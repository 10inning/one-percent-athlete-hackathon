import cv2
import mediapipe as mp
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict
import base64
import io
from PIL import Image

@dataclass
class ExerciseState:
    count: int = 0
    stage: str = "up"
    bad_posture_count: int = 0
    bad_form_frames: List[Tuple[np.ndarray, str, int]] = None  # [(frame, message, rep_number)]
    
    def __post_init__(self):
        self.bad_form_frames = []

class PushupAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils

    def calculate_angle(self, a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
        a, b, c = map(np.array, (a, b, c))
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        return 360 - angle if angle > 180.0 else angle

    def check_pushup_form(self, landmarks) -> Tuple[bool, List[str]]:
        issues = []
        l_shoulder = [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                      landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        l_elbow = [landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                   landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        l_wrist = [landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                   landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y]
        l_hip = [landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].x,
                 landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].y]
        l_knee = [landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                  landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        l_ankle = [landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                   landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        
        arm_angle = self.calculate_angle(l_shoulder, l_elbow, l_wrist)
        back_angle = self.calculate_angle(l_shoulder, l_hip, l_ankle)
        hip_angle = self.calculate_angle(l_shoulder, l_hip, l_knee)
        
        good_form = True
        if back_angle < 160:
            good_form = False
            issues.append("Back not straight (sagging hips)")
        if arm_angle < 45:
            good_form = False
            issues.append("Arms too low (excessive depth)")
        if hip_angle < 160:
            good_form = False
            issues.append("Hips not aligned (improper plank position)")
        if not issues:
            issues.append("Good form!")
        return good_form, issues

    def process_video(self, video_path: str) -> Dict[str, any]:
        cap = cv2.VideoCapture(video_path)
        exercise_state = ExerciseState()
        frame_count = 0
        fps = cap.get(cv2.CAP_PROP_FPS)
        bad_form_images = []
        metadata = {"video_path": video_path, "fps": fps, "frames_analyzed": 0}

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            if results.pose_landmarks:
                self.mp_draw.draw_landmarks(image, results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)
                landmarks = results.pose_landmarks.landmark
                arm_angle = self.calculate_angle(
                    [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                     landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y],
                    [landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                     landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y],
                    [landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                     landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                )
                good_form, issues = self.check_pushup_form(landmarks)

                if arm_angle > 160:
                    exercise_state.stage = "up"
                elif arm_angle < 90 and exercise_state.stage == "up":
                    exercise_state.stage = "down"
                    if good_form:
                        exercise_state.count += 1
                    else:
                        exercise_state.bad_posture_count += 1
                        bad_form_images.append((image.copy(), "; ".join(issues), exercise_state.count + 1))
            
            metadata["frames_analyzed"] = frame_count

        cap.release()
        return {
            "metadata": metadata,
            "bad_form_frames": self.convert_frames_to_base64(bad_form_images),
            "summary": self.generate_report(exercise_state),
            "stats": {
                "total_reps_attempted": exercise_state.count + exercise_state.bad_posture_count,
                "good_form_reps": exercise_state.count,
                "bad_form_reps": exercise_state.bad_posture_count,
                "success_rate": (exercise_state.count / (exercise_state.count + exercise_state.bad_posture_count) * 100) if (exercise_state.count + exercise_state.bad_posture_count) > 0 else 0,
                "frames_analyzed": metadata["frames_analyzed"]
            }
        }


    def convert_frames_to_base64(self, bad_form_frames: List[Tuple[np.ndarray, str, int]]) -> List[Dict[str, any]]:
        base64_frames = []
        for frame, message, rep_number in bad_form_frames:
            pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            buffered = io.BytesIO()
            pil_image.save(buffered, format="JPEG")
            encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
            base64_frames.append({
                "image": encoded_image,
                "message": message,
                "rep_number": rep_number
            })
        return base64_frames

    def generate_report(self, exercise_state: ExerciseState) -> str:
        total_reps = exercise_state.count + exercise_state.bad_posture_count
        success_rate = (exercise_state.count / total_reps * 100) if total_reps > 0 else 0
        return f"""
Push-up Analysis Report
------------------------
Total Reps Attempted: {total_reps}
Good Form Reps: {exercise_state.count}
Bad Form Reps: {exercise_state.bad_posture_count}
Success Rate: {success_rate:.1f}%
"""

def analyze_pushups(filepath: str) -> Dict[str, any]:
    analyzer = PushupAnalyzer()
    results = analyzer.process_video(filepath)
    return results

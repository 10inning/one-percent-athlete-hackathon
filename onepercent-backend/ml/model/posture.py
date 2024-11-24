import cv2
import mediapipe as mp
import numpy as np
import datetime
from dataclasses import dataclass
from typing import List, Tuple, Optional
import os

@dataclass
class ExerciseState:
    count: int = 0
    stage: str = "up"
    bad_posture_count: int = 0
    last_posture_warning: Optional[float] = None
    bad_form_frames: List[Tuple[np.ndarray, str, int]] = None  # [(frame, message, rep_number)]
    
    def __post_init__(self):
        self.bad_form_frames = []

class PushupAnalyzer:
    def __init__(self, output_dir: str = "bad_form_frames"):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
    def calculate_angle(self, a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
        """Calculate angle between three points."""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
                 np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle

    def check_pushup_form(self, landmarks) -> Tuple[bool, List[str]]:
        """Check if pushup form is correct and return detailed feedback."""
        issues = []
        
        # Get relevant landmarks
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
        
        # Calculate key angles
        arm_angle = self.calculate_angle(l_shoulder, l_elbow, l_wrist)
        back_angle = self.calculate_angle(l_shoulder, l_hip, l_ankle)
        hip_angle = self.calculate_angle(l_shoulder, l_hip, l_knee)
        
        # Check form with detailed feedback
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

    def process_video(self, video_path: str):
        """Process video file and analyze pushup form."""
        cap = cv2.VideoCapture(video_path)
        exercise_state = ExerciseState()
        frame_count = 0
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = self.pose.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            if results.pose_landmarks:
                self.mp_draw.draw_landmarks(
                    image, 
                    results.pose_landmarks, 
                    self.mp_pose.POSE_CONNECTIONS
                )
                
                landmarks = results.pose_landmarks.landmark
                
                # Get arm angle for rep counting
                shoulder = [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                          landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                elbow = [landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                        landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                wrist = [landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                        landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                
                arm_angle = self.calculate_angle(shoulder, elbow, wrist)
                good_form, issues = self.check_pushup_form(landmarks)
                
                # Count reps and track form
                if arm_angle > 160:
                    exercise_state.stage = "up"
                elif arm_angle < 90 and exercise_state.stage == "up":
                    exercise_state.stage = "down"
                    if good_form:
                        exercise_state.count += 1
                    else:
                        exercise_state.bad_posture_count += 1
                        # Save frame with bad form
                        exercise_state.bad_form_frames.append(
                            (image.copy(), "; ".join(issues), exercise_state.count + 1)
                        )
                
                # Annotate frame
                time_stamp = frame_count / fps
                cv2.putText(image, f'Rep: {exercise_state.count + 1}', 
                          (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(image, f'Stage: {exercise_state.stage}', 
                          (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(image, f'Form: {"; ".join(issues)}', 
                          (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, 
                          (0, 255, 0) if good_form else (0, 0, 255), 2)
                cv2.putText(image, f'Time: {time_stamp:.2f}s', 
                          (10, image.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                          0.5, (255, 255, 255), 1)
            
            cv2.imshow('Push-up Analysis', image)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        cap.release()
        cv2.destroyAllWindows()
        
        # Save frames with bad form
        self.save_bad_form_frames(exercise_state)
        return self.generate_report(exercise_state)
    
    def save_bad_form_frames(self, exercise_state: ExerciseState):
        """Save frames where bad form was detected."""
        for idx, (frame, message, rep_number) in enumerate(exercise_state.bad_form_frames):
            filename = f"{self.output_dir}/bad_form_rep_{rep_number}_issue_{idx+1}.jpg"
            # Add message to frame
            cv2.putText(frame, f"Rep {rep_number}: {message}", 
                      (10, frame.shape[0] - 40), cv2.FONT_HERSHEY_SIMPLEX, 
                      0.7, (0, 0, 255), 2)
            cv2.imwrite(filename, frame)
    
    def generate_report(self, exercise_state: ExerciseState) -> str:
        """Generate a summary report of the workout."""
        report = f"""Push-up Analysis Report
------------------------
Total Reps Attempted: {exercise_state.count + exercise_state.bad_posture_count}
Good Form Reps: {exercise_state.count}
Bad Form Reps: {exercise_state.bad_posture_count}
Success Rate: {(exercise_state.count / (exercise_state.count + exercise_state.bad_posture_count) * 100):.1f}%

Detailed Form Issues:
"""
        for idx, (_, message, rep_number) in enumerate(exercise_state.bad_form_frames):
            report += f"Rep {rep_number}: {message}\n"
            
        return report

def main():
    video_path = "badform.mp4"  # Replace with your video path
    analyzer = PushupAnalyzer(output_dir="pushup_analysis_results")
    report = analyzer.process_video(video_path)
    print(report)
    print(f"\nDetailed analysis frames have been saved to: {analyzer.output_dir}")

if __name__ == "__main__":
    main()
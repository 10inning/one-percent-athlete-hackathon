from fastapi import APIRouter, UploadFile, File, Form
import shutil
from pathlib import Path
from ml.model.posture_service import analyze_pushups  # Import the function
from typing import Dict

ml_router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)  # Ensure the upload directory exists


@ml_router.post("/ml/upload/chunk")
def upload_chunk(
    chunk: UploadFile = File(...),
    chunkIndex: int = Form(...),
    totalChunks: int = Form(...),
    fileName: str = Form(...),
) -> Dict:
    try:
        # Create a directory for the chunks if it doesn't exist
        chunk_dir = UPLOAD_DIR / f"{fileName}_chunks"
        chunk_dir.mkdir(parents=True, exist_ok=True)

        # Save the chunk to the directory
        chunk_path = chunk_dir / f"{chunkIndex}.chunk"
        with chunk_path.open("wb") as buffer:
            shutil.copyfileobj(chunk.file, buffer)

        # If this is the last chunk, reconstruct the file
        if chunkIndex + 1 == totalChunks:
            final_file_path = UPLOAD_DIR / fileName
            with final_file_path.open("wb") as final_file:
                for i in range(totalChunks):
                    chunk_file_path = chunk_dir / f"{i}.chunk"
                    with chunk_file_path.open("rb") as chunk_file:
                        shutil.copyfileobj(chunk_file, final_file)

            # Clean up the chunk directory
            shutil.rmtree(chunk_dir)

            # Call the PushupAnalyzer function on the uploaded video
            results = analyze_pushups(str(final_file_path))
            print(results)
            return {
                "message": "Upload and analysis completed successfully!",
                "analysis_results": results,
                "fileName": str(final_file_path)
            }

        return {"message": f"Chunk {chunkIndex + 1}/{totalChunks} uploaded successfully."}

    except Exception as e:
        return {"error": f"Error processing chunk: {str(e)}"}

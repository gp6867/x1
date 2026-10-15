from fastapi import APIRouter, File, UploadFile
import logging
import os
import shutil
from datetime import datetime

router = APIRouter()

# SIMPLE FILE UPLOAD - बिना किसी complication के
@router.post("/image")
async def upload_image(
    file: UploadFile = File(...)
):
    """
    Upload an image file
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            return {
                "success": False,
                "message": "Only image files are allowed"
            }
        
        # Create uploads directory
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Save file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "success": True,
            "message": "File uploaded successfully",
            "filename": filename
        }
        
    except Exception as e:
        logging.error(f"Upload error: {e}")
        return {
            "success": False,
            "message": f"Upload failed"
        }

# TEST ENDPOINT
@router.get("/test")
async def test():
    return {
        "success": True,
        "message": "Upload API is working"
    }

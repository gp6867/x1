from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import logging
import os
import shutil
from datetime import datetime
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

BACKEND_BASE_URL = os.getenv("BACKEND_URL", "https://x1-2j5f.onrender.com").rstrip("/")


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file — returns full URL"""
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            return JSONResponse(status_code=400, content={
                "success": False,
                "message": "Only image files are allowed",
            })

        ext = os.path.splitext(file.filename or "img")[1].lower() or ".jpg"
        if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
            ext = ".jpg"

        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:8]}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        url = f"{BACKEND_BASE_URL}/api/upload/file/{filename}"
        logging.info(f"✅ Image uploaded: {filename} → {url}")

        return {
            "success": True,
            "message": "File uploaded successfully",
            "filename": filename,
            "url": url,
        }

    except Exception as e:
        logging.error(f"Upload error: {e}")
        return JSONResponse(status_code=500, content={
            "success": False,
            "message": "Upload failed",
        })


@router.get("/file/{filename}")
async def serve_file(filename: str):
    """Serve uploaded file — public, no auth"""
    safe_name = os.path.basename(filename)
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"success": False, "message": "File not found"})
    return FileResponse(file_path)


@router.get("/test")
async def test():
    return {"success": True, "message": "Upload API is working"}

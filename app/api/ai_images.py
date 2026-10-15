from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, FileResponse
from diffusers import StableDiffusionPipeline
import torch
import uuid
import os
from datetime import datetime

# ✅ Correct - No prefix here, will be added in main.py
router = APIRouter(tags=["AI Images"])

OUTPUT_DIR = "/home/samrat/monster-ai/outputs/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Model loading
device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = None

def get_model():
    global pipe
    if pipe is None:
        print(f"🔄 Loading Stable Diffusion 1.5 on {device}...")
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32
        )
        pipe = pipe.to(device)
        print("✅ Model loaded!")
    return pipe

@router.post("/generate")
async def generate_image(request: Request):
    """Generate image from prompt"""
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        negative_prompt = data.get("negative_prompt", "")
        steps = data.get("steps", 50)
        guidance_scale = data.get("guidance_scale", 7.5)
        
        if not prompt:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Prompt required"}
            )
        
        print(f"🎨 Generating: {prompt}")
        
        pipe = get_model()
        
        with torch.no_grad():
            image = pipe(
                prompt,
                negative_prompt=negative_prompt if negative_prompt else None,
                num_inference_steps=steps,
                guidance_scale=guidance_scale
            ).images[0]
        
        filename = f"image_{uuid.uuid4()}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        image.save(filepath)
        
        return JSONResponse({
            "success": True,
            "image_url": f"/api/ai/images/download/{filename}",
            "prompt": prompt,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@router.get("/download/{filename}")
async def download_image(filename: str):
    """Download generated image"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "Image not found"}
    )

@router.get("/test")
async def test():
    return {"success": True, "message": "AI Images API ready"}

@router.get("/models")
async def list_models():
    return {"models": ["stable-diffusion-v1-5"]}

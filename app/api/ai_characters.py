from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import aiohttp
import logging
from datetime import datetime

router = APIRouter()

@router.post("/create")
async def create_character(request: Request):
    """Create AI character"""
    try:
        data = await request.json()
        name = data.get("name", "")
        personality = data.get("personality", "friendly")
        background = data.get("background", "")
        
        async with aiohttp.ClientSession() as session:
            ollama_url = "http://localhost:11434/api/generate"
            
            prompt = f"""Create an AI character with:
            Name: {name}
            Personality: {personality}
            Background: {background}
            
            Describe this character in detail."""
            
            payload = {
                "model": "phi3",
                "prompt": prompt,
                "stream": False
            }
            
            async with session.post(ollama_url, json=payload) as resp:
                result = await resp.json()
                
                return JSONResponse({
                    "success": True,
                    "character": {
                        "name": name,
                        "personality": personality,
                        "background": background,
                        "description": result.get("response", ""),
                        "id": datetime.utcnow().timestamp()
                    },
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except Exception as e:
        logging.error(f"Character creation error: {e}")
        return JSONResponse({
            "success": False,
            "message": str(e)
        })

@router.post("/chat")
async def chat_with_character(request: Request):
    """Chat with AI character"""
    try:
        data = await request.json()
        character_id = data.get("character_id", "")
        message = data.get("message", "")
        character_data = data.get("character_data", {})
        
        async with aiohttp.ClientSession() as session:
            ollama_url = "http://localhost:11434/api/generate"
            
            prompt = f"""You are {character_data.get('name', 'an AI')} with personality: {character_data.get('personality', 'friendly')}.
            Background: {character_data.get('background', '')}
            
            User says: {message}
            
            Respond as this character:"""
            
            payload = {
                "model": "phi3",
                "prompt": prompt,
                "stream": False
            }
            
            async with session.post(ollama_url, json=payload) as resp:
                result = await resp.json()
                
                return JSONResponse({
                    "success": True,
                    "response": result.get("response", ""),
                    "character": character_data.get("name", "AI"),
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except Exception as e:
        logging.error(f"Character chat error: {e}")
        return JSONResponse({
            "success": False,
            "message": str(e)
        })

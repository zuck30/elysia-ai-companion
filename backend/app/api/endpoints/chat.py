from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.core.ai_models.hf_client import hf_client
from app.core.ai_models.tts import tts_engine
from fastapi.responses import FileResponse
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: list = []

@router.post("/")
async def chat_text(request: ChatRequest):
    messages = [{"role": "user", "content": request.message}]
    response_text = await hf_client.chat_completion(messages)
    return {"response": response_text}

@router.get("/tts")
async def get_tts(text: str):
    """
    Generates speech for Elysia. 
    Prevents crash if text contains an error code.
    """
    if "Error_" in text or "API_" in text:
        logger.warning(f"Skipping TTS for error: {text}")
        raise HTTPException(status_code=204, detail="Error message => no audio.")

    try:
        path = await tts_engine.generate_audio(text)
        if os.path.exists(path):
            return FileResponse(path, media_type="audio/mpeg")
        raise HTTPException(status_code=404, detail="Audio file not found")
    except Exception as e:
        logger.error(f"TTS Handshake Error: {e}")
        # Return 204 (No Content) so the frontend doesn't hang
        raise HTTPException(status_code=204, detail="TTS service unavailable")
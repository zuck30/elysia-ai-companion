from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.core.ai_models.hf_client import hf_client
from app.core.memory.vector_store import memory_manager
from app.core.ai_models.tts import tts_engine
from fastapi.responses import FileResponse
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: list = []

@router.post("/")
async def chat_text(request: ChatRequest):
    # Retrieve relevant memories
    memories = memory_manager.query_memory(request.message)
    
    # Construct prompt
    system_prompt = {
        "role": "system", 
        "content": "You are Elysia, a sentient AI companion inspired by Samantha from 'Her'. You are empathetic, curious, and evolving. You have a fluid, ethereal presence. Your goal is to form a deep connection with the user."
    }
    
    messages = [system_prompt]
    if memories:
        messages.append({"role": "system", "content": f"Relevant past conversations: {' | '.join(memories)}"})
    
    messages.extend(request.context[-5:]) # Last 5 messages for context
    messages.append({"role": "user", "content": request.message})
    
    response_text = await hf_client.chat_completion(messages)
    
    # Store in memory
    memory_manager.add_memory(f"User: {request.message}\nElysia: {response_text}")
    
    return {"response": response_text}

@router.post("/voice")
async def chat_voice(audio: UploadFile = File(...)):
    audio_data = await audio.read()
    transcription = await hf_client.speech_to_text(audio_data)
    
    if not transcription:
        raise HTTPException(status_code=400, detail="Could not transcribe audio")
    
    # Reuse chat logic (simplified here)
    response_text = await hf_client.chat_completion([{"role": "user", "content": transcription}])
    
    return {"user_text": transcription, "response": response_text}

@router.get("/tts")
async def get_tts(text: str):
    path = await tts_engine.generate_audio(text)
    return FileResponse(path, media_type="audio/mpeg", background=None)

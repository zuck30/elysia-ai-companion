from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, vision, emotion
from app.api.websocket import chat_ws
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Elysia-AI Companion API")

# Configure CORS => Muhimu kwa ajili ya mawasiliano na React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers kwa ajili ya REST endpoints
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(vision.router, prefix="/api/vision", tags=["vision"])
app.include_router(emotion.router, prefix="/api/emotion", tags=["emotion"])

@app.get("/")
async def root():
    return {"message": "Elysia-AI Companion API is running"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """
    Hapa ndipo Elysia anapopokea texts na pics.
    Tunatumia 'chat_ws.handle_websocket' ambayo i checked ipo.
    """
    try:
        # We call function directly from module ya chat_ws
        await chat_ws.handle_websocket(websocket)
    except Exception as e:
        logger.error(f"WebSocket Runtime Error: {e}")
        # This prevents server isizime (crash) kama kuna tatizo la connection
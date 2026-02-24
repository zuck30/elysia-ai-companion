from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, vision, emotion
from app.api.websocket import chat_ws
import os

app = FastAPI(title="Elysia AI Companion API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(vision.router, prefix="/api/vision", tags=["vision"])
app.include_router(emotion.router, prefix="/api/emotion", tags=["emotion"])

@app.get("/")
async def root():
    return {"message": "Elysia AI Companion API is running"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await chat_ws.handle_websocket(websocket)

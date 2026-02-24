from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
from app.core.ai_models.hf_client import hf_client
from app.core.ai_models.emotion_engine import emotion_engine
from app.core.memory.vector_store import memory_manager

class ChatWebSocketHandler:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def handle_websocket(self, websocket: WebSocket):
        await self.connect(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different types of messages
                if message["type"] == "chat":
                    user_text = message["text"]
                    # Get response
                    response_text = await hf_client.chat_completion([{"role": "user", "content": user_text}])
                    # Detect emotion of response
                    emotion = await emotion_engine.analyze_text_emotion(response_text)
                    
                    await websocket.send_json({
                        "type": "chat_response",
                        "text": response_text,
                        "emotion": emotion
                    })
                
                elif message["type"] == "heartbeat":
                    await websocket.send_json({"type": "pong"})

        except WebSocketDisconnect:
            self.disconnect(websocket)
        except Exception as e:
            print(f"WS Error: {e}")
            self.disconnect(websocket)

chat_ws = ChatWebSocketHandler()

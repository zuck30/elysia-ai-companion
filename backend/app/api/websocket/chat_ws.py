from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
from app.core.ai_models.hf_client import hf_client
from app.core.ai_models.emotion_engine import emotion_engine
# from app.core.memory.vector_store import memory_manager # Commented until used

class ChatWebSocketHandler:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def handle_websocket(self, websocket: WebSocket):
        """This is the method main.py calls"""
        await self.connect(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "chat":
                    user_text = message.get("text", "")
                    
                    try:
                        # 1. Get AI Response
                        response_text = await hf_client.chat_completion([{"role": "user", "content": user_text}])
                        
                        # 2. Detect emotion
                        emotion = "neutral"
                        if response_text:
                            emotion = await emotion_engine.analyze_text_emotion(response_text)
                        
                        # 3. Send back to frontend
                        await websocket.send_json({
                            "type": "chat_response",
                            "text": response_text,
                            "emotion": emotion
                        })
                    except Exception as ai_err:
                        print(f"AI Generation Error: {ai_err}")
                        await websocket.send_json({
                            "type": "error", 
                            "message": "Elysia is having trouble thinking right now."
                        })
                
                elif message.get("type") == "heartbeat":
                    await websocket.send_json({"type": "pong"})

        except WebSocketDisconnect:
            print("Client disconnected normally")
            self.disconnect(websocket)
        except Exception as e:
            print(f"Global WS Error: {e}")
            self.disconnect(websocket)

# Create the instance that main.py imports
chat_handler = ChatWebSocketHandler()

# Helper function to fix the AttributeError in main.py
async def handle_websocket(websocket: WebSocket):
    await chat_handler.handle_websocket(websocket)
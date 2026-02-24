from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
from app.core.ai_models.hf_client import hf_client
from app.core.ai_models.emotion_engine import emotion_engine

class ChatWebSocketHandler:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Connection established. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"Connection closed. Total active: {len(self.active_connections)}")

    async def handle_websocket(self, websocket: WebSocket):
        await self.connect(websocket)
        try:
            while True:
                # Wait for message from frontend
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "chat":
                    user_text = message.get("text", "")
                    
                    # 1. Get AI Response from Hugging Face
                    # We wrap this in a try/except so the websocket doesn't die if the API fails
                    try:
                        response_text = await hf_client.chat_completion([{"role": "user", "content": user_text}])
                        
                        # 2. Detect emotion of the AI's response
                        emotion = "neutral"
                        try:
                            emotion = await emotion_engine.analyze_text_emotion(response_text)
                        except Exception as e:
                            print(f"Emotion Engine Error: {e}")

                        # 3. Send response back to frontend
                        await websocket.send_json({
                            "type": "chat_response",
                            "text": response_text,
                            "emotion": emotion
                        })
                    except Exception as hf_err:
                        print(f"HF Client Error: {hf_err}")
                        await websocket.send_json({
                            "type": "error",
                            "text": "I'm having trouble connecting to my brain right now."
                        })
                
                elif message.get("type") == "heartbeat":
                    await websocket.send_json({"type": "pong"})

        except WebSocketDisconnect:
            self.disconnect(websocket)
        except Exception as e:
            print(f"Unexpected WebSocket Error: {e}")
            self.disconnect(websocket)

# We name the instance differently than the filename to avoid import confusion
handler_instance = ChatWebSocketHandler()

# This is the function main.py is calling: chat_ws.handle_websocket
async def handle_websocket(websocket: WebSocket):
    await handler_instance.handle_websocket(websocket)
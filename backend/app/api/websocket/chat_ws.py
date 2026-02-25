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
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "chat":
                    user_text = message.get("text", "")
                    
                    # Signal frontend to show typing animation
                    await websocket.send_json({"type": "processing_start"})

                    try:
                        # Call the LLM
                        response_text = await hf_client.chat_completion([{"role": "user", "content": user_text}])
                        
                        # Fallback for the 404 error we saw in your logs
                        if "Error_404" in response_text:
                            response_text = "I'm having a bit of trouble reaching my memory banks. Let's try again in a second."

                        emotion = "neutral"
                        try:
                            emotion = await emotion_engine.analyze_text_emotion(response_text)
                        except:
                            pass

                        await websocket.send_json({
                            "type": "chat_response",
                            "text": response_text,
                            "emotion": emotion
                        })
                    except Exception as e:
                        print(f"HF Error: {e}")
                        await websocket.send_json({
                            "type": "error",
                            "text": "My connection is a bit flickery right now."
                        })
                
                elif message.get("type") == "heartbeat":
                    await websocket.send_json({"type": "pong"})

        except WebSocketDisconnect:
            self.disconnect(websocket)
        except Exception as e:
            print(f"WS Error: {e}")
            self.disconnect(websocket)

# Create the instance
handler_instance = ChatWebSocketHandler()

# THIS IS THE FUNCTION main.py IS LOOKING FOR
async def handle_websocket(websocket: WebSocket):
    await handler_instance.handle_websocket(websocket)
import os
import httpx
import json
import base64
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
# Use unified Router URL
HF_API_URL = "https://router.huggingface.co/hf-inference"

class HFClient:
    def __init__(self):
        self.headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        self.timeout = 60.0

    async def query(self, model_id, payload):
        url = HF_API_URL
        headers = {**self.headers, "x-model-id": model_id}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=headers, json=payload)
            
            if response.status_code == 503:
                return {"error": "Model loading"}
                
            if response.status_code != 200:
                # Log error for visibility in terminal
                print(f"HF API Error Trace: {response.text}")
                raise Exception(f"HF API Error: {response.status_code}")
            
            return response.json()

    async def chat_completion(self, messages, model="mistralai/Mistral-7B-Instruct-v0.2"):
        prompt = ""
        for msg in messages:
            if msg["role"] == "user":
                prompt += f"[INST] {msg['content']} [/INST]"
            else:
                prompt += f" {msg['content']} "
        
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 250, "temperature": 0.7, "return_full_text": False}
        }
        
        result = await self.query(model, payload)
        
        if isinstance(result, dict) and "error" in result:
            return "Give me a second, I'm just waking up..."

        if isinstance(result, list) and len(result) > 0:
            text = result[0].get("generated_text", "")
            return text.replace(prompt, "").strip()
        return "I'm sorry, I couldn't generate a response."

    async def vision_analysis(self, image_base64, model="vikhyatk/moondream2"):
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]

        # Payload format for Moondream on HF Router
        payload = {
            "inputs": {
                "image": image_base64,
                "prompt": "Describe this person and their expression."
            }
        }

        result = await self.query(model, payload)

        if isinstance(result, dict) and "error" in result:
            return "I'm still loading my visual sensors."

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        elif isinstance(result, dict):
            return result.get("generated_text", "")
            
        return "My vision is a bit blurry right now."

    async def speech_to_text(self, audio_data, model="openai/whisper-large-v3"):
        url = HF_API_URL
        headers = {**self.headers, "x-model-id": model}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=headers, content=audio_data)
            if response.status_code != 200:
                raise Exception(f"HF API STT Error: {response.text}")
            return response.json().get("text", "")

hf_client = HFClient()
import os
import httpx
import json
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
HF_API_URL = "https://router.huggingface.co/hf-inference/models/"

class HFClient:
    def __init__(self):
        self.headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        self.timeout = 30.0

    async def query(self, model_id, payload):
        url = f"{HF_API_URL}{model_id}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=self.headers, json=payload)
            if response.status_code != 200:
                raise Exception(f"HF API Error: {response.text}")
            return response.json()

    async def chat_completion(self, messages, model="mistralai/Mistral-7B-Instruct-v0.2"):
        # Format for Mistral
        prompt = ""
        for msg in messages:
            if msg["role"] == "user":
                prompt += f"[INST] {msg['content']} [/INST]"
            else:
                prompt += f" {msg['content']} "
        
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 250, "temperature": 0.7}
        }
        result = await self.query(model, payload)
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "").split("[/INST]")[-1].strip()
        return "I'm sorry, I couldn't generate a response."

    async def vision_analysis(self, image_base64, model="vikhyatk/moondream2"):
        # Moondream2 might need a different format or specific endpoint
        # For HF Inference API, we usually send base64 data
        payload = {
            "inputs": {
                "image": image_base64,
                "question": "What do you see in this image? Describe the person's expression and surroundings briefly."
            }
        }
        result = await self.query(model, payload)
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        return "I'm unable to see clearly right now."

    async def speech_to_text(self, audio_data, model="openai/whisper-large-v3"):
        # This usually requires binary data
        url = f"{HF_API_URL}{model}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=self.headers, content=audio_data)
            if response.status_code != 200:
                raise Exception(f"HF API Error: {response.text}")
            return response.json().get("text", "")

hf_client = HFClient()

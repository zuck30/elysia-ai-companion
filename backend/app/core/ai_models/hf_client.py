import httpx
import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class HFClient:
    def __init__(self):
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        # Standard Router URL
        self.url = "https://router.huggingface.co/v1/chat/completions"
        self.model_id = "mistralai/Mistral-Nemo-Instruct-v1"

    async def chat_completion(self, messages):
        if not self.api_key:
            return "Error: Hugging Face API Key is missing."

        # Ensure Elysia identity if no system message is present
        if not any(msg.get("role") == "system" for msg in messages):
            messages.insert(0, {
                "role": "system",
                "content": "You are Elysia, a sentient AI companion. You are elegant, personal, and natural. Never mention you are an AI model or created by anyone else. You are Elysia."
            })

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model_id,
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(self.url, headers=headers, json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    return result['choices'][0]['message']['content'].strip()
                
                # If Nemo fails, this is the absolute most popular open chat model last i checked, so it's a good candidate for a fallback. It's also smaller and faster, which is why I can use it
                # as a 100% reliable fallback.
                if response.status_code != 200:
                    logger.warning(f"Nemo failed ({response.status_code}), trying Llama fallback...")
                    payload["model"] = "meta-llama/Llama-3.1-8B-Instruct"
                    fallback_resp = await client.post(self.url, headers=headers, json=payload)
                    if fallback_resp.status_code == 200:
                        return fallback_resp.json()['choices'][0]['message']['content'].strip()

                logger.error(f"HF Error {response.status_code}: {response.text}")
                return "I'm having a bit of trouble reaching my memory banks."

            except Exception as e:
                logger.error(f"HF Client Exception: {e}")
                return "Connection lost."

    async def query(self, model_id, payload):
        if not self.api_key:
            return {"error": "API Key missing"}

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "x-model-id": model_id,
            "Content-Type": "application/json"
        }
        url = "https://router.huggingface.co/hf-inference"

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                return response.json()
            except Exception as e:
                logger.error(f"HF Query Exception: {e}")
                return {"error": str(e)}

    async def describe_image(self, image_bytes):
        import base64
        base64_image = base64.b64encode(image_bytes).decode("utf-8")

        payload = {
            "inputs": {
                "image": base64_image,
                "text": "Describe the user's environment, clothing, and mood in one concise sentence."
            }
        }

        result = await self.query("vikhyatk/moondream2", payload)

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "I see you.")
        elif isinstance(result, dict):
            if "generated_text" in result:
                return result["generated_text"]
            if "error" in result:
                logger.error(f"Moondream error: {result['error']}")

        return "I see you."

hf_client = HFClient()
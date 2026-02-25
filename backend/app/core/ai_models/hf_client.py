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

hf_client = HFClient()
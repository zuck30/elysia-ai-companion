import edge_tts
import asyncio
import os
import uuid

class TTSEngine:
    def __init__(self):
        self.voice = "en-US-EmmaMultilingualNeural" # A soft, expressive voice

    async def generate_audio(self, text, output_path=None):
        if not output_path:
            output_path = f"temp_{uuid.uuid4()}.mp3"
        
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(output_path)
        return output_path

tts_engine = TTSEngine()

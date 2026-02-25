import edge_tts
import os
import uuid
import logging

logger = logging.getLogger(__name__)

class TTSEngine:
    def __init__(self):
        # Updated to a 2026-stable voice name
        self.voice = "en-US-AvaNeural" 
        self.output_dir = "temp_audio"
        
        # Ensure the directory exists on your MacBook
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    async def generate_audio(self, text: str):
        # Generate a unique path inside the temp folder
        file_name = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join(self.output_dir, file_name)
        
        try:
            # The library now handles the Sec-MS-GEC token internally
            communicate = edge_tts.Communicate(text, self.voice)
            await communicate.save(output_path)
            return output_path
        except Exception as e:
            logger.error(f"Edge-TTS failed: {e}")
            # Fallback check: if the system clock is off, the 403 will persist
            raise e

tts_engine = TTSEngine()
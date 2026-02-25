import edge_tts
import os
import uuid
import logging

logger = logging.getLogger(__name__)

class TTSEngine:
    def __init__(self):
        # I'm using a specific voice here, If you fork you can change it to any voice supported by edge-tts. 
        # Check the documentation for available voices. --- IGNORE ---
        self.voice = "en-US-AvaNeural" 
        self.output_dir = "temp_audio"
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    async def generate_audio(self, text: str):
        # This Generates a unique path inside the temp folder
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
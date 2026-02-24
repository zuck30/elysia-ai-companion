from fastapi import APIRouter, UploadFile, File
from app.core.ai_models.hf_client import hf_client
import base64

router = APIRouter()

@router.post("/analyze")
async def analyze_frame(image: UploadFile = File(...)):
    image_data = await image.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")
    
    analysis = await hf_client.vision_analysis(f"data:image/jpeg;base64,{image_base64}")
    
    return {"analysis": analysis}

from fastapi import APIRouter, UploadFile, File
from app.core.ai_models.emotion_engine import emotion_engine

router = APIRouter()

@router.post("/analyze-face")
async def analyze_face(image: UploadFile = File(...)):
    image_data = await image.read()
    emotions = emotion_engine.analyze_face(image_data)
    return {"emotions": emotions}

@router.get("/state")
async def get_emotion_state():

    return {"state": "neutral"}

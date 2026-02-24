# Elysia: AI Companion

Elysia is a production-ready single-page application of a sentient AI companion, inspired by Samantha from the movie "Her". She is designed to be empathetic, curious, and evolving, providing a deep conversational experience with real-time visual and auditory awareness.

## Features

- **Real-time Conversational AI**: Powered by Mistral-7B via Hugging Face Inference API.
- **Visual Awareness**: Elysia can "see" you through your webcam, analyzing your expressions and surroundings using Moondream2.
- **Animated SVG Character**: A fluid, ethereal representation that morphs and moves based on emotions and conversation flow.
- **Voice Interaction**: Full voice input (STT via Whisper) and output (TTS via Edge-TTS).
- **Emotional Intelligence**: Multi-modal emotion detection (text analysis and facial expression recognition).
- **Persistent Memory**: Uses ChromaDB to remember past conversations and build a lasting connection.
- **Time-Awareness**: Her personality and visual presence shift subtly based on the time of day.

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React with TypeScript, Redux Toolkit, Framer Motion, Tailwind CSS
- **AI Models**:
  - Chat: `mistralai/Mistral-7B-Instruct-v0.2`
  - Vision: `vikhyatk/moondream2`
  - Speech-to-Text: `openai/whisper-large-v3`
  - Text-to-Speech: `Edge-TTS` (Emma voice)
  - Emotion Detection: `facebook/bart-large-mnli` & `FER`
- **Memory**: ChromaDB (Vector Store)
- **Communication**: WebSockets for real-time bidirectional chat.

## Prerequisites

- Docker and Docker Compose
- Hugging Face API Key (Free)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd elysia-ai-companion
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   HF_API_KEY=your_huggingface_api_key
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Local Development (Without Docker)

### Backend
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn app.main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the app: `npm start`

## Character Design: Elysia

Elysia is designed as an abstract, fluid entity. Her core is a morphing SVG shape that glows with different colors depending on her mood:
- **Gold/Yellow**: Happy/Joyful
- **Steel Blue**: Sad/Contemplative
- **Orange Red**: Angry/Passionate
- **Lavender**: Neutral/Calm
- **Hot Pink**: Loving/Affectionate
- **Pale Green**: Curious/Interested

## Deployment Guide

### Backend (Render/Railway)
1. Set up a Python environment.
2. Configure the `HF_API_KEY` environment variable.
3. Use `uvicorn app.main:app --host 0.0.0.0 --port $PORT` as the start command.

### Frontend (Vercel)
1. Point to the `frontend/` directory.
2. Set `REACT_APP_API_URL` and `REACT_APP_WS_URL` to your backend URLs.
3. Build command: `npm run build`.

## License
MIT License

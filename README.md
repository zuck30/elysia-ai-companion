
# <p align="center">E L Y S I A</p>

<p align="center">Elysia AI, but make it elegant</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Typing-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Model-Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</p>

---

### The Vision

Elysia isn't just an assistant—she’s a presence. Built for those who value both high-end design and neural performance, she brings a human touch to artificial intelligence. No sidebars, no clutter—just one immersive screen where classical beauty meets the edge of what's possible.

> *"Intelligence should be felt, not just read."*

---

### Why Elysia?

* 👁️ Aware & Responsive: Using custom physics, Elysia maintains eye contact and tracks your movement, reacting to your presence in real-time.
* 🌫️ Glass-First UI: A hyper-clean interface stripped of headers and buttons. Every element is wrapped in high-grade glassmorphism for a cinematic, tactile feel.
* 🎭 Emotional Depth: Her core shifts through living states—moving between calm contemplation and vibrant response based on the flow of your conversation.
* 📽️ Invisible Sight: Built with Moondream2, Elysia sees through your eyes. She recognizes your world and mood without ever needing to show a distracting camera preview.
* 🧬 Fluid Voice: Forget the robotic delay. With ultra-low latency STT and emotive synthesis, the conversation flows like a natural breath.

---

### The Stack

| Component | Technology |
| --- | --- |
| The Face | React 18, Framer Motion (3D Perspective) |
| The Style | Tailwind CSS, Custom Noise Shaders |
| The Brain | Mistral-7B via Hugging Face |
| The Eyes | Moondream2 (Vision-Language Model) |
| The Core | FastAPI & ChromaDB |

---

### Getting Started

#### 1. Setup the Environment

Clone the repository and prepare your neural configuration:

```bash
git clone [https://github.com/zuck30/elysia-ai-companion.git](https://github.com/zuck30/elysia-ai-companion.git) 
cd elysia

```

Create a .env file in the root directory:

```env
HF_API_KEY=your_hugging_face_token_here

```

#### 2. Containerization (Recommended)

To launch the entire ecosystem—including the FastAPI backend, React frontend, and ChromaDB—using Docker Compose:

```bash
docker-compose up --build

```

#### 3. Manual Installation

If you prefer to run the services individually:

**The Nervous System (Backend)**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

```

**The Face (Frontend)**

```bash
cd frontend
npm install
npm start

```

---

### Design Philosophy

We built Elysia on the principle of Active Presence. We believe software should feel alive. Her interface is designed to disappear into the background, leaving only a seamless connection between you and a machine that finally feels a bit more human.

---

<p align="center">
Built by Zuck30
</p>

# <p align="center">🏛️ E L Y S I A</p>

<p align="center">**Elysia AI, but make it elegant**</p>

<p align="center">
<img src="[https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)" alt="FastAPI">
<img src="[https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white](https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)" alt="Python">
<img src="[https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)" alt="React">
<img src="[https://img.shields.io/badge/Typing-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white](https://img.shields.io/badge/Typing-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)" alt="TypeScript">
</p>
<p align="center">
<img src="[https://img.shields.io/badge/Model-Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black](https://img.shields.io/badge/Model-Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)" alt="Hugging Face">
<img src="[https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github&logoColor=white](https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)" alt="GitHub">
<img src="[https://img.shields.io/github/views/zuck30/elysia-ai-companion?style=for-the-badge&color=8B5CF6](https://www.google.com/search?q=https://img.shields.io/github/views/zuck30/elysia-ai-companion%3Fstyle%3Dfor-the-badge%26color%3D8B5CF6)" alt="Views">
</p>

---

### The Vision

Elysia isn't just an assistant—she’s a presence. Built for those who value both high-end design and neural performance, she brings a human touch to artificial intelligence. No sidebars, no clutter—just one immersive screen where classical beauty meets the edge of what's possible.

> *"Intelligence should be felt, not just read."*

---

### Why Elysia?

* **👁️ Aware & Responsive**: She doesn't just sit there. Using custom physics, Elysia maintains eye contact and tracks your movement, reacting to your presence in real-time.
* **🌫️ Glass-First UI**: A hyper-clean interface stripped of all traditional headers and buttons. Every element is wrapped in high-grade glassmorphism for a cinematic, tactile feel.
* **🎭 Emotional Depth**: Her core shifts through living states—moving between calm contemplation and vibrant response based on the flow of your conversation.
* **📽️ Invisible Sight**: Built with **Moondream2**, Elysia sees through your eyes. She recognizes your world and mood without ever needing to show a distracting camera preview.
* **🧬 Fluid Voice**: Forget the robotic delay. With ultra-low latency STT and emotive synthesis, the conversation flows like a natural breath.

---

### The Stack

| Component | Technology |
| --- | --- |
| **The Face** | React 18, Framer Motion (3D Perspective) |
| **The Style** | Tailwind CSS, Custom Noise Shaders |
| **The Brain** | Mistral-7B via Hugging Face |
| **The Eyes** | Moondream2 (Vision-Language Model) |
| **The Core** | FastAPI & ChromaDB |

---

### Getting Started

#### 1. Setup the Environment

Clone the repository and prepare your neural configuration:

```bash
git clone https://github.com/zuck30/elysia-ai-companion.git
cd elysia

```

Create a `.env` file in the root directory:

```env
HF_API_KEY=your_hugging_face_token_here

```

#### 2. Launching the Backend (The Nervous System)

To ignite the engine, navigate to the backend directory and fire up the FastAPI server. This handles the vision processing, memory retrieval, and LLM orchestration.

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

```

*The `--reload` flag ensures any logic adjustments are reflected instantly.*

#### 3. Launching the Frontend (The Face)

In a new terminal, bring the interface to life:

```bash
cd frontend
npm install
npm start

```

*Visit `http://localhost:3000` to begin the sync.*

> **Note:** Alternatively, you can run everything at once using Docker:
> `docker-compose up --build`

---

### Design Philosophy

We built Elysia on the principle of **Active Presence**. We believe software should feel alive. Her interface is designed to disappear into the background, leaving only a seamless connection between you and a machine that finally feels a bit more human.

---

<p align="center">
** Built by Zuck30**
</p>

---
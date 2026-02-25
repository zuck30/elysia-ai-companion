import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { 
  addMessage, 
  setEmotion, 
  setSpeaking, 
  setListening, 
  setTyping, 
  setCameraActive,
  setVisionAnalysis
} from './store/elysiaSlice';
import ElysiaCharacter from './components/Character/ElysiaCharacter';
import ChatInterface from './components/Chat/ChatInterface';
import CameraFeed from './components/Camera/CameraFeed';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, History, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WS_BASE = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, emotion, isSpeaking, isListening, isTyping, cameraActive } = useSelector((state: RootState) => state.elysia);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleVoiceInput = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.wav');

    try {
      dispatch(setTyping(true));
      const response = await axios.post(`${API_BASE}/api/chat/voice`, formData);
      const { user_text, response: elysia_response } = response.data;

      dispatch(addMessage({ role: 'user', content: user_text }));
      dispatch(addMessage({ role: 'elysia', content: elysia_response }));
      dispatch(setTyping(false));
      handleSpeak(elysia_response);
    } catch (err) {
      console.error("Voice processing failed", err);
      dispatch(setTyping(false));
    }
  };

  const { toggleRecording } = useVoiceRecorder((blob) => {
    dispatch(setListening(false));
    handleVoiceInput(blob);
  });

  const handleToggleListening = () => {
    const nextState = !isListening;
    dispatch(setListening(nextState));
    toggleRecording();
  };

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/chat`);
    
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_response') {
        dispatch(setTyping(false));
        dispatch(addMessage({ role: 'elysia', content: data.text }));
        dispatch(setEmotion(data.emotion));
        
        // Handle TTS
        handleSpeak(data.text);
      }
    };

    setSocket(ws);
    return () => ws.close();
  }, [dispatch]);

  const handleSpeak = async (text: string) => {
    try {
      const response = await axios.get(`${API_BASE}/api/chat/tts`, {
        params: { text },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      const audio = new Audio(url);
      dispatch(setSpeaking(true));
      audio.onended = () => dispatch(setSpeaking(false));
      audio.play();
    } catch (err) {
      console.error("TTS failed", err);
    }
  };

  const sendMessage = (text: string) => {
    dispatch(addMessage({ role: 'user', content: text }));
    dispatch(setTyping(true));
    socket?.send(JSON.stringify({ type: 'chat', text }));
  };

  const handleFrame = async (imageSrc: string) => {
    const fetchRes = await fetch(imageSrc);
    const blob = await fetchRes.blob();
    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    try {
      const response = await axios.post(`${API_BASE}/api/vision/analyze`, formData);
      dispatch(setVisionAnalysis(response.data.analysis));
    } catch (err) {
      console.error("Vision analysis failed", err);
    }
  };

  return (
    <div
      className="h-screen w-full bg-[#08080a] text-zinc-100 flex flex-col overflow-hidden font-avenir selection:bg-snapchat-blue/30 relative"
      style={{ contain: 'content' }}
    >
      {/* Cinematic Background */}
      <div className="noise opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-900 to-black opacity-80" />

      {/* Animated Glows */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="fixed -top-1/4 -left-1/4 w-full h-full bg-snapchat-blue/20 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Character Visualization - Central Focus / Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-full h-full max-w-4xl opacity-60 transition-opacity duration-700">
          <ElysiaCharacter emotion={emotion} isSpeaking={isSpeaking} />
        </div>
      </div>

      {/* Main Content Area - Floating Overlay */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-end">
        {/* Floating Camera View (if active) */}
        {cameraActive && (
          <div className="absolute top-8 right-8 z-20">
            <CameraFeed
              isActive={cameraActive}
              onFrame={handleFrame}
              toggleCamera={() => dispatch(setCameraActive(!cameraActive))}
            />
          </div>
        )}

        <div className="w-full h-full flex flex-col">
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage} 
            isTyping={isTyping}
            isListening={isListening}
            setIsListening={handleToggleListening}
            isSpeaking={isSpeaking}
            onVoiceInput={handleVoiceInput}
            toggleCamera={() => dispatch(setCameraActive(!cameraActive))}
            isCameraActive={cameraActive}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

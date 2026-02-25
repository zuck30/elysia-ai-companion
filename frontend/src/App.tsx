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
    <div className="h-screen w-full bg-[#08080a] text-zinc-100 flex flex-col overflow-hidden font-avenir selection:bg-snapchat-blue/30">
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

      {/* Snapchat Navigation Header */}
      <header className="z-50 flex items-center justify-between px-4 py-3 backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-snapchat-yellow to-yellow-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,252,0,0.3)] relative">
               <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
              />
               <span className="text-black font-black text-xl relative z-10">E</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#08080a] rounded-full" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none uppercase">
              Elysia
            </h1>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Neural Sync</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
           <CameraFeed
            isActive={cameraActive}
            onFrame={handleFrame}
            toggleCamera={() => dispatch(setCameraActive(!cameraActive))}
          />
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <History size={22} />
          </button>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">

        {/* Character Visualization - Integrated Background/Side Element */}
        <div className="absolute inset-0 lg:relative lg:flex-1 flex items-center justify-center pointer-events-none lg:pointer-events-auto">
          <div className="w-full h-full max-w-2xl opacity-40 lg:opacity-100 transition-opacity duration-700">
            <ElysiaCharacter emotion={emotion} isSpeaking={isSpeaking} />
          </div>

          {/* Desktop Visualizer (Optional) */}
          {isListening && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-3xl px-6 py-4 rounded-full border border-snapchat-blue/30 shadow-[0_0_30px_rgba(0,185,255,0.2)]">
               <div className="flex items-center space-x-1 h-8">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 12, 32, 8] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                    className="w-1.5 bg-snapchat-blue rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest ml-4">Listening...</span>
            </div>
          )}
        </div>

        {/* Chat Interface - Mobile First Full Screen, Desktop Sidebar */}
        <div className="relative z-10 flex-1 lg:max-w-md lg:border-l border-white/10 bg-black/20 lg:bg-black/40 backdrop-blur-sm lg:backdrop-blur-2xl flex flex-col shadow-2xl">
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage} 
            isTyping={isTyping}
            isListening={isListening}
            setIsListening={handleToggleListening}
            isSpeaking={isSpeaking}
            onVoiceInput={handleVoiceInput}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

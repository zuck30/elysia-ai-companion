import React, { useEffect, useState, useCallback } from 'react';
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
import VoiceControl from './components/Chat/VoiceControl';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, History, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const WS_BASE = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, emotion, isSpeaking, isListening, isTyping, cameraActive } = useSelector((state: RootState) => state.elysia);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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

  const handleFrame = async (imageSrc: string) => {
    // Convert base64 to blob
    const fetchRes = await fetch(imageSrc);
    const blob = await fetchRes.blob();
    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    try {
      const response = await axios.post(`${API_BASE}/api/vision/analyze`, formData);
      dispatch(setVisionAnalysis(response.data.analysis));
      // Optionally have Elysia comment on what she sees if it's significant
    } catch (err) {
      console.error("Vision analysis failed", err);
    }
  };

  const getTimeColor = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'from-orange-900/20'; // Morning
    if (hour >= 12 && hour < 17) return 'from-blue-900/20';   // Afternoon
    if (hour >= 17 && hour < 21) return 'from-purple-900/20'; // Evening
    return 'from-indigo-900/20';                             // Night
  };

  return (
    <div className="h-screen w-full bg-[#08080a] text-zinc-100 flex flex-col selection:bg-blue-500/30 overflow-hidden font-['Inter']">
      {/* Dynamic Background Effects */}
      <div className="noise opacity-10" />
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className={`fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-from)_0%,_transparent_100%)] ${getTimeColor()} to-transparent pointer-events-none transition-colors duration-1000`}
      />
      
      {/* Top Navigation Bar - Snapchat Style */}
      <header className="z-30 w-full px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#FFFC00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,252,0,0.4)] group cursor-pointer overflow-hidden relative">
               <motion.span
                 initial={{ y: 20, scale: 0.5 }}
                 animate={{ y: 0, scale: 1 }}
                 className="text-black font-black text-3xl tracking-tighter z-10"
               >
                 E
               </motion.span>
               <motion.div
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 bg-white/30 skew-x-12"
               />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#08080a] rounded-full" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">
              E<span className="text-blue-500">lysi</span>a
            </h1>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Neural Sync Active</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <CameraFeed
            isActive={cameraActive}
            onFrame={handleFrame}
            toggleCamera={() => dispatch(setCameraActive(!cameraActive))}
          />
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-zinc-400 hover:text-white">
            <History size={20} />
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-zinc-400 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="z-10 flex-1 w-full flex overflow-hidden relative">
        {/* Left Side - Character Visualization */}
        <div className="hidden lg:grid grid-rows-[1fr_auto] flex-1 relative bg-gradient-to-br from-black/20 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />

          <div className="flex items-center justify-center relative z-10">
            <ElysiaCharacter emotion={emotion} isSpeaking={isSpeaking} />
          </div>

          <div className="w-full max-w-xl mx-auto px-12 pb-12 z-20">
            <VoiceControl 
              onVoiceInput={handleVoiceInput} 
              isListening={isListening} 
              setIsListening={(val) => dispatch(setListening(val))}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 lg:flex-none lg:w-[520px] h-full border-l border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col relative shadow-2xl">
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage} 
            isTyping={isTyping}
          />

          {/* Mobile Voice Control Overlay */}
          <div className="lg:hidden absolute bottom-24 left-6 right-6 z-20">
             <VoiceControl
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              setIsListening={(val) => dispatch(setListening(val))}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

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
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center p-8 overflow-hidden">
      {/* Background Glow */}
      <div className={`fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-from)_0%,_transparent_50%)] ${getTimeColor()} to-transparent pointer-events-none`} />
      
      <header className="z-10 w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xl">E</div>
          <h1 className="text-2xl font-light tracking-widest uppercase">Elysia</h1>
        </div>
        <CameraFeed 
          isActive={cameraActive} 
          onFrame={handleFrame} 
          toggleCamera={() => dispatch(setCameraActive(!cameraActive))} 
        />
      </header>

      <main className="z-10 flex-1 w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 flex flex-col items-center justify-center h-[50vh] md:h-full">
          <ElysiaCharacter emotion={emotion} isSpeaking={isSpeaking} />
          <div className="mt-8">
            <VoiceControl 
              onVoiceInput={handleVoiceInput} 
              isListening={isListening} 
              setIsListening={(val) => dispatch(setListening(val))}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>
        
        <div className="w-full md:w-[450px] h-[60vh] md:h-[70vh]">
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage} 
            isTyping={isTyping}
          />
        </div>
      </main>
      
      <footer className="z-10 mt-8 text-white/40 text-sm">
        Elysia AI Companion • Inspired by "Her"
      </footer>
    </div>
  );
};

export default App;

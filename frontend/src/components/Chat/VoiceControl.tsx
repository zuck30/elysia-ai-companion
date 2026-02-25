import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceControlProps {
  onVoiceInput: (audioBlob: Blob) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  isSpeaking: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onVoiceInput, isListening, setIsListening, isSpeaking }) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        onVoiceInput(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsListening(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-snapchat-blue uppercase tracking-widest">Voice Interface</span>
          <span className="text-sm font-bold text-white uppercase tracking-tighter">
            {isListening ? 'Recording...' : isSpeaking ? 'Elysia is Speaking' : 'Ready'}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: (isListening || isSpeaking) ? [4, 16, 8, 20, 4] : 4,
                opacity: (isListening || isSpeaking) ? 1 : 0.3
              }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                delay: i * 0.1,
              }}
              className={`w-1 rounded-full ${isListening ? 'bg-red-500' : 'bg-snapchat-blue'}`}
            />
          ))}
        </div>

        <button
          onClick={isListening ? stopRecording : startRecording}
          className={`p-4 rounded-full transition-all ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceControl;

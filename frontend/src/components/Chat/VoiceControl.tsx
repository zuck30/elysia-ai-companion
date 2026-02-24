import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopRecording : startRecording}
          className={`relative p-5 rounded-3xl transition-all duration-500 ${
            isListening
              ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
              : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-xl'
          } text-white group`}
        >
          {isListening ? (
            <MicOff size={28} className="animate-pulse" />
          ) : (
            <Mic size={28} className="group-hover:scale-110 transition-transform" />
          )}
          {isListening && (
            <motion.div
              layoutId="ripple"
              className="absolute inset-0 rounded-3xl bg-red-500 -z-10"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </motion.button>

        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {isSpeaking ? (
              <motion.div
                key="speaking"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center text-purple-300 bg-white/5 px-4 py-2 rounded-2xl border border-white/10"
              >
                <div className="flex space-x-1 mr-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 16, 8] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest">Elysia is speaking</span>
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center text-red-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/10"
              >
                <span className="text-xs font-semibold uppercase tracking-widest animate-pulse">Listening...</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;

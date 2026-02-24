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
    <div className="w-full flex flex-col items-center space-y-8 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 backdrop-blur-sm">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-1">Input Source</span>
          <span className="text-xs text-zinc-300 font-medium">System Microphone</span>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-1 h-3 rounded-full ${isListening ? 'bg-red-500/50 animate-pulse' : 'bg-zinc-800'}`} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isListening ? stopRecording : startRecording}
          className={`relative px-8 py-4 rounded-2xl transition-all duration-700 flex items-center space-x-3 overflow-hidden ${
            isListening
              ? 'bg-red-500/10 border border-red-500/30 text-red-500'
              : 'bg-zinc-100 border border-transparent text-zinc-900 shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
          } group`}
        >
          {isListening ? (
            <>
              <MicOff size={18} className="animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest">Stop Listening</span>
            </>
          ) : (
            <>
              <Mic size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Start Session</span>
            </>
          )}
          {isListening && (
            <motion.div
              className="absolute inset-0 bg-red-500/5"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.button>

        <div className="h-10 w-[1px] bg-white/10" />

        <div className="flex-1 min-w-[120px]">
          <AnimatePresence mode="wait">
            {isSpeaking ? (
              <motion.div
                key="speaking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <span className="text-[9px] text-purple-400 uppercase tracking-widest font-black mb-1">Output</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1 bg-purple-400 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-tighter">Synthesizing...</span>
                </div>
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
              >
                <span className="text-[9px] text-red-500 uppercase tracking-widest font-black mb-1">Status</span>
                <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-tighter animate-pulse">Capturing Audio</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-black mb-1">Ready</span>
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-tighter">Standing By</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;

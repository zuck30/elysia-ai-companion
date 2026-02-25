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
    <div className="relative group w-full max-w-lg mx-auto">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative bg-black/40 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl overflow-hidden">
        {/* Technical Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">Audio Interface</p>
              </div>
              <h3 className="text-xl font-black text-white tracking-tighter italic">
                {isListening ? 'VOICE_ACTIVE' : 'READY_TO_SYNC'}
              </h3>
            </div>

            <div className="flex items-end space-x-1.5 h-8">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isListening ? [8, 24, 12, 28, 8] : 4,
                    opacity: isListening ? 1 : 0.3
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 bg-gradient-to-t from-blue-600 to-purple-400 rounded-full"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isListening ? stopRecording : startRecording}
              className={`relative overflow-hidden py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${
                isListening
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.15)]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff size={14} className="animate-pulse" />
                  <span>Terminate</span>
                </>
              ) : (
                <>
                  <Mic size={14} />
                  <span>Initiate Link</span>
                </>
              )}
            </motion.button>

            <div className="px-6 py-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Neural Latency</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-white tracking-widest">0.024s</span>
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-black bg-blue-500 flex items-center justify-center">
                  <span className="text-[8px] font-bold">Z</span>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-black bg-purple-500 flex items-center justify-center">
                  <span className="text-[8px] font-bold">S</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Multi-Modal active</span>
            </div>
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter">ELYSIA_v2.4.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;

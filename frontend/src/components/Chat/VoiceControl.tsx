import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
    <div className="flex items-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isListening ? stopRecording : startRecording}
        className={`p-4 rounded-full transition-colors ${
          isListening ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-purple-600'
        } text-white`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>
      
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center text-purple-300"
        >
          <Volume2 className="animate-pulse mr-2" />
          <span className="text-sm font-medium">Elysia is speaking...</span>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceControl;

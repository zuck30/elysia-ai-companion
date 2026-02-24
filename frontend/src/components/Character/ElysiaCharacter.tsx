import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ElysiaCharacterProps {
  emotion: string;
  isSpeaking: boolean;
}

const emotionStyles: Record<string, any> = {
  happy: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)' },
  sad: { color: '#4682B4', glow: 'rgba(70, 130, 180, 0.5)' },
  angry: { color: '#FF4500', glow: 'rgba(255, 69, 0, 0.5)' },
  neutral: { color: '#E6E6FA', glow: 'rgba(230, 230, 250, 0.5)' },
  loving: { color: '#FF69B4', glow: 'rgba(255, 105, 180, 0.5)' },
  curious: { color: '#98FB98', glow: 'rgba(152, 251, 152, 0.5)' },
};

const ElysiaCharacter: React.FC<ElysiaCharacterProps> = ({ emotion, isSpeaking }) => {
  const style = emotionStyles[emotion] || emotionStyles.neutral;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Abstract Fluid Core */}
        <motion.svg
          width="400"
          height="400"
          viewBox="0 0 200 200"
          animate={{
            filter: `drop-shadow(0 0 20px ${style.glow})`,
          }}
        >
          <motion.path
            d="M 100, 50 C 130, 50 150, 70 150, 100 C 150, 130 130, 150 100, 150 C 70, 150 50, 130 50, 100 C 50, 70 70, 50 100, 50 Z"
            fill={style.color}
            initial={false}
            animate={{
              d: isSpeaking 
                ? "M 100, 45 C 140, 45 155, 75 155, 100 C 155, 125 140, 155 100, 155 C 60, 155 45, 125 45, 100 C 45, 75 60, 45 100, 45 Z"
                : "M 100, 50 C 130, 50 150, 70 150, 100 C 150, 130 130, 150 100, 150 C 70, 150 50, 130 50, 100 C 50, 70 70, 50 100, 50 Z"
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Eyes/Points of Light */}
          <motion.circle
            cx="80" cy="90" r="5"
            fill="white"
            animate={{
              scaleY: emotion === 'sad' ? 0.2 : 1,
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.circle
            cx="120" cy="90" r="5"
            fill="white"
            animate={{
              scaleY: emotion === 'sad' ? 0.2 : 1,
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
          />

          {/* Mouth / Communication Wave */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.path
                d="M 85, 120 Q 100, 130 115, 120"
                stroke="white"
                strokeWidth="2"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </motion.svg>

        {/* Particle Effects */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: style.color }}
            animate={{
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ElysiaCharacter;

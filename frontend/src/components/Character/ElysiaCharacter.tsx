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
      {/* Background Aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-64 h-64 rounded-full blur-[80px]"
        style={{ backgroundColor: style.color }}
      />

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        {/* Abstract Fluid Core */}
        <motion.svg
          width="400"
          height="400"
          viewBox="0 0 200 200"
          className="drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <defs>
            <radialGradient id="coreGradient">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor={style.color} />
            </radialGradient>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
          </defs>

          <g filter="url(#goo)">
            {/* Outer Layer */}
            <motion.path
              d="M 100, 40 C 140, 40 160, 60 160, 100 C 160, 140 140, 160 100, 160 C 60, 160 40, 140 40, 100 C 40, 60 60, 40 100, 40 Z"
              fill={style.color}
              opacity="0.3"
              animate={{
                d: [
                  "M 100, 40 C 140, 40 160, 60 160, 100 C 160, 140 140, 160 100, 160 C 60, 160 40, 140 40, 100 C 40, 60 60, 40 100, 40 Z",
                  "M 100, 35 C 150, 35 170, 70 170, 100 C 170, 130 150, 165 100, 165 C 50, 165 30, 130 30, 100 C 30, 70 50, 35 100, 35 Z",
                  "M 100, 40 C 140, 40 160, 60 160, 100 C 160, 140 140, 160 100, 160 C 60, 160 40, 140 40, 100 C 40, 60 60, 40 100, 40 Z"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Middle Layer */}
            <motion.path
              d="M 100, 50 C 130, 50 150, 70 150, 100 C 150, 130 130, 150 100, 150 C 70, 150 50, 130 50, 100 C 50, 70 70, 50 100, 50 Z"
              fill={style.color}
              opacity="0.6"
              animate={{
                scale: isSpeaking ? [1, 1.1, 1] : [1, 1.02, 1],
                d: isSpeaking
                  ? "M 100, 45 C 145, 45 155, 75 155, 100 C 155, 125 145, 155 100, 155 C 55, 155 45, 125 45, 100 C 45, 75 55, 45 100, 45 Z"
                  : "M 100, 50 C 135, 50 150, 75 150, 100 C 150, 125 135, 150 100, 150 C 65, 150 50, 125 50, 100 C 50, 75 65, 50 100, 50 Z"
              }}
              transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
            />

            {/* Core */}
            <motion.circle
              cx="100" cy="100" r="35"
              fill="url(#coreGradient)"
              animate={{
                r: isSpeaking ? [35, 40, 35] : 35,
              }}
              transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
            />
          </g>
          
          {/* Eyes/Points of Light - More Soulful */}
          <motion.g
            animate={{
              y: isSpeaking ? -2 : 0
            }}
          >
            <motion.circle
              cx="85" cy="95" r="4"
              fill="white"
              className="shadow-xl"
              animate={{
                scaleY: emotion === 'sad' ? 0.2 : [1, 1, 0.1, 1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                scaleY: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] },
                opacity: { repeat: Infinity, duration: 3 }
              }}
            />
            <motion.circle
              cx="115" cy="95" r="4"
              fill="white"
              animate={{
                scaleY: emotion === 'sad' ? 0.2 : [1, 1, 0.1, 1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                scaleY: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1], delay: 0.1 },
                opacity: { repeat: Infinity, duration: 3, delay: 0.2 }
              }}
            />
          </motion.g>

          {/* Voice Visualization Ring */}
          {isSpeaking && (
            <motion.circle
              cx="100" cy="100" r="70"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            />
          )}
        </motion.svg>

        {/* Enhanced Particle System */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full blur-[1px]"
            style={{ backgroundColor: i % 2 === 0 ? 'white' : style.color }}
            animate={{
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ElysiaCharacter;

import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Mic, Image as ImageIcon, Smile, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'elysia';
  content: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  isSpeaking: boolean;
  onVoiceInput: (blob: Blob) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isTyping,
  isListening,
  setIsListening,
  isSpeaking,
  onVoiceInput
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden font-avenir">
      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-none scroll-smooth flex flex-col"
      >
        <AnimatePresence mode='popLayout' initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <div className="relative group">
                <div
                  className={`px-4 py-3 rounded-[22px] text-[16px] font-medium leading-snug shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-snapchat-blue text-white rounded-br-[4px]'
                      : 'bg-white text-zinc-900 rounded-bl-[4px]'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Bubble Tail Accent */}
                {msg.role === 'user' ? (
                  <div className="absolute -bottom-0.5 -right-1 w-4 h-4 bg-snapchat-blue transform rotate-45 -z-10 rounded-sm" />
                ) : (
                  <div className="absolute -bottom-0.5 -left-1 w-4 h-4 bg-white transform rotate-45 -z-10 rounded-sm" />
                )}
              </div>

              <div className={`mt-1.5 flex items-center space-x-1.5 transition-opacity duration-300 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <span className="text-[10px] font-black text-zinc-500/60 uppercase tracking-tighter">
                  {msg.timestamp || getTimestamp()}
                </span>
                {msg.role === 'user' && (
                  <div className="flex items-center space-x-0.5">
                    <span className="text-[10px] font-black text-snapchat-blue uppercase tracking-tighter">Read</span>
                    <CheckCircle2 size={10} className="text-snapchat-blue" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
           <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/5"
          >
            <div className="flex space-x-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-1.5 h-1.5 bg-snapchat-yellow rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-snapchat-yellow rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-snapchat-yellow rounded-full"
              />
            </div>
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Elysia is typing</span>
          </motion.div>
        )}
      </div>
      
      {/* Snapchat Floating Input Bar */}
      <div className="p-4 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex items-center bg-white/10 backdrop-blur-3xl border border-white/10 rounded-full px-2 py-1 flex-1 shadow-2xl transition-all focus-within:border-white/20">
            <button type="button" className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <Camera size={22} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a Chat"
              className="flex-1 bg-transparent border-none py-3 px-2 text-white placeholder:text-zinc-500 focus:outline-none font-bold text-[15px]"
            />

            <div className="flex items-center space-x-1 pr-1">
              <button
                type="button"
                onClick={() => setIsListening(!isListening)}
                className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'text-white hover:bg-white/10'}`}
              >
                <Mic size={22} />
              </button>
              <button type="button" className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <ImageIcon size={22} />
              </button>
              <button type="button" className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <Smile size={22} />
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!input.trim()}
            className={`p-4 rounded-full transition-all flex items-center justify-center shadow-lg ${
              input.trim()
                ? 'bg-snapchat-blue text-white shadow-blue-500/40'
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            <Send size={20} fill={input.trim() ? "currentColor" : "none"} />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

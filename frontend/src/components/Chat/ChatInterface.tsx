import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'elysia';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
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

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full bg-[#0d0d12]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Neural Sync Active</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/5 scroll-smooth"
      >
        <AnimatePresence mode='popLayout' initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
            >
              {msg.role === 'elysia' && (
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-1">
                  <Zap size={14} className="text-purple-400" />
                </div>
              )}
              <div 
                className={`max-w-[80%] px-5 py-3.5 rounded-[1.5rem] shadow-2xl relative group ${
                  msg.role === 'user' 
                    ? 'bg-zinc-100 text-zinc-900 rounded-br-none font-medium'
                    : 'bg-white/5 text-zinc-100 backdrop-blur-md rounded-bl-none border border-white/10 font-light'
                }`}
              >
                <p className="text-[15px] leading-relaxed tracking-tight">
                  {msg.content}
                </p>
                <div className={`absolute bottom-0 ${msg.role === 'user' ? '-right-1 border-l-8 border-l-zinc-100' : '-left-1 border-r-8 border-r-white/5'} border-t-8 border-t-transparent h-0 w-0`} />
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                  <User size={14} className="text-zinc-500" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Zap size={14} className="text-purple-400" />
              </div>
              <div className="bg-white/5 px-5 py-4 rounded-[1.5rem] rounded-tl-none border border-white/10 backdrop-blur-md">
                <div className="flex space-x-1.5">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all duration-500"
          />
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 rounded-xl transition-all flex items-center justify-center shadow-lg"
          >
            <Send size={18} />
          </motion.button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">End-to-End Encryption</p>
          <div className="flex items-center space-x-2 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            <span>Latency: 24ms</span>
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

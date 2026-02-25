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
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
      {/* Snapchat Chat Header */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center space-x-3 bg-black/40 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <span className="text-sm font-black uppercase tracking-widest text-white">Elysia</span>
        <span className="text-[10px] text-zinc-500 font-bold">• Chatting now</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none scroll-smooth flex flex-col"
      >
        <AnimatePresence mode='popLayout' initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${msg.role === 'user' ? 'text-blue-400' : 'text-purple-400'}`}>
                {msg.role === 'user' ? 'ME' : 'ELYSIA'}
              </span>
              <div 
                className={`px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-white/10 text-zinc-100 rounded-tl-none border border-white/5'
                }`}
              >
                {msg.content}
              </div>
              <div className="mt-1 flex items-center space-x-1 opacity-40">
                <span className="text-[9px] font-bold">Delivered</span>
                {msg.role === 'user' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-zinc-500 italic text-xs font-bold pl-1"
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>Elysia is typing...</span>
          </motion.div>
        )}
      </div>
      
      {/* Snapchat Input Bar */}
      <div className="p-4 bg-black/60 backdrop-blur-2xl border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <button type="button" className="p-2.5 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Zap size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a Chat"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full transition-all flex items-center justify-center font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>

          <button type="button" className="p-2.5 bg-[#FFFC00] rounded-full text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,252,0,0.2)]">
            <Sparkles size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Scale, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { getLegalChatResponse } from '../lib/gemini';

interface Message {
  role: 'user' | 'model';
  message: string;
}

export default function LegalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', message: 'Hola, soy su Asistente Legal Inteligente. ¿En qué puedo ayudarle hoy con el Código Civil, Penal o Mercantil?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getLegalChatResponse(messages.slice(1), userMessage);
      setMessages(prev => [...prev, { role: 'model', message: response || 'Lo siento, no he podido procesar su consulta.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', message: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative font-sans h-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-32 right-12 z-[2000] bg-white border border-[#d0c5b6]/30 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-300 origin-top-right
              ${isMinimized ? 'h-16 w-80' : 'h-[650px] w-[450px] sm:w-[550px]'}`}
          >
            {/* Header */}
            <header className="bg-[#2d1b0d] p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/legal-tech/200/200" 
                    alt="AI Assistant" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-serif italic">Lawbot</h4>
                  <p className="text-[9px] uppercase tracking-[0.2em] opacity-50 font-bold">Consultoría IA</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdf9f6] scroll-smooth"
                >
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden
                          ${msg.role === 'user' ? 'bg-[#74572a] text-white' : 'bg-white text-[#2d1b0d] border border-[#d0c5b6]/30'}`}
                        >
                          {msg.role === 'user' ? <User size={18} /> : (
                            <img 
                              src="https://picsum.photos/seed/legal-tech/200/200" 
                              alt="Bot" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm
                          ${msg.role === 'user' 
                            ? 'bg-[#2d1b0d] text-white rounded-tr-none' 
                            : 'bg-white text-[#1c1b1a] rounded-tl-none border border-[#d0c5b6]/10'}`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-4 max-w-[85%]">
                        <div className="w-10 h-10 rounded-2xl bg-white text-[#2d1b0d] border border-[#d0c5b6]/30 flex items-center justify-center shadow-sm overflow-hidden">
                          <img 
                            src="https://picsum.photos/seed/legal-tech/200/200" 
                            alt="Bot" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-white border border-[#d0c5b6]/10 shadow-sm rounded-tl-none flex items-center gap-3">
                          <Loader2 size={20} className="animate-spin text-[#74572a]" />
                          <span className="text-xs italic text-[#4d463a]/60 font-medium">Consultando jurisprudencia...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-[#d0c5b6]/10 flex gap-3">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Consulte el Código Civil o Penal..."
                    className="flex-1 bg-[#f7f3f0] border border-[#d0c5b6]/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#74572a]/20 transition-all font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-4 bg-[#74572a] text-white rounded-2xl hover:bg-[#5e4622] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all active:scale-95 flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="h-10 px-5 bg-[#2d1b0d] text-white rounded-2xl shadow-lg flex items-center gap-2 hover:shadow-xl transition-all border border-white/10 group overflow-hidden"
        >
          <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/20">
            <img 
              src="https://picsum.photos/seed/legal-tech/200/200" 
              alt="IA" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-[9px] uppercase tracking-[0.2em]">Consúltame</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        </motion.button>
      )}
    </div>
  );
}

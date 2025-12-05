import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToPaulinha } from '../services/geminiService';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Oi amor! 🔥 Gostou de algo que viu? Posso te ajudar a escolher o vídeo perfeito para hoje...',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await sendMessageToPaulinha(input);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: replyText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return (
    <button 
      onClick={onClose} // Acts as open trigger when passed from parent properly, but here we render conditionally usually. 
      // Actually parent controls visibility. If !isOpen, return null or a button. 
      // For this implementation, we will assume parent handles mounting/unmounting or hidden state.
      // Let's assume this component is always mounted but hidden via CSS or parent conditional.
      // If isOpen is false, we render a Floating Action Button.
      className="fixed bottom-6 right-6 z-40 bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg shadow-brand-600/40 transition-transform hover:scale-110"
    >
      <Sparkles size={24} />
    </button>
  );

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 h-[80vh] md:h-[600px] z-50 bg-neutral-900 md:rounded-2xl shadow-2xl flex flex-col border border-white/10 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-brand-900/50 md:rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://picsum.photos/id/646/100/100" 
              alt="Paulinha" 
              className="w-10 h-10 rounded-full border-2 border-green-500 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white">Paulinha</h3>
            <p className="text-xs text-green-400">Online agora</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-neutral-800 text-gray-200 rounded-bl-none border border-white/5'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 p-3 rounded-2xl rounded-bl-none border border-white/5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-neutral-900 md:rounded-b-2xl">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mande uma mensagem..." 
            className="flex-1 bg-neutral-800 border-none rounded-xl px-4 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-brand-600 text-white p-2 rounded-xl hover:bg-brand-500 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

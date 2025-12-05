import React, { useState } from 'react';
import { X, Unlock, Key } from 'lucide-react';

interface VipCodeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VipCodeModal: React.FC<VipCodeModalProps> = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha definida no prompt
    if (code.toLowerCase() === 'prazerilimitado') {
      onSuccess();
    } else {
      setError('Senha incorreta. Verifique seu e-mail ou tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-neutral-900 border border-brand-500/30 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-brand-600/20 rounded-full flex items-center justify-center text-brand-500 mb-4">
            <Key size={24} />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Área de Membros VIP</h3>
          <p className="text-sm text-gray-400 mt-2">
            Já comprou? Digite a senha enviada para o seu e-mail para liberar todo o conteúdo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="Digite a senha VIP..."
              className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:ring-1 focus:ring-brand-500 outline-none placeholder-gray-600 tracking-wider font-medium"
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center animate-pulse">{error}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            <Unlock size={18} />
            ACESSAR CONTEÚDO
          </button>
        </form>
        
        <div className="mt-4 text-center">
           <p className="text-xs text-gray-600">Problemas com a senha? <a href="#" className="text-brand-500 underline">Entre em contato</a></p>
        </div>
      </div>
    </div>
  );
};
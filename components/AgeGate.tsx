import React from 'react';

interface AgeGateProps {
  onVerify: () => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ onVerify }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-md p-4">
      <div className="bg-brand-900 border border-brand-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-red-900/20">
        <h2 className="text-3xl font-serif text-white mb-4">Conteúdo Restrito</h2>
        <p className="text-gray-400 mb-8">
          Este site contém material destinado exclusivamente a maiores de 18 anos.
          Ao entrar, você confirma que tem idade legal para visualizar este conteúdo.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onVerify}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-red-700 text-white font-bold rounded-xl hover:from-brand-500 hover:to-red-600 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            SOU MAIOR DE 18 ANOS
          </button>
          <a 
            href="https://google.com"
            className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm"
          >
            Sair do site
          </a>
        </div>
      </div>
    </div>
  );
};

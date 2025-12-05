import React, { useState } from 'react';
import { Download, Upload, Cloud, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { exportDatabase, importDatabase } from '../services/storage';

interface AdminBackupModalProps {
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const AdminBackupModal: React.FC<AdminBackupModalProps> = ({ onClose, onRestoreSuccess }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      const jsonStr = await exportDatabase();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `paulinha-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erro ao criar backup. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("⚠️ ATENÇÃO: Isso irá substituir TODOS os vídeos e capa atuais pelos dados do arquivo.\n\nDeseja continuar?")) {
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonStr = event.target?.result as string;
      const success = await importDatabase(jsonStr);
      
      if (success) {
        alert("✅ Site sincronizado com sucesso!\nA página será recarregada.");
        onRestoreSuccess();
        window.location.reload();
      } else {
        alert("❌ Erro ao ler o arquivo de backup. Verifique se é um JSON válido.");
      }
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-neutral-900 border border-brand-500/30 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400 mb-4 animate-pulse">
            <Cloud size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Sincronização de Dispositivos</h2>
          <p className="text-sm text-gray-400 mt-2 px-4">
            Como este site não possui servidor central, use esta ferramenta para mover suas configurações do PC para o Celular.
          </p>
        </div>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="bg-neutral-800 rounded-xl p-4 border border-white/5 hover:border-blue-500/50 transition-colors">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Download size={18} className="text-green-400" />
              1. No Computador (Origem)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Baixe o arquivo de configuração atual com todos os vídeos e a capa.
            </p>
            <button 
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="w-full py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isExporting ? 'Gerando Arquivo...' : 'BAIXAR ARQUIVO DE BACKUP'}
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-neutral-800 rounded-xl p-4 border border-white/5 hover:border-blue-500/50 transition-colors">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Upload size={18} className="text-yellow-400" />
              2. No Celular (Destino)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Envie o arquivo baixado para o celular e carregue-o aqui para sincronizar.
            </p>
            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                onChange={handleRestoreBackup}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button 
                className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isImporting ? 'Restaurando...' : 'CARREGAR ARQUIVO DO PC'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 bg-red-900/20 p-3 rounded-lg">
           <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
           <p className="text-[10px] text-red-200">
             Nota: Se os vídeos forem muito pesados, o arquivo de backup pode ficar grande. Recomenda-se usar vídeos curtos para melhor performance.
           </p>
        </div>
      </div>
    </div>
  );
};
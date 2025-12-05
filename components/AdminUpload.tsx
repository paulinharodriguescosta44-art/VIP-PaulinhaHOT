import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Film } from 'lucide-react';
import { Video } from '../types';

interface AdminUploadProps {
  onClose: () => void;
  onAddVideo: (video: Video) => void;
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ onClose, onAddVideo }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('');
  const [isExclusive, setIsExclusive] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Helper to convert file to Base64 string for storage
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !thumbnailFile) {
      alert("Por favor, adicione um título e uma imagem de capa.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Convert Image
      const thumbUrl = await convertToBase64(thumbnailFile);
      
      // 2. Convert Video (if provided)
      let videoUrl = '';
      if (videoFile) {
        // Warning: LocalStorage has a limit (usually 5-10MB). Large videos will fail to save permanently.
        // For a robust app, you would upload to a server/cloud storage.
        try {
           videoUrl = await convertToBase64(videoFile);
        } catch (videoError) {
           console.warn("Vídeo muito grande para converter, usando URL temporária.", videoError);
           videoUrl = URL.createObjectURL(videoFile);
        }
      }

      const newVideo: Video = {
        id: `custom-${Date.now()}`,
        title,
        description: desc || 'Vídeo adicionado via admin.',
        thumbnailUrl: thumbUrl,
        previewUrl: videoUrl, // This stores the actual video data
        price: 0, 
        duration: duration || '00:00',
        tags: ['Novo', isExclusive ? 'Premium' : 'Grátis'],
        isExclusive,
        views: 0
      };

      onAddVideo(newVideo);
      
      // Reset form
      setTitle('');
      setDesc('');
      setDuration('');
      setThumbnailFile(null);
      setVideoFile(null);
      alert('Vídeo adicionado com sucesso!');
    } catch (error) {
      console.error("Erro ao processar arquivos", error);
      alert("Erro ao processar os arquivos. O vídeo ou imagem podem ser muito grandes para o navegador.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-brand-900 w-full max-w-2xl rounded-2xl shadow-2xl relative animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-brand-900/20 rounded-t-2xl">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Upload className="text-brand-500" />
            Adicionar Novo Vídeo
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* File Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Capa do Vídeo (Obrigatório)</label>
              <div className="relative group h-32">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`h-full border-2 border-dashed rounded-xl flex items-center justify-center text-center transition-colors ${thumbnailFile ? 'border-brand-500 bg-brand-900/20' : 'border-white/10 hover:border-white/30 bg-neutral-800'}`}>
                  {thumbnailFile ? (
                    <div className="flex flex-col items-center text-brand-500 p-2">
                      <Check size={24} className="mb-1" />
                      <span className="text-xs truncate max-w-[150px]">{thumbnailFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-xs">Foto de Capa</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Arquivo de Vídeo (Obrigatório)</label>
              <div className="relative group h-32">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`h-full border-2 border-dashed rounded-xl flex items-center justify-center text-center transition-colors ${videoFile ? 'border-brand-500 bg-brand-900/20' : 'border-white/10 hover:border-white/30 bg-neutral-800'}`}>
                   {videoFile ? (
                    <div className="flex flex-col items-center text-brand-500 p-2">
                      <Check size={24} className="mb-1" />
                      <span className="text-xs truncate max-w-[150px]">{videoFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Film size={24} className="mb-1" />
                      <span className="text-xs">Arquivo MP4/MOV</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Text Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Título do Vídeo</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                placeholder="Ex: Noite Inesquecível"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duração</label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                  placeholder="Ex: 10:30"
                />
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isExclusive ? 'bg-brand-600 border-brand-600' : 'border-gray-500 bg-neutral-800'}`}>
                    {isExclusive && <Check size={16} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isExclusive}
                    onChange={(e) => setIsExclusive(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-white font-medium">Conteúdo VIP?</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-500 outline-none resize-none"
                placeholder="Uma breve descrição provocante..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white font-medium transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isProcessing}
              className={`px-8 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isProcessing ? 'Salvando...' : 'Salvar Vídeo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoCard } from './components/VideoCard';
import { AdminUpload } from './components/AdminUpload';
import { VipCodeModal } from './components/VipCodeModal';
import { AdminBackupModal } from './components/AdminBackupModal';
import { PERMANENT_VIDEOS, STATIC_HERO_IMAGE } from './constants';
import { Video, UserState } from './types';
import { Lock, Plus, X, Settings } from 'lucide-react';
import { getAllVideos, saveAllVideos, getHeroImageFromDB, saveHeroImageToDB } from './services/storage';

// Simple Modal Video Player Component
const VideoPlayer: React.FC<{ video: Video; onClose: () => void }> = ({ video, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
    <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-serif text-lg truncate pr-8">{video.title}</h3>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="aspect-video bg-neutral-900 flex items-center justify-center">
        {video.previewUrl ? (
          <video 
            src={video.previewUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-8">
             <p className="text-gray-400 mb-2">Este vídeo é exclusivo ou não possui prévia pública.</p>
             <p className="text-sm text-gray-600">No modo admin, edite o código em 'constants.ts' para adicionar um link de vídeo.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  // Persistence Loading for User State (Small data can stay in LocalStorage)
  const loadUserState = (): UserState => {
    try {
      const saved = localStorage.getItem('paulinha_state');
      return saved ? JSON.parse(saved) : { 
        isAgeVerified: true, 
        unlockedVideos: [], 
        favorites: [],
        isVipUnlocked: false
      };
    } catch (e) {
      return { isAgeVerified: true, unlockedVideos: [], favorites: [], isVipUnlocked: false };
    }
  };

  // Admin persistence
  const loadAdminState = (): boolean => {
    return localStorage.getItem('paulinha_admin_mode') === 'true';
  };

  const [userState, setUserState] = useState<UserState>(loadUserState);
  const [localVideos, setLocalVideos] = useState<Video[]>([]); 
  const [heroImage, setHeroImage] = useState<string>(STATIC_HERO_IMAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  // Admin & Interaction States
  const [isAdminMode, setIsAdminMode] = useState(loadAdminState);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  // CRITICAL: Flag to ensure we don't save empty arrays over existing data on boot
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // 1. Initial Data Load (Runs Once)
  useEffect(() => {
    const loadData = async () => {
      // Load Local Videos (DB)
      const dbVideos = await getAllVideos();
      setLocalVideos(dbVideos);

      // Load Hero Image
      // Priority: DB Image (if changed manually) -> Static Config Image
      const dbImage = await getHeroImageFromDB();
      if (dbImage) {
        setHeroImage(dbImage);
      } else {
        setHeroImage(STATIC_HERO_IMAGE);
      }

      setIsStorageLoaded(true); // Data loaded, now safe to save updates
    };
    
    loadData();
  }, []);

  // 2. Save Videos (Only if loaded) - We only save LOCAL videos to DB
  useEffect(() => {
    if (isStorageLoaded) {
      saveAllVideos(localVideos);
    }
  }, [localVideos, isStorageLoaded]);

  // 3. Save Hero Image (Only if loaded)
  useEffect(() => {
    if (isStorageLoaded) {
      saveHeroImageToDB(heroImage);
    }
  }, [heroImage, isStorageLoaded]);

  // Save User State (LocalStorage is sync, safe to save always)
  useEffect(() => {
    localStorage.setItem('paulinha_state', JSON.stringify(userState));
  }, [userState]);

  // Save Admin Mode
  useEffect(() => {
    localStorage.setItem('paulinha_admin_mode', String(isAdminMode));
  }, [isAdminMode]);

  // Combine Permanent + Local Videos
  const allVideos = [...PERMANENT_VIDEOS, ...localVideos];

  // Interactions
  const handleVideoClick = (video: Video) => {
    // 1. Se for Admin, libera tudo para preview
    if (isAdminMode) {
      setPlayingVideo(video);
      return;
    }

    const isUnlocked = userState.unlockedVideos.includes(video.id);
    const isGlobalVip = userState.isVipUnlocked;

    // 2. Se o vídeo não é exclusivo, já foi comprado, OU o usuário é VIP global -> Toca o vídeo
    if (!video.isExclusive || isUnlocked || isGlobalVip) {
       setPlayingVideo(video); 
    } else {
      // 3. Conteúdo VIP Bloqueado -> Redireciona para pagamento
      const confirmPurchase = window.confirm(`🔒 CONTEÚDO VIP\n\nEste conteúdo é exclusivo da Paulinha.\nDeseja liberar o acesso completo agora?`);
      
      if (confirmPurchase) {
        window.open("https://go.tribopay.com.br/zp79c09xnw", "_blank");
      }
    }
  };

  const handleVipSuccess = () => {
    setUserState(prev => ({ ...prev, isVipUnlocked: true }));
    setIsVipModalOpen(false);
    alert("🔥 SENHA CORRETA!\n\nVocê agora tem acesso TOTAL e ILIMITADO a todos os vídeos. Aproveite!");
  };

  // --- ADMIN FUNCTIONS ---

  const handleAddVideo = (newVideo: Video) => {
    setLocalVideos(prev => [newVideo, ...prev]);
    setIsUploadModalOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    // Check if it's a permanent video
    if (PERMANENT_VIDEOS.some(v => v.id === id)) {
      alert("Este é um vídeo fixo do sistema (configurado em constants.ts) e não pode ser excluído pelo painel.");
      return;
    }

    const confirmDelete = window.confirm("Tem certeza que deseja EXCLUIR este vídeo permanentemente?");
    if (confirmDelete) {
      setLocalVideos(prev => {
        const updated = prev.filter(v => v.id !== id);
        return updated;
      });
    }
  };

  // -----------------------

  const categories = ['Todos', 'Premium', 'Gratuitos'];

  const filteredVideos = allVideos.filter(v => {
    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'Premium') return v.isExclusive;
    if (selectedCategory === 'Gratuitos') return !v.isExclusive;
    return v.tags.includes(selectedCategory);
  });

  if (!isStorageLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-brand-600 animate-pulse font-bold text-xl">Carregando catálogo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-gray-100 selection:bg-brand-600 selection:text-white pb-20 relative">
      
      <Navbar 
        isAdminMode={isAdminMode} 
        onOpenVipModal={() => setIsVipModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      <main>
        <Hero 
          isAdminMode={isAdminMode}
          heroImage={heroImage}
          onUpdateImage={setHeroImage}
        />

        {/* Filters */}
        <div className="sticky top-16 z-30 bg-neutral-950/80 backdrop-blur-lg border-b border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Admin Add Button in Toolbar */}
            {isAdminMode && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-brand-600/30 transition-all animate-pulse"
              >
                <Plus size={18} />
                ADICIONAR VÍDEO
              </button>
            )}
          </div>
        </div>

        {/* Admin Banner */}
        {isAdminMode && (
          <div className="bg-red-900/20 border-b border-red-900/50 py-2 text-center animate-fade-in-down">
            <p className="text-red-400 text-sm font-mono flex items-center justify-center gap-2">
               <Settings size={14} /> MODO ADMIN ATIVADO
            </p>
          </div>
        )}

        {/* VIP Active Banner (Client Mode) */}
        {userState.isVipUnlocked && !isAdminMode && (
          <div className="bg-green-900/20 border-b border-green-900/50 py-2 text-center animate-fade-in-down">
            <p className="text-green-400 text-sm font-bold flex items-center justify-center gap-2">
               <Lock size={14} className="text-green-400" /> ACESSO VIP ATIVO
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-brand-600 rounded-full"></div>
              <h2 className="text-2xl font-serif font-bold text-white">Conteúdo da Paula🔞</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                isUnlocked={userState.unlockedVideos.includes(video.id) || userState.isVipUnlocked}
                onClick={handleVideoClick}
                isAdminMode={isAdminMode}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-xl mb-2 font-serif">O catálogo está vazio.</p>
              {isAdminMode ? (
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Adicionar Primeiro Vídeo
                </button>
              ) : (
                <p className="text-sm">Aguarde novos lançamentos.</p>
              )}
            </div>
          )}
        </div>

        {/* Value Prop */}
        {!isAdminMode && (
          <div className="bg-brand-900/30 border-y border-brand-900/50 py-16 mt-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <Lock className="mx-auto text-brand-500 mb-4" size={40} />
              <h2 className="text-3xl font-serif text-white mb-4">Total Privacidade e Segurança</h2>
              <p className="text-gray-400 mb-8">
                Suas compras são processadas com criptografia de ponta a ponta. 
                No extrato bancário, aparecerá apenas como "PAY-DIGITAL-SVS".
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                <span className="text-xl font-bold tracking-widest text-white">VISA</span>
                <span className="text-xl font-bold tracking-widest text-white">MASTERCARD</span>
                <span className="text-xl font-bold tracking-widest text-white">PIX</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer with SECRET ADMIN BUTTON */}
      <footer className="bg-black py-12 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <p className="text-2xl font-serif italic font-bold text-brand-600 mb-4">Paulinha Hot</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500 mb-8">
            <a href="#" className="hover:text-white">Termos de Uso</a>
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Suporte</a>
          </div>
          <p className="text-xs text-gray-700">
            © 2024 Paulinha Hot. Todos os direitos reservados. 18+ Apenas.
          </p>
          
          {/* BOTÃO SECRETO DE ADMIN */}
          {/* Localizado no canto inferior direito, quase invisível. */}
          <button 
            onClick={() => {
              const newState = !isAdminMode;
              setIsAdminMode(newState);
              if(newState) alert("🔑 Modo Admin: ATIVADO");
            }}
            className="absolute -bottom-8 right-0 p-4 opacity-5 hover:opacity-50 transition-opacity text-white"
            title="Acesso Restrito"
          >
            <Settings size={16} />
          </button>
        </div>
      </footer>

      {/* Admin Floating Action Button (Mobile) */}
      {isAdminMode && (
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="fixed bottom-6 right-6 md:hidden z-50 bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg shadow-brand-600/40 transition-transform hover:scale-110"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Admin Modal */}
      {isUploadModalOpen && (
        <AdminUpload 
          onClose={() => setIsUploadModalOpen(false)}
          onAddVideo={handleAddVideo}
        />
      )}

      {/* Backup Modal */}
      {isBackupModalOpen && (
        <AdminBackupModal 
          onClose={() => setIsBackupModalOpen(false)}
          onRestoreSuccess={() => setIsBackupModalOpen(false)}
        />
      )}

      {/* Vip Code Modal */}
      {isVipModalOpen && (
        <VipCodeModal 
          onClose={() => setIsVipModalOpen(false)}
          onSuccess={handleVipSuccess}
        />
      )}

      {/* Video Player Overlay */}
      {playingVideo && (
        <VideoPlayer 
          video={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </div>
  );
};

export default App;
import React, { useRef } from 'react';
import { Gift, Camera } from 'lucide-react';

interface HeroProps {
  isAdminMode: boolean;
  heroImage: string;
  onUpdateImage: (base64: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ isAdminMode, heroImage, onUpdateImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center group">
      {/* Background Image with Parallax-like fix */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Premium Background" 
          className="w-full h-full object-cover object-center filter brightness-50 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
      </div>

      {/* Admin: Edit Button (Moved to bottom-right to avoid Navbar overlap) */}
      {isAdminMode && (
        <div className="absolute bottom-6 right-6 z-30 animate-fade-in">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-105 group-hover:bg-white/20"
          >
            <Camera size={20} />
            <span className="text-sm font-bold shadow-black drop-shadow-md">Alterar Capa</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <span className="inline-block py-1 px-3 rounded-full bg-brand-600/20 border border-brand-500/50 text-brand-500 text-xs font-bold tracking-wider mb-6 backdrop-blur-sm">
          NOVA COLEÇÃO DISPONÍVEL
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          Conteúdos porno da Paula, <br />
          <span className="text-2xl md:text-4xl block mt-4 font-light text-gray-200">
            venha me conhecer, que garanto te dar <span className="italic text-brand-500 font-bold">PRAZER</span>
          </span>
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button 
            onClick={() => window.open("https://go.tribopay.com.br/zp79c09xnw", "_blank")}
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-600 to-red-600 hover:from-brand-500 hover:to-red-500 text-white rounded-full font-bold text-xl shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all transform hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] border border-brand-500/50"
          >
            <Gift size={28} className="animate-bounce" />
            LIBERAR VIP
          </button>
        </div>
      </div>
    </div>
  );
};
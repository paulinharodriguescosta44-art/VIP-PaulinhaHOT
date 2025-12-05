import React from 'react';
import { APP_NAME } from '../constants';
import { ShieldCheck, Cloud } from 'lucide-react';

interface NavbarProps {
  isAdminMode: boolean;
  onOpenVipModal: () => void;
  onOpenBackupModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdminMode, onOpenVipModal, onOpenBackupModal }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${isAdminMode ? 'bg-red-950/90 border-red-900/50' : 'bg-black/80 border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <span className="ml-2 text-2xl font-serif italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-red-200 to-brand-500">
              {APP_NAME}
            </span>
            {isAdminMode && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                <ShieldCheck size={10} />
                ADMIN
              </span>
            )}
          </div>

          {/* Right - VIP Button & Admin Tools */}
          <div className="flex items-center gap-4">
            {isAdminMode && onOpenBackupModal && (
              <button
                onClick={onOpenBackupModal}
                className="p-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                title="Sincronizar/Backup"
              >
                <Cloud size={20} />
              </button>
            )}

            <button 
              onClick={onOpenVipModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
            >
              <span>💎</span>
              JÁ SOU VIP
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
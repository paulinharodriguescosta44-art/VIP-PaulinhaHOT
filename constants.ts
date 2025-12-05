import { Video } from './types';

export const APP_NAME = "Paulinha Hot";
export const CURRENCY = "R$";

// --- CONFIGURAÇÃO FIXA (PARA TODOS OS DISPOSITIVOS) ---
// Tudo que estiver aqui aparecerá para qualquer pessoa que abrir o site.

// 1. CAPA FIXA (Cole o link da sua imagem de capa aqui)
export const STATIC_HERO_IMAGE = "https://images.unsplash.com/photo-1548685913-fe6678b0d7f3?q=80&w=1920&auto=format&fit=crop";

// 2. CATÁLOGO FIXO
// Adicione seus vídeos aqui para ficarem "instalados" no app.
export const PERMANENT_VIDEOS: Video[] = [
  {
    id: 'fixo-1',
    title: 'Boas vindas 🔥',
    description: 'Um vídeo especial de boas vindas para meus assinantes.',
    // Substitua pelo LINK da sua foto
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop', 
    // Substitua pelo LINK do seu vídeo (mp4)
    previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-legs-of-a-woman-walking-on-the-sand-of-a-1123-large.mp4', 
    price: 0,
    duration: '00:30',
    tags: ['Destaque', 'Grátis'],
    isExclusive: false,
    views: 10500
  },
  {
    id: 'fixo-2',
    title: 'Noite Exclusiva (VIP)',
    description: 'Aquele conteúdo que você pediu... completo e sem cortes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=500&auto=format&fit=crop',
    previewUrl: '', // Deixe vazio se for apenas para VIPs e você não tiver um preview público
    price: 29.90,
    duration: '12:40',
    tags: ['Premium', 'Vip'],
    isExclusive: true, // Isso coloca o cadeado
    views: 5320
  }
];

// Mantemos o mock antigo vazio ou irrelevante, pois agora usamos o PERMANENT_VIDEOS
export const MOCK_VIDEOS: Video[] = [];
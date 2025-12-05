import { Video } from './types';

// Vídeo de exemplo para o catálogo não iniciar vazio.
// O usuário deve adicionar os vídeos reais via Admin Upload.
export const MOCK_VIDEOS: Video[] = [
  {
    id: 'demo-1',
    title: 'Prévia Exclusiva (Demo)',
    description: 'Este é um exemplo de como seus vídeos ficarão no catálogo. Use o botão de Adicionar para fazer upload dos seus vídeos reais.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548685913-fe6678b0d7f3?q=80&w=800&auto=format&fit=crop', // Imagem genérica sensual/dark
    previewUrl: '', // Deixamos vazio para mostrar a mensagem de "Demonstração" no player
    price: 0,
    duration: '00:45',
    tags: ['Novidade', 'Grátis'],
    isExclusive: false,
    views: 1540
  }
];

export const APP_NAME = "Paulinha Hot";
export const CURRENCY = "R$";
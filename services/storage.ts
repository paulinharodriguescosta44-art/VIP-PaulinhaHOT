import { Video } from '../types';

const DB_NAME = 'PaulinhaAppDB';
const STORES = {
  VIDEOS: 'videos',
  SETTINGS: 'settings'
};
// Incrementado versão para forçar atualização da estrutura
const DB_VERSION = 2; 

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store de Vídeos
      if (!db.objectStoreNames.contains(STORES.VIDEOS)) {
        db.createObjectStore(STORES.VIDEOS, { keyPath: 'id' });
      }

      // Store de Configurações (Para a imagem de capa pesada)
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS); // Key-value simples
      }
    };
  });
};

// --- VIDEOS ---

export const saveAllVideos = async (videos: Video[]) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORES.VIDEOS, 'readwrite');
    const store = tx.objectStore(STORES.VIDEOS);
    
    // Limpa e insere tudo novamente para garantir sincronia
    await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => reject(clearReq.error);
    });

    // Insere um por um
    for (const video of videos) {
      store.put(video);
    }
    
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Erro ao salvar vídeos no DB:", error);
  }
};

export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.VIDEOS, 'readonly');
      const store = tx.objectStore(STORES.VIDEOS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Erro ao carregar vídeos do DB:", error);
    return [];
  }
};

// --- HERO IMAGE (SETTINGS) ---

export const saveHeroImageToDB = async (base64Image: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORES.SETTINGS, 'readwrite');
    const store = tx.objectStore(STORES.SETTINGS);
    store.put(base64Image, 'hero_image');
    
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Erro ao salvar imagem de capa:", error);
  }
};

export const getHeroImageFromDB = async (): Promise<string | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const request = store.get('hero_image');
      request.onsuccess = () => resolve(request.result as string || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return null;
  }
};
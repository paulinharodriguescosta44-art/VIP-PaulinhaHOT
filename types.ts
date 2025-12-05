export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  previewUrl?: string; // Short looping gif/video for preview
  price: number;
  duration: string;
  tags: string[];
  isExclusive: boolean;
  views: number;
}

export interface UserState {
  isAgeVerified: boolean;
  unlockedVideos: string[];
  favorites: string[];
  isVipUnlocked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
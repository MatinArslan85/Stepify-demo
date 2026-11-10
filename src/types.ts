export type Screen = 
  | 'onboarding' 
  | 'login'
  | 'register'
  | 'home' 
  | 'map' 
  | 'leaderboard' 
  | 'profile' 
  | 'store' 
  | 'stores'
  | 'withdraw'
  | 'history'
  | 'referral'
  | 'stepify-card'
  | 'create-story'
  | 'marketplace'
  | 'settings'
  | 'stepi-chat'
  | 'story-viewer'
  | 'events'
  | 'premium'
  | 'recipes'
  | 'messages'
  | 'collection';

export interface User {
  name: string;
  steps: number;
  coins: number;
  location: string;
  rank: number;
  discoveredDistricts?: string[];
}

export interface UserProfileType {
  name: string;
  avatar: string;
  discoveredDistricts?: string[];
  bio?: string;
  social?: {
    instagram?: string;
    x?: string;
    whatsapp?: string;
  };
}

export type Language = 'az' | 'en' | 'tr' | 'ru';

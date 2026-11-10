import React from 'react';
import { Home, Map, User, Users, ShoppingBag } from 'lucide-react';
import { Screen } from '../types';
import { Language } from '../translations';

interface Props {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  language: Language;
}

export default function BottomNav({ currentScreen, navigate, language }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-3 z-40 transition-colors">
      <div className="flex justify-between items-center w-full">
        
        <button onClick={() => navigate('home')} className={`flex flex-col items-center space-y-1 transition-colors w-12 ${currentScreen === 'home' ? 'text-[#00C16A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold whitespace-nowrap">{language === 'az' ? 'Ana Səhifə' : language === 'en' ? 'Home' : language === 'tr' ? 'Ana Sayfa' : 'Главная'}</span>
        </button>
        
        <button onClick={() => navigate('marketplace')} className={`flex flex-col items-center space-y-1 transition-colors w-12 ${currentScreen === 'marketplace' ? 'text-[#00C16A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold whitespace-nowrap">{language === 'az' ? 'Market' : language === 'en' ? 'Market' : language === 'tr' ? 'Market' : 'Маркет'}</span>
        </button>

        <button onClick={() => navigate('map')} className={`flex flex-col items-center space-y-1 transition-colors w-12 ${currentScreen === 'map' ? 'text-[#00C16A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-bold whitespace-nowrap">{language === 'az' ? 'Xəritə' : language === 'en' ? 'Map' : language === 'tr' ? 'Harita' : 'Карта'}</span>
        </button>

        <button onClick={() => navigate('leaderboard')} className={`flex flex-col items-center space-y-1 transition-colors w-12 ${currentScreen === 'leaderboard' ? 'text-[#00C16A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold whitespace-nowrap">{language === 'az' ? 'Sosial' : language === 'en' ? 'Social' : language === 'tr' ? 'Sosyal' : 'Социальные'}</span>
        </button>
        
        <button onClick={() => navigate('profile')} className={`flex flex-col items-center space-y-1 transition-colors w-12 ${currentScreen === 'profile' ? 'text-[#00C16A]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold whitespace-nowrap">{language === 'az' ? 'Profil' : language === 'en' ? 'Profile' : language === 'tr' ? 'Profil' : 'Профиль'}</span>
        </button>

      </div>
    </div>
  );
}

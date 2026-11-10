import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Clock, Star, QrCode } from 'lucide-react';
import { Screen, Language } from '../types';
import { stores } from '../data';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  storeId: number;
  language: Language;
}

export default function StoreDetail({ navigate, coins, setCoins, storeId, language }: Props) {
  const [showQR, setShowQR] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  
  const store = stores.find(s => s.id === storeId) || stores[0];

  const handleUse = () => {
    if (coins >= store.coins) {
      setCoins(c => c - store.coins);
      setIsUsed(true);
      setTimeout(() => {
        navigate('home');
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 relative transition-colors">
      <div className="h-64 bg-gray-800 relative">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${store.color} opacity-60`}></div>
        <div className="absolute top-12 left-6">
          <button onClick={() => navigate('home')} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-[#00C16A] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
            {store.category.toUpperCase()}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl">{store.icon}</span>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{store.name}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{store.location} • 1.2 km</span>
          </div>
          <div className="flex items-center text-amber-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-bold">{language === 'az' ? 'Açıqdır' : language === 'en' ? 'Open' : language === 'tr' ? 'Açık' : 'Открыто'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
          <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Təklif Detalları' : language === 'en' ? 'Offer Details' : language === 'tr' ? 'Teklif Detayları' : 'Детали предложения'}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {store.desc}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Tələb olunan:' : language === 'en' ? 'Required:' : language === 'tr' ? 'Gerekli:' : 'Требуется:'}</span>
            <span className={`font-bold text-lg ${coins < store.coins ? 'text-red-500 dark:text-red-400' : 'text-[#0A0A0A] dark:text-white'}`}>
              {store.coins} Coin
            </span>
          </div>
        </div>

        {!showQR ? (
          <button
            onClick={() => setShowQR(true)}
            disabled={coins < store.coins}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all ${
              coins >= store.coins ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A]' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {coins >= store.coins ? (language === 'az' ? 'QR Kodu Göstər' : language === 'en' ? 'Show QR Code' : language === 'tr' ? 'QR Kodu Göster' : 'Показать QR-код') : (language === 'az' ? 'Kifayət qədər coin yoxdur' : language === 'en' ? 'Not enough coins' : language === 'tr' ? 'Yeterli coin yok' : 'Недостаточно монет')}
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden transition-colors"
          >
            {isUsed && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center transition-colors">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-[#00C16A] rounded-full flex items-center justify-center text-white mb-4"
                >
                  ✓
                </motion.div>
                <h3 className="text-xl font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Təsdiqləndi!' : language === 'en' ? 'Confirmed!' : language === 'tr' ? 'Onaylandı!' : 'Подтверждено!'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'az' ? 'Endirim tətbiq edildi' : language === 'en' ? 'Discount applied' : language === 'tr' ? 'İndirim uygulandı' : 'Скидка применена'}</p>
              </div>
            )}
            
            <QrCode className="w-48 h-48 text-[#0A0A0A] dark:text-white mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{language === 'az' ? 'Kassada bu kodu oxudun' : language === 'en' ? 'Scan this code at checkout' : language === 'tr' ? 'Kasada bu kodu okutun' : 'Отсканируйте этот код на кассе'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-6">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            
            <button
              onClick={handleUse}
              className="w-full bg-[#00C16A] text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
            >
              {language === 'az' ? 'İstifadə Et' : language === 'en' ? 'Use' : language === 'tr' ? 'Kullan' : 'Использовать'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
}

export default function QRScanner({ navigate, setCoins, language }: Props) {
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Simulate scanning process
    const timer = setTimeout(() => {
      setScanned(true);
      setCoins(c => c + 50);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setCoins]);

  return (
    <div className="flex flex-col h-full bg-black relative transition-colors">
      {/* Header */}
      <div className="absolute top-12 left-6 right-6 z-20 flex justify-between items-center">
        <button onClick={() => navigate('home')} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-bold">{language === 'az' ? 'QR Oxut' : language === 'en' ? 'Scan QR' : language === 'tr' ? 'QR Okut' : 'Сканировать QR'}</span>
        <div className="w-10"></div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {!scanned ? (
          <div className="relative w-64 h-64">
            {/* Frame */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#00C16A] rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#00C16A] rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#00C16A] rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#00C16A] rounded-br-3xl"></div>
            
            {/* Scanning Line */}
            <motion.div 
              animate={{ y: [0, 250, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 right-0 h-1 bg-[#00C16A] shadow-[0_0_15px_#00C16A]"
            />
            <p className="absolute -bottom-12 left-0 right-0 text-center text-white/70 text-sm">
              {language === 'az' ? 'Restoranın QR kodunu çərçivəyə salın' : language === 'en' ? 'Frame the restaurant\'s QR code' : language === 'tr' ? 'Restoranın QR kodunu çerçeveye alın' : 'Поместите QR-код ресторана в рамку'}
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl mx-6 transition-colors"
          >
            <CheckCircle2 className="w-20 h-20 text-[#00C16A] mb-4" />
            <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Təsdiqləndi!' : language === 'en' ? 'Confirmed!' : language === 'tr' ? 'Onaylandı!' : 'Подтверждено!'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'az' ? 'KFC Nərimanov ziyarətiniz qeydə alındı.' : language === 'en' ? 'Your visit to KFC Narimanov has been recorded.' : language === 'tr' ? 'KFC Nerimanov ziyaretiniz kaydedildi.' : 'Ваш визит в KFC Нариманов зарегистрирован.'}
            </p>
            <div className="bg-[#00C16A]/10 dark:bg-emerald-900/30 text-[#00C16A] px-4 py-2 rounded-full font-bold text-lg mb-6 transition-colors">
              {language === 'az' ? '+50 Coin Qazandınız' : language === 'en' ? 'You earned +50 Coins' : language === 'tr' ? '+50 Coin Kazandınız' : 'Вы заработали +50 монет'}
            </div>
            <button
              onClick={() => navigate('home')}
              className="w-full bg-[#00C16A] text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
            >
              {language === 'az' ? 'Ana Səhifəyə Qayıt' : language === 'en' ? 'Return to Home' : language === 'tr' ? 'Ana Sayfaya Dön' : 'Вернуться на главную'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Eye, EyeOff, Wifi, Copy, CheckCircle2 } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  language: Language;
}

export default function StepifyCard({ navigate, coins, language }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const balanceAZN = (coins / 100).toFixed(2);
  const cardNumber = showDetails ? "4123  4567  8910  1112" : "••••  ••••  ••••  1112";
  const expiry = showDetails ? "12/28" : "••/••";
  const cvv = showDetails ? "123" : "•••";

  const handleCopy = () => {
    navigator.clipboard.writeText("4123456789101112");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{language === 'az' ? 'Stepify Kart' : language === 'en' ? 'Stepify Card' : language === 'tr' ? 'Stepify Kart' : 'Карта Stepify'}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* The Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full h-56 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden mb-8"
        >
          {/* Card Background Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00C16A] opacity-20 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#00C16A] rounded-lg flex items-center justify-center font-bold text-xl italic">S</div>
                <span className="font-bold tracking-wider">Stepify</span>
              </div>
              <Wifi className="w-6 h-6 transform rotate-90 opacity-80" />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-7 bg-yellow-200/80 rounded flex items-center justify-center overflow-hidden">
                  <div className="w-full h-[1px] bg-yellow-400/50"></div>
                </div>
              </div>
              <p className="font-mono text-xl tracking-[0.15em] mb-2">{cardNumber}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{language === 'az' ? 'Kart Sahibi' : language === 'en' ? 'Cardholder' : language === 'tr' ? 'Kart Sahibi' : 'Владелец карты'}</p>
                  <p className="font-bold tracking-widest text-sm">MƏTİN ARSLAN</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{language === 'az' ? 'Müddət' : language === 'en' ? 'Expires' : language === 'tr' ? 'Süre' : 'Срок действия'}</p>
                  <p className="font-bold tracking-widest text-sm">{expiry}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">CVV</p>
                  <p className="font-bold tracking-widest text-sm">{cvv}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Balance & Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{language === 'az' ? 'Kart Balansı' : language === 'en' ? 'Card Balance' : language === 'tr' ? 'Kart Bakiyesi' : 'Баланс карты'}</p>
          <h2 className="text-4xl font-bold text-[#0A0A0A] dark:text-white mb-6">{balanceAZN} <span className="text-xl text-gray-400 dark:text-gray-500">AZN</span></h2>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-gray-50 dark:bg-gray-700 text-[#0A0A0A] dark:text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showDetails ? (language === 'az' ? 'Gizlət' : language === 'en' ? 'Hide' : language === 'tr' ? 'Gizle' : 'Скрыть') : (language === 'az' ? 'Göstər' : language === 'en' ? 'Show' : language === 'tr' ? 'Göster' : 'Показать')}</span>
            </button>
            <button 
              onClick={handleCopy}
              className="flex-1 bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#00C16A]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (language === 'az' ? 'Kopyalandı' : language === 'en' ? 'Copied' : language === 'tr' ? 'Kopyalandı' : 'Скопировано') : (language === 'az' ? 'Kopyala' : language === 'en' ? 'Copy' : language === 'tr' ? 'Kopyala' : 'Копировать')}</span>
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-2xl transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors">
                <CreditCard className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Apple Pay-ə əlavə et' : language === 'en' ? 'Add to Apple Pay' : language === 'tr' ? 'Apple Pay\'e ekle' : 'Добавить в Apple Pay'}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'az' ? 'Təmassız ödəniş üçün' : language === 'en' ? 'For contactless payments' : language === 'tr' ? 'Temassız ödeme için' : 'Для бесконтактных платежей'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-2xl transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center transition-colors">
                <div className="w-5 h-5 border-2 border-red-500 dark:border-red-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-red-500 dark:bg-red-400 transform rotate-45"></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-500 dark:text-red-400">{language === 'az' ? 'Kartı Dondur' : language === 'en' ? 'Freeze Card' : language === 'tr' ? 'Kartı Dondur' : 'Заморозить карту'}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'az' ? 'Müvəqqəti olaraq blokla' : language === 'en' ? 'Temporarily block' : language === 'tr' ? 'Geçici olarak engelle' : 'Временно заблокировать'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

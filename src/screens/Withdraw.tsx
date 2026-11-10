import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Building2, PlaySquare, Crown, Loader2 } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
  isPremium: boolean;
  realMoneyBalance: number;
  setRealMoneyBalance: React.Dispatch<React.SetStateAction<number>>;
}

export default function Withdraw({ navigate, coins, setCoins, language, isPremium, realMoneyBalance, setRealMoneyBalance }: Props) {
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const CONVERSION_RATE = 0.01; // 1 Coin = 0.01 AZN
  const CONVERT_AMOUNT = 100; // Convert 100 coins at a time

  const handleConvert = () => {
    if (coins < CONVERT_AMOUNT) return;
    
    if (isPremium) {
      // Instant conversion for premium
      executeConversion();
    } else {
      // Show ad for non-premium
      setShowAdModal(true);
      setAdProgress(0);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAdModal && adProgress < 100) {
      timer = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setShowAdModal(false);
              executeConversion();
            }, 500);
            return 100;
          }
          return prev + 20; // 5 seconds ad (20% per second)
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showAdModal, adProgress]);

  const executeConversion = () => {
    setIsConverting(true);
    setTimeout(() => {
      setCoins(c => c - CONVERT_AMOUNT);
      setRealMoneyBalance(b => b + (CONVERT_AMOUNT * CONVERSION_RATE));
      setIsConverting(false);
    }, 500);
  };

  const handleWithdraw = () => {
    if (amount && method && realMoneyBalance >= amount) {
      setRealMoneyBalance(b => b - amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('home');
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full bg-[#00C16A] items-center justify-center p-6 relative overflow-hidden transition-colors">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, opacity: 1 }}
            animate={{ 
              y: 500, 
              x: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360 
            }}
            transition={{ duration: 2, ease: "easeOut", delay: Math.random() * 0.5 }}
            className={`absolute w-3 h-3 rounded-sm ${['bg-white', 'bg-yellow-300', 'bg-blue-400'][i % 3]}`}
            style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
          />
        ))}
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl z-10 transition-colors"
        >
          <CheckCircle2 className="w-20 h-20 text-[#00C16A] mb-4" />
          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Uğurlu!' : language === 'en' ? 'Success!' : language === 'tr' ? 'Başarılı!' : 'Успешно!'}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {amount} AZN {language === 'az' ? `uğurla ${method} hesabınıza köçürüldü.` : language === 'en' ? `successfully transferred to your ${method} account.` : language === 'tr' ? `başarıyla ${method} hesabınıza aktarıldı.` : `успешно переведено на ваш счет ${method}.`}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{language === 'az' ? 'Coin Çıxar' : language === 'en' ? 'Withdraw Coins' : language === 'tr' ? 'Coin Çek' : 'Вывод монет'}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-[#0A0A0A] dark:bg-gray-800 rounded-3xl p-6 text-white mb-6 shadow-md border border-transparent dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">{language === 'az' ? 'Mövcud Coin' : language === 'en' ? 'Available Coins' : language === 'tr' ? 'Mevcut Coin' : 'Доступные монеты'}</p>
              <div className="flex items-end space-x-2">
                <h2 className="text-3xl font-bold">{coins}</h2>
                <span className="text-sm text-[#00C16A] font-medium mb-1">Coin</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">{language === 'az' ? 'Real Pul' : language === 'en' ? 'Real Money' : language === 'tr' ? 'Gerçek Para' : 'Реальные деньги'}</p>
              <div className="flex items-end space-x-1 justify-end">
                <h2 className="text-3xl font-bold">{realMoneyBalance.toFixed(2)}</h2>
                <span className="text-sm text-white font-medium mb-1">AZN</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">
                {language === 'az' ? 'Coinləri Pula Çevir' : language === 'en' ? 'Convert Coins to Money' : language === 'tr' ? 'Coinleri Paraya Çevir' : 'Конвертировать монеты'}
              </span>
              <span className="text-xs text-gray-400">100 Coin = 1.00 AZN</span>
            </div>
            <button
              onClick={handleConvert}
              disabled={coins < CONVERT_AMOUNT || isConverting}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                coins >= CONVERT_AMOUNT
                  ? isPremium 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 active:scale-95'
                    : 'bg-[#00C16A] text-white shadow-lg shadow-[#00C16A]/20 active:scale-95'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isConverting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPremium ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  {language === 'az' ? 'Dərhal Çevir (Premium)' : language === 'en' ? 'Convert Instantly (Premium)' : language === 'tr' ? 'Hemen Çevir (Premium)' : 'Мгновенная конвертация'}
                </>
              ) : (
                <>
                  <PlaySquare className="w-4 h-4 mr-2" />
                  {language === 'az' ? 'Reklam İzlə və Çevir' : language === 'en' ? 'Watch Ad & Convert' : language === 'tr' ? 'Reklam İzle ve Çevir' : 'Смотреть рекламу и конвертировать'}
                </>
              )}
            </button>
          </div>
        </div>

        <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-4">{language === 'az' ? 'Çıxarış Məbləği (AZN)' : language === 'en' ? 'Withdrawal Amount (AZN)' : language === 'tr' ? 'Çekim Tutarı (AZN)' : 'Сумма вывода (AZN)'}</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[5, 10, 20].map((val, idx) => {
            const isDisabled = val > realMoneyBalance;
            return (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                  amount === val 
                    ? 'border-[#00C16A] bg-[#00C16A]/10 text-[#00C16A]' 
                    : isDisabled 
                      ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {val} AZN
              </button>
            );
          })}
        </div>

        <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-4">{language === 'az' ? 'Köçürmə üsulu' : language === 'en' ? 'Transfer Method' : language === 'tr' ? 'Transfer Yöntemi' : 'Метод перевода'}</h3>
        <div className="space-y-3 mb-8">
          {['M10', 'Kapital Bank', 'ABB Bank'].map((m) => (
            <div
              key={m}
              onClick={() => setMethod(m)}
              className={`p-4 rounded-2xl border-2 flex items-center space-x-4 cursor-pointer transition-all ${
                method === m 
                  ? 'border-[#00C16A] bg-[#00C16A]/5' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                method === m ? 'bg-[#00C16A] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[#0A0A0A] dark:text-white">{m}</span>
              {method === m && <CheckCircle2 className="w-5 h-5 text-[#00C16A] ml-auto" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 transition-colors">
        <button
          onClick={handleWithdraw}
          disabled={!amount || !method || amount > realMoneyBalance}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            amount && method && amount <= realMoneyBalance
              ? 'bg-[#00C16A] text-white shadow-lg shadow-[#00C16A]/30 active:scale-95' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {language === 'az' ? 'Təsdiqlə' : language === 'en' ? 'Confirm' : language === 'tr' ? 'Onayla' : 'Подтвердить'}
        </button>
      </div>

      {/* Ad Modal */}
      <AnimatePresence>
        {showAdModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
          >
            <div className="bg-gray-900 rounded-3xl p-6 w-full max-w-sm border border-gray-800 flex flex-col items-center text-center">
              <PlaySquare className="w-16 h-16 text-[#00C16A] mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'az' ? 'Reklam İzlənilir...' : language === 'en' ? 'Watching Ad...' : language === 'tr' ? 'Reklam İzleniyor...' : 'Просмотр рекламы...'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {language === 'az' ? 'Zəhmət olmasa reklam bitənə qədər gözləyin.' : language === 'en' ? 'Please wait until the ad finishes.' : language === 'tr' ? 'Lütfen reklam bitene kadar bekleyin.' : 'Пожалуйста, подождите окончания рекламы.'}
              </p>
              
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                <motion.div 
                  className="bg-[#00C16A] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${adProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-gray-500 text-xs font-bold">{adProgress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

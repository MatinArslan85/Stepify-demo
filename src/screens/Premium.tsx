import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Crown, Zap, Percent, ShieldCheck, Check, Ticket, Activity } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
  isPremium: boolean;
  setIsPremium: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Premium({ navigate, language, isPremium, setIsPremium }: Props) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = () => {
    setIsPremium(true);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate('home');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center p-6 relative overflow-hidden transition-colors">
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
            className={`absolute w-3 h-3 rounded-sm ${['bg-white', 'bg-yellow-200', 'bg-orange-200'][i % 3]}`}
            style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
          />
        ))}
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl z-10 transition-colors"
        >
          <Crown className="w-20 h-20 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-2">
            {language === 'az' ? 'Təbriklər!' : language === 'en' ? 'Congratulations!' : language === 'tr' ? 'Tebrikler!' : 'Поздравляем!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'az' ? 'Siz artıq Premium istifadəçisiniz!' : language === 'en' ? 'You are now a Premium user!' : language === 'tr' ? 'Artık Premium kullanıcısısınız!' : 'Теперь вы Premium пользователь!'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors overflow-y-auto pb-10">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors sticky top-0 z-20">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">
          {language === 'az' ? 'Premium' : language === 'en' ? 'Premium' : language === 'tr' ? 'Premium' : 'Премиум'}
        </h1>
      </div>

      <div className="p-6 flex-1">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white mb-8 shadow-lg shadow-amber-500/30 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <Crown className="w-16 h-16 mb-4 text-white drop-shadow-md" />
          <h2 className="text-3xl font-bold mb-2">Stepify Premium</h2>
          <p className="text-amber-50 mb-6 font-medium">
            {language === 'az' ? 'Daha çox qazan, daha çox endirim əldə et!' : language === 'en' ? 'Earn more, get bigger discounts!' : language === 'tr' ? 'Daha çok kazan, daha çok indirim al!' : 'Зарабатывайте больше, получайте больше скидок!'}
          </p>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 flex items-center">
            <span className="text-3xl font-bold">4.99 AZN</span>
            <span className="text-sm opacity-80 ml-1">/ {language === 'az' ? 'ay' : language === 'en' ? 'month' : language === 'tr' ? 'ay' : 'месяц'}</span>
          </div>
        </div>

        <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-4 text-lg">
          {language === 'az' ? 'Premium Özəlliklər' : language === 'en' ? 'Premium Features' : language === 'tr' ? 'Premium Özellikler' : 'Премиум функции'}
        </h3>
        
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white">1.5x Coin {language === 'az' ? 'Qazancı' : language === 'en' ? 'Earnings' : language === 'tr' ? 'Kazancı' : 'Заработок'}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'az' ? 'Hər addım üçün 50% daha çox coin qazan.' : language === 'en' ? 'Earn 50% more coins for every step.' : language === 'tr' ? 'Her adım için %50 daha fazla coin kazan.' : 'Зарабатывайте на 50% больше монет за каждый шаг.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <Percent className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Daha Çox Endirim' : language === 'en' ? 'Bigger Discounts' : language === 'tr' ? 'Daha Çok İndirim' : 'Больше скидок'}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'az' ? 'Marketdə əlavə 10-20% endirim əldə et.' : language === 'en' ? 'Get an extra 10-20% discount in the market.' : language === 'tr' ? 'Markette ekstra %10-20 indirim al.' : 'Получите дополнительную скидку 10-20% в маркете.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <Ticket className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Tədbirlərə VIP Giriş' : language === 'en' ? 'VIP Event Access' : language === 'tr' ? 'Etkinliklere VIP Giriş' : 'VIP-доступ к мероприятиям'}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'az' ? 'Marafon və festivallara pulsuz və ya endirimli qeydiyyat.' : language === 'en' ? 'Free or discounted registration for marathons and festivals.' : language === 'tr' ? 'Maraton ve festivallere ücretsiz veya indirimli kayıt.' : 'Бесплатная или льготная регистрация на марафоны и фестивали.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Dərin Analitika' : language === 'en' ? 'Deep Analytics' : language === 'tr' ? 'Derin Analitik' : 'Глубокая аналитика'}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'az' ? 'Süni intellekt dəstəkli sağlamlıq və addım analitikası.' : language === 'en' ? 'AI-powered health and step analytics.' : language === 'tr' ? 'Yapay zeka destekli sağlık ve adım analitiği.' : 'Аналитика здоровья и шагов с помощью ИИ.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Reklamsız Çıxarış' : language === 'en' ? 'Ad-free Withdrawal' : language === 'tr' ? 'Reklamsız Çekim' : 'Вывод без рекламы'}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'az' ? 'Coinləri real pula çevirərkən reklam izləmə.' : language === 'en' ? 'Skip ads when converting coins to real money.' : language === 'tr' ? 'Coinleri gerçek paraya çevirirken reklam izleme.' : 'Пропускайте рекламу при конвертации монет в реальные деньги.'}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubscribe}
          disabled={isPremium}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center ${
            isPremium 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-amber-500/30'
          }`}
        >
          {isPremium ? (
            <>
              <Check className="w-6 h-6 mr-2" />
              {language === 'az' ? 'Aktivdir' : language === 'en' ? 'Active' : language === 'tr' ? 'Aktif' : 'Активно'}
            </>
          ) : (
            language === 'az' ? 'İndi Abunə Ol' : language === 'en' ? 'Subscribe Now' : language === 'tr' ? 'Şimdi Abone Ol' : 'Подписаться сейчас'
          )}
        </button>
      </div>
    </div>
  );
}

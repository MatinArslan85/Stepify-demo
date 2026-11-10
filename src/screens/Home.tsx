import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Zap, MapPin, Camera, Calendar, Edit2, X as CloseIcon, Check, Crown, MessageCircle, Instagram, Share2, Download, Twitter } from 'lucide-react';
import { toPng } from 'html-to-image';
import { StepiAvatar } from '../components/StepiAvatar';
import { Screen, UserProfileType } from '../types';
import { stores } from '../data';
import { translations, Language } from '../translations';

interface Props {
  navigate: (screen: Screen) => void;
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onSelectStory: (id: number) => void;
  onSelectStore: (id: number) => void;
  language: Language;
  userProfile: UserProfileType;
  appStories: any[];
  userGoals: { daily: number; weekly: number; monthly: number };
  setUserGoals: React.Dispatch<React.SetStateAction<{ daily: number; weekly: number; monthly: number }>>;
  isPremium: boolean;
}

export default function Home({ navigate, steps, setSteps, coins, setCoins, onSelectStory, onSelectStore, language, userProfile, appStories, userGoals, setUserGoals, isPremium }: Props) {
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState(userGoals.daily);
  const goal = userGoals.daily;
  const progress = Math.min(steps / goal, 1);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - progress * circumference;

  // Generate mock calendar data for the current month (March 2026)
  const daysInMonth = 31;
  const firstDayOfWeek = 0; // Sunday
  
  // Stable past days pattern so they don't change on re-render
  const pastDaysPattern = [true, false, true, true, false, true, true, true, false, true];
  
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    if (day < 11) {
      return { day, completed: pastDaysPattern[i], isToday: false, isFuture: false };
    } else if (day === 11) {
      return { day, completed: steps >= goal, isToday: true, isFuture: false };
    } else {
      return { day, completed: false, isToday: false, isFuture: true };
    }
  });

  const handleSaveGoal = () => {
    setUserGoals(prev => ({ ...prev, daily: tempGoal }));
    setShowGoalModal(false);
  };

  const shareRef = useRef<HTMLDivElement>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  type SharePlatform = 'instagram' | 'whatsapp' | 'x' | null;
  const [activeSharePlatform, setActiveSharePlatform] = useState<SharePlatform>(null);

  const generateShareImage = async () => {
    if (!shareRef.current) return;
    setIsGeneratingStory(true);
    try {
      const image = await toPng(shareRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution for mobile screens
      });
      
      // Try to use Web Share API with files if supported
      if (navigator.canShare) {
        try {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], `stepify_share.png`, { type: "image/png" });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Stepify',
              text: `Mən bu gün ${steps.toLocaleString()} addım atdım! 🚶‍♂️ Stepify ilə sən də qoşul.`,
              files: [file],
            });
            setIsGeneratingStory(false);
            setActiveSharePlatform(null);
            return;
          }
        } catch (err) {
          console.log("Error sharing file:", err);
        }
      }
      
      // Fallback: Download the image for the user to post it manually
      const link = document.createElement('a');
      link.href = image;
      link.download = `stepify_${activeSharePlatform}_${new Date().getTime()}.png`;
      link.click();
      setActiveSharePlatform(null);
    } catch (err) {
      console.error("Error generating share image:", err);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const simulateWalking = () => {
    setSteps(s => s + 500);
    setCoins(c => c + (isPremium ? 3 : 2)); // 1.5x coins for premium
  };

  let stepiVariant: 'happy' | 'motivated' | 'sad' | 'hero' = 'happy';
  let stepiMessage = '';

  if (steps === 0) {
    stepiVariant = 'sad';
    stepiMessage = t.missedYou;
  } else if (steps < goal) {
    stepiVariant = 'motivated';
    stepiMessage = `"${userProfile.name.split(' ')[0]}, bu gün ${goal - steps} ${t.stepsLeft}"`;
  } else {
    stepiVariant = 'hero';
    stepiMessage = t.goalReached;
  }

  const handleStoreClick = (id: number) => {
    onSelectStore(id);
    navigate('store');
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 overflow-y-auto pb-24 transition-colors">
      {/* Header with Stories */}
      <div className="pt-10 pb-4 relative z-30">
        <div className="flex justify-between items-center px-6 mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.welcome}</p>
            <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">{userProfile.name}</h1>
          </div>
          <div className="flex gap-3 relative items-center">
            <button 
              onClick={() => navigate('messages')} 
              className="w-11 h-11 relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80 dark:border-gray-700/60 active:scale-95 hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/80 transition-all"
            >
              <MessageCircle className="w-[22px] h-[22px] text-[#0A0A0A] dark:text-white" strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm animate-pulse"></span>
            </button>
            <button 
              onClick={() => navigate('create-story')} 
              className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80 dark:border-gray-700/60 active:scale-95 hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/80 transition-all"
            >
              <Camera className="w-[22px] h-[22px] text-[#0A0A0A] dark:text-white" strokeWidth={2} />
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="w-11 h-11 relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80 dark:border-gray-700/60 active:scale-95 hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/80 transition-all"
            >
              <Bell className="w-[22px] h-[22px] text-[#0A0A0A] dark:text-white" strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#00C16A] rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></span>
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-[#0A0A0A] dark:text-white">
                      {language === 'az' ? 'Bildirişlər' : language === 'en' ? 'Notifications' : language === 'tr' ? 'Bildirimler' : 'Уведомления'}
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <p className="text-sm text-[#0A0A0A] dark:text-white"><span className="font-bold">Aysel</span> {language === 'az' ? 'sənin storini bəyəndi' : language === 'en' ? 'liked your story' : language === 'tr' ? 'hikayeni beğendi' : 'понравилась ваша история'} ❤️</p>
                      <span className="text-xs text-gray-400 mt-1 block">{language === 'az' ? '2 dəqiqə əvvəl' : language === 'en' ? '2 mins ago' : language === 'tr' ? '2 dakika önce' : '2 минуты назад'}</span>
                    </div>
                    <div className="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <p className="text-sm text-[#0A0A0A] dark:text-white"><span className="font-bold">Rəşad</span> {language === 'az' ? 'yeni stori paylaşdı' : language === 'en' ? 'shared a new story' : language === 'tr' ? 'yeni hikaye paylaştı' : 'поделился новой историей'} 📸</p>
                      <span className="text-xs text-gray-400 mt-1 block">{language === 'az' ? '1 saat əvvəl' : language === 'en' ? '1 hour ago' : language === 'tr' ? '1 saat önce' : '1 час назад'}</span>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <p className="text-sm text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Gündəlik hədəfinə çatmağa az qalıb!' : language === 'en' ? 'Almost reached your daily goal!' : language === 'tr' ? 'Günlük hedefine ulaşmana az kaldı!' : 'Почти достигли ежедневной цели!'} 🏃‍♂️</p>
                      <span className="text-xs text-gray-400 mt-1 block">{language === 'az' ? '3 saat əvvəl' : language === 'en' ? '3 hours ago' : language === 'tr' ? '3 saat önce' : '3 часа назад'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stories Row */}
        <div className="px-6 flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex flex-col items-center space-y-1 flex-shrink-0" onClick={() => navigate('create-story')}>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800 cursor-pointer relative shadow-sm overflow-hidden">
              {userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http') ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-2xl">{userProfile.avatar}</span>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00C16A] rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-xs z-10">+</div>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.you}</span>
          </div>
          
          {appStories.map(story => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
              onClick={() => { onSelectStory(story.id); navigate('story-viewer'); }}
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#00C16A] to-emerald-400 shadow-sm">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl border-2 border-white dark:border-gray-800 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {story.avatar.startsWith('data:image') || story.avatar.startsWith('http') ? (
                      <img src={story.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      story.avatar
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{story.user}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 relative z-20 mt-2">
        {/* Stepi Motivation Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 mb-6"
        >
          <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
            <StepiAvatar className="w-12 h-12" variant={stepiVariant} />
          </div>
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {stepiMessage}
            </p>
          </div>
        </motion.div>

        {/* Main Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-white flex items-center space-x-2">
              <span>{t.dailyActivity}</span>
              <button onClick={() => navigate('collection')} className="ml-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center border border-indigo-100 dark:border-indigo-800 hover:scale-105 transition-transform active:scale-95">
                🌟 Kolleksiya: {userProfile.discoveredDistricts?.length || 0}/9
              </button>
            </h2>
            <div className="flex items-center space-x-2">
              {isPremium && (
                <span className="text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  1.5x
                </span>
              )}
              <span className="text-[#00C16A] font-medium bg-[#00C16A]/10 px-3 py-1 rounded-full text-sm">
                {coins} Coin
              </span>
            </div>
          </div>

          <div 
            className="relative w-56 h-56 mx-auto mb-4 cursor-pointer active:scale-95 transition-transform"
            onClick={simulateWalking}
            title={t.tapToSimulate}
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none" stroke="#00C16A" strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                strokeDasharray={circumference}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.span 
                key={steps}
                initial={{ scale: 1.2, color: '#00C16A' }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-[#0A0A0A] dark:text-white"
              >
                {steps.toLocaleString()}
              </motion.span>
              <div 
                className="flex items-center mt-1 cursor-pointer bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full pointer-events-auto hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => { e.stopPropagation(); setTempGoal(goal); setShowGoalModal(true); }}
              >
                <span className="text-sm text-gray-500 font-medium">/ {goal.toLocaleString()}</span>
                <Edit2 className="w-3 h-3 ml-1 text-gray-400" />
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">{t.tapToSimulate}</p>
          
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={() => setActiveSharePlatform('instagram')}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl shadow-lg shadow-pink-500/30 active:scale-95 transition-all"
            >
              <Instagram className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveSharePlatform('whatsapp')}
              className="flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-xl shadow-lg shadow-[#25D366]/30 active:scale-95 transition-all"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveSharePlatform('x')}
              className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl shadow-lg shadow-black/30 active:scale-95 transition-all"
            >
              <Twitter className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Share Preview Modal */}
        <AnimatePresence>
          {activeSharePlatform && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md px-4"
            >
              <div className="w-full max-w-sm flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">
                  {language === 'az' ? 'Paylaş' : language === 'en' ? 'Share' : language === 'tr' ? 'Paylaş' : 'Поделиться'}
                </h3>
                <button onClick={() => setActiveSharePlatform(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* The Story Canvas (what will be captured) */}
              <div 
                ref={shareRef}
                className="w-full max-w-sm rounded-[2rem] overflow-hidden relative shadow-2xl"
                style={{ 
                  aspectRatio: activeSharePlatform === 'instagram' ? '9/16' : '1/1', 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C16A]/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                
                <div className={`absolute inset-0 ${activeSharePlatform === 'instagram' ? 'p-8' : 'p-4'} flex flex-col items-center justify-between pointer-events-none`}>
                  {/* Header */}
                  <div className="w-full flex items-center justify-between">
                    <div className={`flex items-center space-x-3 bg-white/10 backdrop-blur-md ${activeSharePlatform === 'instagram' ? 'px-4 py-2' : 'px-3 py-1.5'} rounded-full border border-white/10`}>
                      <div className={activeSharePlatform === 'instagram' ? 'text-2xl' : 'text-xl'}>{userProfile.avatar}</div>
                      <span className={`text-white font-bold ${activeSharePlatform !== 'instagram' && 'text-sm'}`}>{userProfile.name}</span>
                    </div>
                    <div className={`${activeSharePlatform === 'instagram' ? 'w-10 h-10' : 'w-8 h-8'} bg-[#00C16A] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-[#00C16A]/50`}>
                      S
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      key={steps}
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className={activeSharePlatform === 'instagram' ? 'mb-8' : 'mb-4'}
                    >
                      <h2 className={`text-[#00C16A] font-black ${activeSharePlatform === 'instagram' ? 'text-8xl' : 'text-6xl'} mb-1 tracking-tighter drop-shadow-lg`}>
                        {steps.toLocaleString()}
                      </h2>
                      <p className={`text-white/80 font-bold ${activeSharePlatform === 'instagram' ? 'text-2xl' : 'text-lg'} uppercase tracking-widest`}>
                        {language === 'az' ? 'ADDIM' : language === 'en' ? 'STEPS' : language === 'tr' ? 'ADIM' : 'ШАГОВ'}
                      </p>
                    </motion.div>
                    
                    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl ${activeSharePlatform === 'instagram' ? 'p-6' : 'p-4'} w-full shadow-xl`}>
                      <p className={`text-white font-medium ${activeSharePlatform === 'instagram' ? 'text-lg' : 'text-sm'} leading-relaxed`}>
                        {language === 'az' ? 'Mən bu gün sağlamlığım üçün addım atdım!' : 
                         language === 'en' ? 'I stepped for my health today!' : 
                         language === 'tr' ? 'Bugün sağlığım için adım attım!' : 
                         'Сегодня я сделал шаги для своего здоровья!'}
                      </p>
                      <div className={`mt-3 pt-3 border-t border-white/20 flex items-center justify-center space-x-2 text-[#00C16A] ${activeSharePlatform !== 'instagram' && 'text-sm'}`}>
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="font-bold">{progress >= 1 ? 'Hədəfə Çatdım!' : 'Yoluma davam edirəm!'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`text-center bg-black/40 backdrop-blur-md ${activeSharePlatform === 'instagram' ? 'px-6 py-3' : 'px-4 py-2'} rounded-full border border-white/10`}>
                    <p className={`text-white font-black tracking-wider shadow-black drop-shadow-md ${activeSharePlatform !== 'instagram' && 'text-sm'}`}>
                      #STEPIFY
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-sm mt-6 space-y-3">
                <button 
                  onClick={generateShareImage}
                  disabled={isGeneratingStory}
                  className="w-full bg-white text-[#0A0A0A] hover:bg-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                >
                  {navigator.canShare ? (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>{isGeneratingStory ? 'Hazırlanır...' : (language === 'az' ? 'Paylaş' : 'Share')}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>{isGeneratingStory ? 'Yüklənir...' : (language === 'az' ? 'Şəkli Yüklə' : 'Download Image')}</span>
                    </>
                  )}
                </button>
                {!navigator.canShare && (
                  <p className="text-center text-white/50 text-xs">
                    {language === 'az' ? 'Şəkli yüklədikdən sonra Instagram-da paylaşa bilərsiniz.' : 'You can share this on Instagram after downloading.'}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal Edit Modal */}
        <AnimatePresence>
          {showGoalModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white">
                    {language === 'az' ? 'Hədəfi Dəyiş' : language === 'en' ? 'Edit Goal' : language === 'tr' ? 'Hedefi Değiştir' : 'Изменить цель'}
                  </h3>
                  <button onClick={() => setShowGoalModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-6">
                  <label className="text-xs text-gray-400 mb-2 block">
                    {language === 'az' ? 'Günlük Hədəf (addım)' : language === 'en' ? 'Daily Goal (steps)' : language === 'tr' ? 'Günlük Hedef (adım)' : 'Дневная цель (шагов)'}
                  </label>
                  <input 
                    type="number" 
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors text-lg font-bold"
                  />
                </div>
                <button 
                  onClick={handleSaveGoal}
                  className="w-full bg-[#00C16A] hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#00C16A]/20 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {language === 'az' ? 'Yadda Saxla' : language === 'en' ? 'Save' : language === 'tr' ? 'Kaydet' : 'Сохранить'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stepi's Challenge & Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0A0A0A] dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#00C16A]" />
              {language === 'az' ? 'Aylıq Təqvim' : language === 'en' ? 'Monthly Calendar' : language === 'tr' ? 'Aylık Takvim' : 'Календарь на месяц'}
            </h2>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
              {language === 'az' ? 'Mart 2026' : language === 'en' ? 'March 2026' : language === 'tr' ? 'Mart 2026' : 'Март 2026'}
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {['B', 'B', 'Ç', 'Ç', 'C', 'C', 'Ş'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-gray-400 mb-1">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {calendarDays.map((d) => (
              <div 
                key={d.day} 
                className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium ${
                  d.isToday 
                    ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/30 ring-2 ring-[#00C16A] ring-offset-2 dark:ring-offset-gray-800' 
                    : d.isFuture
                      ? 'text-gray-300 dark:text-gray-600'
                      : d.completed
                        ? 'bg-[#00C16A]/20 text-[#00C16A] dark:bg-[#00C16A]/30'
                        : 'bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500'
                }`}
              >
                {d.day}
              </div>
            ))}
          </div>

          {/* Stepi's Suggestion */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <StepiAvatar className="w-8 h-8" variant="hero" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  {language === 'az' ? 'Stepi Təklif Edir' : language === 'en' ? 'Stepi Suggests' : language === 'tr' ? 'Stepi Öneriyor' : 'Степи предлагает'}
                </h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-200 mb-3 leading-relaxed">
                  {language === 'az' 
                    ? `Bu həftə ${userGoals.weekly.toLocaleString()} addım at, əlavə 50 coin qazan! Hazırda ${(steps * 3).toLocaleString()} addımdasan.` 
                    : language === 'en' 
                      ? `Walk ${userGoals.weekly.toLocaleString()} steps this week and earn 50 extra coins! You are currently at ${(steps * 3).toLocaleString()} steps.`
                      : language === 'tr'
                        ? `Bu hafta ${userGoals.weekly.toLocaleString()} adım at, ekstra 50 coin kazan! Şu anda ${(steps * 3).toLocaleString()} adımdasın.`
                        : `Пройдите ${userGoals.weekly.toLocaleString()} шагов на этой неделе и получите 50 дополнительных монет! Сейчас у вас ${(steps * 3).toLocaleString()} шагов.`}
                </p>
                <button 
                  onClick={() => setAcceptedChallenge(true)}
                  disabled={acceptedChallenge}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    acceptedChallenge 
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                  }`}
                >
                  {acceptedChallenge 
                    ? (language === 'az' ? 'Qəbul Edildi' : language === 'en' ? 'Accepted' : language === 'tr' ? 'Kabul Edildi' : 'Принято') 
                    : (language === 'az' ? 'Hədəfi Qəbul Et' : language === 'en' ? 'Accept Goal' : language === 'tr' ? 'Hedefi Kabul Et' : 'Принять цель')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events & Activities Banner */}
        {!isPremium && (
          <div 
            onClick={() => navigate('premium')}
            className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white mb-6 flex justify-between items-center cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform"
          >
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Stepify Premium
              </h3>
              <p className="text-sm opacity-90">
                {language === 'az' ? '1.5x Coin qazan, reklamları sil!' : language === 'en' ? 'Earn 1.5x Coins, remove ads!' : language === 'tr' ? '1.5x Coin kazan, reklamları kaldır!' : 'Зарабатывайте 1.5x монет, уберите рекламу!'}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        <div 
          onClick={() => navigate('events')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white mb-6 flex justify-between items-center cursor-pointer shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          <div>
            <h3 className="font-bold text-lg mb-1">{t.events}</h3>
            <p className="text-sm opacity-90">{t.eventsDesc}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Healthy Recipes Banner */}
        <div 
          onClick={() => navigate('recipes')}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white mb-6 flex justify-between items-center cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
        >
          <div>
            <h3 className="font-bold text-lg mb-1">{t.recipes || 'Sağlam Qidalanma'}</h3>
            <p className="text-sm opacity-90">{t.recipesDesc || 'Evdə hazırlaya biləcəyiniz menyular'}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">🥗</span>
          </div>
        </div>

        {/* Flash Deals (Healthy Options) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-white flex items-center">
              <Zap className="w-5 h-5 text-amber-500 mr-2 fill-amber-500" />
              {t.flashDeals}
            </h2>
            <button onClick={() => navigate('stores')} className="text-sm text-gray-500 hover:text-[#00C16A] font-medium">{t.seeAll}</button>
          </div>

          <div className="space-y-3">
            {stores.slice(0, 3).map((store, idx) => (
              <div 
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform ${idx > 0 ? 'opacity-80' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl">
                    {store.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A0A0A] dark:text-white">{store.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> {store.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#00C16A] font-bold">{store.discount}</div>
                  <div className="text-xs text-amber-500 font-medium mt-1">0{idx + 1}:24:00 {language === 'az' ? 'qaldı' : language === 'en' ? 'left' : language === 'tr' ? 'kaldı' : 'осталось'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

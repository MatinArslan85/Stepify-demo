import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Camera, Share2, CheckCircle2, Sparkles } from 'lucide-react';
import { Screen, Language, UserProfileType } from '../types';
import { StepiAvatar } from '../components/StepiAvatar';

interface Props {
  navigate: (screen: Screen) => void;
  steps: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
  userProfile: UserProfileType;
  setAppStories: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function CreateStory({ navigate, steps, setCoins, language, userProfile, setAppStories }: Props) {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    setCoins(c => c + 20); // Bonus for sharing
    
    // Add new story
    const newStory = {
      id: Date.now(),
      user: userProfile.name.split(' ')[0],
      avatar: userProfile.avatar,
      image: "https://images.unsplash.com/photo-1552674605-171ff3ea36f0?q=80&w=1500&auto=format&fit=crop",
      time: language === 'az' ? 'İndi' : language === 'en' ? 'Just now' : language === 'tr' ? 'Şimdi' : 'Только что',
      likes: 0
    };
    
    setAppStories(prev => [newStory, ...prev]);

    setTimeout(() => {
      navigate('home');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="absolute top-12 left-6 right-6 z-30 flex justify-between items-center">
        <button onClick={() => navigate('home')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-bold drop-shadow-md">{language === 'az' ? 'Stori Paylaş' : language === 'en' ? 'Share Story' : language === 'tr' ? 'Hikaye Paylaş' : 'Поделиться историей'}</span>
        <div className="w-10"></div>
      </div>

      {/* Camera Viewfinder Simulation */}
      <div className="flex-1 relative">
        {/* Mock Camera Background (Blurred environment) */}
        <div className="absolute inset-0 bg-gray-800">
          <img 
            src="https://images.unsplash.com/photo-1552674605-171ff3ea36f0?q=80&w=1500&auto=format&fit=crop" 
            alt="Walking path" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Story Overlay Content */}
        {!shared ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8"
          >
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[3rem] border border-white/30 text-center shadow-2xl w-full max-w-sm transform -rotate-2">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg text-5xl overflow-hidden">
                {userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http') ? (
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  userProfile.avatar
                )}
              </div>
              <h2 className="text-white font-bold text-xl mb-1 drop-shadow-md">{language === 'az' ? 'Günün Statistikası' : language === 'en' ? 'Daily Stats' : language === 'tr' ? 'Günün İstatistikleri' : 'Статистика за день'}</h2>
              <div className="text-5xl font-black text-[#00C16A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] mb-2">
                {steps.toLocaleString()}
              </div>
              <p className="text-white/90 font-medium text-lg drop-shadow-md">{language === 'az' ? 'addım atıldı! 🏃‍♂️' : language === 'en' ? 'steps taken! 🏃‍♂️' : language === 'tr' ? 'adım atıldı! 🏃‍♂️' : 'шагов пройдено! 🏃‍♂️'}</p>
              
              <div className="mt-8 inline-flex items-center bg-black/40 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                <span className="text-white font-bold text-sm">Stepify App</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl flex flex-col items-center text-center shadow-2xl mx-6 transition-colors">
              <CheckCircle2 className="w-20 h-20 text-[#00C16A] mb-4" />
              <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Paylaşıldı!' : language === 'en' ? 'Shared!' : language === 'tr' ? 'Paylaşıldı!' : 'Поделились!'}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {language === 'az' ? 'Stori uğurla paylaşıldı və izləyicilərinizə göstərildi.' : language === 'en' ? 'Story successfully shared and shown to your followers.' : language === 'tr' ? 'Hikaye başarıyla paylaşıldı ve takipçilerinize gösterildi.' : 'История успешно опубликована и показана вашим подписчикам.'}
              </p>
              <div className="bg-[#00C16A]/10 dark:bg-emerald-900/30 text-[#00C16A] px-4 py-2 rounded-full font-bold text-lg transition-colors">
                {language === 'az' ? '+20 Coin Qazandınız' : language === 'en' ? 'You earned +20 Coins' : language === 'tr' ? '+20 Coin Kazandınız' : 'Вы заработали +20 монет'}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      {!shared && (
        <div className="absolute bottom-0 left-0 right-0 p-8 z-30 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
          <button
            onClick={handleShare}
            className="w-full bg-[#00C16A] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg shadow-[#00C16A]/30 active:scale-95 transition-transform"
          >
            <Share2 className="w-6 h-6" />
            <span>{language === 'az' ? 'Storidə Paylaş' : language === 'en' ? 'Share to Story' : language === 'tr' ? 'Hikayede Paylaş' : 'Поделиться в истории'}</span>
          </button>
          <p className="text-white/60 text-xs mt-4">{language === 'az' ? 'Paylaşaraq əlavə 20 Coin qazan' : language === 'en' ? 'Earn an extra 20 Coins by sharing' : language === 'tr' ? 'Paylaşarak ekstra 20 Coin kazan' : 'Заработайте дополнительные 20 монет, поделившись'}</p>
        </div>
      )}
    </div>
  );
}

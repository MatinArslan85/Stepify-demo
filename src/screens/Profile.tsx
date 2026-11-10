import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, CreditCard, ChevronRight, LogOut, MapPin, Award, Users, Edit2, Check, X, Crown, Camera, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Screen, UserProfileType } from '../types';
import { translations, Language } from '../translations';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  steps: number;
  onLogout: () => void;
  language: Language;
  userProfile: UserProfileType;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfileType>>;
  userGoals: { daily: number; weekly: number; monthly: number };
  setUserGoals: React.Dispatch<React.SetStateAction<{ daily: number; weekly: number; monthly: number }>>;
  isPremium: boolean;
  realMoneyBalance: number;
}

const weeklyStepData = [
  { day: 'B.e', steps: 4200 },
  { day: 'Ç.a', steps: 5800 },
  { day: 'Ç', steps: 3100 },
  { day: 'C.a', steps: 6500 },
  { day: 'C', steps: 8400 },
  { day: 'Ş', steps: 10200 },
  { day: 'B', steps: 7500 },
];

export default function Profile({ navigate, coins, steps, onLogout, language, userProfile, setUserProfile, userGoals, setUserGoals, isPremium, realMoneyBalance }: Props) {
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editBio, setEditBio] = useState(userProfile.bio || '');
  const [editInstagram, setEditInstagram] = useState(userProfile.social?.instagram || '');
  const [editX, setEditX] = useState(userProfile.social?.x || '');
  const [editWhatsapp, setEditWhatsapp] = useState(userProfile.social?.whatsapp || '');
  const [editDailyGoal, setEditDailyGoal] = useState(userGoals.daily);
  const [editWeeklyGoal, setEditWeeklyGoal] = useState(userGoals.weekly);
  const [editMonthlyGoal, setEditMonthlyGoal] = useState(userGoals.monthly);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [appleHealth, setAppleHealth] = useState(false);
  const [googleFit, setGoogleFit] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleApp = (app: 'apple' | 'google') => {
    if (app === 'apple') {
      if (!appleHealth) {
        showToast(language === 'az' ? 'Apple Health qoşuldu (Simulyasiya)' : language === 'en' ? 'Apple Health connected (Simulation)' : language === 'tr' ? 'Apple Health bağlandı (Simülasyon)' : 'Apple Health подключен (Симуляция)');
      }
      setAppleHealth(!appleHealth);
    } else {
      if (!googleFit) {
        showToast(language === 'az' ? 'Google Fit qoşuldu (Simulyasiya)' : language === 'en' ? 'Google Fit connected (Simulation)' : language === 'tr' ? 'Google Fit bağlandı (Simülasyon)' : 'Google Fit подключен (Симуляция)');
      }
      setGoogleFit(!googleFit);
    }
  };

  const nftClasses = [
    {
      id: 'bronze',
      name: language === 'az' ? 'Bürünc (Başlanğıc)' : language === 'en' ? 'Bronze (Novice)' : language === 'tr' ? 'Bronz (Başlangıç)' : 'Бронза (Новичок)',
      minSteps: 0,
      color: 'from-orange-400 to-orange-600',
      avatars: ['👦', '👧', '👨', '👩']
    },
    {
      id: 'iron',
      name: language === 'az' ? 'Dəmir (Gəzintiçi)' : language === 'en' ? 'Iron (Walker)' : language === 'tr' ? 'Demir (Yürüyüşçü)' : 'Железо (Ходок)',
      minSteps: 5000,
      color: 'from-slate-400 to-slate-600',
      avatars: ['🚶', '🏃', '👟', '🧢']
    },
    {
      id: 'silver',
      name: language === 'az' ? 'Gümüş (Həvəskar)' : language === 'en' ? 'Silver (Amateur)' : language === 'tr' ? 'Gümüş (Amatör)' : 'Серебро (Любитель)',
      minSteps: 10000,
      color: 'from-gray-300 to-gray-500',
      avatars: ['🦊', '🐺', '🐱', '🐶']
    },
    {
      id: 'gold',
      name: language === 'az' ? 'Qızıl (Peşəkar)' : language === 'en' ? 'Gold (Pro)' : language === 'tr' ? 'Altın (Profesyonel)' : 'Золото (Профи)',
      minSteps: 25000,
      color: 'from-yellow-400 to-amber-500',
      avatars: ['🐯', '🦁', '🐻', '🐼']
    },
    {
      id: 'platinum',
      name: language === 'az' ? 'Platin (Elit)' : language === 'en' ? 'Platinum (Elite)' : language === 'tr' ? 'Platin (Elit)' : 'Платина (Элита)',
      minSteps: 50000,
      color: 'from-teal-400 to-teal-600',
      avatars: ['🦅', '🦉', '🦇', '🦋']
    },
    {
      id: 'emerald',
      name: language === 'az' ? 'Zümrüd (Usta)' : language === 'en' ? 'Emerald (Master)' : language === 'tr' ? 'Zümrüt (Usta)' : 'Изумруд (Мастер)',
      minSteps: 100000,
      color: 'from-emerald-400 to-emerald-600',
      avatars: ['🦸', '🦹', '🥷', '🕵️']
    },
    {
      id: 'diamond',
      name: language === 'az' ? 'Almaz (Əfsanə)' : language === 'en' ? 'Diamond (Legend)' : language === 'tr' ? 'Elmas (Efsane)' : 'Алмаз (Легенда)',
      minSteps: 250000,
      color: 'from-cyan-400 to-blue-500',
      avatars: ['💎', '⚡', '🔥', '❄️']
    },
    {
      id: 'ruby',
      name: language === 'az' ? 'Yaqut (Qəhrəman)' : language === 'en' ? 'Ruby (Hero)' : language === 'tr' ? 'Yakut (Kahraman)' : 'Рубин (Герой)',
      minSteps: 500000,
      color: 'from-red-400 to-red-600',
      avatars: ['🦄', '🐉', '🦖', '🐙']
    },
    {
      id: 'sapphire',
      name: language === 'az' ? 'Sapfir (Titan)' : language === 'en' ? 'Sapphire (Titan)' : language === 'tr' ? 'Safir (Titan)' : 'Сапфир (Титан)',
      minSteps: 750000,
      color: 'from-blue-500 to-indigo-600',
      avatars: ['🧜', '🧚', '🧛', '🧟']
    },
    {
      id: 'mythic',
      name: language === 'az' ? 'Mifik (Kosmik)' : language === 'en' ? 'Mythic (Cosmic)' : language === 'tr' ? 'Mistik (Kozmik)' : 'Мифический (Космос)',
      minSteps: 1000000,
      color: 'from-fuchsia-500 to-purple-600',
      avatars: ['🌌', '👑', '👽', '🧞', '👼']
    }
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'az' ? 'Şəkil ölçüsü çox böyükdür (Maksimum 5MB)' : 'Image size is too large (Max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Get base64 string (JPEG, 0.7 quality)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setEditAvatar(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setUserProfile(prev => ({ 
      ...prev, 
      name: editName, 
      avatar: editAvatar,
      bio: editBio,
      social: {
        ...prev.social,
        instagram: editInstagram,
        x: editX,
        whatsapp: editWhatsapp
      }
    }));
    setUserGoals({ daily: editDailyGoal, weekly: editWeeklyGoal, monthly: editMonthlyGoal });
    setIsEditing(false);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          name: editName,
          photoURL: editAvatar.startsWith('data:image') || editAvatar.startsWith('http') ? editAvatar : '',
          bio: editBio,
          social: {
            instagram: editInstagram,
            x: editX,
            whatsapp: editWhatsapp
          }
        }, { merge: true });
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditName(userProfile.name);
    setEditAvatar(userProfile.avatar);
    setEditBio(userProfile.bio || '');
    setEditInstagram(userProfile.social?.instagram || '');
    setEditX(userProfile.social?.x || '');
    setEditWhatsapp(userProfile.social?.whatsapp || '');
    setEditDailyGoal(userGoals.daily);
    setEditWeeklyGoal(userGoals.weekly);
    setEditMonthlyGoal(userGoals.monthly);
    setIsEditing(false);
  };

  const handleSaveGoals = () => {
    setUserGoals({ daily: editDailyGoal, weekly: editWeeklyGoal, monthly: editMonthlyGoal });
    setShowGoalModal(false);
  };

  const handleCancelGoals = () => {
    setEditDailyGoal(userGoals.daily);
    setEditWeeklyGoal(userGoals.weekly);
    setEditMonthlyGoal(userGoals.monthly);
    setShowGoalModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 overflow-y-auto pb-24 transition-colors">
      {/* Header */}
      <div className="bg-[#0A0A0A] dark:bg-black text-white pt-10 pb-8 px-6 rounded-b-[2.5rem] shadow-md relative transition-colors">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{language === 'az' ? 'Profil' : language === 'en' ? 'Profile' : language === 'tr' ? 'Profil' : 'Профиль'}</h1>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Edit2 className="w-5 h-5 text-white" />
                </button>
                <button onClick={() => navigate('settings')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancel} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <button onClick={handleSave} className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full transition-colors">
                  <Check className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-tr from-[#00C16A] to-emerald-300 rounded-full p-1 mb-4">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl transition-colors overflow-hidden">
                    {editAvatar.startsWith('data:image') || editAvatar.startsWith('http') ? (
                      <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      editAvatar
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-0 bg-[#00C16A] p-2 rounded-full text-white shadow-lg border-2 border-[#0A0A0A] dark:border-black"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="w-full max-h-60 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {nftClasses.map(nftClass => {
                  const isUnlocked = steps >= nftClass.minSteps;
                  return (
                    <div key={nftClass.id} className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold bg-gradient-to-r ${nftClass.color} bg-clip-text text-transparent`}>
                          {nftClass.name}
                        </span>
                        {!isUnlocked && (
                          <span className="text-[10px] text-gray-400 bg-black/30 px-2 py-0.5 rounded-full">
                            {nftClass.minSteps.toLocaleString()} {language === 'az' ? 'addım' : language === 'en' ? 'steps' : language === 'tr' ? 'adım' : 'шагов'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {nftClass.avatars.map(a => (
                          <button 
                            key={a} 
                            onClick={() => isUnlocked && setEditAvatar(a)}
                            disabled={!isUnlocked}
                            className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              editAvatar === a 
                                ? 'bg-white/20 scale-110 border border-white/30' 
                                : isUnlocked 
                                  ? 'hover:bg-white/10 bg-white/5' 
                                  : 'opacity-30 grayscale cursor-not-allowed bg-black/20'
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{language === 'az' ? 'Adınız' : language === 'en' ? 'Your Name' : language === 'tr' ? 'Adınız' : 'Ваше имя'}</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#00C16A] transition-colors mb-4"
              />

              <label className="text-xs text-gray-400 mb-1 block">Bio</label>
              <textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#00C16A] transition-colors mb-4 resize-none"
                placeholder={language === 'az' ? 'Özünüz haqqında qısa məlumat...' : 'Short bio about yourself...'}
              />

              <h3 className="text-sm font-bold text-white mb-3 mt-2">{language === 'az' ? 'Sosial Şəbəkələr' : language === 'en' ? 'Social Media' : language === 'tr' ? 'Sosyal Medya' : 'Социальные сети'}</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Instagram (username)</label>
                  <input 
                    type="text" 
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#00C16A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">X / Twitter (username)</label>
                  <input 
                    type="text" 
                    value={editX}
                    onChange={(e) => setEditX(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#00C16A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">WhatsApp (nömrə)</label>
                  <input 
                    type="text" 
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-[#00C16A] transition-colors"
                  />
                </div>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#00C16A] to-emerald-300 rounded-full p-1">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl transition-colors overflow-hidden">
                {userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http') ? (
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  userProfile.avatar
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-xl font-bold mr-2">{userProfile.name}</h2>
                {isPremium && <Crown className="w-5 h-5 text-amber-500" />}
              </div>
              <p className="text-gray-400 text-sm flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" /> Nərimanov, Bakı
              </p>
              {userProfile.bio && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] break-words line-clamp-2">
                  {userProfile.bio}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {userProfile.social?.instagram && (
                  <a href={`https://instagram.com/${userProfile.social.instagram}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-lg shadow-sm hover:scale-105 transition-transform">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {userProfile.social?.x && (
                  <a href={`https://x.com/${userProfile.social.x}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-black text-white rounded-lg shadow-sm hover:scale-105 transition-transform">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {userProfile.social?.whatsapp && (
                  <a href={`https://wa.me/${userProfile.social.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#25D366] text-white rounded-lg shadow-sm hover:scale-105 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>
              {!isPremium && (
                <button 
                  onClick={() => navigate('premium')}
                  className="mt-2 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm"
                >
                  {language === 'az' ? 'Premium Al' : language === 'en' ? 'Get Premium' : language === 'tr' ? 'Premium Al' : 'Купить Premium'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 -mt-4 relative z-10 space-y-6">
        {/* Stats Row */}
        <div className="flex space-x-4">
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transition-colors">
            <Award className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-[#0A0A0A] dark:text-white">#4</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Bakı Reytinqi' : language === 'en' ? 'Baku Ranking' : language === 'tr' ? 'Bakü Sıralaması' : 'Рейтинг Баку'}</span>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transition-colors">
            <div className="text-2xl mb-2">🔥</div>
            <span className="text-2xl font-bold text-[#0A0A0A] dark:text-white">12</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Günlük Streak' : language === 'en' ? 'Daily Streak' : language === 'tr' ? 'Günlük Seri' : 'Дневная серия'}</span>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-[#00C16A] to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-[#00C16A]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">{language === 'az' ? 'Cari Balans' : language === 'en' ? 'Current Balance' : language === 'tr' ? 'Mevcut Bakiye' : 'Текущий баланс'}</p>
              <h3 className="text-4xl font-bold">{coins} <span className="text-xl font-medium">Coin</span></h3>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm font-medium mb-1">{language === 'az' ? 'Real Pul' : language === 'en' ? 'Real Money' : language === 'tr' ? 'Gerçek Para' : 'Реальные деньги'}</p>
              <h3 className="text-2xl font-bold">{realMoneyBalance.toFixed(2)} <span className="text-sm font-medium">AZN</span></h3>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('withdraw')}
              className="flex-1 bg-white text-[#00C16A] py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              {language === 'az' ? 'Coin Çıxar' : language === 'en' ? 'Withdraw Coin' : language === 'tr' ? 'Coin Çek' : 'Вывести Coin'}
            </button>
            <button 
              onClick={() => navigate('history')}
              className="flex-1 bg-black/20 text-white py-3 rounded-xl font-bold text-sm backdrop-blur-sm active:scale-95 transition-transform"
            >
              {language === 'az' ? 'Tarixçə' : language === 'en' ? 'History' : language === 'tr' ? 'Geçmiş' : 'История'}
            </button>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-xl font-bold text-[#0A0A0A] dark:text-white mb-6">
            {language === 'az' ? 'Həftəlik Trend' : language === 'en' ? 'Weekly Trend' : language === 'tr' ? 'Haftalık Trend' : 'Недельный тренд'}
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStepData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C16A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C16A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'var(--tw-colors-white)' }}
                  itemStyle={{ color: '#00C16A', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="steps" stroke="#00C16A" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#0A0A0A] dark:text-white">
              {language === 'az' ? 'Hədəflərim' : language === 'en' ? 'My Goals' : language === 'tr' ? 'Hedeflerim' : 'Мои цели'}
            </h3>
            <button onClick={() => setShowGoalModal(true)} className="p-2.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
              <Edit2 className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Günlük' : language === 'en' ? 'Daily' : language === 'tr' ? 'Günlük' : 'Дневная'}</span>
                <span className="font-bold text-[#0A0A0A] dark:text-white text-lg">{steps.toLocaleString()} / {userGoals.daily.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (steps / userGoals.daily) * 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Həftəlik' : language === 'en' ? 'Weekly' : language === 'tr' ? 'Haftalık' : 'Недельная'}</span>
                <span className="font-bold text-[#0A0A0A] dark:text-white text-lg">{(steps * 3).toLocaleString()} / {userGoals.weekly.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, ((steps * 3) / userGoals.weekly) * 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 dark:text-gray-400 font-medium">{language === 'az' ? 'Aylıq' : language === 'en' ? 'Monthly' : language === 'tr' ? 'Aylık' : 'Месячная'}</span>
                <span className="font-bold text-[#0A0A0A] dark:text-white text-lg">{(steps * 12).toLocaleString()} / {userGoals.monthly.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, ((steps * 12) / userGoals.monthly) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-4">
            {language === 'az' ? 'NFT Kolleksiyam' : language === 'en' ? 'My NFT Collection' : language === 'tr' ? 'NFT Koleksiyonum' : 'Моя NFT коллекция'}
          </h3>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {nftClasses.map(nftClass => {
              const isUnlocked = steps >= nftClass.minSteps;
              return (
                <div 
                  key={nftClass.id} 
                  className={`flex-shrink-0 w-32 rounded-2xl p-4 border flex flex-col items-center text-center transition-all ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60 grayscale'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${
                    isUnlocked ? `bg-gradient-to-tr ${nftClass.color} text-white` : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {nftClass.avatars[0]}
                  </div>
                  <span className={`text-xs font-bold mb-1 ${isUnlocked ? `bg-gradient-to-r ${nftClass.color} bg-clip-text text-transparent` : 'text-gray-400'}`}>
                    {nftClass.name}
                  </span>
                  {!isUnlocked && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      {nftClass.minSteps.toLocaleString()} {language === 'az' ? 'addım' : language === 'en' ? 'steps' : language === 'tr' ? 'adım' : 'шагов'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-4">
            {language === 'az' ? 'Nailiyyətlər' : language === 'en' ? 'Achievements' : language === 'tr' ? 'Başarılar' : 'Достижения'}
          </h3>
          <div className="flex flex-col space-y-3">
            {[
              { id: 'early', title: 'Early Bird', desc: language === 'az' ? 'Səhər aktivliyi' : language === 'en' ? 'Morning activity' : language === 'tr' ? 'Sabah aktivitesi' : 'Утренняя активность', icon: '🌅', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500', minSteps: 0 },
              { id: '10k', title: '10k Club', desc: language === 'az' ? '10,000 addım' : language === 'en' ? '10,000 steps' : language === 'tr' ? '10,000 adım' : '10,000 шагов', icon: '🏃', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500', minSteps: 10000 },
              { id: '50k', title: '50k Club', desc: language === 'az' ? '50,000 addım' : language === 'en' ? '50,000 steps' : language === 'tr' ? '50,000 adım' : '50,000 шагов', icon: '🔥', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-500', minSteps: 50000 },
              { id: '100k', title: '100k Club', desc: language === 'az' ? '100,000 addım' : language === 'en' ? '100,000 steps' : language === 'tr' ? '100,000 adım' : '100,000 шагов', icon: '💯', color: 'bg-red-100 dark:bg-red-900/30 text-red-500', minSteps: 100000 },
              { id: 'marathon', title: 'Marathon', desc: language === 'az' ? 'Marafonçu' : language === 'en' ? 'Marathoner' : language === 'tr' ? 'Maratoncu' : 'Марафонец', icon: '🏅', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500', minSteps: 250000 }
            ].map(achievement => {
              const unlocked = steps >= achievement.minSteps || achievement.id === 'early';
              return (
                <div key={achievement.id} className={`flex items-center space-x-4 p-3 rounded-2xl border transition-all ${unlocked ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700' : 'bg-gray-50/50 dark:bg-gray-800/30 border-transparent opacity-60 grayscale'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${unlocked ? achievement.color : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${unlocked ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{achievement.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.desc}</p>
                  </div>
                  {unlocked && (
                    <div className="w-6 h-6 bg-[#00C16A] rounded-full flex items-center justify-center text-white shadow-sm shadow-[#00C16A]/20">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Connected Apps */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-4">
            {language === 'az' ? 'Bağlı Tətbiqlər' : language === 'en' ? 'Connected Apps' : language === 'tr' ? 'Bağlı Uygulamalar' : 'Подключенные приложения'}
          </h3>
          <div className="space-y-3">
            {/* Apple Health */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <svg viewBox="0 0 384 512" className="w-5 h-5 text-black dark:text-white fill-current">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-white">Apple Health</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {appleHealth ? (language === 'az' ? 'Qoşulub' : language === 'en' ? 'Connected' : language === 'tr' ? 'Bağlı' : 'Подключено') : (language === 'az' ? 'Qoşulmayıb' : language === 'en' ? 'Not connected' : language === 'tr' ? 'Bağlı değil' : 'Не подключено')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleApp('apple')}
                className={`w-12 h-6 rounded-full transition-colors relative ${appleHealth ? 'bg-[#00C16A]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${appleHealth ? 'translate-x-6.5 left-0' : 'translate-x-0.5 left-0'}`} />
              </button>
            </div>

            {/* Google Fit */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                   <svg viewBox="0 0 488 512" className="w-5 h-5 text-blue-500 fill-current">
                     <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                   </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-white">Google Fit</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {googleFit ? (language === 'az' ? 'Qoşulub' : language === 'en' ? 'Connected' : language === 'tr' ? 'Bağlı' : 'Подключено') : (language === 'az' ? 'Qoşulmayıb' : language === 'en' ? 'Not connected' : language === 'tr' ? 'Bağlı değil' : 'Не подключено')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleApp('google')}
                className={`w-12 h-6 rounded-full transition-colors relative ${googleFit ? 'bg-[#00C16A]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${googleFit ? 'translate-x-6.5 left-0' : 'translate-x-0.5 left-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div 
            onClick={() => navigate('collection')}
            className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-2xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] dark:text-white">Kolleksiya</h4>
                <p className="text-xs text-indigo-500 font-medium">{userProfile.discoveredDistricts?.length || 0}/9 rayon</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>

          <div 
            onClick={() => navigate('referral')}
            className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Dostunu Dəvət Et' : language === 'en' ? 'Invite a Friend' : language === 'tr' ? 'Arkadaşını Davet Et' : 'Пригласить друга'}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">+100 Coin {language === 'az' ? 'qazan' : language === 'en' ? 'earn' : language === 'tr' ? 'kazan' : 'получить'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>

          <div 
            onClick={() => navigate('stepify-card')}
            className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] dark:text-white">Stepify {language === 'az' ? 'Kart' : language === 'en' ? 'Card' : language === 'tr' ? 'Kart' : 'Карта'}</h4>
                <p className="text-xs text-emerald-500 dark:text-emerald-400 font-medium">{language === 'az' ? 'Aktivdir' : language === 'en' ? 'Active' : language === 'tr' ? 'Aktif' : 'Активно'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>
          
          <div 
            onClick={onLogout}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-2xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-semibold text-red-600 dark:text-red-400">{language === 'az' ? 'Hesabdan çıx' : language === 'en' ? 'Log out' : language === 'tr' ? 'Çıkış yap' : 'Выйти'}</h4>
            </div>
          </div>
        </div>
      </div>
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
                  {language === 'az' ? 'Hədəfləri Dəyiş' : language === 'en' ? 'Edit Goals' : language === 'tr' ? 'Hedefleri Değiştir' : 'Изменить цели'}
                </h3>
                <button onClick={handleCancelGoals} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    {language === 'az' ? 'Günlük Hədəf (addım)' : language === 'en' ? 'Daily Goal (steps)' : language === 'tr' ? 'Günlük Hedef (adım)' : 'Дневная цель (шагов)'}
                  </label>
                  <input 
                    type="number" 
                    value={editDailyGoal}
                    onChange={(e) => setEditDailyGoal(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    {language === 'az' ? 'Həftəlik Hədəf (addım)' : language === 'en' ? 'Weekly Goal (steps)' : language === 'tr' ? 'Haftalık Hedef (adım)' : 'Недельная цель (шагов)'}
                  </label>
                  <input 
                    type="number" 
                    value={editWeeklyGoal}
                    onChange={(e) => setEditWeeklyGoal(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    {language === 'az' ? 'Aylıq Hədəf (addım)' : language === 'en' ? 'Monthly Goal (steps)' : language === 'tr' ? 'Aylık Hedef (adım)' : 'Месячная цель (шагов)'}
                  </label>
                  <input 
                    type="number" 
                    value={editMonthlyGoal}
                    onChange={(e) => setEditMonthlyGoal(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveGoals}
                className="w-full bg-[#00C16A] hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#00C16A]/20 active:scale-95 transition-all flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                {language === 'az' ? 'Yadda Saxla' : language === 'en' ? 'Save' : language === 'tr' ? 'Kaydet' : 'Сохранить'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

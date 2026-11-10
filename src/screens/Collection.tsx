import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Map, Lock, Award, Zap, X } from 'lucide-react';
import { Screen, User } from '../types';
import { Language } from '../translations';
import { districts } from '../data';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
  userProfile: User;
  setCoins: (cb: (prev: number) => number) => void;
}

export default function Collection({ navigate, language, userProfile, setCoins }: Props) {
  const discovered = userProfile.discoveredDistricts || [];
  const progress = discovered.length;
  const isAllUnlocked = progress === districts.length;
  
  const [selectedFact, setSelectedFact] = useState<typeof districts[0] | null>(null);
  const [showCompletionBonus, setShowCompletionBonus] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const handleClaimBonus = () => {
    setCoins(prev => prev + 500);
    setBonusClaimed(true);
    setShowCompletionBonus(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 pt-14 sm:pt-16 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors sticky top-0 z-20">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors mr-3">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white leading-tight">Kolleksiya</h1>
          <p className="text-sm text-gray-500 font-medium">{progress} / {districts.length} rayon kəşf edildi</p>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-[#0A0A0A] dark:text-white">Ümumi irəliləyiş</h3>
            <span className="text-[#00C16A] font-bold text-lg">{Math.round((progress/districts.length)*100)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(progress/districts.length)*100}%` }}
              className="h-full bg-gradient-to-r from-[#00C16A] to-emerald-400 rounded-full"
            />
          </div>
          {isAllUnlocked && !bonusClaimed && (
            <button 
              onClick={() => setShowCompletionBonus(true)}
              className="w-full mt-4 bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] py-3 rounded-xl font-bold flex items-center justify-center space-x-2 animate-bounce"
            >
              <Award className="w-5 h-5 text-amber-400" />
              <span>Bakı Kaşifi Mükafatını Al</span>
            </button>
          )}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-3 gap-4">
          {districts.map(district => {
            const isUnlocked = discovered.includes(district.id);
            return (
              <motion.div
                key={district.id}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && setSelectedFact(district)}
                className={`flex flex-col items-center p-3 rounded-3xl border-2 transition-all ${
                  isUnlocked 
                    ? 'bg-white dark:bg-gray-800 border-[#00C16A] shadow-[0_8px_16px_-6px_rgba(0,193,106,0.2)] cursor-pointer' 
                    : 'bg-gray-100 dark:bg-gray-800/50 border-transparent cursor-not-allowed opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 relative ${
                  isUnlocked ? 'bg-emerald-50 dark:bg-emerald-900/40' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {isUnlocked ? (
                    district.icon
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`text-[11px] font-bold text-center w-full truncate ${
                  isUnlocked ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-500'
                }`}>
                  {district.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fact Modal */}
      <AnimatePresence>
        {selectedFact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-xl relative"
            >
              <button 
                onClick={() => setSelectedFact(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                {selectedFact.icon}
              </div>
              <h3 className="text-2xl font-bold text-center text-[#0A0A0A] dark:text-white mb-2">{selectedFact.name}</h3>
              <p className="text-center text-[#00C16A] text-sm font-bold mb-4 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full inline-block mx-auto left-1/2 relative -translate-x-1/2">
                +{selectedFact.coins} Coin qazanılıb
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                {selectedFact.fact}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grand Completion Modal */}
      <AnimatePresence>
        {showCompletionBonus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative text-center text-white"
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto border-4 border-white/30 backdrop-blur-sm shadow-inner">
                🏆
              </div>
              <h2 className="text-3xl font-extrabold mb-2">Bakı Kaşifi</h2>
              <p className="text-white/90 font-medium mb-8 leading-relaxed">
                Təbriklər! Sən Bakının bütün əsas rayonlarını kəşf etdin və xüsusi nişan qazandın.
              </p>
              <button 
                onClick={handleClaimBonus}
                className="w-full bg-white text-orange-500 py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                +500 Coin Al
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Copy, Share2, CheckCircle2 } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
}

export default function Referral({ navigate, setCoins, language }: Props) {
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [applied, setApplied] = useState(false);
  const referralCode = "STEP-M123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCode = () => {
    if (friendCode.length > 4 && !applied) {
      setApplied(true);
      setCoins(c => c + 100);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors">
        <button onClick={() => navigate('leaderboard')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{language === 'az' ? 'Dostunu Dəvət Et' : language === 'en' ? 'Invite a Friend' : language === 'tr' ? 'Arkadaşını Davet Et' : 'Пригласить друга'}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[#0A0A0A] to-gray-800 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C16A] opacity-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
          <Gift className="w-16 h-16 text-[#00C16A] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{language === 'az' ? 'Hər dosta görə 100 Coin!' : language === 'en' ? '100 Coins per friend!' : language === 'tr' ? 'Her arkadaş için 100 Coin!' : '100 монет за каждого друга!'}</h2>
          <p className="text-gray-300 text-sm mb-6">
            {language === 'az' ? 'Dostunuz sizin kodunuzla qeydiyyatdan keçdikdə həm siz, həm də o 100 Coin qazanacaq.' : language === 'en' ? 'When your friend registers with your code, both of you will earn 100 Coins.' : language === 'tr' ? 'Arkadaşınız kodunuzla kayıt olduğunda hem siz hem de o 100 Coin kazanacak.' : 'Когда ваш друг зарегистрируется с вашим кодом, вы оба получите 100 монет.'}
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
            <span className="text-2xl font-mono font-bold tracking-wider">{referralCode}</span>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-white text-[#0A0A0A] rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-[#00C16A]" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <button className="w-full mt-4 bg-[#00C16A] text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform">
            <Share2 className="w-5 h-5" />
            <span>{language === 'az' ? 'Kodu Paylaş' : language === 'en' ? 'Share Code' : language === 'tr' ? 'Kodu Paylaş' : 'Поделиться кодом'}</span>
          </button>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Dəvət Kodunuz Var?' : language === 'en' ? 'Have an Invite Code?' : language === 'tr' ? 'Davet Kodunuz Var mı?' : 'Есть код приглашения?'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{language === 'az' ? 'Dostunuzun kodunu daxil edərək dərhal 100 Coin qazanın.' : language === 'en' ? 'Enter your friend\'s code to instantly earn 100 Coins.' : language === 'tr' ? 'Arkadaşınızın kodunu girerek anında 100 Coin kazanın.' : 'Введите код вашего друга, чтобы мгновенно получить 100 монет.'}</p>
          
          <div className="flex space-x-3">
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              disabled={applied}
              placeholder={language === 'az' ? 'Kodu daxil edin' : language === 'en' ? 'Enter code' : language === 'tr' ? 'Kodu girin' : 'Введите код'}
              className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white font-mono uppercase focus:outline-none focus:border-[#00C16A] dark:focus:border-[#00C16A] transition-colors"
            />
            <button
              onClick={handleApplyCode}
              disabled={friendCode.length < 5 || applied}
              className={`px-6 rounded-xl font-bold transition-colors ${
                applied 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : friendCode.length >= 5 
                    ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A]' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}
            >
              {applied ? (language === 'az' ? 'Tətbiq edildi' : language === 'en' ? 'Applied' : language === 'tr' ? 'Uygulandı' : 'Применено') : (language === 'az' ? 'Təsdiqlə' : language === 'en' ? 'Confirm' : language === 'tr' ? 'Onayla' : 'Подтвердить')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, MapPin, ChevronDown, ChevronUp, Users, Target, UserPlus, Swords, MessageCircle, Flame, ArrowUp, ArrowDown, Upload, FileImage, Share2, X as CloseIcon, Crown } from 'lucide-react';
import { translations, Language } from '../translations';
import { friends } from '../data';
import { Screen, UserProfileType } from '../types';

interface Props {
  language: Language;
  userProfile: UserProfileType;
  steps?: number;
  navigate: (screen: Screen) => void;
  joinedChallenges: number[];
  setJoinedChallenges: React.Dispatch<React.SetStateAction<number[]>>;
  challengedFriends: number[];
  setChallengedFriends: React.Dispatch<React.SetStateAction<number[]>>;
  isPremium?: boolean;
}

export default function Social({ language, userProfile, steps = 0, navigate, joinedChallenges, setJoinedChallenges, challengedFriends, setChallengedFriends, isPremium }: Props) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'challenges' | 'wew' | 'groups'>('leaderboard');
  const [region, setRegion] = useState('Bakı');
  const [showRegions, setShowRegions] = useState(false);
  const [followingFriends, setFollowingFriends] = useState<number[]>([1, 2]);
  const [wewJoined, setWewJoined] = useState(false);
  const [selectedUni, setSelectedUni] = useState<string | null>(null);
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [studentIdDoc, setStudentIdDoc] = useState<string | null>(null);
  const [studentCardDoc, setStudentCardDoc] = useState<string | null>(null);
  const [studentNumber, setStudentNumber] = useState('');
  const [studentCourse, setStudentCourse] = useState('1');
  const [studentFaculty, setStudentFaculty] = useState('');
  const [selectedFriendProfile, setSelectedFriendProfile] = useState<typeof friends[0] | null>(null);

  // Groups state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [createdGroups, setCreatedGroups] = useState<{id: string, name: string, desc: string, members: number}[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState<{id: string, name: string, desc: string, members: number} | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [groupMessages, setGroupMessages] = useState<Record<string, {text: string, sender: string, time: string, isMe?: boolean}[]>>({
    '1': [
      { text: 'Salamlar! Sabah kimlər qaçışa qatılır?', sender: 'Aysel', time: '10:30' },
      { text: 'Mən mütləq gələcəm 🏃‍♂️', sender: 'Tural', time: '10:35' },
    ]
  });

  const reqUniversities = ['ADA Universiteti', 'BANM', 'UNEC', 'BDU', 'ADNSU', 'Xəzər Universiteti', 'AzMIU'];

  const regions = ['Bakı', 'Sumqayıt', 'Gəncə', 'Lənkəran', 'Şəki', 'Quba'];

  const handleShareSteps = (friendName: string) => {
    const uniStatus = selectedUni 
      ? `mən ${selectedUni} təmsil edirəm!` 
      : '';
    const text = `Salam ${friendName}! Mən bu gün Stepify ilə ${steps.toLocaleString()} addım atdım. ${uniStatus} Bəs sən neçə addımdasan? 🚶‍♂️🏃‍♀️💪`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Stepify Addımlarım',
        text: text,
      }).catch(console.error);
    } else {
      alert(`Mesaj kopyalandı:\n\n${text}`);
      navigator.clipboard.writeText(text).catch(console.error);
    }
  };

  const getRegionData = (selectedRegion: string) => {
    const baseUsers = [
      { rank: 1, name: "Xədicə", steps: 12400, isCurrentUser: false },
      { rank: 2, name: "Eldəniz", steps: 10200, isCurrentUser: false },
      { rank: 3, name: "Cəbrayıl", steps: 8900, isCurrentUser: false },
      { rank: 4, name: userProfile.name, steps: 6840, isCurrentUser: true },
      { rank: 5, name: "Rauf", steps: 5400, isCurrentUser: false },
      { rank: 6, name: "Sevinc", steps: 4200, isCurrentUser: false },
      { rank: 7, name: "Fərid", steps: 3100, isCurrentUser: false },
    ];

    if (selectedRegion === 'Bakı') return baseUsers;

    const multiplier = selectedRegion.length % 3 + 0.8;
    return baseUsers.map(u => ({
      ...u,
      name: u.isCurrentUser ? u.name : `${u.name} (${selectedRegion.substring(0, 3)})`,
      steps: Math.floor(u.steps * multiplier)
    })).sort((a, b) => b.steps - a.steps).map((u, i) => ({ ...u, rank: i + 1 }));
  };

  const users = getRegionData(region);

  const challenges = [
    { id: 1, title: language === 'az' ? 'Həftəsonu Qaçışı' : language === 'en' ? 'Weekend Run' : language === 'tr' ? 'Hafta Sonu Koşusu' : 'Забег на выходных', desc: language === 'az' ? 'Şənbə və Bazar günü cəmi 20,000 addım' : language === 'en' ? 'Total 20,000 steps on Saturday and Sunday' : language === 'tr' ? 'Cumartesi ve Pazar toplam 20.000 adım' : 'Всего 20 000 шагов в субботу и воскресенье', reward: 500, baseParticipants: 1240 },
    { id: 2, title: language === 'az' ? 'Komanda Yarışı: Bakı vs Sumqayıt' : language === 'en' ? 'Team Race: Baku vs Sumgait' : language === 'tr' ? 'Takım Yarışı: Bakü vs Sumgayıt' : 'Командная гонка: Баку против Сумгаита', desc: language === 'az' ? 'Hansı şəhər daha çox addım atacaq?' : language === 'en' ? 'Which city will take more steps?' : language === 'tr' ? 'Hangi şehir daha çok adım atacak?' : 'Какой город сделает больше шагов?', reward: 1000, baseParticipants: 5429 },
    { id: 3, title: language === 'az' ? 'Səhər Quşu' : language === 'en' ? 'Early Bird' : language === 'tr' ? 'Erkenci Kuş' : 'Ранняя пташка', desc: language === 'az' ? 'Hər gün səhər 08:00-dan əvvəl 3000 addım' : language === 'en' ? '3000 steps before 08:00 every morning' : language === 'tr' ? 'Her sabah 08:00\'den önce 3000 adım' : '3000 шагов до 08:00 каждое утро', reward: 300, baseParticipants: 850 },
  ].map(c => ({
    ...c,
    joined: joinedChallenges.includes(c.id),
    participants: c.baseParticipants + (joinedChallenges.includes(c.id) ? 1 : 0)
  }));

  const wewLeaderboard = [
    { rank: 1, name: 'ADA Universiteti', activeStudents: 1450, avgSteps: 12500, trend: 5, isUp: true },
    { rank: 2, name: 'BANM', activeStudents: 890, avgSteps: 11800, trend: 2, isUp: true },
    { rank: 3, name: 'UNEC', activeStudents: 3200, avgSteps: 10450, trend: 1, isUp: false },
    { rank: 4, name: 'BDU', activeStudents: 5100, avgSteps: 9200, trend: 3, isUp: true },
    { rank: 5, name: 'ADNSU', activeStudents: 2800, avgSteps: 8700, trend: 2, isUp: false },
  ].map(u => ({ ...u, isUser: u.name === selectedUni }));

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 overflow-y-auto pb-24 relative transition-colors">
      {/* Header */}
      <div className="bg-[#0A0A0A] dark:bg-black text-white pt-10 pb-6 px-6 rounded-b-[2.5rem] shadow-md relative z-30 transition-colors">
        <h1 className="text-2xl font-bold text-center mb-6">{language === 'az' ? 'Sosial' : language === 'en' ? 'Social' : language === 'tr' ? 'Sosyal' : 'Социальные'}</h1>
        
        {/* Tabs */}
        <div className="flex space-x-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === 'leaderboard' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{language === 'az' ? 'Reytinq' : language === 'en' ? 'Ranking' : language === 'tr' ? 'Sıralama' : 'Рейтинг'}</span>
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === 'friends' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'az' ? 'Dostlar' : language === 'en' ? 'Friends' : language === 'tr' ? 'Arkadaşlar' : 'Друзья'}</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === 'challenges' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>{language === 'az' ? 'Yarışlar' : language === 'en' ? 'Challenges' : language === 'tr' ? 'Yarışmalar' : 'Челленджи'}</span>
          </button>
          <button
            onClick={() => setActiveTab('wew')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === 'wew' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>WEW</span>
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
              activeTab === 'groups' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>{language === 'az' ? 'Qruplar' : language === 'en' ? 'Groups' : language === 'tr' ? 'Gruplar' : 'Группы'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pt-6"
            >
            <div className="flex justify-center items-center mb-6 relative px-6 z-50">
              <div 
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                onClick={() => setShowRegions(!showRegions)}
              >
                <MapPin className="w-4 h-4 text-[#00C16A]" />
                <span className="font-bold text-sm text-[#0A0A0A] dark:text-white">{region} {language === 'az' ? 'Reytinqi' : language === 'en' ? 'Ranking' : language === 'tr' ? 'Sıralaması' : 'Рейтинг'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRegions ? 'rotate-180' : ''}`} />
              </div>

              {showRegions && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                >
                  {regions.map(r => (
                    <div 
                      key={r}
                      onClick={() => { setRegion(r); setShowRegions(false); }}
                      className={`px-4 py-3 text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors ${region === r ? 'bg-emerald-50 dark:bg-emerald-900/30 text-[#00C16A]' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {r}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Podium */}
            <div className="px-6 relative z-10 mb-8 flex items-end justify-center space-x-4 h-60 mt-8">
              {/* 2nd Place */}
              <motion.div 
                key={`podium-2-${region}`}
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-xl mb-2 relative transition-colors">
                  👦
                  <div className="absolute -bottom-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-gray-800 transition-colors">2</div>
                </div>
                <div className="w-16 h-24 bg-gradient-to-t from-gray-200 dark:from-gray-700 to-gray-100 dark:to-gray-800 rounded-t-xl flex justify-center pt-2 shadow-inner transition-colors">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{(users[1].steps / 1000).toFixed(1)}k</span>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div 
                key={`podium-1-${region}`}
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="flex flex-col items-center z-10"
              >
                <Trophy className="w-8 h-8 text-amber-400 mb-1 fill-amber-400" />
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-2xl mb-2 relative transition-colors">
                  👩
                  <div className="absolute -bottom-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-gray-800 transition-colors">1</div>
                </div>
                <div className="w-20 h-32 bg-gradient-to-t from-amber-200 dark:from-amber-900/50 to-amber-100 dark:to-amber-900/20 rounded-t-xl flex justify-center pt-2 shadow-inner transition-colors">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-500">{(users[0].steps / 1000).toFixed(1)}k</span>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div 
                key={`podium-3-${region}`}
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-xl mb-2 relative transition-colors">
                  👨
                  <div className="absolute -bottom-2 bg-orange-300 dark:bg-orange-700 text-orange-800 dark:text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-gray-800 transition-colors">3</div>
                </div>
                <div className="w-16 h-20 bg-gradient-to-t from-orange-200 dark:from-orange-900/50 to-orange-100 dark:to-orange-900/20 rounded-t-xl flex justify-center pt-2 shadow-inner transition-colors">
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-500">{(users[2].steps / 1000).toFixed(1)}k</span>
                </div>
              </motion.div>
            </div>

            {/* List */}
            <div className="px-6 space-y-3">
              {users.slice(3).map((user, index) => (
                <motion.div 
                  key={`${user.rank}-${region}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-2xl shadow-sm border transition-colors ${
                    user.isCurrentUser ? 'bg-[#00C16A] text-white border-[#00C16A]' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#0A0A0A] dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold w-6 text-center ${user.isCurrentUser ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                      {user.rank}
                    </span>
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg transition-colors overflow-hidden">
                      {user.isCurrentUser ? (
                        userProfile.avatar.startsWith('data:image') || userProfile.avatar.startsWith('http') ? (
                          <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          userProfile.avatar
                        )
                      ) : (
                        ['👦', '👨', '👩', '🧑'][index % 4]
                      )}
                    </div>
                    <span className="font-semibold truncate max-w-[100px]">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${user.isCurrentUser ? 'text-white' : 'text-[#00C16A]'}`}>
                      {user.steps.toLocaleString()}
                    </span>
                    {user.isCurrentUser && <ChevronUp className="w-4 h-4 text-white" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}

          {activeTab === 'friends' && (
            <motion.div 
              key="friends"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 space-y-4"
            >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Dostların' : language === 'en' ? 'Your Friends' : language === 'tr' ? 'Arkadaşların' : 'Ваши друзья'}</h2>
              <button onClick={() => navigate('referral')} className="flex items-center text-sm font-bold text-[#00C16A] bg-[#00C16A]/10 px-3 py-1.5 rounded-full hover:bg-[#00C16A]/20 transition-colors">
                <UserPlus className="w-4 h-4 mr-1" />
                {language === 'az' ? 'Dost Əlavə Et' : language === 'en' ? 'Add Friend' : language === 'tr' ? 'Arkadaş Ekle' : 'Добавить друга'}
              </button>
            </div>
            
            {friends.map((friend, index) => (
              <motion.div 
                key={friend.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col space-y-4"
              >
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setSelectedFriendProfile(friend)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl relative flex-shrink-0">
                      {friend.avatar}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white leading-tight hover:underline">{friend.name}</h3>
                      <p className="text-[11px] font-bold text-[#00C16A] mt-1 bg-emerald-50 dark:bg-emerald-900/30 inline-block px-2 py-0.5 rounded-full">{friend.status}</p>
                      {friend.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-snug">
                          {friend.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                  <button 
                    onClick={() => {
                      setFollowingFriends(prev => prev.includes(friend.id) ? prev.filter(id => id !== friend.id) : [...prev, friend.id])
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-1 border ${
                      followingFriends.includes(friend.id) 
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300' 
                        : 'bg-[#00C16A] border-[#00C16A] text-white shadow-md shadow-[#00C16A]/20'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {followingFriends.includes(friend.id) 
                        ? (language === 'az' ? 'İzləyirsən' : language === 'en' ? 'Following' : language === 'tr' ? 'Takip Ediyorsun' : 'Вы подписаны')
                        : (language === 'az' ? 'İzlə' : language === 'en' ? 'Follow' : language === 'tr' ? 'Takip Et' : 'Подписаться')}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleShareSteps(friend.name)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-500 border border-blue-200 dark:border-blue-800 hover:bg-blue-500 hover:text-white flex-shrink-0"
                    title={language === 'az' ? 'Addımımı Paylaş' : language === 'en' ? 'Share Steps' : language === 'tr' ? 'Adımlarımı Paylaş' : 'Поделиться шагами'}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigate('messages')}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#00C16A] hover:text-white flex-shrink-0"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (!challengedFriends.includes(friend.id)) {
                        setChallengedFriends(prev => [...prev, friend.id]);
                      }
                    }}
                    disabled={challengedFriends.includes(friend.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 border ${
                      challengedFriends.includes(friend.id)
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 border-amber-200 dark:border-amber-800 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    <Swords className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div 
              key="challenges"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 space-y-4"
            >
            {challenges.map((challenge, index) => (
              <motion.div 
                key={challenge.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A0A0A] dark:text-white leading-tight">{challenge.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{challenge.participants} {language === 'az' ? 'iştirakçı' : language === 'en' ? 'participants' : language === 'tr' ? 'katılımcı' : 'участников'}</p>
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold text-xs px-2 py-1 rounded-lg flex items-center">
                    +{challenge.reward} 🪙
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{challenge.desc}</p>
                <button 
                  onClick={() => {
                    if (!challenge.joined) {
                      setJoinedChallenges(prev => [...prev, challenge.id]);
                    }
                  }}
                  disabled={challenge.joined}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    challenge.joined 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] active:scale-95'
                  }`}
                >
                  {challenge.joined 
                    ? (language === 'az' ? 'Qoşulmusan' : language === 'en' ? 'Joined' : language === 'tr' ? 'Katıldın' : 'Присоединился') 
                    : (language === 'az' ? 'Qoşul' : language === 'en' ? 'Join' : language === 'tr' ? 'Katıl' : 'Присоединиться')}
                </button>
              </motion.div>
            ))}
          </motion.div>
          )}

          {activeTab === 'wew' && (
            <motion.div 
              key="wew"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 space-y-6 pb-32"
            >
              {/* Banner */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
                
                <h2 className="text-2xl font-black italic tracking-wider mb-2">Walk, Earn, Win (WEW)</h2>
                <p className="text-white/90 text-sm font-medium mb-4 leading-relaxed">
                  Bakının ən aktiv universitetini təyin edirik! Mükafat: 1 aylıq 50% İdman Zalı endirimi.
                </p>
                
                <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hesablama: Ortalama addım sayına görə</span>
                </div>
              </div>

              {/* Content */}
              {!wewJoined ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mb-2">Universitet Qeydiyyatı</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">WEW Kampus Liqasına qoşulmaq və universitetini təmsil etmək üçün məlumatlarını doldur.</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Universitetlər</label>
                      <button 
                        onClick={() => setShowUniDropdown(!showUniDropdown)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between text-left transition-colors focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <span className={selectedUni ? 'text-[#0A0A0A] dark:text-white font-bold' : 'text-gray-400 font-medium'}>
                          {selectedUni || 'Siyahıdan seçin...'}
                        </span>
                        {showUniDropdown ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      
                      <AnimatePresence>
                        {showUniDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-[80px] left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                          >
                            {reqUniversities.map((uni, i) => (
                              <button
                                key={uni}
                                onClick={() => {
                                  setSelectedUni(uni);
                                  setShowUniDropdown(false);
                                }}
                                className={`w-full text-left px-5 py-3.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm font-bold transition-colors ${i !== reqUniversities.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''} ${selectedUni === uni ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-[#0A0A0A] dark:text-white'}`}
                              >
                                {uni}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Şəxsiyyət vəsiqəsi */}
                      <button 
                        onClick={() => setStudentIdDoc('uploaded')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                          studentIdDoc ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {studentIdDoc ? <FileImage className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        <span className="text-xs font-bold text-center">Şəxsiyyət vəsiqəsi</span>
                      </button>

                      {/* Tələbə bileti */}
                      <button 
                        onClick={() => setStudentCardDoc('uploaded')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                          studentCardDoc ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {studentCardDoc ? <FileImage className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        <span className="text-xs font-bold text-center">Tələbə bileti</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tələbə nömrəsi</label>
                      <input 
                        type="text"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        placeholder="Məs: 12345678"
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-[#0A0A0A] dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 placeholder:font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">KURS</label>
                        <select 
                          value={studentCourse}
                          onChange={(e) => setStudentCourse(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-[#0A0A0A] dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                        >
                          <option value="1">1-ci kurs</option>
                          <option value="2">2-ci kurs</option>
                          <option value="3">3-ci kurs</option>
                          <option value="4">4-cü kurs</option>
                          <option value="5">Magistratura</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fakültə</label>
                        <input 
                          type="text"
                          value={studentFaculty}
                          onChange={(e) => setStudentFaculty(e.target.value)}
                          placeholder="Məs: Kiber Təhlükəsizlik"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-[#0A0A0A] dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 placeholder:font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (selectedUni && studentIdDoc && studentCardDoc && studentNumber && studentFaculty) setWewJoined(true);
                    }}
                    disabled={!selectedUni || !studentIdDoc || !studentCardDoc || !studentNumber || !studentFaculty}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                      selectedUni && studentIdDoc && studentCardDoc && studentNumber && studentFaculty
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 active:scale-95' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <span>Liqaya Qoşul</span>
                    {selectedUni && studentIdDoc && studentCardDoc && studentNumber && studentFaculty && <Flame className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white">Kampus Liqası</h3>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">Canlı</div>
                  </div>
                  {wewLeaderboard.map((uni, idx) => (
                    <motion.div 
                      key={uni.name}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-3xl flex items-center justify-between shadow-sm transition-all border ${
                        uni.isUser 
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700/50' 
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${
                          idx === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' : 
                          idx === 1 ? 'bg-gray-100 text-gray-500 border border-gray-200' : 
                          idx === 2 ? 'bg-orange-50 text-orange-500 border border-orange-200' : 
                          'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border border-transparent'
                        }`}>
                          {uni.rank}
                        </div>
                        <div>
                          <h4 className={`font-bold text-base ${uni.isUser ? 'text-amber-900 dark:text-amber-100' : 'text-[#0A0A0A] dark:text-white'}`}>
                            {uni.name}
                          </h4>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <Users className={`w-3 h-3 ${uni.isUser ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`} />
                            <p className={`text-xs font-medium ${uni.isUser ? 'text-amber-700 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'}`}>
                              {uni.activeStudents.toLocaleString()} tələbə
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-black text-lg ${uni.isUser ? 'text-amber-900 dark:text-amber-100' : 'text-[#0A0A0A] dark:text-white'}`}>
                          {uni.avgSteps.toLocaleString()}
                        </div>
                        <div className={`text-[10px] font-black flex items-center justify-end space-x-0.5 mt-0.5 uppercase tracking-wider ${uni.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {uni.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span>{uni.trend}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'groups' && (
            <motion.div 
              key="groups"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 space-y-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">
                  {language === 'az' ? 'Qruplar' : language === 'en' ? 'Groups' : language === 'tr' ? 'Gruplar' : 'Группы'}
                </h2>
                {isPremium && (
                  <button 
                    onClick={() => setShowCreateGroup(true)}
                    className="flex items-center text-sm font-bold text-[#00C16A] bg-[#00C16A]/10 px-3 py-1.5 rounded-full hover:bg-[#00C16A]/20 transition-colors"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    {language === 'az' ? 'Qrup Yarat' : language === 'en' ? 'Create Group' : language === 'tr' ? 'Grup Oluştur' : 'Создать группу'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {!isPremium && (
                  <div className="bg-gradient-to-br from-[#00C16A] to-emerald-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-[#00C16A]/20">
                    <div>
                      <h4 className="font-bold text-sm flex items-center mb-1">
                        <Crown className="w-4 h-4 mr-1" />
                        {language === 'az' ? 'Premium Qruplar Yarat' : language === 'en' ? 'Create Premium Groups' : language === 'tr' ? 'Premium Grup Oluştur' : 'Создать премиум группу'}
                      </h4>
                      <p className="text-[11px] text-emerald-100 max-w-[200px]">
                        {language === 'az' ? 'Öz icmanızı yaratmaq üçün Premium abunəçisi olun' : language === 'en' ? 'Become Premium to create your own community' : language === 'tr' ? 'Kendi topluluğunuzu oluşturmak için Premium olun' : 'Станьте Premium, чтобы создать свое сообщество'}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('premium')}
                      className="bg-white text-[#00C16A] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm shrink-0 whitespace-nowrap"
                    >
                      {language === 'az' ? 'Premium Al' : language === 'en' ? 'Get Premium' : language === 'tr' ? 'Premium Al' : 'Купить Premium'}
                    </button>
                  </div>
                )}

                {isPremium && (
                  <div className="space-y-4 mb-6">
                    {createdGroups.length === 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-[#00C16A]" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-[200px] mx-auto">
                          {language === 'az' ? 'Hələ heç bir qrup yaratmamısınız.' : language === 'en' ? 'You haven\'t created any groups yet.' : language === 'tr' ? 'Henüz hiç grup oluşturmadınız.' : 'Вы еще не создали ни одной группы.'}
                        </p>
                      </div>
                    ) : (
                      createdGroups.map(group => (
                        <div key={group.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-[#0A0A0A] dark:text-white text-lg">{group.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] mt-0.5">{group.desc}</p>
                            <div className="flex items-center space-x-1 mt-2">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-xs font-bold text-gray-400">{group.members} üzv</span>
                            </div>
                          </div>
                          <button onClick={() => setSelectedGroupChat(group)} className="bg-emerald-50 dark:bg-emerald-900/30 text-[#00C16A] border border-emerald-100 dark:border-emerald-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                            {language === 'az' ? 'Aç' : language === 'en' ? 'Open' : language === 'tr' ? 'Aç' : 'Открыть'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
                  
                {/* Dummy Popular Groups */}
                <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mt-8 mb-4">
                  {language === 'az' ? 'Məşhur Qruplar' : language === 'en' ? 'Popular Groups' : language === 'tr' ? 'Popüler Gruplar' : 'Популярные группы'}
                </h3>
                  
                {[
                  { id: '1', name: 'Səhər Qaçışçıları', desc: 'Səhər 06:00 qaçış edənlər klubu', members: 124 },
                  { id: '2', name: 'Həftəsonu Yürüşü', desc: 'Hər həftəsonu bulvarda yürüş edirik', members: 89 },
                  { id: '3', name: 'Marathon 2026', desc: 'Bakı marafonuna hazırlıq qrupu', members: 450 }
                ].map(group => (
                  <div key={group.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="font-bold text-[#0A0A0A] dark:text-white text-lg">{group.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{group.desc}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-bold text-gray-400">{group.members} üzv</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (joinedGroups.includes(group.id)) {
                          setSelectedGroupChat(group);
                        } else {
                          setJoinedGroups(prev => [...prev, group.id]);
                          // Initialize empty messages if none exist
                          if (!groupMessages[group.id]) {
                            setGroupMessages(prev => ({ ...prev, [group.id]: [] }));
                          }
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-transform active:scale-[0.98] ${
                        joinedGroups.includes(group.id)
                          ? 'bg-emerald-50 text-[#00C16A] shadow-none border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800'
                          : 'bg-[#00C16A] text-white shadow-[#00C16A]/20'
                      }`}
                    >
                      {joinedGroups.includes(group.id)
                        ? (language === 'az' ? 'Aç' : language === 'en' ? 'Open' : language === 'tr' ? 'Aç' : 'Открыть')
                        : (language === 'az' ? 'Qoşul' : language === 'en' ? 'Join' : language === 'tr' ? 'Katıl' : 'Присоединиться')}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Status */}
      <AnimatePresence>
        {activeTab === 'wew' && wewJoined && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[84px] left-0 right-0 px-4 z-40 pointer-events-none"
          >
            <div className="bg-amber-500 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between border-2 border-amber-400 pointer-events-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🎓</div>
                <div>
                  <h4 className="font-bold text-sm text-amber-50">Sənin Universitetin</h4>
                  <p className="font-black text-lg leading-tight">{selectedUni}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-100 uppercase tracking-wide">Reytinq</div>
                <div className="font-black text-xl">#{wewLeaderboard.find(u => u.name === selectedUni)?.rank || '42'} <span className="text-sm font-semibold opacity-90 ml-1">Top 5%</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Friend Profile Overlay */}
      <AnimatePresence>
        {selectedFriendProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/40 backdrop-blur-sm"
            onClick={() => setSelectedFriendProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <div className="h-32 bg-gradient-to-tr from-[#00C16A] to-emerald-400 relative">
                <button
                  onClick={() => setSelectedFriendProfile(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-6 pb-6 relative pt-12 text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-xl">
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    {selectedFriendProfile.avatar.startsWith('data:image') || selectedFriendProfile.avatar.startsWith('http') ? (
                      <img src={selectedFriendProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      selectedFriendProfile.avatar
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-2">{selectedFriendProfile.name}</h2>
                <div className="inline-flex items-center space-x-1.5 mt-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                  <MapPin className="w-4 h-4 text-[#00C16A]" />
                  <span className="text-sm font-bold text-[#00C16A]">Bakı</span>
                </div>
                
                {selectedFriendProfile.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm px-4">
                    {selectedFriendProfile.bio}
                  </p>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">{((selectedFriendProfile.id % 5) * 1.5 + 2).toFixed(1)}k</p>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Aylıq Addım</p>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-gray-800"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0A0A0A] dark:text-white">#{(selectedFriendProfile.id * 7 % 100) + 1}</p>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Reytinq</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setFollowingFriends(prev => 
                      prev.includes(selectedFriendProfile.id) 
                        ? prev.filter(id => id !== selectedFriendProfile.id) 
                        : [...prev, selectedFriendProfile.id]
                    );
                  }}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    followingFriends.includes(selectedFriendProfile.id)
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      : 'bg-gradient-to-r from-[#00C16A] to-emerald-500 text-white shadow-lg shadow-[#00C16A]/20'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>
                    {followingFriends.includes(selectedFriendProfile.id)
                      ? (language === 'az' ? 'İzləyirsən' : language === 'en' ? 'Following' : language === 'tr' ? 'Takip Ediyorsun' : 'Вы подписаны')
                      : (language === 'az' ? 'İzlə' : language === 'en' ? 'Follow' : language === 'tr' ? 'Takip Et' : 'Подписаться')}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/40 backdrop-blur-sm"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#0A0A0A] dark:text-white">
                  {language === 'az' ? 'Premium Qrup Yarat' : language === 'en' ? 'Create Premium Group' : language === 'tr' ? 'Premium Grup Oluştur' : 'Создать премиум-группу'}
                </h3>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors text-gray-500"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-[#0A0A0A] dark:text-gray-300 block mb-2">Qrup Adı</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="Məs: Səhər Qaçışçıları"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#0A0A0A] dark:text-gray-300 block mb-2">Təsvir</label>
                  <textarea
                    value={groupDesc}
                    onChange={e => setGroupDesc(e.target.value)}
                    placeholder="Qrupun məqsədi və fəaliyyət planı..."
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mt-2">
                  <div className="flex items-center space-x-2 text-[#00C16A] mb-1">
                    <Crown className="w-4 h-4" />
                    <span className="font-bold text-sm">Premium İmtizaylar</span>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-emerald-100/70 space-y-1 ml-6 list-disc mt-2">
                    <li>Limitsiz üzv qəbulu</li>
                    <li>Özəl yarışlar təşkil etmək</li>
                    <li>Qrup liderlövhəsi</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (groupName.trim()) {
                      const newGroupId = Date.now().toString();
                      setCreatedGroups(prev => [...prev, { id: newGroupId, name: groupName, desc: groupDesc, members: 1 }]);
                      setJoinedGroups(prev => [...prev, newGroupId]);
                      setGroupMessages(prev => ({ ...prev, [newGroupId]: [{ text: 'Qrup yaradıldı. Salam deyin!', sender: 'System', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }));
                      setShowCreateGroup(false);
                      setGroupName('');
                      setGroupDesc('');
                    }
                  }}
                  disabled={!groupName.trim()}
                  className="w-full bg-[#00C16A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#00C16A]/20 mt-4"
                >
                  Yarat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Chat Modal */}
      <AnimatePresence>
        {selectedGroupChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/60 backdrop-blur-sm"
            onClick={() => setSelectedGroupChat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-50 dark:bg-gray-900 rounded-3xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800"
            >
              <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white">{selectedGroupChat.name}</h3>
                  <p className="text-xs text-[#00C16A] font-bold">{selectedGroupChat.members} üzv</p>
                </div>
                <button
                  onClick={() => setSelectedGroupChat(null)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors text-gray-500"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(groupMessages[selectedGroupChat.id] || []).map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-gray-500">{msg.sender}</span>
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${msg.sender === 'System' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mx-auto text-center' : msg.isMe ? 'bg-[#00C16A] text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-[#0A0A0A] dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && chatMessage.trim()) {
                        const newMsg = { text: chatMessage.trim(), sender: userProfile.name || 'Mən', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
                        setGroupMessages(prev => ({ ...prev, [selectedGroupChat.id]: [...(prev[selectedGroupChat.id] || []), newMsg] }));
                        setChatMessage('');
                      }
                    }}
                    placeholder={language === 'az' ? 'Mesaj yazın...' : language === 'en' ? 'Type a message...' : language === 'tr' ? 'Mesaj yazın...' : 'Введите сообщение...'}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-[#0A0A0A] dark:text-white outline-none focus:border-[#00C16A] transition-colors"
                  />
                  <button 
                    onClick={() => {
                      if (chatMessage.trim()) {
                        const newMsg = { text: chatMessage.trim(), sender: userProfile.name || 'Mən', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
                        setGroupMessages(prev => ({ ...prev, [selectedGroupChat.id]: [...(prev[selectedGroupChat.id] || []), newMsg] }));
                        setChatMessage('');
                      }
                    }}
                    disabled={!chatMessage.trim()}
                    className="w-12 h-12 bg-[#00C16A] disabled:opacity-50 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#00C16A]/20 transition-transform active:scale-[0.95]"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

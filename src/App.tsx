import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Screen, UserProfileType } from './types';
import { Language } from './translations';
import { stories as initialStories } from './data';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import MapScreen from './screens/MapScreen';
import Social from './screens/Social';
import Profile from './screens/Profile';
import StoreDetail from './screens/StoreDetail';
import Stores from './screens/Stores';
import Withdraw from './screens/Withdraw';
import QRScanner from './screens/QRScanner';
import History from './screens/History';
import Referral from './screens/Referral';
import StepifyCard from './screens/StepifyCard';
import CreateStory from './screens/CreateStory';
import Marketplace from './screens/Marketplace';
import Settings from './screens/Settings';
import StepiChat from './screens/StepiChat';
import StoryViewer from './screens/StoryViewer';
import Events from './screens/Events';
import Premium from './screens/Premium';
import Recipes from './screens/Recipes';
import Messages from './screens/Messages';
import BottomNav from './components/BottomNav';

import Collection from './screens/Collection';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [steps, setSteps] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(1);
  const [selectedStoryId, setSelectedStoryId] = useState<number>(1);
  const [shareLocation, setShareLocation] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('az');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [realMoneyBalance, setRealMoneyBalance] = useState<number>(0.00);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    name: 'İstifadəçi',
    avatar: '👦',
    discoveredDistricts: []
  });
  const [userGoals, setUserGoals] = useState({
    daily: 10000,
    weekly: 70000,
    monthly: 300000
  });
  const [appStories, setAppStories] = useState(initialStories);
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([2]);
  const [challengedFriends, setChallengedFriends] = useState<number[]>([]);
  const [showAILabel, setShowAILabel] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      setShowAILabel(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setShowAILabel(true);
      }, 2000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    // Initial timer
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    // Simulating database deactivation - direct entry
    setUserId('dummy-user-id');
    setIsAuthReady(true);
    
    // Only redirect to login if we are not on onboarding or register
    if (currentScreen !== 'onboarding' && currentScreen !== 'register' && currentScreen === 'login') {
      // Keep it on login so the user can click the button
    }
  }, []);

  useEffect(() => {
    if (isAuthReady && userId) {
      // Simulating database deactivation - load dummy data
      setSteps(0);
      setCoins(0);
      setIsPremium(false);
      setUserProfile(prev => ({
        ...prev,
        name: 'Test İstifadəçi',
        avatar: '👦'
      }));
    }
  }, [isAuthReady, userId]);

  // Sync steps and coins to Firestore when they change (debounced or simple for now)
  useEffect(() => {
    if (isAuthReady && userId && (steps > 0 || coins > 0)) {
      // Simulating database deactivation - no sync needed
    }
  }, [steps, coins, isAuthReady, userId]);

  const handleLogout = async () => {
    setSteps(0);
    setCoins(0);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentScreen('login')} />;
      case 'login':
        return <Login navigate={setCurrentScreen} />;
      case 'register':
        return <Register navigate={setCurrentScreen} />;
      case 'home':
        return <Home navigate={setCurrentScreen} steps={steps} setSteps={setSteps} coins={coins} setCoins={setCoins} onSelectStory={setSelectedStoryId} onSelectStore={setSelectedStoreId} language={language} userProfile={userProfile} appStories={appStories} userGoals={userGoals} setUserGoals={setUserGoals} isPremium={isPremium} />;
      case 'map':
        return <MapScreen onSelectStore={(id) => { setSelectedStoreId(id); setCurrentScreen('store'); }} shareLocation={shareLocation} language={language} userProfile={userProfile} setUserProfile={setUserProfile} setCoins={setCoins} />;
      case 'leaderboard':
        return <Social language={language} userProfile={userProfile} steps={steps} navigate={setCurrentScreen} joinedChallenges={joinedChallenges} setJoinedChallenges={setJoinedChallenges} challengedFriends={challengedFriends} setChallengedFriends={setChallengedFriends} isPremium={isPremium} />;
      case 'profile':
        return <Profile navigate={setCurrentScreen} coins={coins} steps={steps} onLogout={handleLogout} language={language} userProfile={userProfile} setUserProfile={setUserProfile} userGoals={userGoals} setUserGoals={setUserGoals} isPremium={isPremium} realMoneyBalance={realMoneyBalance} />;
      case 'store':
        return <StoreDetail navigate={setCurrentScreen} coins={coins} setCoins={setCoins} storeId={selectedStoreId} language={language} />;
      case 'stores':
        return <Stores navigate={setCurrentScreen} onSelectStore={setSelectedStoreId} language={language} />;
      case 'withdraw':
        return <Withdraw navigate={setCurrentScreen} coins={coins} setCoins={setCoins} language={language} isPremium={isPremium} realMoneyBalance={realMoneyBalance} setRealMoneyBalance={setRealMoneyBalance} />;
      case 'qr-scanner':
        return <QRScanner navigate={setCurrentScreen} setCoins={setCoins} language={language} />;
      case 'history':
        return <History navigate={setCurrentScreen} coins={coins} language={language} />;
      case 'referral':
        return <Referral navigate={setCurrentScreen} setCoins={setCoins} language={language} />;
      case 'stepify-card':
        return <StepifyCard navigate={setCurrentScreen} coins={coins} language={language} />;
      case 'create-story':
        return <CreateStory navigate={setCurrentScreen} steps={steps} setCoins={setCoins} language={language} userProfile={userProfile} setAppStories={setAppStories} />;
      case 'marketplace':
        return <Marketplace navigate={setCurrentScreen} coins={coins} setCoins={setCoins} language={language} isPremium={isPremium} />;
      case 'settings':
        return <Settings navigate={setCurrentScreen} onLogout={handleLogout} shareLocation={shareLocation} setShareLocation={setShareLocation} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />;
      case 'stepi-chat':
        return <StepiChat navigate={setCurrentScreen} language={language} userProfile={userProfile} />;
      case 'story-viewer':
        return <StoryViewer navigate={setCurrentScreen} storyId={selectedStoryId} language={language} appStories={appStories} setAppStories={setAppStories} />;
      case 'events':
        return <Events navigate={setCurrentScreen} language={language} />;
      case 'premium':
        return <Premium navigate={setCurrentScreen} language={language} isPremium={isPremium} setIsPremium={setIsPremium} />;
      case 'recipes':
        return <Recipes navigate={setCurrentScreen} language={language} />;
      case 'messages':
        return <Messages navigate={setCurrentScreen} language={language} />;
      case 'collection':
        return <Collection navigate={setCurrentScreen} language={language} userProfile={userProfile} setCoins={setCoins} />;
      default:
        return <Home navigate={setCurrentScreen} steps={steps} setSteps={setSteps} coins={coins} setCoins={setCoins} onSelectStory={setSelectedStoryId} onSelectStore={setSelectedStoreId} language={language} userProfile={userProfile} appStories={appStories} userGoals={userGoals} setUserGoals={setUserGoals} isPremium={isPremium} />;
    }
  };

  const showBottomNav = ['home', 'map', 'marketplace', 'leaderboard', 'profile'].includes(currentScreen);

  return (
    <div className={`flex justify-center items-center min-h-[100dvh] sm:bg-gray-200 bg-[#F7F7F7] sm:py-8 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="w-full h-[100dvh] sm:h-[880px] sm:max-h-[min(100vh-4rem,932px)] sm:max-w-[430px] bg-[#F7F7F7] dark:bg-gray-900 sm:rounded-[3.5rem] relative overflow-hidden flex flex-col sm:border-[14px] sm:border-[#1E1E1E] sm:shadow-[0_0_0_1px_rgba(255,255,255,0.1),_0_20px_40px_rgba(0,0,0,0.2)] transition-colors">
        
        {/* Mobile Status Bar Mock (iPhone 17 Pro Max / Dynamic Island) */}
        <div className="hidden sm:flex absolute top-0 left-0 right-0 h-14 bg-transparent z-50 justify-between items-start px-8 pt-[14px] pointer-events-none">
          <span className="text-[14px] font-semibold text-black dark:text-white tracking-tight relative top-[1px]">9:41</span>
          
          {/* Dynamic Island */}
          <div className="w-[124px] h-[32px] bg-black dark:bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-between px-2 shadow-sm drop-shadow-md">
            {/* Camera sensor mock */}
            <div className="w-[11px] h-[11px] rounded-full bg-[#0a0a0a] border border-[#1a1a1a] shadow-inner ml-1.5"></div>
            {/* FaceID indicator mock */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] opacity-70 mr-2 flex items-center justify-center">
               <div className="w-1 h-1 rounded-full bg-green-500/20"></div>
            </div>
          </div>

          <div className="flex space-x-1.5 opacity-90 relative top-[1px] items-center">
            {/* Signal */}
            <div className="flex items-end space-x-[2px] h-[11px] pb-[1px]">
               <div className="w-[3px] h-1 bg-black dark:bg-white rounded-sm"></div>
               <div className="w-[3px] h-1.5 bg-black dark:bg-white rounded-sm"></div>
               <div className="w-[3px] h-2 bg-black dark:bg-white rounded-sm"></div>
               <div className="w-[3px] h-2.5 bg-black dark:bg-white rounded-sm"></div>
            </div>
            {/* Wifi */}
            <svg className="w-4 h-4 text-black dark:text-white relative bottom-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21L15.6 16.2C14.6 15.45 13.35 15 12 15C10.65 15 9.4 15.45 8.4 16.2L12 21ZM12 3C7.95 3 4.2 4.4 1.2 6.6L3 9C5.55 7.05 8.55 6 12 6C15.45 6 18.45 7.05 21 9L22.8 6.6C19.8 4.4 16.05 3 12 3ZM12 9C9.3 9 6.8 9.9 4.8 11.4L6.6 13.8C8.1 12.6 9.9 12 12 12C14.1 12 15.9 12.6 17.4 13.8L19.2 11.4C17.2 9.9 14.7 9 12 9Z"/></svg>
            {/* Battery */}
            <div className="w-[22px] h-[11px] border border-black dark:border-white rounded p-[1px] flex relative opacity-80">
              <div className="bg-black dark:bg-white w-[85%] h-full rounded-[1px]"></div>
              <div className="w-[2px] h-1 bg-black dark:bg-white absolute -right-[3px] top-1/2 -translate-y-1/2 rounded-r-[1px]"></div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {showBottomNav && (
          <>
            {/* Floating Stepi Chat Assistant Button */}
            <div className="absolute bottom-[65px] left-1/2 -translate-x-1/2 z-50 flex items-end justify-center pointer-events-none">
              <div className="bg-white dark:bg-gray-800 w-20 h-10 rounded-t-full relative flex justify-center pointer-events-auto border-t border-l border-r border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setCurrentScreen('stepi-chat')}
                  className="absolute bottom-1 w-14 h-14 bg-gradient-to-tr from-[#00C16A] to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-[#00C16A]/40 border-4 border-white dark:border-gray-800 transition-all duration-300 hover:scale-125 hover:-translate-y-2 active:scale-95 group"
                  title="AI Məşqçi"
                >
                  <div className="absolute inset-0 rounded-full bg-[#00C16A] opacity-20 animate-ping"></div>
                  <MessageCircle className="w-6 h-6 text-white relative z-10" />
                  
                  {/* Red Notification Badge with Count */}
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold border-2 border-white dark:border-gray-800 rounded-full z-20 shadow-sm animate-bounce">
                    2
                  </span>
                  
                  {/* Fading Label */}
                  <div className={`absolute -top-8 bg-black/80 text-white text-[10px] font-medium px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none whitespace-nowrap ${showAILabel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    AI Məşqçi
                    {/* Small triangle arrow at bottom */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-black/80"></div>
                  </div>
                </button>
              </div>
            </div>
            <BottomNav currentScreen={currentScreen} navigate={setCurrentScreen} language={language} />
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  storyId: number;
  language: Language;
  appStories: any[];
  setAppStories: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function StoryViewer({ navigate, storyId, language, appStories, setAppStories }: Props) {
  const [currentIndex, setCurrentIndex] = useState(appStories.findIndex(s => s.id === storyId) || 0);
  const [progress, setProgress] = useState(0);

  const currentStory = appStories[currentIndex];
  const liked = currentStory?.likedByMe || false;

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          handleNext();
          return 0;
        }
        return p + 2; // 5 seconds per story (50 * 100ms)
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < appStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('home');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update the story's like count in the global state
    const newStories = [...appStories];
    if (newStories[currentIndex]) {
      newStories[currentIndex] = {
        ...newStories[currentIndex],
        likes: newStories[currentIndex].likes + (liked ? -1 : 1),
        likedByMe: !liked
      };
      setAppStories(newStories);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={currentStory.image} 
          alt="Story" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      {/* Progress Bars */}
      <div className="absolute top-12 left-4 right-4 z-30 flex space-x-1">
        {appStories.map((s, idx) => (
          <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-16 left-4 right-4 z-30 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl border-2 border-[#00C16A] overflow-hidden">
            {currentStory.avatar.startsWith('data:image') || currentStory.avatar.startsWith('http') ? (
              <img src={currentStory.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              currentStory.avatar
            )}
          </div>
          <span className="text-white font-bold drop-shadow-md">{currentStory.user}</span>
        </div>
        <button onClick={() => navigate('home')} className="p-2 text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tap Areas */}
      <div className="absolute inset-0 z-20 flex">
        <div className="w-1/3 h-full" onClick={handlePrev}></div>
        <div className="w-2/3 h-full" onClick={handleNext}></div>
      </div>

      {/* Content & Actions */}
      <div className="absolute bottom-8 left-6 right-6 z-30 flex justify-between items-end pointer-events-none">
        <div className="flex-1 pr-4">
          <p className="text-white font-bold text-xl drop-shadow-lg">{currentStory.text}</p>
        </div>
        <div className="flex flex-col items-center space-y-1 pointer-events-auto">
          <button 
            onClick={handleLike}
            className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">
            {currentStory.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

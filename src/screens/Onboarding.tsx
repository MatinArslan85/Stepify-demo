import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from '../types';
import { StepiAvatar } from '../components/StepiAvatar';
import { ArrowRight, Activity, Coins, Gift } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Addım at, Sağlam qal",
      description: "Hər gün yeriyərək həm sağlamlığını qoru, həm də qazanmağa başla.",
      icon: <Activity className="w-24 h-24 text-[#00C16A]" />,
    },
    {
      title: "Coin Qazan",
      description: "Hər 1,000 addım sənə 5 Stepify Coin qazandırır. Daha çox gəz, daha çox qazan!",
      icon: <Coins className="w-24 h-24 text-[#00C16A]" />,
    },
    {
      title: "Endirim və ya Cash",
      description: "Qazandığın coinləri partnyor mağazalarda xərclə və ya real pula çevirib kartına çək.",
      icon: <Gift className="w-24 h-24 text-[#00C16A]" />,
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 p-6 relative transition-colors">
      <div className="flex justify-end pt-4">
        <button onClick={onComplete} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Keç
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-[#00C16A] opacity-10 dark:opacity-20 blur-2xl rounded-full scale-150"></div>
              {slides[step].icon}
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-4">{slides[step].title}</h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              {slides[step].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-8 flex flex-col items-center">
        <div className="flex space-x-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-[#00C16A]' : 'w-2 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-[#00C16A] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg shadow-[#00C16A]/30 active:scale-95 transition-transform"
        >
          <span>{step === slides.length - 1 ? "Başlayaq" : "Davam et"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

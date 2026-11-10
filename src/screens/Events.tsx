import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { Screen } from '../types';
import { events } from '../data';
import { translations, Language } from '../translations';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
}

export default function Events({ navigate, language }: Props) {
  const t = translations[language];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{t.events}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6 pb-24">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-[#00C16A] text-sm shadow-sm flex items-center transition-colors">
                +{event.coins} Coin
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-[#0A0A0A] dark:text-white mb-3">{event.title}</h3>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-[#00C16A]" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-[#00C16A]" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Users className="w-4 h-4 mr-2 text-[#00C16A]" />
                  {event.participants} {t.participants}
                </div>
              </div>
              
              <button className="w-full bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-md">
                {t.join}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

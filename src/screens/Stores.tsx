import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, MapPin, Tag } from 'lucide-react';
import { Screen, Language } from '../types';
import { stores } from '../data';

interface Props {
  navigate: (screen: Screen) => void;
  onSelectStore: (id: number) => void;
  language: Language;
}

export default function Stores({ navigate, onSelectStore, language }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: language === 'az' ? 'Hamısı' : language === 'en' ? 'All' : language === 'tr' ? 'Tümü' : 'Все' },
    { id: 'food', label: language === 'az' ? 'Sağlam Qida' : language === 'en' ? 'Healthy Food' : language === 'tr' ? 'Sağlıklı Gıda' : 'Здоровая еда' },
    { id: 'gym', label: language === 'az' ? 'İdman Zalları' : language === 'en' ? 'Gyms' : language === 'tr' ? 'Spor Salonları' : 'Спортзалы' },
    { id: 'health', label: language === 'az' ? 'Sağlamlıq' : language === 'en' ? 'Health' : language === 'tr' ? 'Sağlık' : 'Здоровье' },
  ];

  const filteredStores = stores.filter(store => {
    const matchesCategory = activeTab === 'all' || store.category === activeTab;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 border-b border-gray-100 dark:border-gray-700 z-10 transition-colors">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
          </button>
          <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{language === 'az' ? 'Mağazalar' : language === 'en' ? 'Stores' : language === 'tr' ? 'Mağazalar' : 'Магазины'}</h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C16A] transition-all"
            placeholder={language === 'az' ? 'Mağaza və ya kateqoriya axtar...' : language === 'en' ? 'Search store or category...' : language === 'tr' ? 'Mağaza veya kategori ara...' : 'Поиск магазина или категории...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 py-4 overflow-x-auto scrollbar-hide flex space-x-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === cat.id 
                ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A]' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4 pb-24">
        {filteredStores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => { onSelectStore(store.id); navigate('store'); }}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl transition-colors">
                {store.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#0A0A0A] dark:text-white">{store.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" /> {store.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#00C16A] font-bold text-sm flex items-center justify-end">
                <Tag className="w-3 h-3 mr-1" />
                {store.discount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md inline-block transition-colors">
                {store.coins} Coin
              </div>
            </div>
          </motion.div>
        ))}

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-2">{language === 'az' ? 'Nəticə tapılmadı' : language === 'en' ? 'No results found' : language === 'tr' ? 'Sonuç bulunamadı' : 'Ничего не найдено'}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{language === 'az' ? 'Axtarışınıza uyğun məkan yoxdur.' : language === 'en' ? 'No places match your search.' : language === 'tr' ? 'Aramanıza uygun mekan yok.' : 'Нет мест, соответствующих вашему поиску.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Leaf, CheckCircle2, Store, Dumbbell, Utensils, Crown, Percent, Search } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  language: Language;
  isPremium?: boolean;
}

export default function Marketplace({ navigate, coins, setCoins, language, isPremium = false }: Props) {
  const [activeTab, setActiveTab] = useState<'stepify' | 'partners' | 'gyms' | 'restaurants'>('stepify');
  const [purchasedId, setPurchasedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getDiscountedPrice = (price: number) => {
    return isPremium ? Math.floor(price * 0.8) : price; // 20% discount for premium
  };

  const stepifyProducts = [
    { id: 1, name: 'Optimum Nutrition Whey', desc: language === 'az' ? 'Protein tozu (900q)' : language === 'en' ? 'Protein powder (900g)' : language === 'tr' ? 'Protein tozu (900g)' : 'Протеиновый порошок (900г)', price: 2500, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500&auto=format&fit=crop' },
    { id: 2, name: 'Omega 3 Balıq Yağı', desc: language === 'az' ? 'Solgar (120 kapsul)' : language === 'en' ? 'Solgar (120 capsules)' : language === 'tr' ? 'Solgar (120 kapsül)' : 'Solgar (120 капсул)', price: 800, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500&auto=format&fit=crop' },
    { id: 3, name: 'Şəkərsiz Fıstıq Əzməsi', desc: language === 'az' ? 'Təbii (300q)' : language === 'en' ? 'Natural (300g)' : language === 'tr' ? 'Doğal (300g)' : 'Натуральная (300г)', price: 300, image: 'https://images.unsplash.com/photo-1599598425947-3300262b31b5?q=80&w=500&auto=format&fit=crop' },
  ];

  const partners = [
    { id: 4, name: 'Nike Store', desc: language === 'az' ? 'Bütün idman ayaqqabılarına 20% Endirim' : language === 'en' ? '20% off all sports shoes' : language === 'tr' ? 'Tüm spor ayakkabılarda %20 İndirim' : 'Скидка 20% на всю спортивную обувь', price: 1500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop' },
    { id: 5, name: 'Puma', desc: language === 'az' ? 'İdman geyimlərinə 15% Endirim' : language === 'en' ? '15% off sportswear' : language === 'tr' ? 'Spor giyimde %15 İndirim' : 'Скидка 15% на спортивную одежду', price: 1000, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500&auto=format&fit=crop' },
  ];

  const gyms = [
    { id: 6, name: 'FitLife Gym', desc: language === 'az' ? '1 Aylıq Limitsiz Abunəlik' : language === 'en' ? '1 Month Unlimited Membership' : language === 'tr' ? '1 Aylık Sınırsız Üyelik' : '1 месяц безлимитного абонемента', price: 5000, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop' },
    { id: 7, name: 'Iron Paradise', desc: language === 'az' ? 'Həftəsonu Giriş Bileti' : language === 'en' ? 'Weekend Entry Pass' : language === 'tr' ? 'Hafta Sonu Giriş Bileti' : 'Билет на выходные', price: 800, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop' },
  ];

  const restaurants = [
    { id: 8, name: 'GreenCafe', desc: language === 'az' ? 'Xüsusi Detox Menyusu' : language === 'en' ? 'Special Detox Menu' : language === 'tr' ? 'Özel Detoks Menüsü' : 'Специальное детокс-меню', price: 450, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop' },
    { id: 9, name: 'Keto Bowl', desc: language === 'az' ? 'Toyuq döşü, avokado, kinoa' : language === 'en' ? 'Chicken breast, avocado, quinoa' : language === 'tr' ? 'Tavuk göğsü, avokado, kinoa' : 'Куриная грудка, авокадо, киноа', price: 500, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop' },
  ];

  const getItems = () => {
    let items = [];
    switch (activeTab) {
      case 'stepify': items = stepifyProducts; break;
      case 'partners': items = partners; break;
      case 'gyms': items = gyms; break;
      case 'restaurants': items = restaurants; break;
      default: items = stepifyProducts;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      );
    }

    return items;
  };

  const handlePurchase = (id: number, price: number) => {
    const finalPrice = getDiscountedPrice(price);
    if (coins >= finalPrice) {
      setCoins(c => c - finalPrice);
      setPurchasedId(id);
      setTimeout(() => setPurchasedId(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 border-b border-gray-100 dark:border-gray-700 z-10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Marketplace</h1>
          <div className="bg-[#00C16A]/10 dark:bg-emerald-900/30 text-[#00C16A] px-3 py-1 rounded-full font-bold text-sm transition-colors flex items-center space-x-1">
            <span>{coins}</span>
            <span className="text-xs">Coin</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={language === 'az' ? 'Axtarış...' : language === 'en' ? 'Search...' : language === 'tr' ? 'Ara...' : 'Поиск...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C16A] focus:border-transparent transition-colors sm:text-sm"
          />
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('stepify')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'stepify' ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Stepify Market</span>
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'partners' ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{language === 'az' ? 'Partnyorlar' : language === 'en' ? 'Partners' : language === 'tr' ? 'Ortaklar' : 'Партнеры'}</span>
          </button>
          <button
            onClick={() => setActiveTab('gyms')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'gyms' ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{language === 'az' ? 'İdman Zalları' : language === 'en' ? 'Gyms' : language === 'tr' ? 'Spor Salonları' : 'Спортзалы'}</span>
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'restaurants' ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>{language === 'az' ? 'Restoranlar' : language === 'en' ? 'Restaurants' : language === 'tr' ? 'Restoranlar' : 'Рестораны'}</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6 pb-24">
        {isPremium && (
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 p-4 rounded-2xl mb-2 flex items-center space-x-3 border border-amber-200 dark:border-amber-800/50">
            <div className="bg-amber-500 p-2 rounded-full">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                {language === 'az' ? 'Premium Endirimi Aktivdir' : language === 'en' ? 'Premium Discount Active' : language === 'tr' ? 'Premium İndirimi Aktif' : 'Премиум скидка активна'}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {language === 'az' ? 'Bütün məhsullara 20% endirim!' : language === 'en' ? '20% off all products!' : language === 'tr' ? 'Tüm ürünlerde %20 indirim!' : 'Скидка 20% на все продукты!'}
              </p>
            </div>
          </div>
        )}

        {getItems().map((item, index) => {
          const finalPrice = getDiscountedPrice(item.price);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 relative transition-colors">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-[#0A0A0A] dark:text-white text-sm shadow-sm transition-colors flex items-center space-x-1">
                  {isPremium && (
                    <span className="text-xs text-gray-400 line-through mr-1">{item.price}</span>
                  )}
                  <span className={isPremium ? "text-amber-500" : ""}>{finalPrice} Coin</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mb-1">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{item.desc}</p>
                
                {purchasedId === item.id ? (
                  <div className="w-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{language === 'az' ? 'Sifariş edildi!' : language === 'en' ? 'Ordered!' : language === 'tr' ? 'Sipariş edildi!' : 'Заказано!'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={coins < finalPrice}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      coins >= finalPrice 
                        ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] active:scale-95 shadow-md' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {coins >= finalPrice ? (language === 'az' ? 'Əldə Et' : language === 'en' ? 'Get It' : language === 'tr' ? 'Elde Et' : 'Получить') : (language === 'az' ? 'Kifayət qədər coin yoxdur' : language === 'en' ? 'Not enough coins' : language === 'tr' ? 'Yeterli coin yok' : 'Недостаточно монет')}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

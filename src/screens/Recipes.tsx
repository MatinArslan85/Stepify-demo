import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Flame, Utensils, X } from 'lucide-react';
import { Screen, Language } from '../types';
import { translations } from '../translations';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
}

type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function Recipes({ navigate, language }: Props) {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<Category>('breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const recipes = [
    {
      id: 1,
      category: 'breakfast',
      title: language === 'az' ? 'Giləmeyvəli Yulaf Sıyığı' : language === 'en' ? 'Berry Oatmeal' : language === 'tr' ? 'Orman Meyveli Yulaf' : 'Овсянка с ягодами',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1476&auto=format&fit=crop',
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8,
      time: '10 min',
      ingredients: language === 'az' 
        ? ['50q yulaf əzməsi', '150ml badam südü', '1 x.q. bal', 'Yarım stəkan qarışıq giləmeyvə', '1 ç.q. çia toxumu']
        : language === 'en' ? ['50g rolled oats', '150ml almond milk', '1 tbsp honey', '1/2 cup mixed berries', '1 tsp chia seeds']
        : language === 'tr' ? ['50g yulaf ezmesi', '150ml badem sütü', '1 y.k. bal', 'Yarım bardak orman meyvesi', '1 ç.k. chia tohumu']
        : ['50г овсяных хлопьев', '150мл миндального молока', '1 ст.л. меда', 'Полстакана ягод', '1 ч.л. семян чиа'],
      instructions: language === 'az'
        ? 'Yulaf və südü qazanda orta odda 5 dəqiqə bişirin. Üzərinə giləmeyvə, bal və çia toxumu əlavə edib servis edin.'
        : language === 'en' ? 'Cook oats and milk in a pot over medium heat for 5 mins. Top with berries, honey, and chia seeds.'
        : language === 'tr' ? 'Yulaf ve sütü orta ateşte 5 dakika pişirin. Üzerine meyve, bal ve chia tohumu ekleyip servis yapın.'
        : 'Варите овсянку с молоком на среднем огне 5 минут. Добавьте ягоды, мед и семена чиа.'
    },
    {
      id: 2,
      category: 'breakfast',
      title: language === 'az' ? 'Avokado Tostu və Yumurta' : language === 'en' ? 'Avocado Toast & Egg' : language === 'tr' ? 'Avokado Tost ve Yumurta' : 'Авокадо-тост с яйцом',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1480&auto=format&fit=crop',
      calories: 410,
      protein: 18,
      carbs: 30,
      fat: 22,
      time: '15 min',
      ingredients: language === 'az' 
        ? ['2 dilim tam buğda çörəyi', '1 ədəd avokado', '2 ədəd yumurta', 'Duz, istiot, limon suyu']
        : language === 'en' ? ['2 slices whole wheat bread', '1 avocado', '2 eggs', 'Salt, pepper, lemon juice']
        : language === 'tr' ? ['2 dilim tam buğday ekmeği', '1 adet avokado', '2 adet yumurta', 'Tuz, karabiber, limon suyu']
        : ['2 ломтика цельнозернового хлеба', '1 авокадо', '2 яйца', 'Соль, перец, лимонный сок'],
      instructions: language === 'az'
        ? 'Çörəkləri qızardın. Avokadonu əzib limon suyu və ədviyyatlarla qarışdırın. Çörəyin üzərinə çəkin. Yumurtaları suda və ya az yağda bişirib üzərinə qoyun.'
        : language === 'en' ? 'Toast bread. Mash avocado with lemon juice and spices. Spread on toast. Cook eggs and place on top.'
        : language === 'tr' ? 'Ekmekleri kızartın. Avokadoyu ezip limon suyu ve baharatlarla karıştırın. Ekmeğe sürün. Yumurtaları pişirip üzerine ekleyin.'
        : 'Поджарьте хлеб. Разомните авокадо с лимонным соком и специями. Намажьте на тост. Приготовьте яйца и положите сверху.'
    },
    {
      id: 3,
      category: 'lunch',
      title: language === 'az' ? 'Qızardılmış Toyuq Salatı' : language === 'en' ? 'Grilled Chicken Salad' : language === 'tr' ? 'Izgara Tavuk Salatası' : 'Салат с курицей гриль',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
      calories: 380,
      protein: 45,
      carbs: 12,
      fat: 15,
      time: '20 min',
      ingredients: language === 'az' 
        ? ['150q toyuq döşü', 'Qarışıq göyərti', 'Çerri pomidor', 'Xiyar', '1 x.q. zeytun yağı', 'Limon suyu']
        : language === 'en' ? ['150g chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', '1 tbsp olive oil', 'Lemon juice']
        : language === 'tr' ? ['150g tavuk göğsü', 'Karışık yeşillik', 'Çeri domates', 'Salatalık', '1 y.k. zeytinyağı', 'Limon suyu']
        : ['150г куриной грудки', 'Смесь зелени', 'Помидоры черри', 'Огурец', '1 ст.л. оливкового масла', 'Лимонный сок'],
      instructions: language === 'az'
        ? 'Toyuq döşünü ədviyyatlayıb tavada qızardın. Tərəvəzləri doğrayın. Toyuğu dilimləyib salatın üzərinə əlavə edin. Zeytun yağı və limon suyu gəzdirin.'
        : language === 'en' ? 'Season and grill chicken. Chop vegetables. Slice chicken and add to salad. Dress with olive oil and lemon juice.'
        : language === 'tr' ? 'Tavuğu baharatlayıp ızgarada pişirin. Sebzeleri doğrayın. Tavuğu dilimleyip salataya ekleyin. Zeytinyağı ve limon suyu gezdirin.'
        : 'Приправьте и обжарьте курицу. Нарежьте овощи. Нарежьте курицу и добавьте в салат. Заправьте оливковым маслом и лимонным соком.'
    },
    {
      id: 4,
      category: 'dinner',
      title: language === 'az' ? 'Kinoa ilə Qızılbalıq' : language === 'en' ? 'Salmon with Quinoa' : language === 'tr' ? 'Kinoalı Somon' : 'Лосось с киноа',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1374&auto=format&fit=crop',
      calories: 520,
      protein: 42,
      carbs: 35,
      fat: 24,
      time: '25 min',
      ingredients: language === 'az' 
        ? ['150q qızılbalıq', '50q kinoa', 'Brokkoli', 'Zeytun yağı', 'Limon', 'Sarımsaq']
        : language === 'en' ? ['150g salmon', '50g quinoa', 'Broccoli', 'Olive oil', 'Lemon', 'Garlic']
        : language === 'tr' ? ['150g somon', '50g kinoa', 'Brokoli', 'Zeytinyağı', 'Limon', 'Sarımsak']
        : ['150г лосося', '50г киноа', 'Брокколи', 'Оливковое масло', 'Лимон', 'Чеснок'],
      instructions: language === 'az'
        ? 'Kinoanı qaynadın. Qızılbalığı sarımsaq, limon və zeytun yağı ilə marinad edib sobada 200 dərəcədə 15 dəqiqə bişirin. Brokkolini buxarda bişirib birlikdə servis edin.'
        : language === 'en' ? 'Boil quinoa. Marinate salmon with garlic, lemon, and olive oil, bake at 200°C for 15 mins. Steam broccoli and serve together.'
        : language === 'tr' ? 'Kinoayı haşlayın. Somonu sarımsak, limon ve zeytinyağı ile marine edip fırında 200 derecede 15 dakika pişirin. Brokoliyi buharda pişirip birlikte servis yapın.'
        : 'Отварите киноа. Замаринуйте лосось с чесноком, лимоном и оливковым маслом, запекайте при 200°C 15 минут. Приготовьте брокколи на пару и подавайте вместе.'
    },
    {
      id: 5,
      category: 'snack',
      title: language === 'az' ? 'Alma və Fıstıq Əzməsi' : language === 'en' ? 'Apple & Peanut Butter' : language === 'tr' ? 'Elma ve Fıstık Ezmesi' : 'Яблоко с арахисовой пастой',
      image: 'https://images.unsplash.com/photo-1568158879083-c42860933241?q=80&w=1470&auto=format&fit=crop',
      calories: 200,
      protein: 6,
      carbs: 25,
      fat: 10,
      time: '5 min',
      ingredients: language === 'az' 
        ? ['1 ədəd alma', '2 x.q. şəkərsiz fıstıq əzməsi', 'Darçın (istəyə görə)']
        : language === 'en' ? ['1 apple', '2 tbsp unsweetened peanut butter', 'Cinnamon (optional)']
        : language === 'tr' ? ['1 adet elma', '2 y.k. şekersiz fıstık ezmesi', 'Tarçın (isteğe bağlı)']
        : ['1 яблоко', '2 ст.л. арахисовой пасты без сахара', 'Корица (по желанию)'],
      instructions: language === 'az'
        ? 'Almanı dilimləyin. Üzərinə fıstıq əzməsi çəkin və darçın səpin.'
        : language === 'en' ? 'Slice the apple. Spread peanut butter on slices and sprinkle with cinnamon.'
        : language === 'tr' ? 'Elmayı dilimleyin. Üzerine fıstık ezmesi sürün ve tarçın serpin.'
        : 'Нарежьте яблоко. Намажьте арахисовой пастой и посыпьте корицей.'
    }
  ];

  const filteredRecipes = recipes.filter(r => r.category === activeCategory);

  const categories: { id: Category; label: string }[] = [
    { id: 'breakfast', label: t.breakfast || 'Breakfast' },
    { id: 'lunch', label: t.lunch || 'Lunch' },
    { id: 'dinner', label: t.dinner || 'Dinner' },
    { id: 'snack', label: t.snack || 'Snack' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <div className="ml-2">
          <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white">{t.recipes}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.recipesDesc}</p>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-[#00C16A] text-white shadow-md shadow-[#00C16A]/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-24 space-y-4">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
              <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0A0A0A] dark:text-white flex items-center shadow-sm">
                <Clock className="w-3 h-3 mr-1 text-[#00C16A]" />
                {recipe.time}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mb-2">{recipe.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Flame className="w-4 h-4 mr-1 text-orange-500" />
                  {recipe.calories} {t.calories}
                </div>
                <div className="flex items-center">
                  <Utensils className="w-4 h-4 mr-1 text-blue-500" />
                  {recipe.protein}g {t.protein}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="relative h-64 flex-shrink-0">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedRecipe.title}</h2>
                  <div className="flex items-center space-x-4 text-white/90 text-sm">
                    <div className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-400" /> {selectedRecipe.calories} {t.calories}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-[#00C16A]" /> {selectedRecipe.time}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Macros */}
                <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl mb-6 border border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.protein}</div>
                    <div className="font-bold text-[#0A0A0A] dark:text-white">{selectedRecipe.protein}g</div>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.carbs}</div>
                    <div className="font-bold text-[#0A0A0A] dark:text-white">{selectedRecipe.carbs}g</div>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.fat}</div>
                    <div className="font-bold text-[#0A0A0A] dark:text-white">{selectedRecipe.fat}g</div>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mb-3">{t.ingredients}</h3>
                <ul className="space-y-2 mb-6">
                  {selectedRecipe.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C16A] mr-3"></div>
                      {ing}
                    </li>
                  ))}
                </ul>

                <h3 className="font-bold text-lg text-[#0A0A0A] dark:text-white mb-3">{t.instructions}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {selectedRecipe.instructions}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

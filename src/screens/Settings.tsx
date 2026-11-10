import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Lock, Shield, HelpCircle, Mail, Globe, ChevronRight, MapPin, X, Moon, Sun } from 'lucide-react';
import { Screen } from '../types';
import { translations, Language } from '../translations';

interface Props {
  navigate: (screen: Screen) => void;
  onLogout: () => void;
  shareLocation: boolean;
  setShareLocation: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (val: 'light' | 'dark') => void;
  language: Language;
  setLanguage: (val: Language) => void;
}

export default function Settings({ navigate, onLogout, shareLocation, setShareLocation, theme, setTheme, language, setLanguage }: Props) {
  const t = translations[language];
  const [notifications, setNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  // Modals for Support section
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.passwordSuccess);
    setShowPasswordModal(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mesajınız uğurla göndərildi!");
    setShowContact(false);
  };

  const languageMap: Record<Language, string> = {
    az: 'Azərbaycan',
    en: 'English',
    tr: 'Türkçe',
    ru: 'Русский'
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 relative transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{t.settings}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6 pb-24">
        
        {/* Account Settings */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">{t.account}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div 
              onClick={() => setShowPasswordModal(true)}
              className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.changePassword}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
            </div>
            <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.notifications}</span>
              </div>
              <div 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-[#00C16A]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div 
                  animate={{ x: notifications ? 24 : 0 }} 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.shareLocation}</span>
              </div>
              <div 
                onClick={() => setShareLocation(!shareLocation)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${shareLocation ? 'bg-[#00C16A]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div 
                  animate={{ x: shareLocation ? 24 : 0 }} 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.theme}</span>
              </div>
              <div 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-[#00C16A]' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div 
                  animate={{ x: theme === 'dark' ? 24 : 0 }} 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </div>
            <div 
              onClick={() => setShowLanguageModal(true)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{languageMap[language]}</span>
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Support & About */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">{t.support}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div 
              onClick={() => setShowFAQ(true)}
              className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.faq}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
            </div>
            <div 
              onClick={() => setShowContact(true)}
              className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.contact}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
            </div>
            <div 
              onClick={() => setShowPrivacy(true)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-semibold text-[#0A0A0A] dark:text-white">{t.privacy}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform"
          >
            {t.logout}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">Stepify v5.0.1</p>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{t.changePassword}</h2>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.oldPassword}</label>
                  <input type="password" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#00C16A] dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.newPassword}</label>
                  <input type="password" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#00C16A] dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.newPasswordRepeat}</label>
                  <input type="password" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#00C16A] dark:text-white" />
                </div>
                <button type="submit" className="w-full bg-[#00C16A] text-white py-3 rounded-xl font-bold mt-2">
                  {t.confirm}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{t.languageSelection}</h2>
                <button onClick={() => setShowLanguageModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-2">
                {(Object.entries(languageMap) as [Language, string][]).map(([langKey, langName]) => (
                  <div 
                    key={langKey}
                    onClick={() => { setLanguage(langKey); setShowLanguageModal(false); }}
                    className={`p-4 rounded-xl cursor-pointer font-medium transition-colors ${language === langKey ? 'bg-emerald-50 dark:bg-emerald-900/30 text-[#00C16A]' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    {langName}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{t.faq}</h2>
                <button onClick={() => setShowFAQ(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Addımlar necə hesablanır?' : language === 'en' ? 'How are steps calculated?' : language === 'tr' ? 'Adımlar nasıl hesaplanır?' : 'Как рассчитываются шаги?'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{language === 'az' ? 'Telefonunuzun daxili sensorları vasitəsilə addımlarınız avtomatik olaraq qeydə alınır.' : language === 'en' ? 'Your steps are automatically recorded via your phone\'s internal sensors.' : language === 'tr' ? 'Adımlarınız telefonunuzun dahili sensörleri aracılığıyla otomatik olarak kaydedilir.' : 'Ваши шаги автоматически записываются с помощью внутренних датчиков вашего телефона.'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Coinləri necə xərcləyə bilərəm?' : language === 'en' ? 'How can I spend coins?' : language === 'tr' ? 'Coinleri nasıl harcayabilirim?' : 'Как я могу потратить монеты?'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{language === 'az' ? 'Marketplace bölməsində müxtəlif məhsullar və ya endirimlər əldə etmək üçün istifadə edə bilərsiniz.' : language === 'en' ? 'You can use them to get various products or discounts in the Marketplace section.' : language === 'tr' ? 'Marketplace bölümünde çeşitli ürünler veya indirimler almak için kullanabilirsiniz.' : 'Вы можете использовать их для получения различных продуктов или скидок в разделе Marketplace.'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0A0A0A] dark:text-white">{language === 'az' ? 'Məkanımı kimlər görə bilər?' : language === 'en' ? 'Who can see my location?' : language === 'tr' ? 'Konumumu kimler görebilir?' : 'Кто может видеть мое местоположение?'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{language === 'az' ? 'Yalnız dostluq siyahınızda olan şəxslər məkanınızı görə bilər. Bunu tənzimləmələrdən bağlaya bilərsiniz.' : language === 'en' ? 'Only people on your friend list can see your location. You can turn this off in settings.' : language === 'tr' ? 'Sadece arkadaş listenizdeki kişiler konumunuzu görebilir. Bunu ayarlardan kapatabilirsiniz.' : 'Только люди из вашего списка друзей могут видеть ваше местоположение. Вы можете отключить это в настройках.'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{t.contact}</h2>
                <button onClick={() => setShowContact(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{language === 'az' ? 'Mövzu' : language === 'en' ? 'Subject' : language === 'tr' ? 'Konu' : 'Тема'}</label>
                  <input type="text" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#00C16A] dark:text-white" placeholder={language === 'az' ? 'Məsələn: Texniki problem' : language === 'en' ? 'Example: Technical issue' : language === 'tr' ? 'Örnek: Teknik sorun' : 'Пример: Техническая проблема'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{language === 'az' ? 'Mesajınız' : language === 'en' ? 'Your message' : language === 'tr' ? 'Mesajınız' : 'Ваше сообщение'}</label>
                  <textarea required rows={4} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#00C16A] dark:text-white resize-none" placeholder={language === 'az' ? 'Mesajınızı bura yazın...' : language === 'en' ? 'Write your message here...' : language === 'tr' ? 'Mesajınızı buraya yazın...' : 'Напишите ваше сообщение здесь...'}></textarea>
                </div>
                <button type="submit" className="w-full bg-[#00C16A] text-white py-3 rounded-xl font-bold mt-2">
                  {language === 'az' ? 'Göndər' : language === 'en' ? 'Send' : language === 'tr' ? 'Gönder' : 'Отправить'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">{t.privacy}</h2>
                <button onClick={() => setShowPrivacy(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>{language === 'az' ? '1. Məlumatların Toplanması:' : language === 'en' ? '1. Data Collection:' : language === 'tr' ? '1. Veri Toplama:' : '1. Сбор данных:'}</strong> {language === 'az' ? 'Biz sizin addım sayınızı, məkan məlumatlarınızı (əgər icazə vermisinizsə) və profil məlumatlarınızı toplayırıq.' : language === 'en' ? 'We collect your step count, location data (if permitted), and profile information.' : language === 'tr' ? 'Adım sayınızı, konum verilerinizi (izin verdiyseniz) ve profil bilgilerinizi topluyoruz.' : 'Мы собираем количество ваших шагов, данные о местоположении (если разрешено) и информацию профиля.'}
                </p>
                <p>
                  <strong>{language === 'az' ? '2. Məlumatların İstifadəsi:' : language === 'en' ? '2. Data Usage:' : language === 'tr' ? '2. Veri Kullanımı:' : '2. Использование данных:'}</strong> {language === 'az' ? 'Toplanan məlumatlar sizə daha yaxşı xidmət göstərmək, reytinqləri hesablamaq və fərdi təkliflər sunmaq üçün istifadə olunur.' : language === 'en' ? 'Collected data is used to provide you with better service, calculate rankings, and offer personalized suggestions.' : language === 'tr' ? 'Toplanan veriler size daha iyi hizmet sunmak, sıralamaları hesaplamak ve kişiselleştirilmiş öneriler sunmak için kullanılır.' : 'Собранные данные используются для предоставления вам лучшего обслуживания, расчета рейтингов и предложения персонализированных рекомендаций.'}
                </p>
                <p>
                  <strong>{language === 'az' ? '3. Üçüncü Tərəflərlə Paylaşım:' : language === 'en' ? '3. Sharing with Third Parties:' : language === 'tr' ? '3. Üçüncü Taraflarla Paylaşım:' : '3. Обмен с третьими лицами:'}</strong> {language === 'az' ? 'Sizin şəxsi məlumatlarınız heç bir halda üçüncü tərəflərə satılmır və ya icazəniz olmadan paylaşılmır.' : language === 'en' ? 'Your personal information is never sold to third parties or shared without your permission.' : language === 'tr' ? 'Kişisel bilgileriniz hiçbir durumda üçüncü taraflara satılmaz veya izniniz olmadan paylaşılmaz.' : 'Ваша личная информация ни при каких обстоятельствах не продается третьим лицам и не передается без вашего разрешения.'}
                </p>
                <p>
                  <strong>{language === 'az' ? '4. Təhlükəsizlik:' : language === 'en' ? '4. Security:' : language === 'tr' ? '4. Güvenlik:' : '4. Безопасность:'}</strong> {language === 'az' ? 'Məlumatlarınızın təhlükəsizliyini təmin etmək üçün müasir şifrələmə texnologiyalarından istifadə edirik.' : language === 'en' ? 'We use modern encryption technologies to ensure the security of your data.' : language === 'tr' ? 'Verilerinizin güvenliğini sağlamak için modern şifreleme teknolojileri kullanıyoruz.' : 'Мы используем современные технологии шифрования для обеспечения безопасности ваших данных.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

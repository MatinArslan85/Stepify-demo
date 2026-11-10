import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { Screen } from '../types';
import { auth, googleProvider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: Screen) => void;
}

export default function Register({ navigate }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Zəhmət olmasa, adınızı daxil edin.");
      return;
    }
    if (!email.trim()) {
      setError("Zəhmət olmasa, e-poçt ünvanınızı daxil edin.");
      return;
    }
    if (password.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }
    if (!agreed) {
      setError("Zəhmət olmasa, istifadəçi razılaşmasını qəbul edin.");
      return;
    }

    setError('');
    setLoading(true);
    
    // Simulating database deactivation - direct entry
    setTimeout(() => {
      setLoading(false);
      navigate('home');
    }, 1000);
  };

  const handleGoogleRegister = async () => {
    if (!agreed) {
      setError("Zəhmət olmasa, istifadəçi razılaşmasını qəbul edin.");
      return;
    }
    setError('');
    setLoading(true);
    
    // Simulating database deactivation - direct entry
    setTimeout(() => {
      setLoading(false);
      navigate('home');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 p-6 relative transition-colors">
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-[#0A0A0A] dark:text-white mb-2">Hesab Yarat</h1>
          <p className="text-gray-500 dark:text-gray-400">Stepify ailəsinə qoşulun və qazanmağa başlayın.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleRegister} 
          className="space-y-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C16A] focus:border-transparent transition-all"
              placeholder="Ad və Soyad"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C16A] focus:border-transparent transition-all"
              placeholder="E-poçt ünvanı"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C16A] focus:border-transparent transition-all"
              placeholder="Şifrə"
              required
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <div 
              className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors mt-0.5 ${agreed ? 'bg-[#00C16A] border-[#00C16A]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && <Check className="w-4 h-4 text-white" />}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
              Mən{' '}
              <button 
                type="button" 
                onClick={() => setShowTerms(true)}
                className="text-[#00C16A] font-semibold hover:underline"
              >
                İstifadəçi Razılaşmasını
              </button>{' '}
              oxudum və qəbul edirəm.
            </p>
          </div>

          <button
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg transition-transform mt-8 ${agreed ? 'bg-[#00C16A] text-white shadow-[#00C16A]/30 active:scale-95' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
          >
            <span>{loading ? 'Qeydiyyatdan keçilir...' : 'Qeydiyyatdan keç'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm">və ya</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#0A0A0A] dark:text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 shadow-sm active:scale-95 transition-transform disabled:opacity-70"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span>Google ilə qeydiyyatdan keç</span>
          </button>
        </motion.form>
      </div>

      <div className="pb-8 text-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Artıq hesabınız var?{' '}
          <button onClick={() => navigate('login')} className="font-bold text-[#0A0A0A] dark:text-white hover:underline">
            Daxil olun
          </button>
        </p>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
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
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-bold text-lg text-[#0A0A0A] dark:text-white">İstifadəçi Razılaşması</h2>
                <button onClick={() => setShowTerms(false)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 space-y-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Bu razılaşma Azərbaycan Respublikasının qanunvericiliyinə əsasən tənzimlənir.</p>
                
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">1. Ümumi Müddəalar</h3>
                  <p>Stepify tətbiqi istifadəçilərin fiziki aktivliyini izləmək və mükafatlandırmaq məqsədi daşıyır.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">2. Şəxsi Məlumatların Qorunması</h3>
                  <p>İstifadəçinin şəxsi məlumatları (ad, e-poçt, məkan) "Fərdi məlumatlar haqqında" Azərbaycan Respublikasının Qanununa uyğun olaraq qorunur və üçüncü tərəflərə ötürülmür.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">3. Məkan Məlumatları</h3>
                  <p>Tətbiq addımları hesablamaq və xəritə funksiyalarını təmin etmək üçün məkan məlumatlarından istifadə edir. İstifadəçi bu məlumatların toplanmasına razılıq verir.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">4. Məsuliyyət</h3>
                  <p>Stepify tətbiqi istifadəçinin sağlamlıq vəziyyətinə görə məsuliyyət daşımır. Tətbiqdən istifadə edərkən öz fiziki imkanlarınızı nəzərə almalısınız.</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">5. Razılaşmanın Dəyişdirilməsi</h3>
                  <p>Stepify rəhbərliyi bu razılaşmaya birtərəfli qaydada dəyişiklik etmək hüququna malikdir. Dəyişikliklər tətbiq daxilində elan ediləcək.</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <button 
                  onClick={() => { setAgreed(true); setShowTerms(false); }}
                  className="bg-[#00C16A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00a85d] transition-colors"
                >
                  Qəbul Edirəm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

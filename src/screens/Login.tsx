import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Screen } from '../types';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: Screen) => void;
}

export default function Login({ navigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Zəhmət olmasa, e-poçt və şifrənizi daxil edin.");
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

  const handleGoogleLogin = async () => {
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
          <div className="w-20 h-20 bg-[#00C16A] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#00C16A]/30 transform rotate-12">
            <span className="text-4xl text-white font-bold -rotate-12">S</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0A0A0A] dark:text-white mb-2">Xoş Gəldiniz!</h1>
          <p className="text-gray-500 dark:text-gray-400">Davam etmək üçün hesabınıza daxil olun.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin} 
          className="space-y-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
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

          <div className="flex justify-end">
            <button type="button" className="text-sm font-medium text-[#00C16A] hover:text-emerald-700 dark:hover:text-emerald-400">
              Şifrəni unutmusunuz?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A0A0A] dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform mt-8 disabled:opacity-70"
          >
            <span>{loading ? 'Daxil olunur...' : 'Daxil ol'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm">və ya</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
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
            <span>Google ilə daxil ol</span>
          </button>
        </motion.form>
      </div>

      <div className="pb-8 text-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Hesabınız yoxdur?{' '}
          <button onClick={() => navigate('register')} className="font-bold text-[#00C16A] hover:underline">
            Qeydiyyatdan keçin
          </button>
        </p>
      </div>
    </div>
  );
}

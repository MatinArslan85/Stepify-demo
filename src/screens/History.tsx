import React from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Screen, Language } from '../types';

interface Props {
  navigate: (screen: Screen) => void;
  coins: number;
  language: Language;
}

export default function History({ navigate, coins, language }: Props) {
  const transactions = [
    { id: 1, type: 'earn', title: language === 'az' ? 'KFC Nərimanov ziyarəti' : language === 'en' ? 'KFC Narimanov visit' : language === 'tr' ? 'KFC Nerimanov ziyareti' : 'Посещение KFC Нариманов', amount: 50, date: language === 'az' ? 'Bu gün, 14:30' : language === 'en' ? 'Today, 14:30' : language === 'tr' ? 'Bugün, 14:30' : 'Сегодня, 14:30' },
    { id: 2, type: 'spend', title: language === 'az' ? 'FitLife Endirim' : language === 'en' ? 'FitLife Discount' : language === 'tr' ? 'FitLife İndirim' : 'Скидка FitLife', amount: -150, date: language === 'az' ? 'Dünən, 18:00' : language === 'en' ? 'Yesterday, 18:00' : language === 'tr' ? 'Dün, 18:00' : 'Вчера, 18:00' },
    { id: 3, type: 'earn', title: language === 'az' ? 'Gündəlik Addım Hədəfi' : language === 'en' ? 'Daily Step Goal' : language === 'tr' ? 'Günlük Adım Hedefi' : 'Ежедневная цель шагов', amount: 25, date: language === 'az' ? 'Dünən, 20:00' : language === 'en' ? 'Yesterday, 20:00' : language === 'tr' ? 'Dün, 20:00' : 'Вчера, 20:00' },
    { id: 4, type: 'earn', title: language === 'az' ? 'Reklam İzləmə' : language === 'en' ? 'Ad Watching' : language === 'tr' ? 'Reklam İzleme' : 'Просмотр рекламы', amount: 8, date: language === 'az' ? 'Dünən, 20:05' : language === 'en' ? 'Yesterday, 20:05' : language === 'tr' ? 'Dün, 20:05' : 'Вчера, 20:05' },
    { id: 5, type: 'earn', title: language === 'az' ? 'Addım Qazancı' : language === 'en' ? 'Step Earnings' : language === 'tr' ? 'Adım Kazancı' : 'Заработок за шаги', amount: 12, date: language === 'az' ? '2 gün əvvəl, 19:30' : language === 'en' ? '2 days ago, 19:30' : language === 'tr' ? '2 gün önce, 19:30' : '2 дня назад, 19:30' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-700 transition-colors">
        <button onClick={() => navigate('profile')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white ml-2">{language === 'az' ? 'Tarixçə' : language === 'en' ? 'History' : language === 'tr' ? 'Geçmiş' : 'История'}</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-gradient-to-br from-[#00C16A] to-emerald-600 rounded-3xl p-6 text-white mb-8 shadow-lg shadow-[#00C16A]/20">
          <p className="text-emerald-100 text-sm font-medium mb-1">{language === 'az' ? 'Cari Balans' : language === 'en' ? 'Current Balance' : language === 'tr' ? 'Mevcut Bakiye' : 'Текущий баланс'}</p>
          <h3 className="text-4xl font-bold">{coins} <span className="text-xl font-medium">Coin</span></h3>
        </div>

        <h3 className="font-bold text-[#0A0A0A] dark:text-white mb-4">{language === 'az' ? 'Son Əməliyyatlar' : language === 'en' ? 'Recent Transactions' : language === 'tr' ? 'Son İşlemler' : 'Последние транзакции'}</h3>
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${t.type === 'earn' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                  {t.type === 'earn' ? <ArrowDownRight className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> : <ArrowUpRight className="w-5 h-5 text-red-500 dark:text-red-400" />}
                </div>
                <div>
                  <h4 className="font-semibold text-[#0A0A0A] dark:text-white text-sm">{t.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                </div>
              </div>
              <span className={`font-bold ${t.type === 'earn' ? 'text-emerald-500 dark:text-emerald-400' : 'text-[#0A0A0A] dark:text-white'}`}>
                {t.amount > 0 ? '+' : ''}{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

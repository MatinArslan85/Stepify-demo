import React, { useState } from 'react';
import { ArrowLeft, Search, MoreVertical, Send, Phone, Video, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from '../types';
import { Language } from '../translations';
import { friends } from '../data';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
}

export default function Messages({ navigate, language }: Props) {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  
  // Dummy messages memory
  const [messages, setMessages] = useState<Record<number, {id: number, text: string, sent: boolean}[]>>({
    1: [
      { id: 1, text: "Salam, bu gün qaçışa gedirsən?", sent: false },
      { id: 2, text: "Hə, axşam saat 7-də planlaşdırıram", sent: true },
      { id: 3, text: "Əla, birlikdə gedək?", sent: false }
    ],
    2: [
      { id: 1, text: "Təbriklər, bu həftəki yarışda qalib gəldin!", sent: false }
    ]
  });

  const chatFriends = friends.filter(f => [1, 2, 4].includes(f.id));

  const handleSend = () => {
    if (!message.trim() || activeChat === null) return;
    
    setMessages(prev => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] || []),
        { id: Date.now(), text: message, sent: true }
      ]
    }));
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      <AnimatePresence mode="wait">
        {activeChat === null ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full w-full"
          >
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 z-10 transition-colors">
              <div className="flex items-center">
                <button onClick={() => navigate('home')} className="p-2 -ml-2 mr-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
                </button>
                <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">
                  {language === 'az' ? 'Mesajlar' : language === 'en' ? 'Messages' : language === 'tr' ? 'Mesajlar' : 'Сообщения'}
                </h1>
              </div>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatFriends.map((friend) => (
                <div 
                  key={friend.id}
                  onClick={() => setActiveChat(friend.id)}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all active:scale-95"
                >
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl flex-shrink-0 relative">
                    {friend.avatar}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-[#0A0A0A] dark:text-white truncate">{friend.name}</h3>
                      <span className="text-xs text-gray-400">12:30</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {messages[friend.id] ? messages[friend.id][messages[friend.id].length - 1].text : "Salam!"}
                    </p>
                  </div>
                  {friend.id === 1 && (
                    <div className="w-5 h-5 bg-[#00C16A] text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full bg-[#f0f2f5] dark:bg-gray-900"
          >
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 z-10 transition-colors shadow-sm">
              <div className="flex items-center">
                <button onClick={() => setActiveChat(null)} className="p-2 -ml-2 mr-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl relative">
                    {friends.find(f => f.id === activeChat)?.avatar}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0A0A] dark:text-white truncate">{friends.find(f => f.id === activeChat)?.name}</h3>
                    <p className="text-[10px] text-green-500">Onlayn</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-center mb-6">
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">Bugün</span>
              </div>
              
              {(messages[activeChat] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    msg.sent 
                      ? 'bg-[#00C16A] text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-[#0A0A0A] dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] block mt-1 text-right ${msg.sent ? 'text-white/80' : 'text-gray-400'}`}>
                      12:35
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700 pb-8 sm:pb-4 transition-colors">
              <div className="flex items-center space-x-3 bg-[#F7F7F7] dark:bg-gray-900 rounded-full p-1.5 border border-gray-100 dark:border-gray-700 px-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'az' ? 'Mesaj yaz...' : language === 'en' ? 'Type a message...' : language === 'tr' ? 'Mesaj yaz...' : 'Введите сообщение...'}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[#0A0A0A] dark:text-white placeholder-gray-400 text-sm py-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    message.trim() ? 'bg-[#00C16A] text-white shadow-md hover:scale-105 active:scale-95' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

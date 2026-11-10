import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Loader2, Camera } from 'lucide-react';
import { Screen, Language, User } from '../types';
import { StepiAvatar } from '../components/StepiAvatar';
import { GoogleGenAI } from '@google/genai';
import { translations } from '../translations';
import { districts } from '../data';

interface Props {
  navigate: (screen: Screen) => void;
  language: Language;
  userProfile: User;
}

interface Message {
  id: number;
  text: string;
  sender: 'stepi' | 'user';
  image?: string;
  suggestions?: string[];
}

export default function StepiChat({ navigate, language, userProfile }: Props) {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: language === 'az' ? 'Salam Mətin! 👋 Bu gün necə hiss edirsən? Yeni addım hədəflərini qırmağa hazırsan?' : language === 'en' ? 'Hello Metin! 👋 How are you feeling today? Ready to break new step goals?' : language === 'tr' ? 'Merhaba Metin! 👋 Bugün nasıl hissediyorsun? Yeni adım hedeflerini kırmaya hazır mısın?' : 'Привет, Метин! 👋 Как ты себя чувствуешь сегодня? Готов побить новые цели по шагам?', 
      sender: 'stepi',
      suggestions: language === 'az' 
        ? ['Gündəlik hədəfim nə qədər olmalıdır?', 'Mənə sağlam resept ver', 'Necə daha çox coin qazana bilərəm?']
        : language === 'en'
        ? ['What should my daily goal be?', 'Give me a healthy recipe', 'How can I earn more coins?']
        : language === 'tr'
        ? ['Günlük hedefim ne kadar olmalı?', 'Bana sağlıklı bir tarif ver', 'Nasıl daha fazla coin kazanabilirim?']
        : ['Какой должна быть моя дневная цель?', 'Дай мне здоровый рецепт', 'Как я могу заработать больше монет?']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processStepiResponse = (text: string) => {
    let stepiReply = text;
    let suggestions: string[] = [];
    const suggestionsMatch = stepiReply.match(/SUGGESTIONS:\s*(\[.*\])/s);
    if (suggestionsMatch) {
      try {
        suggestions = JSON.parse(suggestionsMatch[1]);
        stepiReply = stepiReply.replace(/SUGGESTIONS:\s*\[.*\]/s, '').trim();
      } catch (e) {
        console.error("Failed to parse suggestions", e);
      }
    }
    return { stepiReply, suggestions };
  };

  useEffect(() => {
    // Initialize Gemini Chat
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        aiRef.current = ai;
        
        let districtInfo = "";
        const discovered = userProfile.discoveredDistricts || [];
        if (discovered.length > 0) {
          const names = discovered.map(id => districts.find(d => d.id === id)?.name).filter(Boolean);
          districtInfo = `\n\nİstifadəçi bu Bakı rayonlarını kəşf edib: ${names.join(', ')}. Cəmi ${discovered.length}/9 rayon tapılıb. Əgər istifadəçi bu barədə soruşsa və ya rayonlarla bağlı sual versə, bu məlumatı ona xatırlat və təbrik et.`;
        } else {
          districtInfo = `\n\nİstifadəçi hələ heç bir Bakı rayonunu kəşf etməyib. Onu xəritəyə daxil olub rayonları kəşf etməyə həvəsləndirə bilərsən.`;
        }

        const systemInstructionBase = language === 'az' ? "Sən Stepisən, Stepify tətbiqinin dostcanlı, motivasiya verən və enerjili AI asistanısan. Sənin məqsədin istifadəçilərə (xüsusən Mətinə) sağlam həyat tərzi, idman, qidalanma və addım atmaq barədə məsləhətlər vermək, onlara dəstək olmaq və motivasiya etməkdir. Qısa, səmimi və Azərbaycan dilində cavablar ver. Çox rəsmi olma, emojilərdən istifadə et. İstifadəçi sənə sual verəndə, onun sağlamlıq və fitness məqsədlərinə uyğun cavablar ver." : language === 'en' ? "You are Stepi, the friendly, motivating, and energetic AI assistant of the Stepify app. Your goal is to give users (especially Metin) advice on a healthy lifestyle, sports, nutrition, and walking, to support and motivate them. Give short, sincere answers in English. Don't be too formal, use emojis. When the user asks you a question, give answers that fit their health and fitness goals." : language === 'tr' ? "Sen Stepi'sin, Stepify uygulamasının dost canlısı, motive edici ve enerjik yapay zeka asistanısın. Amacın kullanıcılara (özellikle Metin'e) sağlıklı yaşam, spor, beslenme ve adım atma konusunda tavsiyeler vermek, onlara destek olmak ve motive etmektir. Kısa, samimi ve Türkçe cevaplar ver. Çok resmi olma, emojiler kullan. Kullanıcı sana soru sorduğunda, sağlık ve fitness hedeflerine uygun cevaplar ver." : "Вы Степи, дружелюбный, мотивирующий и энергичный ИИ-помощник приложения Stepify. Ваша цель - давать пользователям (особенно Метину) советы по здоровому образу жизни, спорту, питанию и ходьбе, поддерживать и мотивировать их. Давайте короткие, искренние ответы на русском языке. Не будьте слишком формальны, используйте смайлики. Когда пользователь задает вам вопрос, давайте ответы, соответствующие его целям в области здоровья и фитнеса.";
        const suggestionInstruction = language === 'az' 
          ? "\n\nMÜHÜM: Cavabının ən sonunda istifadəçinin sənə verə biləcəyi 2-3 qısa davam sualı və ya fəaliyyəti təklif et. Format TAM OLARAQ belə olmalıdır yeni sətirdə: SUGGESTIONS: [\"Sual 1\", \"Sual 2\"]"
          : language === 'en'
          ? "\n\nIMPORTANT: At the very end of your response, provide 2-3 short follow-up questions or actions the user can ask you. The format MUST BE EXACTLY like this on a new line: SUGGESTIONS: [\"Question 1\", \"Question 2\"]"
          : language === 'tr'
          ? "\n\nÖNEMLİ: Cevabının en sonunda kullanıcının sana sorabileceği 2-3 kısa takip sorusu veya eylemi öner. Format TAM OLARAK yeni satırda şöyle olmalıdır: SUGGESTIONS: [\"Soru 1\", \"Soru 2\"]"
          : "\n\nВАЖНО: В самом конце вашего ответа предложите 2-3 коротких последующих вопроса или действия, которые пользователь может вам задать. Формат ДОЛЖЕН БЫТЬ ТОЧНО таким на новой строке: SUGGESTIONS: [\"Вопрос 1\", \"Вопрос 2\"]";

        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: systemInstructionBase + districtInfo + suggestionInstruction,
          },
        });
      } catch (error) {
        console.error("Error initializing Gemini chat:", error);
      }
    };
    initChat();
  }, [language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: userText });
        const rawReply = response.text || (language === 'az' ? "Bağışla, nəsə səhv oldu. Yenidən cəhd edə bilərsən? 😅" : language === 'en' ? "Sorry, something went wrong. Can you try again? 😅" : language === 'tr' ? "Üzgünüm, bir şeyler ters gitti. Tekrar deneyebilir misin? 😅" : "Извините, что-то пошло не так. Можете попробовать еще раз? 😅");
        const { stepiReply, suggestions } = processStepiResponse(rawReply);
        setMessages(prev => [...prev, { id: Date.now(), text: stepiReply, sender: 'stepi', suggestions }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), text: language === 'az' ? "Sistemə qoşulmaqda çətinlik çəkirəm. Zəhmət olmasa, bir az sonra yenidən yoxla. 🛠️" : language === 'en' ? "I'm having trouble connecting to the system. Please check again later. 🛠️" : language === 'tr' ? "Sisteme bağlanmakta zorluk çekiyorum. Lütfen daha sonra tekrar kontrol et. 🛠️" : "У меня проблемы с подключением к системе. Пожалуйста, проверьте позже. 🛠️", sender: 'stepi' }]);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: language === 'az' ? "Bağışla, cavab verərkən xəta baş verdi. 😔" : language === 'en' ? "Sorry, an error occurred while replying. 😔" : language === 'tr' ? "Üzgünüm, cevap verirken bir hata oluştu. 😔" : "Извините, произошла ошибка при ответе. 😔", sender: 'stepi' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    
    const newUserMsg: Message = { id: Date.now(), text: suggestion, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: suggestion });
        const rawReply = response.text || (language === 'az' ? "Bağışla, nəsə səhv oldu. Yenidən cəhd edə bilərsən? 😅" : language === 'en' ? "Sorry, something went wrong. Can you try again? 😅" : language === 'tr' ? "Üzgünüm, bir şeyler ters gitti. Tekrar deneyebilir misin? 😅" : "Извините, что-то пошло не так. Можете попробовать еще раз? 😅");
        const { stepiReply, suggestions } = processStepiResponse(rawReply);
        setMessages(prev => [...prev, { id: Date.now(), text: stepiReply, sender: 'stepi', suggestions }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), text: language === 'az' ? "Sistemə qoşulmaqda çətinlik çəkirəm. Zəhmət olmasa, bir az sonra yenidən yoxla. 🛠️" : language === 'en' ? "I'm having trouble connecting to the system. Please check again later. 🛠️" : language === 'tr' ? "Sisteme bağlanmakta zorluk çekiyorum. Lütfen daha sonra tekrar kontrol et. 🛠️" : "У меня проблемы с подключением к системе. Пожалуйста, проверьте позже. 🛠️", sender: 'stepi' }]);
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: language === 'az' ? "Bağışla, cavab verərkən xəta baş verdi. 😔" : language === 'en' ? "Sorry, an error occurred while replying. 😔" : language === 'tr' ? "Üzgünüm, cevap verirken bir hata oluştu. 😔" : "Извините, произошла ошибка при ответе. 😔", sender: 'stepi' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !aiRef.current) return;

    setIsLoading(true);
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      
      const newUserMsg: Message = { 
        id: Date.now(), 
        text: language === 'az' ? 'Bu yeməyin kalorisini hesablaya bilərsən?' : language === 'en' ? 'Can you calculate the calories of this food?' : language === 'tr' ? 'Bu yemeğin kalorisini hesaplayabilir misin?' : 'Можешь посчитать калории этой еды?', 
        sender: 'user',
        image: base64String
      };
      
      setMessages(prev => [...prev, newUserMsg]);

      try {
        const imagePart = {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        };
        
        const promptString = language === 'az' 
          ? "Bu yeməyin şəklinə bax və təxmini olaraq neçə kalori, zülal, karbohidrat və yağ olduğunu hesabla. Qısa və səmimi cavab ver." 
          : language === 'en' 
            ? "Look at this picture of food and estimate the calories, protein, carbs, and fat. Give a short and friendly answer."
            : language === 'tr'
              ? "Bu yemeğin resmine bak ve tahmini olarak kaç kalori, protein, karbonhidrat ve yağ olduğunu hesapla. Kısa ve samimi bir cevap ver."
              : "Посмотри на эту фотографию еды и оцени калории, белки, углеводы и жиры. Дай короткий и дружелюбный ответ.";

        const textPart = { text: promptString };

        const response = await aiRef.current.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: { parts: [imagePart, textPart] },
        });

        const rawReply = response.text || (language === 'az' ? "Bağışla, şəkli analiz edə bilmədim. 😅" : language === 'en' ? "Sorry, I couldn't analyze the image. 😅" : language === 'tr' ? "Üzgünüm, resmi analiz edemedim. 😅" : "Извините, я не смог проанализировать изображение. 😅");
        const { stepiReply, suggestions } = processStepiResponse(rawReply);
        
        setMessages(prev => [...prev, { id: Date.now(), text: stepiReply, sender: 'stepi', suggestions }]);
        
        // Add to chat history so context is maintained
        if (chatRef.current) {
          await chatRef.current.sendMessage({ message: `I sent an image of food and you replied: ${stepiReply}` });
        }
      } catch (error) {
        console.error("Error analyzing image:", error);
        setMessages(prev => [...prev, { id: Date.now(), text: language === 'az' ? "Bağışla, şəkli analiz edərkən xəta baş verdi. 😔" : language === 'en' ? "Sorry, an error occurred while analyzing the image. 😔" : language === 'tr' ? "Üzgünüm, resmi analiz ederken bir hata oluştu. 😔" : "Извините, произошла ошибка при анализе изображения. 😔", sender: 'stepi' }]);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 pt-10 pb-4 px-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 shadow-sm z-10 transition-colors">
        <div className="flex items-center">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#0A0A0A] dark:text-white" />
          </button>
          <div className="flex items-center ml-2">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 transition-colors">
              <StepiAvatar className="w-8 h-8" variant="happy" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0A0A0A] dark:text-white leading-tight">Stepi</h1>
              <p className="text-xs text-[#00C16A] font-medium">{language === 'az' ? 'Onlayn' : language === 'en' ? 'Online' : language === 'tr' ? 'Çevrimiçi' : 'В сети'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-[#00C16A] text-white rounded-br-sm' 
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[#0A0A0A] dark:text-white rounded-bl-sm shadow-sm transition-colors'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Uploaded food" className="w-full h-auto rounded-lg mb-2" />
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                      className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-[#00C16A] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[#0A0A0A] dark:text-white rounded-2xl rounded-bl-sm shadow-sm p-4 flex items-center space-x-2 transition-colors">
              <Loader2 className="w-4 h-4 animate-spin text-[#00C16A]" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{t.analyzingFood || 'Analiz edilir...'}</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-full p-1 border border-gray-200 dark:border-gray-600 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-[#00C16A] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={t.uploadFoodImage || 'Yemək şəkli yüklə'}
          >
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'az' ? 'Stepiyə mesaj yaz...' : language === 'en' ? 'Message Stepi...' : language === 'tr' ? 'Stepi\'ye mesaj yaz...' : 'Написать Степи...'} 
            className="flex-1 bg-transparent px-2 py-3 outline-none text-sm text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              input.trim() && !isLoading ? 'bg-[#00C16A] text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
            }`}
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

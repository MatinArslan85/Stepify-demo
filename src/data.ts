export const stores = [
  { 
    id: 1, 
    name: 'Ocaq Sport', 
    category: 'gym', 
    icon: '🤸‍♂️', 
    location: 'Koroğlu', 
    discount: '10% Endirim', 
    coins: 200, 
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    desc: 'Gimnastika və funksional məşqlər üçün ixtisaslaşmış mərkəz.',
    color: 'from-red-600 to-red-900',
    lat: 40.4208,
    lng: 49.9189
  },
  { 
    id: 2, 
    name: 'Green Diet', 
    category: 'food', 
    icon: '🥗', 
    location: 'Nərimanov', 
    discount: 'Pulsuz Detox', 
    coins: 100, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
    desc: '100% orqanik və vegan menyular, şəkərsiz şirniyyatlar. Hər salat sifarişində 1 stəkan yaşıl detox şirəsi hədiyyə.',
    color: 'from-emerald-600 to-teal-900',
    lat: 40.4023,
    lng: 49.8718
  },
  { 
    id: 3, 
    name: 'The Yoga Shala Baku', 
    category: 'health', 
    icon: '🧘‍♀️', 
    location: 'İçərişəhər', 
    discount: '1 Pulsuz Dərs', 
    coins: 120, 
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1470&auto=format&fit=crop',
    desc: 'Bədən və ruh sağlamlığı üçün yoqa və meditasiya dərsləri. İlk sınaq dərsi Stepify ilə tamamilə pulsuz.',
    color: 'from-purple-600 to-indigo-900',
    lat: 40.3661,
    lng: 49.8352
  },
  { 
    id: 4, 
    name: 'Port Baku Mall', 
    category: 'health', 
    icon: '🛍️', 
    location: 'Neftçilər Prospekti', 
    discount: '15% Endirim (İdman geyimləri)', 
    coins: 80, 
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=1470&auto=format&fit=crop',
    desc: 'İdman geyimləri və sağlamlıq məhsulları mağazalarında Stepify istifadəçilərinə özəl endirimlər.',
    color: 'from-orange-500 to-red-700',
    lat: 40.3775,
    lng: 49.8547
  },
  { 
    id: 5, 
    name: 'Fitway Baku', 
    category: 'gym', 
    icon: '🏋️‍♂️', 
    location: 'Gənclik', 
    discount: '20% Endirim', 
    coins: 150, 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    desc: 'Ən müasir avadanlıqlarla təchiz olunmuş premium idman zalı. Stepify istifadəçilərinə özəl 1 aylıq abunəlikdə 20% endirim.',
    color: 'from-blue-800 to-gray-900',
    lat: 40.3985,
    lng: 49.8488
  },
  { 
    id: 6, 
    name: 'Baku City Circuit', 
    category: 'health', 
    icon: '🏃‍♂️', 
    location: 'Dənizkənarı Bulvar', 
    discount: 'Açıq Hava Məşqi', 
    coins: 50, 
    image: 'https://images.unsplash.com/photo-1552674605-171ff3ea36f0?q=80&w=1470&auto=format&fit=crop',
    desc: 'Bulvarda qaçış və açıq hava məşqləri üçün ideal məkan. Burada atılan hər 1000 addım 2x coin qazandırır.',
    color: 'from-cyan-500 to-blue-700',
    lat: 40.3683,
    lng: 49.8368
  }
];

export const friends = [
  { id: 1, name: 'Aysel', avatar: '👩', lat: 40.3953, lng: 49.8299, status: 'Qaçışdadır', bio: 'Fitness həvəskarı, səhər qaçışlarını sevir 🏃‍♀️' },
  { id: 2, name: 'Rəşad', avatar: '👨', lat: 40.4093, lng: 49.8671, status: 'Fitway-də məşq edir', bio: 'Zal təlimatçısı. Birlikdə güclənək! 💪' },
  { id: 3, name: 'Leyla', avatar: '👱‍♀️', lat: 40.3775, lng: 49.8547, status: 'Port Baku-da gəzir', bio: 'Sağlam qidalanma və aktiv həyat 🌱' },
  { id: 4, name: 'Tural', avatar: '👱‍♂️', lat: 40.3800, lng: 49.8500, status: 'Dincəlir', bio: 'Həftəsonu yürüşlərinin fanatı ⛰️' }
];

export const events = [
  {
    id: 1,
    title: 'Bakı Marafonu 2026',
    date: '15 Aprel, 09:00',
    location: 'Dövlət Bayrağı Meydanı',
    image: 'https://images.unsplash.com/photo-1552674605-171ff3ea36f0?q=80&w=1470&auto=format&fit=crop',
    participants: 1250,
    coins: 500
  },
  {
    id: 2,
    title: 'Dənizkənarı Yoqa',
    date: 'Hər Bazar, 08:00',
    location: 'Bulvar',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1470&auto=format&fit=crop',
    participants: 85,
    coins: 100
  },
  {
    id: 3,
    title: 'Velosiped Turu',
    date: '22 May, 10:00',
    location: 'Ağ Şəhər',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop',
    participants: 320,
    coins: 250
  },
  {
    id: 4,
    title: 'Gənclik Parkında Təbiət Yürüşü',
    date: '5 İyun, 07:30',
    location: 'Gənclik Parkı',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop',
    participants: 150,
    coins: 300
  },
  {
    id: 5,
    title: 'Sağlam Qidalanma Festivalı',
    date: '12 İyun, 12:00',
    location: 'Dəniz Mall',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop',
    participants: 800,
    coins: 150
  },
  {
    id: 6,
    title: 'Açıq Hava Fitnes Düşərgəsi',
    date: '20 İyun, 18:00',
    location: 'Mərkəzi Park',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    participants: 200,
    coins: 400
  },
  {
    id: 7,
    title: 'Gecə Qaçışı (Night Run)',
    date: '2 İyul, 21:00',
    location: 'İçərişəhər',
    image: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=1470&auto=format&fit=crop',
    participants: 450,
    coins: 600
  }
];

export const stories = [
  { id: 1, user: 'Aysel', avatar: '👩', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop', text: 'Səhər qaçışı tamamlandı! 🏃‍♀️', likes: 24 },
  { id: 2, user: 'Rəşad', avatar: '👨', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop', text: 'Zalda ağır məşq 💪', likes: 56 },
  { id: 3, user: 'Leyla', avatar: '👱‍♀️', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop', text: 'Green Diet-də sağlam nahar 🥗', likes: 18 },
];

export const districts = [
  { id: 'nerimanov', name: 'Nərimanov', lat: 40.4023, lng: 49.8718, radius: 2000, icon: '🏢', fact: 'Nərimanov rayonu Bakının ən böyük inzibati və ticarət mərkəzlərindən biridir.', coins: 50 },
  { id: 'nesimi', name: 'Nəsimi', lat: 40.3888, lng: 49.8353, radius: 2000, icon: '🏛️', fact: 'Nəsimi rayonu Bakı şəhərinin tarixi mərkəzi hissəsində yerləşir.', coins: 60 },
  { id: 'iceriseher', name: 'İçərişəhər', lat: 40.3661, lng: 49.8352, radius: 1000, icon: '🏰', fact: 'İçərişəhər Bakının qədim tarixi nüvəsidir, UNESCO siyahısındadır.', coins: 100 },
  { id: 'sahil', name: 'Sahil', lat: 40.3683, lng: 49.8368, radius: 1500, icon: '🌊', fact: 'Sahil Milli Parkı Bakı bulvarının ən məşhur hissəsidir.', coins: 40 },
  { id: 'xetai', name: 'Xətai', lat: 40.3804, lng: 49.8808, radius: 2500, icon: '🏭', fact: 'Xətai rayonu Bakının əsas sənaye və yaşayış məskənlərindən biridir.', coins: 70 },
  { id: 'yasamal', name: 'Yasamal', lat: 40.3953, lng: 49.8142, radius: 2500, icon: '🏘️', fact: 'Yasamal tarixi "Qanlıtəpə" adlanan ərazidə salınmışdır.', coins: 60 },
  { id: 'sabuncu', name: 'Sabunçu', lat: 40.4851, lng: 49.9575, radius: 3000, icon: '🚂', fact: 'Azərbaycanda ilk dəmir yolu stansiyalarından biri Sabunçuda yerləşib.', coins: 80 },
  { id: 'bineqedi', name: 'Binəqədi', lat: 40.4820, lng: 49.8164, radius: 3000, icon: '🌲', fact: 'Binəqədi ərazisində məşhur paleontoloji flora və fauna abidəsi var.', coins: 90 },
  { id: 'suraxani', name: 'Suraxanı', lat: 40.4282, lng: 50.0101, radius: 3000, icon: '🔥', fact: 'Suraxanı dünyaca məşhur Atəşgah məbədinin yerləşdiyi tarixi məkandır.', coins: 80 }
];


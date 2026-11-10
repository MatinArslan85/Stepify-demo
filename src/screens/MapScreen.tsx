import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Search, MapPin, Loader2, Award, Zap } from 'lucide-react';
import { stores, friends, districts } from '../data';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoogleGenAI } from '@google/genai';
import { translations, Language } from '../translations';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (emoji: string, colorClass: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-10 h-10 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center text-xl ${colorClass}">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const userIcon = createCustomIcon('👦', 'bg-blue-100 border-blue-500');

interface Props {
  onSelectStore: (id: number) => void;
  shareLocation: boolean;
  language: Language;
  userProfile: any;
  setUserProfile: any;
  setCoins: any;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface LivePlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  uri: string;
}

function CenterTracker({ setMapCenter }: { setMapCenter: (center: [number, number]) => void }) {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      setMapCenter([center.lat, center.lng]);
    }
  });
  return null;
}

export default function MapScreen({ onSelectStore, shareLocation, language, userProfile, setUserProfile, setCoins }: Props) {
  const t = translations[language];
  const [showSheet, setShowSheet] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [livePlaces, setLivePlaces] = useState<LivePlace[]>([]);
  const [showUnlockAnim, setShowUnlockAnim] = useState<string | null>(null);
  
  // Green Routes coordinates
  const GREEN_ROUTES: { id: string, name: string, color: string, coords: [number, number][] }[] = [
    {
      id: 'bulvar',
      name: 'Dənizkənarı Bulvar Marşrutu',
      color: '#10B981',
      coords: [
        [40.358, 49.836],
        [40.362, 49.845],
        [40.370, 49.860]
      ]
    },
    {
      id: 'merkezi-park',
      name: 'Mərkəzi Park Marşrutu',
      color: '#059669',
      coords: [
        [40.375, 49.830],
        [40.378, 49.835]
      ]
    },
    {
      id: 'velopark',
      name: 'Həzi Aslanov Veloparkı',
      color: '#047857',
      coords: [
        [40.301, 49.799],
        [40.305, 49.805]
      ]
    }
  ];

  // Baku center
  const defaultCenter: [number, number] = [40.3953, 49.8299];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const getActiveDistrict = () => {
    let closest = null;
    let minD = Infinity;
    for(const d of districts) {
      const dist = getDistance(mapCenter[0], mapCenter[1], d.lat, d.lng);
      if(dist < d.radius && dist < minD) {
        minD = dist;
        closest = d;
      }
    }
    return closest;
  };

  const activeDistrict = getActiveDistrict();
  const isDistrictUnlocked = activeDistrict && userProfile.discoveredDistricts?.includes(activeDistrict.id);

  const handleUnlockDistrict = () => {
    if (activeDistrict && !isDistrictUnlocked) {
      setUserProfile((prev: any) => ({
        ...prev,
        discoveredDistricts: [...(prev.discoveredDistricts || []), activeDistrict.id]
      }));
      setCoins((prev: number) => prev + activeDistrict.coins);
      setShowUnlockAnim(activeDistrict.name);
      setTimeout(() => setShowUnlockAnim(null), 3000);
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setLivePlaces([]);
      return;
    }

    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find places matching "${searchQuery}" near Baku, Azerbaijan.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: defaultCenter[0],
                longitude: defaultCenter[1]
              }
            }
          }
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const places: LivePlace[] = [];
        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            // We don't get exact lat/lng from groundingChunks easily without parsing text, 
            // but we can try to extract or just show them in the list.
            // For now, we'll just add them to the list and maybe center the map slightly differently
            places.push({
              id: `live-${index}`,
              name: chunk.web.title,
              lat: defaultCenter[0] + (Math.random() - 0.5) * 0.05, // Mocking lat/lng for visual purposes since grounding doesn't return raw coordinates
              lng: defaultCenter[1] + (Math.random() - 0.5) * 0.05,
              uri: chunk.web.uri
            });
          }
        });
        setLivePlaces(places);
        if (places.length > 0) {
          setMapCenter([places[0].lat, places[0].lng]);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] dark:bg-gray-900 relative transition-colors">
      {/* Search Bar */}
      <div className="absolute top-10 left-6 right-6 z-[1000] pointer-events-none">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 flex items-center space-x-3 pointer-events-auto transition-colors">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Məkan və ya mağaza axtar (Live)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#0A0A0A] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-[#00C16A] animate-spin" />
          ) : (
            <button type="submit" className="text-xs font-bold text-[#00C16A] bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full transition-colors">Axtar</button>
          )}
        </form>
        
        <AnimatePresence>
          {activeDistrict && !isDistrictUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex justify-center pointer-events-auto"
            >
              <button 
                onClick={handleUnlockDistrict}
                className="bg-[#00C16A] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[#00C16A]/30 flex items-center space-x-2 border-2 border-white dark:border-gray-800 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{activeDistrict.icon}</span>
                <span>Bu rayonu kəşf et (+{activeDistrict.coins} Coin)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unlock Celebration Animation Modal */}
      <AnimatePresence>
        {showUnlockAnim && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full mx-6 text-center shadow-2xl relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#00C16A] rounded-full flex items-center justify-center shadow-xl shadow-[#00C16A]/40 border-4 border-white dark:border-gray-800">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-10 mb-2">Təbriklər!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Sən <span className="font-bold text-[#0A0A0A] dark:text-white">{showUnlockAnim}</span> rayonunu kəşf etdin.
              </p>
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-[#00C16A] bg-emerald-50 dark:bg-emerald-900/40 py-3 rounded-2xl">
                <Zap className="w-6 h-6 fill-current" />
                <span>Coin Qazanıldı</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Green Routes Legend */}
      <div className="absolute top-28 right-6 z-[400] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 pointer-events-auto">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-[#00C16A] fill-[#00C16A]" />
          <h4 className="font-bold text-sm text-[#0A0A0A] dark:text-white">Yaşıl Marşrutlar</h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Mükafat: 1.2x Coin Çarpanı ⚡</p>
        <div className="space-y-1.5">
          {GREEN_ROUTES.map(route => (
            <div key={route.id} className="flex items-center space-x-2">
              <div className="w-3 h-1 rounded-full" style={{ backgroundColor: route.color }}></div>
              <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">{route.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapUpdater center={mapCenter} />
          <CenterTracker setMapCenter={setMapCenter} />

          {/* Green Routes */}
          {GREEN_ROUTES.map(route => (
            <Polyline 
              key={route.id} 
              positions={route.coords} 
              pathOptions={{ color: route.color, weight: 6, opacity: 0.8 }}
            >
              <Popup>
                <div className="text-center p-1">
                  <p className="font-bold text-[#0A0A0A] text-sm mb-1">{route.name}</p>
                  <div className="bg-emerald-50 text-[#00C16A] text-xs font-bold px-2 py-1 rounded-md mb-1 inline-flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1 fill-current" />
                    Mükafat: 1.2x Coin Çarpanı ⚡
                  </div>
                  <p className="text-gray-500 text-[10px]">Status: Yaşıl Ekologiya Zonası</p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* User Location */}
          <Marker position={defaultCenter} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">Sən</p>
                <p className="text-xs text-gray-500">Hazırkı mövqe</p>
              </div>
            </Popup>
          </Marker>

          {/* Friends Locations */}
          {shareLocation && friends.map(friend => (
            <Marker 
              key={`friend-${friend.id}`} 
              position={[friend.lat, friend.lng]} 
              icon={createCustomIcon(friend.avatar, 'bg-emerald-100 border-emerald-500')}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Local Stores Locations */}
          {filteredStores.map(store => (
            store.lat && store.lng ? (
              <Marker 
                key={`store-${store.id}`} 
                position={[store.lat, store.lng]} 
                icon={createCustomIcon(store.icon, 'bg-white border-gray-200')}
              >
                <Popup>
                  <div className="text-center cursor-pointer" onClick={() => onSelectStore(store.id)}>
                    <p className="font-bold">{store.name}</p>
                    <p className="text-[#00C16A] text-xs font-bold">{store.discount}</p>
                    <button className="mt-2 bg-[#00C16A] text-white text-xs px-3 py-1 rounded-full">
                      Ətraflı
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}

          {/* Live Places Locations */}
          {livePlaces.map(place => (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]} 
              icon={createCustomIcon('📍', 'bg-red-100 border-red-500')}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">{place.name}</p>
                  <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline mt-1 block">
                    Xəritədə bax
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Sheet */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showSheet ? 0 : 'calc(100% - 60px)' }}
        className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 z-[1000] transition-colors"
      >
        <div 
          className="flex justify-between items-start mb-4 cursor-pointer"
          onClick={() => setShowSheet(!showSheet)}
        >
          <div>
            <h3 className="font-bold text-[#0A0A0A] dark:text-white text-lg">Yaxınlıqdakı Məkanlar</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {livePlaces.length > 0 
                ? `Axtarış nəticəsi: ${livePlaces.length} məkan`
                : `Ətrafınızda ${filteredStores.length} aktiv təklif var`
              }
            </p>
          </div>
          <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-[#0A0A0A] dark:text-white transition-colors">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {livePlaces.length > 0 ? (
            livePlaces.map((place) => (
              <div 
                key={place.id}
                onClick={() => setMapCenter([place.lat, place.lng])}
                className="flex-none w-48 bg-red-50 dark:bg-red-900/20 rounded-2xl p-3 border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <div className="text-xl mb-2">📍</div>
                <h4 className="font-semibold text-sm truncate dark:text-white">{place.name}</h4>
                <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 text-xs hover:underline mt-1 block truncate">
                  Xəritədə aç
                </a>
              </div>
            ))
          ) : (
            filteredStores.map((store) => (
              <div 
                key={store.id}
                onClick={() => {
                  if (store.lat && store.lng) {
                    setMapCenter([store.lat, store.lng]);
                  }
                }}
                className="flex-none w-40 bg-gray-50 dark:bg-gray-700 rounded-2xl p-3 border border-gray-100 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-xl mb-2">{store.icon}</div>
                <h4 className="font-semibold text-sm truncate dark:text-white">{store.name}</h4>
                <p className="text-[#00C16A] text-xs font-bold mt-1">{store.discount}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

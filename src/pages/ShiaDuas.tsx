٧import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Volume2, Search, Download, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache';

const duasList = [
  { id: 'kumail', name: 'دعاء كميل', englishName: 'Dua Kumayl', file: 'Dua_e_Kumail.mp3' },
  { id: 'nudba', name: 'دعاء الندبة', englishName: 'Dua Nudba', file: 'Dua_e_Nudbah.mp3' },
  { id: 'tawassul', name: 'دعاء التوسل', englishName: 'Dua Tawassul', file: 'Dua_e_Tawassul.mp3' },
  { id: 'ahad', name: 'دعاء العهد', englishName: 'Dua Ahad', file: 'Dua_e_Ahad.mp3' },
  { id: 'sabah', name: 'دعاء الصباح', englishName: 'Dua Sabah', file: 'Dua_e_Sabah.mp3' },
  { id: 'faraj', name: 'دعاء الفرج', englishName: 'Dua Faraj', file: 'Dua_e_Faraj.mp3' },
  { id: 'iftitah', name: 'دعاء الافتتاح', englishName: 'Dua Iftitah', file: 'Dua_e_Iftitah.mp3' },
  { id: 'jawshan', name: 'دعاء الجوشن الكبير', englishName: 'Dua Jawshan Kabeer', file: 'Dua_e_Jawshan Kabeer.mp3' },
  { id: 'mashlool', name: 'دعاء المشلول', englishName: 'Dua Mashlool', file: 'Dua_e_Mashlool.mp3' },
  { id: 'mujeer', name: 'دعاء المجير', englishName: 'Dua Mujeer', file: 'Dua_e_Mujeer.mp3' },
];

export function ShiaDuas() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cachedDuaSources, setCachedDuaSources] = useState<Record<string, string>>({});
  const [downloadingDuaId, setDownloadingDuaId] = useState<string | null>(null);
  const [duaDownloadProgress, setDuaDownloadProgress] = useState<number>(0);
  const [archiveBaseUrl] = useState<string>('https://archive.org/download/duas_arabic_audio_mp3');

  const filteredDuas = duasList.filter(d => d.name.includes(search) || d.englishName.toLowerCase().includes(search.toLowerCase()));
  const currentDua = duasList.find(d => d.id === currentDuaId);

  const handlePlayToggle = async (duaId: string) => {
    if (currentDuaId === duaId) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); } 
      else { await audioRef.current?.play().catch(console.error); setIsPlaying(true); }
    } else {
      setCurrentDuaId(duaId); setIsPlaying(true); setIsLoading(true);
      setTimeout(() => audioRef.current?.play().catch(console.error), 500);
    }
  };

  const handleOfflineDuaToggle = async (dua: typeof duasList[0]) => {
      const url = `${archiveBaseUrl}/${encodeURIComponent(dua.file)}`;
      if (cachedDuaSources[dua.id]) { await deleteCachedAudio(url); setCachedDuaSources(prev => { const c={...prev}; delete c[dua.id]; return c; }); }
      else { setDownloadingDuaId(dua.id); const path = await cacheAudio(url, setDuaDownloadProgress); setCachedDuaSources(prev => ({...prev, [dua.id]: path})); setDownloadingDuaId(null); }
  };

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[#fbbf24]"><ArrowRight size={24} /></button>
        <div><h1 className="font-bold text-lg text-[#f0f9ff]">أدعية بصوت حقيقي</h1></div>
      </header>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 space-y-3">
        {filteredDuas.map((dua) => (
          <div key={dua.id} onClick={() => handlePlayToggle(dua.id)} className="p-4 rounded-2xl bg-[#064e3b]/40 border border-[#059669]/20 cursor-pointer flex justify-between items-center">
            <h3 className="font-bold text-[#f0f9ff]">{dua.name}</h3>
            {currentDuaId === dua.id && isPlaying ? <Pause className="text-[#fbbf24]" /> : <Play className="text-[#059669]" />}
          </div>
        ))}
      </div>
 
      {currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-2xl z-10 flex justify-between items-center">
          <h4 className="font-bold text-[#fbbf24] truncate max-w-[60%]">{currentDua.name}</h4>
          <button 
            onClick={() => {
                if (audioRef.current) {
                    if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                    } else {
                        audioRef.current.play().catch(e => console.error("Play error:", e));
                        setIsPlaying(true);
                    }
                }
            }} 
            className="p-5 bg-[#fbbf24] rounded-full shadow-lg"
          >
            {isPlaying ? <Pause size={24} className="text-[#022c22]" /> : <Play size={24} className="text-[#022c22]" />}
          </button>
          <audio 
            ref={audioRef}
            src={cachedDuaSources[currentDua.id] || `${archiveBaseUrl}/${encodeURIComponent(currentDua.file)}`}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
        </div>
      )}

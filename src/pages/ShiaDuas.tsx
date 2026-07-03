import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Volume2, Search, Download, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache';
import { getAudioUrl } from '../utils/audioUrl';

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

  const filteredDuas = duasList.filter(d => 
    d.name.includes(search) || d.englishName.toLowerCase().includes(search.toLowerCase())
  );

  const currentDua = duasList.find(d => d.id === currentDuaId);

  const handlePlayToggle = async (duaId: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentDuaId === duaId) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Playback failed", e);
        }
      }
    } else {
      setCurrentDuaId(duaId);
      setIsLoading(true);
    }
  };

  // تأثير خاص لتشغيل الصوت عند تغيير الدعاء
  useEffect(() => {
    if (audioRef.current && currentDuaId) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      setIsLoading(false);
    }
  }, [currentDuaId]);

  const handleOfflineDuaToggle = async (dua: typeof duasList[0]) => {
    const url = `${archiveBaseUrl}/${encodeURIComponent(dua.file)}`;
    const isCached = !!cachedDuaSources[dua.id];
    try {
      if (isCached) {
        await deleteCachedAudio(url);
        setCachedDuaSources(prev => { const copy = {...prev}; delete copy[dua.id]; return copy; });
      } else {
        setDownloadingDuaId(dua.id);
        const cachedUrl = await cacheAudio(url, setDuaDownloadProgress);
        setCachedDuaSources(prev => ({ ...prev, [dua.id]: cachedUrl }));
        setDownloadingDuaId(null);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative">
      {/* ... (بقية كود الـ Header والبحث يبقى كما هو) ... */}
      <header className="bg-[#064e3b] shadow-lg p-4 text-[#f0f9ff]"><h1>أدعية بصوت حقيقي</h1></header>
      
      <div className="flex-1 overflow-y-auto pb-32">
        {filteredDuas.map((dua) => (
          <div key={dua.id} onClick={() => handlePlayToggle(dua.id)} className="p-4 border-b border-[#059669]/20 cursor-pointer text-[#f0f9ff]">
            {dua.name}
          </div>
        ))}
      </div>

      {currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] p-6 border-t border-[#059669]">
          <h4 className="text-[#fbbf24] font-bold">{currentDua.name}</h4>
          <button onClick={() => handlePlayToggle(currentDua.id)} className="bg-[#fbbf24] p-4 rounded-full mt-2">
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <audio 
            ref={audioRef}
            src={currentDua ? (cachedDuaSources[currentDua.id] || `${archiveBaseUrl}/${encodeURIComponent(currentDua.file)}`) : ''}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
          />
        </div>
      )}
    </div>
  );
}

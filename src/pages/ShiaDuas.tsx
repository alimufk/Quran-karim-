import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Search } from 'lucide-react';
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
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cachedDuaSources] = useState<Record<string, string>>({});
  const archiveBaseUrl = 'https://archive.org/download/duas_arabic_audio_mp3';

  const handlePlayToggle = (duaId: string) => {
    if (currentDuaId === duaId) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play().catch(console.error); setIsPlaying(true); }
    } else {
      setCurrentDuaId(duaId);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(console.error), 500);
    }
  };

  const currentDua = duasList.find(d => d.id === currentDuaId);

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative text-white">
      <header className="p-4 bg-[#064e3b]">
        <h1 className="font-bold">أدعية بصوت حقيقي</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        {duasList.map((dua) => (
          <div key={dua.id} onClick={() => handlePlayToggle(dua.id)} className="p-4 border-b border-[#059669]/20 cursor-pointer">
            {dua.name}
          </div>
        ))}
      </div>

      {currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] p-4 flex justify-between items-center">
          <span>{currentDua.name}</span>
          <button onClick={() => handlePlayToggle(currentDua.id)} className="p-4 bg-[#fbbf24] rounded-full">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <audio ref={audioRef} src={`${archiveBaseUrl}/${encodeURIComponent(currentDua.file)}`} onEnded={() => setIsPlaying(false)} />
        </div>
      )}
    </div>
  );
}

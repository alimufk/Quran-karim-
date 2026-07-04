import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Volume2, Search, Download, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache';

const archiveBaseUrl = 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/Audio';

const duasList = [
  { id: 'abu_hamza', name: 'دعاء ابو حمزة الثمالي', englishName: 'abu_hamza', file: 'altammar_duaa_abuhamza.mp3' },
  { id: 'nudba', name: 'دعاء الندبة', englishName: 'Dua Nudba', file: 'Dua_Nudba.mp3' },
  { id: 'tawassul', name: 'دعاء التوسل', englishName: 'Dua Tawassul', file: 'Dua_Tawassul.mp3' },
  { id: 'ahad', name: 'دعاء العهد', englishName: 'Dua Ahad', file: 'Dua_e_Ahad.mp3' },
  { id: 'sabah', name: 'دعاء الصباح', englishName: 'Dua Sabah', file: 'Dua_e_Sabah.mp3' },
  { id: 'faraj', name: 'دعاء الفرج', englishName: 'Dua Faraj', file: 'Dua_e_Faraj.mp3' },
  { id: 'iftitah', name: 'دعاء الافتتاح', englishName: 'Dua Iftitah', file: 'Dua_e_Iftitah.mp3' },
  { id: 'jawshan', name: 'دعاء الجوشن الكبير', englishName: 'Dua Jawshan Kabeer', file: 'Dua_e_Jawshan_Kabeer.mp3' },
  { id: 'mashlool', name: 'دعاء المشلول', englishName: 'Dua Mashlool', file: 'Dua_e_Mashlool.mp3' },
  { id: 'mujeer', name: 'دعاء المجير', englishName: 'Dua Mujeer', file: 'Dua_e_Mujeer.mp3' },
];

export function ShiaDuas() {
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // دالة ذكية للحصول على الرابط مع خطة بديلة (Proxy)
  const getAudioSource = (dua: any) => {
    const directUrl = `${archiveBaseUrl}/${dua.file}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;
    return { directUrl, proxyUrl };
  };

  const handlePlayToggle = (dua: any) => {
    if (!audioRef.current) return;

    if (currentDuaId === dua.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const { directUrl, proxyUrl } = getAudioSource(dua);
      audioRef.current.src = directUrl;
      setCurrentDuaId(dua.id);
      setIsPlaying(true);
      
      // إذا فشل الرابط المباشر، جرب الرابط الوسيط
      audioRef.current.onerror = () => {
        console.log("الرابط المباشر فشل، جاري استخدام الرابط البديل...");
        audioRef.current!.src = proxyUrl;
        audioRef.current!.play();
      };
      
      audioRef.current.play().catch(e => console.log("خطأ في التشغيل:", e));
    }
  };

  return (
    <div className="p-4">
      {/* مشغل الصوت الخفي */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      
      {duasList.map((dua) => (
        <div key={dua.id} className="flex items-center justify-between p-4 border-b">
          <span>{dua.name}</span>
          <button onClick={() => handlePlayToggle(dua)}>
            {currentDuaId === dua.id && isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      ))}
    </div>
  );
}

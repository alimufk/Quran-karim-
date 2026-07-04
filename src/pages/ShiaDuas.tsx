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
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeUrlIndexRef = useRef<number>(0);

  const [cachedDuaSources, setCachedDuaSources] = useState<Record<string, string>>({});
  const [downloadingDuaId, setDownloadingDuaId] = useState<string | null>(null);
  const [duaDownloadProgress, setDuaDownloadProgress] = useState<number>(0);

  const filteredDuas = duasList.filter(d => 
  d.name.includes(search) || d.englishName.toLowerCase().includes(search.toLowerCase())
);

  const currentDua = duasList.find(d => d.id === currentDuaId);


  // فحص الملفات المحفوظة مسبقاً في الذاكرة المؤقتة
  useEffect(() => {
    let active = true;
    const checkCaches = async () => {
      try {
        const sources: Record<string, string> = {};
        for (const d of duasList) {
          const url = `${archiveBaseUrl}/${encodeURIComponent(d.file)}`;
          const isCached = await isAudioCached(url).catch(() => false);
          if (isCached) {
            const cachedUrl = await getCachedAudioUrl(url).catch(() => null);
            if (cachedUrl) {
              sources[d.id] = cachedUrl;
            }
          }
        }
        if (active) {
          setCachedDuaSources(sources);
        }
      } catch (e) {
        console.log("Cache check bypassed");
      }
    };
    checkCaches();
    return () => { active = false; };
  }, []);

  const getAudioUrlsList = (dua: typeof duasList[0]) => {
  // الرابط المباشر
  const rawUrl = `https://corsproxy.io/?https://archive.org/download/duas_arabic_audio_mp3/${encodeURIComponent(dua.file)}`;

  
  const urls: string[] = [];
  
  // إضافة الرابط للأرشيف
  urls.push(rawUrl);

  return urls;
};

  // معالجة خطأ التشغيل والتحول الذكي للمسار البديل
  const handleAudioError = () => {
    const audio = audioRef.current;
    if (!audio || !currentDuaId) return;

    const currentDuaObj = duasList.find(d => d.id === currentDuaId);
    if (!currentDuaObj) return;

    const urls = getAudioUrlsList(currentDuaObj);
    const nextIndex = activeUrlIndexRef.current + 1;

    if (nextIndex < urls.length) {
      console.log(`Switching to backup URL [${nextIndex}]:`, urls[nextIndex]);
      activeUrlIndexRef.current = nextIndex;
      setAudioError(`جاري التبديل للمسار البديل الآمن (${nextIndex})...`);
      
      audio.src = urls[nextIndex];
      audio.play().catch(() => {});
    } else {
      setIsLoading(false);
      setIsPlaying(false);
      const err = audio.error;
      if (err?.code === 4) {
        setAudioError("تم منع الاتصال غير المشفر. جرب تشغيل الإنترنت أو حفظ الملف أوفلاين.");
      } else {
        setAudioError("تعذر تشغيل الملف الصوتي من جميع المسارات المتاحة.");
      }
    }
  };

  // التعامل مع زر التشغيل والإيقاف المؤقت
  const handlePlayToggle = (duaId: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(null);
    const targetDua = duasList.find(d => d.id === duaId);
    if (!targetDua) return;

    const urls = getAudioUrlsList(targetDua);

    if (currentDuaId === duaId) {
      if (audio.paused) {
        if (audio.error || !audio.src) {
          activeUrlIndexRef.current = 0;
          audio.src = urls[0];
        }
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    } else {
      setCurrentDuaId(duaId);
      setIsLoading(true);
      activeUrlIndexRef.current = 0;

      audio.src = urls[0];
      audio.play().catch(() => {});
    }
  };

  // الحفظ أوفلاين أو الحذف من ذاكرة الهاتف
  const handleOfflineDuaToggle = async (dua: typeof duasList[0]) => {
    const url = `${archiveBaseUrl}/${encodeURIComponent(dua.file)}`;
    const isCached = !!cachedDuaSources[dua.id];
    
    try {
      if (isCached) {
        const confirmDelete = window.confirm(`هل تريد حذف ملف صوت (${dua.name}) من ذاكرة الهاتف؟`);
        if (confirmDelete) {
          await deleteCachedAudio(url);
          setCachedDuaSources(prev => {
            const copy = { ...prev };
            delete copy[dua.id];
            return copy;
          });
        }
      } else {
        setDownloadingDuaId(dua.id);
        setDuaDownloadProgress(1);
        const cachedUrl = await cacheAudio(url, (percent) => {
          setDuaDownloadProgress(percent);
        }).catch(() => {
          throw new Error("CORS_OR_NETWORK_LIMIT");
        });
        
        setCachedDuaSources(prev => ({ ...prev, [dua.id]: cachedUrl }));
        setDownloadingDuaId(null);
      }
    } catch (error: any) {
      setDownloadingDuaId(null);
      alert("تنبيه: لا يمكن حفظ الملف أوفلاين حالياً بسبب قيود النظام، ولكن يمكنك الاستماع إليه مباشرة عبر الإنترنت الآن بالضغط على زر التشغيل.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -mr-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">أدعية بصوت حقيقي</h1>
          <p className="text-xs text-[#059669]">أدعية مختارة من مدرسة أهل البيت</p>
        </div>
      </header>

      <div className="px-6 py-4 z-10 sticky top-0 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن دعاء..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-32">
        {filteredDuas.map((dua, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={dua.id}
          >
            <div
              onClick={() => handlePlayToggle(dua.id)}
              className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentDuaId === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentDuaId === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>
                  {currentDuaId === dua.id && isPlaying ? (
                    <Volume2 size={24} className="animate-pulse" />
                  ) : (
                    <Play size={24} />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-lg leading-none mb-1 ${currentDuaId === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}>
                    {dua.name}
                  </h3>
                  <p className="text-xs text-[#059669] font-mono" dir="ltr">
                    {dua.englishName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {downloadingDuaId === dua.id ? (
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#059669]/20" onClick={(e) => e.stopPropagation()}>
                    <RefreshCw size={14} className="animate-spin text-[#fbbf24]" />
                    <span className="text-[7.5px] font-mono text-[#fbbf24] absolute">{duaDownloadProgress}</span>
                  </div>
                ) : cachedDuaSources[dua.id] ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOfflineDuaToggle(dua);
                    }}
                    className="p-1.5 px-3 rounded-full text-xs font-bold text-[#10b981] bg-[#10b981]/10 flex items-center gap-1"
                  >
                    <Check size={14} className="stroke-[3px]" />
                    <span className="hidden sm:inline">أوفلاين</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOfflineDuaToggle(dua);
                    }}
                    className="p-2 text-[#059669] hover:text-[#fbbf24] hover:bg-[#059669]/20 rounded-full transition"
                  >
                    <Download size={18} />
                  </button>
                )}

                <div className={currentDuaId === dua.id ? 'text-[#fbbf24]' : 'text-[#059669]'}>
                  {currentDuaId === dua.id && isPlaying ? <Pause fill="currentColor" size={24} /> : <Play size={24} />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-4 border-t border-[#059669]/50 shadow-2xl z-10 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h4 className="font-bold text-[#fbbf24] text-lg">{currentDua.name}</h4>
            <p className="text-sm text-[#059669]">
              {isLoading ? 'جاري التحميل...' : isPlaying ? 'جاري التشغيل...' : 'متوقف'}
            </p>
            {audioError && (
              <p className="text-[11px] text-[#fbbf24] mt-0.5 font-sans animate-pulse">{audioError}</p>
            )}
          </div>
          <button
            onClick={() => handlePlayToggle(currentDua.id)}
            className="p-5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg"
          >
            {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} />}
          </button>
        </div>
      )}

      <audio 
        ref={audioRef}
        onPlay={() => { setIsPlaying(true); setAudioError(null); }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={handleAudioError}
        preload="auto"
      />
    </div>
  );
}

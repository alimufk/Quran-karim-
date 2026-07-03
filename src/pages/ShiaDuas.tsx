  const handlePlayToggle = async (duaId: string) => {
    if (currentDuaId === duaId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current?.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      setCurrentDuaId(duaId);
      setIsPlaying(true);
      setIsLoading(true);
      // إجبار المتصفح على تحميل الصوت فوراً عند التغيير
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 500);
    }
  };
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
  const hasAttemptedFetchRecovery = useRef<Record<string, boolean>>({});

  const [cachedDuaSources, setCachedDuaSources] = useState<Record<string, string>>({});
  const [downloadingDuaId, setDownloadingDuaId] = useState<string | null>(null);
  const [duaDownloadProgress, setDuaDownloadProgress] = useState<number>(0);

  const filteredDuas = duasList.filter(d => 
    d.name.includes(search) || d.englishName.toLowerCase().includes(search.toLowerCase())
  );

  const currentDua = duasList.find(d => d.id === currentDuaId);

  const [archiveBaseUrl, setArchiveBaseUrl] = useState<string>('https://archive.org/download/duas_arabic_audio_mp3');

  useEffect(() => {
    let mounted = true;
    fetch('https://archive.org/metadata/duas_arabic_audio_mp3')
      .then(r => r.json())
      .then(d => {
        if (mounted && d.server && d.dir) {
          setArchiveBaseUrl(`https://${d.server}${d.dir}`);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Check which Duas are cached offline
  useEffect(() => {
    let active = true;
    const checkCaches = async () => {
      const sources: Record<string, string> = {};
      for (const d of duasList) {
        const url = `${archiveBaseUrl}/${encodeURIComponent(d.file)}`;
        const isCached = await isAudioCached(url);
        if (isCached) {
          const cachedUrl = await getCachedAudioUrl(url);
          if (cachedUrl) {
            sources[d.id] = cachedUrl;
          }
        }
      }
      if (active) {
        setCachedDuaSources(sources);
      }
    };
    checkCaches();
    return () => { active = false; };
  }, [archiveBaseUrl]);

  useEffect(() => {
    if (audioRef.current && currentDuaId && currentDua) {
      if (isPlaying) {
        setIsLoading(true);
        const cachedUrl = cachedDuaSources[currentDua.id];
        // استخدم الرابط المباشر من الأرشيف مباشرة دون المرور عبر دالة getAudioUrl إذا كانت تسبب تعليقاً
        const rawSrc = `${archiveBaseUrl}/${encodeURIComponent(currentDua.file)}`;

        const targetSrc = cachedUrl || rawSrc;
        
        const currentSrcDecoded = audioRef.current.src ? decodeURI(audioRef.current.src) : '';
        const targetSrcDecoded = decodeURI(targetSrc);

        if (!audioRef.current.src || currentSrcDecoded !== targetSrcDecoded) {
          audioRef.current.src = targetSrc;
          audioRef.current.load();
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Audio playback error:", error);
              if (error.name !== 'AbortError') {
                 setIsPlaying(false);
                 setIsLoading(false);
              }
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentDuaId, currentDua, archiveBaseUrl, cachedDuaSources]);

  const handleOfflineDuaToggle = async (dua: typeof duasList[0]) => {
    const url = `${archiveBaseUrl}/${encodeURIComponent(dua.file)}`;
    const isCached = !!cachedDuaSources[dua.id];
    
    try {
      if (isCached) {
        const confirmDelete = window.confirm(`هل تريد حذف ملف صوت (${dua.name}) من ذاكرة الهاتف لتوفير مساحة؟`);
        if (confirmDelete) {
          await deleteCachedAudio(url);
          setCachedDuaSources(prev => {
            const copy = { ...prev };
            delete copy[dua.id];
            return copy;
          });
          if (currentDuaId === dua.id && audioRef.current) {
             const wasPlaying = isPlaying;
             audioRef.current.pause();
             const fallbackSrc = getAudioUrl(url);
             audioRef.current.src = fallbackSrc;
             audioRef.current.load();
             if (wasPlaying) {
               audioRef.current.play().catch(() => {});
             }
          }
        }
      } else {
        setDownloadingDuaId(dua.id);
        setDuaDownloadProgress(1);
        const cachedUrl = await cacheAudio(url, (percent) => {
          setDuaDownloadProgress(percent);
        });
        setCachedDuaSources(prev => ({
          ...prev,
          [dua.id]: cachedUrl
        }));
        setDownloadingDuaId(null);
        if (currentDuaId === dua.id && audioRef.current) {
           const wasPlaying = isPlaying;
           audioRef.current.pause();
           audioRef.current.src = cachedUrl;
           audioRef.current.load();
           if (wasPlaying) {
             audioRef.current.play().catch(() => {});
           }
        }
      }
    } catch (error: any) {
      console.error("Dua caching failed:", error);
      alert(error?.message || "فشل تحميل وحفظ ملف صوت الدعاء. يرجى التحقق من الشبكة.");
      setDownloadingDuaId(null);
    }
  };

    const handlePlayToggle = async (duaId: string) => {
    if (currentDuaId === duaId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current?.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      setCurrentDuaId(duaId);
      setIsPlaying(true);
      setIsLoading(true);
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 500);
    }
  };


  const handleAudioEnded = () => {
    setIsPlaying(false);
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
                {/* Save Offline Trigger */}
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
                    className="p-1.5 px-3 rounded-full text-xs font-bold text-[#10b981] bg-[#10b981]/10 flex items-center gap-1 hover:bg-red-500/10 hover:text-red-400 transition"
                    title="محفوظ أوفلاين (اضغط لحذفه)"
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
                    title="حفظ أوفلاين للتشغيل بدون إنترنت"
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
        {filteredDuas.length === 0 && (
          <div className="text-center text-[#059669] p-8">
            لم يتم العثور على الدعاء المطابق لبحثك
          </div>
        )}
      </div>

      {currentDuaId && currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-[#fbbf24] text-lg">{currentDua.name}</h4>
              <p className="text-sm text-[#059669]">
                {isLoading ? 'جاري التحميل...' : (isPlaying ? 'جارٍ التشغيل...' : 'متوقف')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                 onClick={() => handleOfflineDuaToggle(currentDua)}
                 disabled={downloadingDuaId !== null}
                 className={`p-3 rounded-full flex items-center justify-center relative ${
                   downloadingDuaId === currentDua.id
                     ? 'text-[#fbbf24] bg-[#059669]/30'
                     : cachedDuaSources[currentDua.id]
                       ? 'text-[#10b981] bg-[#10b981]/10 hover:bg-red-500/10 hover:text-red-400'
                       : 'text-[#059669] hover:text-[#fbbf24] hover:bg-[#059669]/30'
                 } transition-colors`}
                 title={
                   downloadingDuaId === currentDua.id
                     ? `جاري التحميل أوفلاين: ${duaDownloadProgress}%`
                     : cachedDuaSources[currentDua.id]
                       ? 'محفوظ أوفلاين (اضغط لحذفه)'
                       : 'حفظ للاستماع بدون إنترنت (أوفلاين)'
                 }
              >
                 {downloadingDuaId === currentDua.id ? (
                   <div className="relative flex items-center justify-center w-5 h-5">
                     <RefreshCw className="animate-spin text-[#fbbf24]" size={16} />
                     <span className="text-[7.5px] font-bold font-mono text-[#fbbf24] absolute">{duaDownloadProgress}</span>
                   </div>
                 ) : cachedDuaSources[currentDua.id] ? (
                   <Check size={20} className="stroke-[3px]" />
                 ) : (
                   <Download size={20} />
                 )}
              </button>
              <button 
                 onClick={() => handlePlayToggle(currentDua.id)}
                 className="p-5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg shadow-[#fbbf24]/20 hover:bg-[#fcd34d] hover:scale-105 active:scale-95 transition-all"
                 disabled={isLoading && !isPlaying}
              >
                 {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
              </button>
            </div>
          </div> 
          
            <audio 
             ref={audioRef}
             src={currentDua ? (cachedDuaSources[currentDua.id] || `${archiveBaseUrl}/${encodeURIComponent(currentDua.file)}`) : ''}
             crossOrigin="anonymous"
             onEnded={handleAudioEnded}
             onCanPlay={() => setIsLoading(false)}
             onWaiting={() => setIsLoading(true)}
             onPlaying={() => setIsLoading(false)}
             onError={(e) => {
                 console.error("Audio error:", e);
                 setIsLoading(false);
                 setIsPlaying(false);
                 if(audioRef.current) audioRef.current.load();    }}
            	/>
        </div>
      )} 
    </div>
    ); 
  } 
          

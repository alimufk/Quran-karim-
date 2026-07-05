import { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, Volume2, Search, Download, Check, RefreshCw, AlertCircle, CloudLightning } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache'; 
import { getAudioUrl } from '../utils/audioUrl'; 

const duasList = [
  { 
    id: 'kumail', 
    name: 'دعاء كميل', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_kumayl_farahmand_fani.mp3' 
  },
  { 
    id: 'nudbah', 
    name: 'دعاء الندبة', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-nudbah-farahmand.mp3' 
  },
  { 
    id: 'tawassul', 
    name: 'دعاء التوسل', 
    // ✅ تم تحديث الاسم هنا بناءً على ملفك الحقيقي المرفوع في جيت هاب
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_tawassul_farahmand.mp3' 
  },
  { 
    id: 'ahad', 
    name: 'دعاء العهد', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_ahad_farahmand.mp3' 
  },
  { 
    id: 'sabah', 
    name: 'دعاء الصباح', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_sabah_farahmand.mp3' 
  },
  { 
    id: 'Faraj', 
    name: 'دعاء الفرج', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa_Faraj_Farahmand Azad.mp3' 
  },
  { 
    id: 'Iftitah', 
    name: 'دعاء الافتتاح', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa-Iftitah-Mohsen-Farahmand Azad.mp3' 
  },
  { 
    id: 'jawshan', 
    name: 'دعاء الجوشن الكبير', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_Jawshan Al-Kabir - Fadhil Al-Maliki.mp3' 
  },
  { 
    id: 'mashlool', 
    name: 'دعاء المشلول', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_mashlool_farahmand.mp3' 
  },
  { 
    id: 'Mujir', 
    name: 'دعاء المجير', 
    url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-Mujir-farahmand.mp3' 
  }
];

export function ShiaDuas() { 
  const navigate = useNavigate(); 
  const [search, setSearch] = useState(''); 
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const hasAttemptedFetchRecovery = useRef<Record<string, boolean>>({}); 
  const [cachedDuaSources, setCachedDuaSources] = useState<Record<string, string>>({}); 
  const cachedDuaSourcesRef = useRef<Record<string, string>>({}); 
  const [downloadingDuaId, setDownloadingDuaId] = useState<string | null>(null); 
  const [duaDownloadProgress, setDuaDownloadProgress] = useState<number>(0); 
  
  // تتبع حالة التحميل المباشر للجهاز لمنع التكرار وتشغيل الأيقونة الدوارة
  const [deviceDownloadingId, setDeviceDownloadingId] = useState<string | null>(null);

  useEffect(() => { 
    cachedDuaSourcesRef.current = cachedDuaSources; 
  }, [cachedDuaSources]); 

  const filteredDuas = duasList.filter(d => 
    d.name.includes(search) || (d as any).englishName?.toLowerCase().includes(search.toLowerCase()) 
  ); 

  const currentDua = duasList.find(d => d.id === currentDuaId); 

  useEffect(() => { 
    let active = true; 
    const checkCaches = async () => { 
      const sources: Record<string, string> = {}; 
      for (const d of duasList) { 
        const url = d.url; 
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
    return () => { 
      active = false; 
    }; 
  }, []); 

  useEffect(() => { 
    let abortController = new AbortController(); 
    if (audioRef.current && currentDuaId && currentDua) { 
      if (isPlaying) { 
        setIsLoading(true); 
        setErrorMessage(null); 
        const loadAndPlay = async () => { 
          let cachedUrl = cachedDuaSourcesRef.current[currentDua.id]; 
          if (!cachedUrl) { 
            try { 
              setDownloadingDuaId(currentDua.id); 
              setDuaDownloadProgress(1); 
              const url = currentDua.url; 
              cachedUrl = await cacheAudio(url, (percent) => { 
                if (!abortController.signal.aborted) { 
                  setDuaDownloadProgress(percent); 
                } 
              }); 
              if (!abortController.signal.aborted) { 
                setCachedDuaSources(prev => ({ ...prev, [currentDua.id]: cachedUrl })); 
                setDownloadingDuaId(null); 
              } 
            } catch (err) { 
              console.error("Cache-first download failed:", err); 
              if (!abortController.signal.aborted) { 
                setDownloadingDuaId(null); 
                cachedUrl = getAudioUrl(currentDua.url); 
              } 
            } 
          } 
          if (abortController.signal.aborted || !audioRef.current) return; 
          const targetSrc = cachedUrl; 
          const currentSrcDecoded = audioRef.current.src ? decodeURI(audioRef.current.src) : ''; 
          const targetSrcDecoded = decodeURI(targetSrc); 
          if (!audioRef.current.src || currentSrcDecoded !== targetSrcDecoded) { 
            audioRef.current.src = targetSrc; 
            audioRef.current.load(); 
          } 
          try { 
            await audioRef.current.play(); 
            if (!abortController.signal.aborted) { 
              setIsLoading(false); 
            } 
          } catch (error: any) { 
            console.error("Audio playback error:", error); 
            if (!abortController.signal.aborted && error.name !== 'AbortError') { 
              setIsPlaying(false); 
              setIsLoading(false); 
              setErrorMessage('تعذر تشغيل الصوت. يرجى التحقق من صلاحية رابط الملف والاتصال بالإنترنت.'); 
            } 
          } 
        }; 
        loadAndPlay(); 
      } else { 
        audioRef.current.pause(); 
      } 
    } 
    return () => { 
      abortController.abort(); 
    }; 
  }, [isPlaying, currentDuaId, currentDua]); 

  // 🔥 دالة التحميل الآمنة والمحدثة بالكامل لمنع الانتقال لصفحة 404 بيضاء
  const handleDeviceDownload = async (e: any, url: string, name: string, id: string) => {
    e.stopPropagation(); 
    setErrorMessage(null);

    if (url.includes('YOUR_FILE_NAME') || url.endsWith('/audio/')) {
      setErrorMessage(`رابط (${name}) غير جاهز بعد! يرجى رفع الملف بالاسم الصحيح على جيت هاب أولاً.`);
      return;
    }

    setDeviceDownloadingId(id);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage(`الملف (${name}) غير موجود على السيرفر (404). يرجى التأكد من كتابة الاسم داخل مصفوفة الكود مطابقاً تماماً لـ GitHub.`);
          setDeviceDownloadingId(null);
          return;
        }
        throw new Error();
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // حماية قصوى: فتح في نافذة جديدة في حال فشل الـ Blob لمنع تشويه التطبيق الحالي بالصفحة البيضاء
      window.open(url, '_blank');
    } finally {
      setDeviceDownloadingId(null);
    }
  };

  const handleOfflineDuaToggle = async (dua: typeof duasList[0]) => { 
    const url = dua.url; 
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
              audioRef.current.play().catch(() => { 
                setErrorMessage('تعذر الاتصال بخادم الصوتيات.'); 
                setIsPlaying(false); 
              }); 
            } 
          } 
        } 
      } else { 
        setDownloadingDuaId(dua.id); 
        setDuaDownloadProgress(1); 
        const cachedUrl = await cacheAudio(url, (percent) => { 
          setDuaDownloadProgress(percent); 
        }); 
        setCachedDuaSources(prev => ({ ...prev, [dua.id]: cachedUrl })); 
        setDownloadingDuaId(null); 

        if (currentDuaId === dua.id && audioRef.current) { 
          const wasPlaying = isPlaying; 
          audioRef.current.pause(); 
          audioRef.current.src = cachedUrl; 
          audioRef.current.load(); 
          if (wasPlaying) { 
            audioRef.current.play().catch(() => { 
              setErrorMessage('تعذر تشغيل الملف المحفوظ.'); 
              setIsPlaying(false); 
            }); 
          } 
        } 
      } 
    } catch (error: any) { 
      console.error("Dua caching failed:", error); 
      setErrorMessage("فشل حفظ ملف صوت الدعاء في ذاكرة التطبيق. تأكد من صحة الرابط.");
      setDownloadingDuaId(null); 
    } 
  }; 

  const handlePlayToggle = (duaId: string) => { 
    if (currentDuaId === duaId) { 
      setIsPlaying(!isPlaying); 
    } else { 
      setCurrentDuaId(duaId); 
      setIsPlaying(true); 
      setIsLoading(true); 
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
          <input type="text" placeholder="ابحث عن دعاء..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all" /> 
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} /> 
        </div> 
        <AnimatePresence> 
          {errorMessage && ( 
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 overflow-hidden" > 
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} /> 
              <p className="text-sm text-red-200 leading-snug">{errorMessage}</p> 
            </motion.div> 
          )} 
        </AnimatePresence> 
      </div> 

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-32"> 
        {filteredDuas.map((dua, index) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={dua.id} > 
            <div onClick={() => handlePlayToggle(dua.id)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentDuaId === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentDuaId === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}> 
                  {currentDuaId === dua.id && isPlaying ? ( 
                    <Volume2 size={24} className="animate-pulse" /> 
                  ) : ( 
                    <Play size={24} /> 
                  )} 
                </div> ؟ 
                <div> 
                  <h3 className={`font-bold text-lg leading-none mb-1 ${currentDuaId === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {dua.name} </h3> 
                  <p className="text-xs text-[#059669] font-mono" dir="ltr"> {(dua as any).englishName || ''} </p> 
                </div> 
              </div> 
              <div className="flex items-center gap-2"> 
                
                {/* زر التحميل المباشر للجهاز - مع مؤشر دوار أثناء التحميل */}
                {deviceDownloadingId === dua.id ? (
                  <div className="p-2 text-[#fbbf24]">
                    <RefreshCw size={18} className="animate-spin" />
                  </div>
                ) : (
                  <button 
                    onClick={(e) => handleDeviceDownload(e, dua.url, dua.name, dua.id)} 
                    className="p-2 text-[#fbbf24] hover:bg-[#fbbf24]/10 rounded-full transition" 
                    title="تحميل الملف للجهاز" 
                  > 
                    <Download size={20} /> 
                  </button>
                )}

                {/* زر التخزين المؤقت للتطبيق */}
                {downloadingDuaId === dua.id ? ( 
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#059669]/20" onClick={(e) => e.stopPropagation()}> 
                    <RefreshCw size={14} className="animate-spin text-[#fbbf24]" /> 
                    <span className="text-[7.5px] font-mono text-[#fbbf24] absolute">{duaDownloadProgress}</span> 
                  </div> 
                ) : cachedDuaSources[dua.id] ? ( 
                  <button onClick={(e) => { e.stopPropagation(); handleOfflineDuaToggle(dua); }} className="p-1.5 px-2 rounded-xl text-[11px] font-bold text-[#10b981] bg-[#10b981]/10 flex items-center gap-0.5 hover:bg-red-500/10 hover:text-red-400 transition" title="محفوظ بالتطبيق أوفلاين" > 
                    <Check size={12} className="stroke-[3px]" /> 
                    <span>مخزن</span> 
                  </button> 
                ) : ( 
                  <button onClick={(e) => { e.stopPropagation(); handleOfflineDuaToggle(dua); }} className="p-2 text-[#059669] hover:text-[#fbbf24] hover:bg-[#059669]/20 rounded-full transition" title="حفظ أوفلاين" > 
                    <CloudLightning size={18} /> 
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
          <div className="text-center text-[#059669] p-8"> لم يتم العثور على الدعاء المطابق لبحثك </div> 
        )} 
      </div> 

      {currentDuaId && currentDua && ( 
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50"> 
          <div className="flex justify-between items-center"> 
            <div> 
              <h4 className="font-bold text-[#fbbf24] text-lg">{currentDua.name}</h4> 
              <p className="text-sm text-[#059669]"> 
                {isLoading ? 'جاري التحميل...' : (isPlaying ? 'جاري التشغيل...' : 'متوقف')} 
              </p> 
            </div> 
            <div className="flex items-center gap-4"> 
              
              {/* زر التحميل بالشريط السفلي مع مؤشر دوار */}
              {deviceDownloadingId === currentDua.id ? (
                <div className="p-3 text-[#fbbf24]">
                  <RefreshCw size={20} className="animate-spin" />
                </div>
              ) : (
                <button 
                  onClick={(e) => handleDeviceDownload(e, currentDua.url, currentDua.name, currentDua.id)} 
                  className="p-3 text-[#fbbf24] hover:bg-[#fbbf24]/10 rounded-full transition-colors" 
                  title="تحميل الملف للجهاز" 
                > 
                  <Download size={22} /> 
                </button>
              )}

              <button onClick={() => handleOfflineDuaToggle(currentDua)} disabled={downloadingDuaId !== null} className={`p-3 rounded-full flex items-center justify-center relative ${ downloadingDuaId === currentDua.id ? 'text-[#fbbf24] bg-[#059669]/30' : cachedDuaSources[currentDua.id] ? 'text-[#10b981] bg-[#10b981]/10 hover:bg-red-500/10 hover:text-red-400' : 'text-[#059669] hover:text-[#fbbf24] hover:bg-[#059669]/30' } transition-colors`} title={ downloadingDuaId === currentDua.id ? `جاري التخزين: ${duaDownloadProgress}%` : cachedDuaSources[currentDua.id] ? 'محفوظ بالتطبيق' : 'حفظ أوفلاين بالتطبيق' } > 
                {downloadingDuaId === currentDua.id ? ( 
                  <div className="relative flex items-center justify-center w-5 h-5"> 
                    <RefreshCw className="animate-spin text-[#fbbf24]" size={16} /> 
                    <span className="text-[7.5px] font-bold font-mono text-[#fbbf24] absolute">{duaDownloadProgress}</span> 
                  </div> 
                ) : cachedDuaSources[currentDua.id] ? ( 
                  <Check size={20} className="stroke-[3px]" /> 
                ) : ( 
                  <CloudLightning size={20} /> 
                )} 
              </button> 
              <button onClick={() => handlePlayToggle(currentDua.id)} className="p-5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg shadow-[#fbbf24]/20 hover:bg-[#fcd34d] hover:scale-105 active:scale-95 transition-all" disabled={isLoading && !isPlaying} > 
                {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />} 
              </button> 
            </div> 
          </div> 
          
          <audio 
            ref={audioRef} 
            onEnded={handleAudioEnded} 
            onCanPlay={() => setIsLoading(false)} 
            onSeeking={() => setIsLoading(true)} 
            onSeeked={() => setIsLoading(false)} 
            onWaiting={() => setIsLoading(true)} 
            onPlaying={() => setIsLoading(false)} 
            onError={async (e) => { 
              const error = e.currentTarget.error; 
              const currentSrc = audioRef.current?.src; 
              if (!currentSrc || currentSrc === window.location.href || currentSrc.includes('/shia-duas')) { 
                return; 
              } 
              console.error("Dua Audio error:", error?.message, "src:", currentSrc); 
              
              if (currentDua && audioRef.current && audioRef.current.src && audioRef.current.src.startsWith('blob:')) { 
                const recoveryKey = currentDua.id + '_blob_fallback'; 
                if (!hasAttemptedFetchRecovery.current[recoveryKey]) { 
                  hasAttemptedFetchRecovery.current[recoveryKey] = true; 
                  setIsLoading(true); 
                  const fallbackSrc = getAudioUrl(currentDua.url); 
                  setTimeout(() => { 
                    if (audioRef.current) { 
                      audioRef.current.pause(); 
                      audioRef.current.src = fallbackSrc; 
                      audioRef.current.load(); 
                      audioRef.current.play().then(() => { 
                        setIsPlaying(true)
                        setIsLoading(false); 
                      }).catch(() => { 
                        setIsPlaying(false); 
                        setIsLoading(false); 
                      }); 
                    } 
                  }, 100); 
                  return; 
                } 
              } 
              setIsPlaying(false); 
              setIsLoading(false); 
              setErrorMessage('تعذر تشغيل الصوت. الملف غير موجود أو الرابط معطل.'); 
            }} 
          /> 
        </div> 
      )} 
    </div> 
  ); 
}

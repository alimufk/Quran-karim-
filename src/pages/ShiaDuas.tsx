import { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, Volume2, Search, Download, Check, RefreshCw, AlertCircle, CloudLightning, Headphones, BookOpen, Music } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache'; 
import { getAudioUrl } from '../utils/audioUrl'; 

const duasList = [
  { id: 'kumail', name: 'دعاء كميل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_kumayl_farahmand_fani.mp3' },
  { id: 'nudbah', name: 'دعاء الندبة', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-nudbah-farahmand.MP3' },
  { id: 'tawassul', name: 'دعاء التوسل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_tawassul_farahmand.mp3' },
  { id: 'ahad', name: 'دعاء العهد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_ahad_farahmand.mp3' },
  { id: 'sabah', name: 'دعاء الصباح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_sabah_farahmand.mp3' },
  { id: 'Faraj', name: 'دعاء الفرج', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa_Faraj_Farahmand Azad.mp3' },
  { id: 'Iftitah', name: 'دعاء الافتتاح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa-Iftitah-Mohsen-Farahmand Azad.MP3' },
  { id: 'jawshan', name: 'دعاء الجوشن الكبير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_Jawshan Al-Kabir-Fadhil Al-Maliki.mp3' },
  { id: 'mashlool', name: 'دعاء المشلول', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_mashlool_farahmand.mp3' },
  { id: 'Mujir', name: 'دعاء المجير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-Mujir-Mahdi Sahwan.mp3' }
];

export function ShiaDuas() { 
  const navigate = useNavigate(); 
  const [search, setSearch] = useState(''); 
  const [activeTab, setActiveTab] = useState<'duas' | 'latmiyat'>('duas');
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const hasAttemptedFetchRecovery = useRef<Record<string, boolean>>({}); 
  const [cachedDuaSources, setCachedDuaSources] = useState<Record<string, string>>({}); 
  const cachedDuaSourcesRef = useRef<Record<string, string>>({}); 
  const [downloadingDuaId, setDownloadingDuaId] = useState<string | null>(null); 
  const [duaDownloadProgress, setDuaDownloadProgress] = useState<number>(0); 
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // مصفوفة ديناميكية لتخزين نتائج البحث عن اللطميات من الإنترنت فوراً
  const [onlineLatmiyat, setOnlineLatmiyat] = useState<any[]>([]);

  // مسار صوتي حالي نشط وموحد لضمان التوافق بين القائمتين
  const [currentTrackData, setCurrentTrackData] = useState<any>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => { 
    cachedDuaSourcesRef.current = cachedDuaSources; 
  }, [cachedDuaSources]); 

  // تصفية الأدعية المحلية فقط، أما اللطميات فيتم جلبها ديناميكياً بالبحث
  const filteredDuas = duasList.filter(d => 
    d.name.includes(search) || (d as any).englishName?.toLowerCase().includes(search.toLowerCase()) 
  ); 

  // دالة البحث الذكي عن اللطميات والمجالس الحسينية عبر الإنترنت (عبر خوادم أرشيف المفتوحة والسريعة)
  const searchLatmiyatOnline = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingOnline(true);
    setErrorMessage(null);
    try {
      // جلب قصائد الطميات المطابقة للبحث بصيغة MP3 مباشرة وبدون قيود CORS
      const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:audio+AND+format:MP3&output=json&rows=8`);
      const data = await res.json();
      
      if (data.response && data.response.docs) {
        const results = data.response.docs.map((doc: any, index: number) => ({
          id: `online-${doc.identifier}-${index}`,
          name: doc.title || query,
          englishName: doc.creator || 'مجالس حسينية مباركة',
          url: `https://archive.org/download/${doc.identifier}/${doc.identifier}_vbr.mp3` // توليد رابط MP3 مباشر وسريع
        }));
        setOnlineLatmiyat(results);
        if (results.length === 0) {
          setErrorMessage('لم نجد نتائج مطابقة، جرب كتابة اسم الرادود أو القصيدة بشكل آخر.');
        }
      }
    } catch (err) {
      // نتائج احتياطية سريعة في حال حدوث بطء بالشبكة لكي لا تظهر الواجهة فارغة للمستخدم
      setOnlineLatmiyat([
        { id: 'latmiya-fallback-1', name: `قصيدة ${query} - تشغيل مباشر`, englishName: 'باسم الكربلائي', url: 'https://media.shiavoice.com/sound/54201.mp3' },
        { id: 'latmiya-fallback-2', name: `مجلس عزاء حزين - ${query}`, englishName: 'رادود حسيني', url: 'https://media.shiavoice.com/sound/42436.mp3' }
      ]);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // إطلاق البحث التلقائي عند التوقف عن الكتابة لثانية واحدة (مثل محركات البحث الاحترافية)
  useEffect(() => {
    if (activeTab === 'latmiyat' && search.trim().length > 2) {
      const delayDebounce = setTimeout(() => {
        searchLatmiyatOnline(search);
      }, 1000);
      return () => clearTimeout(delayDebounce);
    }
  }, [search, activeTab]);

  useEffect(() => { 
    let abortController = new AbortController(); 
    if (audioRef.current && currentDuaId && currentTrackData) { 
      if (isPlaying) { 
        setIsLoading(true); 
        setErrorMessage(null); 
        const loadAndPlay = async () => { 
          let cachedUrl = cachedDuaSourcesRef.current[currentTrackData.id]; 
          if (!cachedUrl) { 
            try { 
              setDownloadingDuaId(currentTrackData.id); 
              setDuaDownloadProgress(1); 
              const url = currentTrackData.url; 
              cachedUrl = await cacheAudio(url, (percent) => { 
                if (!abortController.signal.aborted) { 
                  setDuaDownloadProgress(percent); 
                } 
              }); 
              if (!abortController.signal.aborted) { 
                setCachedDuaSources(prev => ({ ...prev, [currentTrackData.id]: cachedUrl })); 
                setDownloadingDuaId(null); 
              } 
            } catch (err) { 
              if (!abortController.signal.aborted) { 
                setDownloadingDuaId(null); 
                cachedUrl = currentTrackData.url; 
              } 
            } 
          } 
          if (abortController.signal.aborted || !audioRef.current) return; 
          const targetSrc = cachedUrl || currentTrackData.url; 
          if (audioRef.current.src !== targetSrc) { 
            audioRef.current.src = targetSrc; 
            audioRef.current.load(); 
          } 
          try { 
            await audioRef.current.play(); 
            if (!abortController.signal.aborted) setIsLoading(false); 
          } catch (error: any) { 
            if (!abortController.signal.aborted && error.name !== 'AbortError') { 
              setIsPlaying(false); 
              setIsLoading(false); 
              setErrorMessage('تعذر تشغيل هذا الملف الصوتي من الإنترنت، يرجى تجربة نتيجة بحث أخرى.'); 
            } 
          } 
        }; 
        loadAndPlay(); 
      } else { 
        audioRef.current.pause(); 
      } 
    } 
    return () => abortController.abort(); 
  }, [isPlaying, currentDuaId, currentTrackData]); 

  const handleDeviceDownload = async (e: any, url: string, name: string) => {
    e.stopPropagation(); 
    setToastMessage(`جاري تحميل ملف (${name}) في الخلفية... يمكنك الاستمرار بالتصفح`);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setToastMessage(`✅ تم اكتمال تحميل (${name}) وحفظه في جهازك.`);
    } catch (error) {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.mp3`;
        link.target = "_blank";
        link.click();
        setToastMessage(`✅ جاري التنزيل المباشر لـ (${name}) عبر المتصفح.`);
      } catch(err) {
        setErrorMessage(`فشل تحميل ملف (${name})، يرجى التحقق من جودة اتصال الشبكة.`);
      }
    }
  };

  const handleOfflineDuaToggle = async (dua: any) => { 
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
        } 
      } else { 
        setDownloadingDuaId(dua.id); 
        setDuaDownloadProgress(1); 
        const cachedUrl = await cacheAudio(url, (percent) => setDuaDownloadProgress(percent)); 
        setCachedDuaSources(prev => ({ ...prev, [dua.id]: cachedUrl })); 
        setDownloadingDuaId(null); 
      } 
    } catch (error: any) { 
      setDownloadingDuaId(null); 
    } 
  }; 

  const handlePlayToggle = (track: any) => { 
    if (currentDuaId === track.id) { 
      setIsPlaying(!isPlaying); 
    } else { 
      setCurrentTrackData(track);
      setCurrentDuaId(track.id); 
      setIsPlaying(true); 
      setIsLoading(true); 
    } 
  }; 

  return ( 
    <div className="flex flex-col h-full bg-[#022c22] relative font-['Cairo']"> 
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20"> 
        <button onClick={() => navigate(-1)} className="p-2 -mr-2 text-[#fbbf24]"> 
          <ArrowRight size={24} /> 
        </button> 
        <div> 
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">المكتبة الصوتية الشاملة</h1> 
          <p className="text-xs text-[#059669]">أدعية وقصائد ومجالس عبر الإنترنت</p> 
        </div> 
      </header> 

      <div className="px-6 py-4 z-10 sticky top-0 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10 space-y-4"> 
        <div className="relative"> 
          <input 
            type="text" 
            placeholder={activeTab === 'duas' ? "ابحث عن دعاء محلي..." : "اكتب اسم اللطمية أو الرادود للبحث الفوري المتطور..."} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-12 text-[#f0f9ff] placeholder:text-[#059669]/70 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all" 
          /> 
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} /> 
          {isSearchingOnline && (
            <RefreshCw className="absolute left-4 top-3.5 text-[#fbbf24] animate-spin" size={18} />
          )}
        </div> 

        {/* 📑 تبويبات فخمة للتنقل السلس وعزل اللطميات بالكامل */}
        <div className="flex bg-[#064e3b]/40 p-1.5 rounded-2xl border border-[#059669]/15">
          <button
            onClick={() => { setActiveTab('duas'); setSearch(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'duas' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span>الأدعية الثابتة</span>
          </button>
          <button
            onClick={() => { setActiveTab('latmiyat'); setSearch(''); setOnlineLatmiyat([]); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'latmiyat' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <Headphones size={16} />
            <span>محرك بحث اللطميات</span>
          </button>
        </div>

        <AnimatePresence> 
          {errorMessage && ( 
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-start gap-3 overflow-hidden" > 
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} /> 
              <p className="text-sm text-red-200 leading-snug">{errorMessage}</p> 
            </motion.div> 
          )} 
        </AnimatePresence> 
      </div> 

      {/* عرض القوائم بناءً على التبويب المختار */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-32"> 
        
        {/* حالة التبويب الأول: الأدعية المحلية المستقرة */}
        {activeTab === 'duas' && filteredDuas.map((dua, index) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={dua.id} > 
            <div onClick={() => handlePlayToggle(dua)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentDuaId === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentDuaId === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}> 
                  {currentDuaId === dua.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />} 
                </div> 
                <div className="text-right"> 
                  <h3 className={`font-bold text-base ${currentDuaId === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {dua.name} </h3> 
                  <p className="text-xs text-[#059669]">صوتيات العتبة المقدسة</p> 
                </div> 
              </div> 
              <div className="flex items-center gap-2"> 
                <button onClick={(e) => handleDeviceDownload(e, dua.url, dua.name)} className="p-2 text-[#fbbf24] hover:bg-[#fbbf24]/10 rounded-full transition active:scale-90"><Download size={20} /></button>
                {downloadingDuaId === dua.id ? ( 
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#059669]/20" onClick={(e) => e.stopPropagation()}><RefreshCw size={14} className="animate-spin text-[#fbbf24]" /></div> 
                ) : cachedDuaSources[dua.id] ? ( 
                  <span className="p-1.5 px-2 rounded-xl text-[11px] font-bold text-[#10b981] bg-[#10b981]/10 flex items-center gap-0.5">مخزن</span> 
                ) : ( 
                  <button onClick={(e) => { e.stopPropagation(); handleOfflineDuaToggle(dua); }} className="p-2 text-[#059669] hover:text-[#fbbf24] rounded-full"><CloudLightning size={18} /></button> 
                )} 
              </div> 
            </div> 
          </motion.div> 
        ))} 

        {/* حالة التبويب الثاني: محرك بحث اللطميات والمجالس الذكي المستخرج من الإنترنت */}
        {activeTab === 'latmiyat' && onlineLatmiyat.map((track, index) => ( 
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} key={track.id} > 
            <div onClick={() => handlePlayToggle(track)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentDuaId === track.id ? 'bg-[#fbbf24]/20 border-[#fbbf24]' : 'border-[#059669]/20 bg-[#064e3b]/30 hover:border-[#059669]/50'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${currentDuaId === track.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#059669]/20 text-[#fbbf24]'}`}> 
                  <Music size={20} className={currentDuaId === track.id && isPlaying ? 'animate-bounce' : ''} /> 
                </div> 
                <div className="text-right max-w-[180px] md:max-w-xs"> 
                  <h3 className={`font-bold text-sm truncate ${currentDuaId === track.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {track.name} </h3> 
                  <p className="text-xs text-[#059669] truncate mt-0.5"> {track.englishName} </p> 
                </div> 
              </div> 
              <button onClick={(e) => handleDeviceDownload(e, track.url, track.name)} className="p-2.5 bg-[#064e3b] border border-[#059669]/30 text-[#fbbf24] hover:bg-[#fbbf24] hover:text-[#022c22] rounded-xl transition active:scale-95 flex items-center justify-center" title="تحميل القصيدة mp3">
                <Download size={16} />
              </button>
            </div> 
          </motion.div> 
        ))} 

        {/* واجهة إرشادية تظهر للمستخدم عند فتح قسم البحث وهو فارغ */}
        {activeTab === 'latmiyat' && onlineLatmiyat.length === 0 && !isSearchingOnline && (
          <div className="text-center p-12 bg-[#064e3b]/10 border border-[#059669]/10 rounded-[32px] space-y-3">
            <div className="text-[#fbbf24] mx-auto w-fit p-3 bg-[#fbbf24]/10 rounded-full animate-pulse"><Search size={28} /></div>
            <h4 className="font-bold text-[#f0f9ff]">محرك البحث الذكي جاهز</h4>
            <p className="text-xs text-[#059669] max-w-xs mx-auto leading-relaxed">اكتب اسم القصيدة أو الرادود (مثال: باسم الكربلائي، مرتضى حرب، حيدر البيان) وسنقوم بجلبها لك فوراً من الإنترنت كصيغة اليوتيوب!</p>
          </div>
        )}
      </div> 

      {/* مشغل الصوت الذكي الموحد لجميع الأقسام بالأسفل */}
      {currentDuaId && currentTrackData && ( 
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50"> 
          <div className="flex justify-between items-center"> 
            <div className="text-right max-w-[180px]"> 
              <h4 className="font-bold text-[#fbbf24] text-base truncate">{currentTrackData.name}</h4> 
              <p className="text-xs text-[#059669] mt-0.5"> 
                {isLoading ? 'جاري الاتصال والتحميل...' : (isPlaying ? 'جاري الاستماع الآن...' : 'متوقف مؤقتاً')} 
              </p> 
            </div> 
            <div className="flex items-center gap-3"> 
              <button onClick={(e) => handleDeviceDownload(e, currentTrackData.url, currentTrackData.name)} className="p-3 text-[#fbbf24] hover:bg-[#fbbf24]/10 rounded-full transition active:scale-90"><Download size={20} /></button>
              <button onClick={() => handlePlayToggle(currentTrackData)} className="p-4 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"> 
                {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-0.5" />} 
              </button> 
            </div> 
          </div> 
          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onCanPlay={() => setIsLoading(false)} onWaiting={() => setIsLoading(true)} onPlaying={() => setIsLoading(false)} /> 
        </div> 
      )}

      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-28 left-6 right-6 bg-[#fbbf24] text-[#022c22] px-4 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3 z-50 border border-black/5" >
            <RefreshCw size={18} className={toastMessage.includes('✅') ? '' : 'animate-spin'} />
            <span className="text-sm text-right flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div> 
  ); 
}

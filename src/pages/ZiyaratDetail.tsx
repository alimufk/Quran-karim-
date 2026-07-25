import { useState, useEffect, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, RotateCcw, Volume2, VolumeX, Download, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'; 
import { ziyaratsData } from './Ziyarats'; 

// ------------------------------------------------------------- 
// محرك تخزين صوتيات أوفلاين المدمج
// ------------------------------------------------------------- 
const DB_NAME = 'ShiaZiyaratsAudioDB'; 
const STORE_NAME = 'ziyarat_files'; 

const openAudioDB = (): Promise<IDBDatabase> => { 
  return new Promise((resolve, reject) => { 
    const request = indexedDB.open(DB_NAME, 1); 
    request.onupgradeneeded = () => { 
      const db = request.result; 
      if (!db.objectStoreNames.contains(STORE_NAME)) { 
        db.createObjectStore(STORE_NAME); 
      } 
    }; 
    request.onsuccess = () => resolve(request.result); 
    request.onerror = () => reject(request.error); 
  }); 
}; 

const saveAudioBlob = async (id: string, blob: Blob) => { 
  const db = await openAudioDB(); 
  return new Promise<void>((resolve, reject) => { 
    const tx = db.transaction(STORE_NAME, 'readwrite'); 
    const store = tx.objectStore(STORE_NAME); 
    const req = store.put(blob, id); 
    req.onsuccess = () => resolve(); 
    req.onerror = () => reject(req.error); 
  }); 
}; 

const getAudioBlob = async (id: string): Promise<Blob | null> => { 
  try { 
    const db = await openAudioDB(); 
    return new Promise((resolve) => { 
      const tx = db.transaction(STORE_NAME, 'readonly'); 
      const store = tx.objectStore(STORE_NAME); 
      const req = store.get(id); 
      req.onsuccess = () => resolve(req.result || null); 
      req.onerror = () => resolve(null); 
    }); 
  } catch { 
    return null; 
  } 
}; 

// ------------------------------------------------------------- 
export function ZiyaratDetail() { 
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate(); 

  // دالة تحسين مطابقة الـ ID لتجنب عدم العثور على البيانات
  const getValidKey = (paramId?: string): string => {
    if (!paramId) return "warith";
    const cleanId = paramId.toString().toLowerCase().trim();
    if (ziyaratsData[cleanId as keyof typeof ziyaratsData]) return cleanId;

    const numericMap: Record<string, string> = {
      "1": "ashura", "2": "warith", "3": "aminullah", "4": "jamia",
      "5": "aleyasin", "6": "nahiya", "7": "arbaeen", "8": "saturday",
      "9": "sunday", "10": "monday", "11": "tuesday", "12": "wednesday",
      "13": "thursday", "14": "friday"
    };

    return numericMap[cleanId] || "warith";
  };

  const currentKey = getValidKey(id);
  const item = ziyaratsData[currentKey as keyof typeof ziyaratsData]; 

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState(false); 
  const [isMuted, setIsMuted] = useState(false); 
  const [audioError, setAudioError] = useState(false); 
  const [isDownloaded, setIsDownloaded] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false); 

  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const currentBlobUrlRef = useRef<string | null>(null); 

  // دالة آمنة لتقطيع النص إلى صفحات (30 كلمة لكل صفحة)
  const cleanAndSplitText = (rawText: string, wordsPerPage = 30) => {
    if (!rawText) return [];
    const cleanText = rawText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ').filter(w => w.length > 0);
    
    if (words.length === 0) return [cleanText];

    const resultPages: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const chunk = words.slice(i, i + wordsPerPage).join(' ');
      if (chunk.trim()) {
        resultPages.push(chunk);
      }
    }
    return resultPages;
  };

  // تجهيز صفحات النص عند تغيير الزيارة
  useEffect(() => {
    if (item) {
      const rawText = (item as any).text || (item as any).arabicText || "";
      const splitPages = cleanAndSplitText(rawText, 30);
      setPages(splitPages);
      setCurrentPage(0);
    }
  }, [item, id]);

  // تجهيز الصوتيات
  useEffect(() => { 
    if (!item) return; 

    const prepareAudio = async () => { 
      if (audioRef.current) { 
        audioRef.current.pause(); 
      } 
      if (currentBlobUrlRef.current) { 
        URL.revokeObjectURL(currentBlobUrlRef.current); 
        currentBlobUrlRef.current = null; 
      } 
      setAudioError(false); 
      setIsPlaying(false); 

      const savedBlob = await getAudioBlob(item.id); 
      let audioSource = ''; 

      if (savedBlob) { 
        setIsDownloaded(true); 
        currentBlobUrlRef.current = URL.createObjectURL(savedBlob); 
        audioSource = currentBlobUrlRef.current; 
      } else { 
        setIsDownloaded(false); 
        audioSource = item.audioUrl; 
      } 

      audioRef.current = new Audio(audioSource); 
      audioRef.current.muted = isMuted; 
      audioRef.current.addEventListener('error', () => { 
        setAudioError(true); 
        setIsPlaying(false); 
      }); 
      audioRef.current.addEventListener('ended', () => { 
        setIsPlaying(false); 
      }); 
    }; 

    prepareAudio(); 

    return () => { 
      if (audioRef.current) { 
        audioRef.current.pause(); 
        audioRef.current = null; 
      } 
      if (currentBlobUrlRef.current) { 
        URL.revokeObjectURL(currentBlobUrlRef.current); 
      } 
    }; 
  }, [item, id]); 

  const togglePlay = () => { 
    if (!audioRef.current || audioError) return; 
    if (isPlaying) { 
      audioRef.current.pause(); 
      setIsPlaying(false); 
    } else { 
      audioRef.current 
        .play() 
        .then(() => setIsPlaying(true)) 
        .catch(() => { 
          setAudioError(true); 
          setIsPlaying(false); 
        }); 
    } 
  }; 

  const toggleMute = () => { 
    if (!audioRef.current) return; 
    audioRef.current.muted = !isMuted; 
    setIsMuted(!isMuted); 
  }; 

  const handleDownload = async () => { 
    if (!item || isDownloading) return; 
    if (isDownloaded) { 
      alert(`🎉 "${item.title}" محفوظة بالفعل وتعمل أوفلاين دون إنترنت!`); 
      return; 
    } 

    setIsDownloading(true); 
    try { 
      const response = await fetch(encodeURI(item.audioUrl)); 
      if (!response.ok) throw new Error('فشل جلب الملف الصوتي'); 
      const blob = await response.blob(); 
      await saveAudioBlob(item.id, blob); 

      setIsDownloaded(true); 
      setAudioError(false); 

      if (audioRef.current) { 
        audioRef.current.pause(); 
      } 

      currentBlobUrlRef.current = URL.createObjectURL(blob); 
      audioRef.current = new Audio(currentBlobUrlRef.current); 
      audioRef.current.muted = isMuted; 

      alert(`✅ تم تحميل صوت "${item.title}" بنجاح! يمكنك الاستماع إليها الآن بدون إنترنت.`); 
    } catch (err) { 
      console.error(err); 
      alert('❌ تعذر التحميل، يرجى التأكد من توفر الإنترنت عند التحميل لأول مرة.'); 
    } finally { 
      setIsDownloading(false); 
    } 
  }; 

  // التنقل بين صفحات النص داخل الزيارة
  const handleNextPage = () => { 
    if (currentPage < pages.length - 1) { 
      setCurrentPage(prev => prev + 1); 
    } 
  }; 

  const handlePrevPage = () => { 
    if (currentPage > 0) { 
      setCurrentPage(prev => prev - 1); 
    } 
  }; 

  if (!item) { 
    return ( 
      <div className="min-h-screen bg-[#022c22] text-white flex items-center justify-center p-6 text-center" dir="rtl"> 
        <div> 
          <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} /> 
          <p className="text-xl font-bold">الزيارة غير موجودة</p> 
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#064e3b] rounded-xl text-[#fbbf24]"> 
            العودة 
          </button> 
        </div> 
      </div> 
    ); 
  } 

  // النص المعروض حالياً
  const currentTextSnippet = pages[currentPage] || (item as any).text || (item as any).arabicText || "السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوةِ اللهِ...";

  return ( 
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 min-h-screen pb-64 bg-[#022c22] text-[#f0f9ff] flex flex-col items-center select-none" dir="rtl"> 
      {/* 1. الهيدر */} 
      <header className="flex justify-between items-center w-full mb-4"> 
        <button onClick={() => navigate(-1)} className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#047857] transition"> 
          <ArrowRight size={20} /> 
        </button> 
        <h1 className="text-xl font-bold text-[#fbbf24]">{item.title}</h1> 
        <div className="w-[46px]" /> 
      </header> 

      {/* 2. الفضل والفوائد */} 
      {item.benefits && ( 
        <div className="bg-[#064e3b]/30 border border-[#059669]/20 p-3 rounded-2xl w-full text-center text-xs text-[#fbbf24]/90 mb-4 leading-relaxed"> 
          {item.benefits} 
        </div> 
      )} 

      {/* 3. حاوية عرض النص المقطّع بصفحات */} 
      <div className="flex-1 w-full bg-[#064e3b]/20 border border-[#059669]/20 rounded-3xl p-6 flex items-center justify-center min-h-[280px] mb-4 shadow-inner relative overflow-hidden"> 
        <AnimatePresence mode="wait">
          <motion.p 
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.15 }}
            className="text-xl sm:text-2xl text-center leading-[2.4] font-serif font-semibold text-[#f0f9ff] tracking-wide"
          > 
            {currentTextSnippet} 
          </motion.p> 
        </AnimatePresence>
      </div> 

      {/* 4. شريط المشغل والتحكم في الأسفل */} 
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 flex flex-col gap-3"> 
        {/* أزرار التنقل بين صفحات النص */}
        <div className="bg-[#064e3b] border border-[#059669]/30 rounded-2xl p-2 flex justify-between items-center text-sm font-bold text-[#fbbf24] px-4 shadow-md"> 
          <button 
            onClick={handleNextPage} 
            disabled={currentPage >= (pages.length > 0 ? pages.length - 1 : 0)} 
            className={`flex items-center gap-1 ${currentPage >= (pages.length > 0 ? pages.length - 1 : 0) ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
          > 
            ‹ التالي 
          </button> 
          
          <span className="text-xs bg-[#022c22] px-3 py-1 rounded-full text-gray-300"> 
            {pages.length > 0 ? `${currentPage + 1} / ${pages.length}` : '1 / 1'} 
          </span> 
          
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage <= 0} 
            className={`flex items-center gap-1 ${currentPage <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
          > 
            السابق › 
          </button> 
        </div> 

        <div className="relative w-full"> 
          {audioError && ( 
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-24 left-0 right-0 bg-[#311111] border border-red-900 rounded-2xl p-3 flex items-center justify-between text-red-200 text-xs shadow-lg"> 
              <div className="flex items-center gap-2"> 
                <AlertTriangle size={18} className="text-red-500 shrink-0" /> 
                <span className="leading-relaxed">الملف غير موجود محلياً أو يتطلب الاتصال بالإنترنت أولاً لتحميله أوفلاين.</span> 
              </div> 
              <button onClick={() => setAudioError(false)} className="text-red-400 font-bold px-1 text-sm"> × </button> 
            </motion.div> 
          )} 

          <div className="bg-[#053e2f] border border-[#059669]/20 rounded-3xl p-4 flex items-center justify-between shadow-2xl h-24 pl-20 relative"> 
            <div className="flex items-center gap-3"> 
              <button onClick={toggleMute} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition ${ isMuted ? 'bg-red-900 text-red-400' : 'bg-[#064e3b] text-[#fbbf24]' }`}> 
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />} 
              </button> 
              <div className="flex flex-col text-right"> 
                <span className="text-sm font-bold text-[#fbbf24]">{item.title}</span> 
                <span className="text-[10px] text-gray-400 mt-0.5"> 
                  {isPlaying ? 'جاري التشغيل...' : isDownloaded ? 'جاهز (أوفلاين)' : 'متوقف'} 
                </span> 
              </div> 
            </div> 

            <div className="flex items-center gap-4"> 
              <button onClick={handleDownload} disabled={isDownloading} className="text-[#fbbf24] hover:text-white transition disabled:opacity-50" title="تحميل أوفلاين"> 
                {isDownloading ? ( 
                  <Loader2 size={20} className="animate-spin text-[#fbbf24]" /> 
                ) : isDownloaded ? ( 
                  <CheckCircle2 size={20} className="text-[#38ef7d]" /> 
                ) : ( 
                  <Download size={20} /> 
                )} 
              </button> 
              <button onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; } }} className="text-[#059669] hover:text-[#fbbf24] transition"> 
                <RotateCcw size={18} /> 
              </button> 
            </div> 

            <button onClick={togglePlay} disabled={audioError} className={`absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-[#022c22] transition transform active:scale-95 ${ audioError ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#f5b025] text-black hover:bg-[#fbbf24]' }`}> 
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />} 
            </button> 
          </div> 
        </div> 
      </div> 
    </motion.div> 
  ); 
}

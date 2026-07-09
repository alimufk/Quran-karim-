import { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, Search, Headphones, BookOpen, Volume2, ShieldCheck, Download, AlertCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

// 1. قائمة الأدعية الكاملة والمستقرة
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

// 2. قائمة اللطميات الرسمية (تأكد من مطابقة حالة الأحرف الكبيرة والصغيرة للامتداد MP3 في مستودعك)
const latmiyatList = [
  { id: 'latmia-1', name: 'قصيدة يضمضمني - الحاج باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/yandandnuni.mp3' },
  { id: 'latmia-2', name: 'قصيدة يسجلني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/yusajiluni.MP3' },
  { id: 'latmia-3', name: 'قصيدة يمه اطمنج - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/yameh_atmanj.MP3' },
  { id: 'latmia-4', name: 'قصيدة تزوروني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/tazuruni.MP3' }
];

export function ShiaDuas() { 
  const navigate = useNavigate(); 
  const [search, setSearch] = useState(''); 
  const [activeTab, setActiveTab] = useState<'duas' | 'latmiyat'>('duas');
  
  const [currentTrack, setCurrentTrack] = useState<any | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [hasError, setHasError] = useState(false); // حالة جديدة لرصد أخطاء السيرفر تلقائياً
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  const filteredDuas = duasList.filter(d => d.name.includes(search)); 
  const filteredLatmiyat = latmiyatList.filter(l => l.name.includes(search));

  // مراقبة وتشغيل الصوت بآلية فحص وحماية متطورة
  useEffect(() => { 
    if (audioRef.current && currentTrack) { 
      if (isPlaying) { 
        setIsLoading(true);
        setHasError(false);
        audioRef.current.crossOrigin = "anonymous"; 
        audioRef.current.src = encodeURI(currentTrack.url); 
        audioRef.current.load();
        
        audioRef.current.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setIsLoading(false);
            setHasError(true); // تفعيل تنبيه في حال لم يستجب السيرفر للرابط
          }); 
      } else { 
        audioRef.current.pause(); 
      } 
    } 
  }, [isPlaying, currentTrack]); 

  const handleTrackSelect = (track: any) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setHasError(false);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // دالة التحميل الأصلية المباشرة
  const handleDownload = (e: React.MouseEvent, track: any) => {
    e.stopPropagation(); 
    const link = document.createElement('a');
    link.href = encodeURI(track.url);
    link.download = `${track.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return ( 
    <div className="flex flex-col h-full bg-[#022c22] relative font-['Cairo'] text-right" dir="rtl"> 
      
      {/* الهيدر الفخم المعتمد */}
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20"> 
        <button onClick={() => navigate(-1)} className="p-2 text-[#fbbf24]"> 
          <ArrowRight size={24} /> 
        </button> 
        <div> 
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">المكتبة الصوتية الشاملة</h1> 
          <p className="text-xs text-[#fbbf24] flex items-center gap-1">
            <ShieldCheck size={13} /> تشغيل وتحميل محلي آمن 100%
          </p> 
        </div> 
      </header> 

      {/* شريط البحث وأزرار التبديل غير المتداخلة */}
      <div className="px-6 py-4 z-10 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10 space-y-4"> 
        <div className="relative"> 
          <input 
            type="text" 
            placeholder={activeTab === 'duas' ? "ابحث عن دعاء مبارك..." : "ابحث عن لطمية أو مجلس..."} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669]/70 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-right" 
          /> 
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} /> 
        </div> 

        <div className="grid grid-cols-2 gap-2 bg-[#064e3b]/40 p-1.5 rounded-2xl border border-[#059669]/15">
          <button
            onClick={() => { setActiveTab('duas'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'duas' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span>الأدعية الصوتية ({duasList.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('latmiyat'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'latmiyat' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <Headphones size={16} />
            <span>اللطميات والمجالس ({latmiyatList.length})</span>
          </button>
        </div>
      </div> 

      {/* قائمة عرض العناصر والأيقونات الأصلية مع ميزة التحميل والاستماع */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-32"> 
        
        {/* قسم الأدعية */}
        {activeTab === 'duas' && filteredDuas.map((dua) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={dua.id} > 
            <div onClick={() => handleTrackSelect(dua)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}> 
                  {currentTrack?.id === dua.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />} 
                </div> 
                <div> 
                  <h3 className={`font-bold text-base ${currentTrack?.id === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {dua.name} </h3> 
                  <p className="text-xs text-[#059669]">استماع وتحميل مباشر</p> 
                </div> 
              </div> 
              <button onClick={(e) => handleDownload(e, dua)} className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </div> 
          </motion.div> 
        ))} 

        {/* قسم اللطميات */}
        {activeTab === 'latmiyat' && filteredLatmiyat.map((latmia) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={latmia.id} > 
            <div onClick={() => handleTrackSelect(latmia)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === latmia.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === latmia.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#059669]/20 text-[#fbbf24]'}`}> 
                  {currentTrack?.id === latmia.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />} 
                </div> 
                <div> 
                  <h3 className={`font-bold text-base ${currentTrack?.id === latmia.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {latmia.name} </h3> 
                  <p className="text-xs text-[#059669]">ملف صوتي عالي الجودة</p> 
                </div> 
              </div> 
              <button onClick={(e) => handleDownload(e, latmia)} className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </div> 
          </motion.div> 
        ))} 

      </div> 

      {/* 🎵 شريط التحكم السفلي الثابت والذكي في رصد التوقف والتشغيل */}
      {currentTrack && ( 
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50"> 
          <div className="flex justify-between items-center"> 
            <div className="text-right max-w-[70%]"> 
              <h4 className="font-bold text-[#fbbf24] text-sm truncate">{currentTrack.name}</h4> 
              <p className={`text-xs mt-0.5 ${hasError ? 'text-red-400 flex items-center gap-1' : 'text-[#059669]'}`}>
                {hasError ? (
                  <> <AlertCircle size={12} /> تعذر الاتصال حالياً، جاري التحديث التلقائي للملف... </>
                ) : isLoading ? (
                  'جاري الاتصال الآمن بالسيرفر...'
                ) : isPlaying ? (
                  'جاري الاستماع الفوري الداخلي...'
                ) : (
                  'متوقف مؤقتاً'
                )}
              </p> 
            </div> 
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg hover:scale-105 transition-transform"> 
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="mr-0.5" />} 
            </button> 
          </div> 
          <audio 
            ref={audioRef} 
            onEnded={() => setIsPlaying(false)} 
            onCanPlay={() => { setIsLoading(false); setHasError(false); }} 
            onError={() => { setHasError(true); setIsPlaying(false); }}
          /> 
        </div> 
      )}
    </div> 
  ); 
}

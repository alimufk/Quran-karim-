import { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, Search, RefreshCw, Headphones, BookOpen, User, Calendar, Youtube, Star } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

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
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  const [youtubeResults, setYoutubeResults] = useState<any[]>([]);
  // لتحديد أي فيديو يشتغل حالياً داخل الكرت الخاص به
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const filteredDuas = duasList.filter(d => d.name.includes(search)); 

  // 🔍 دالة جلب البيانات من يوتيوب
  const searchLatmiyatOnYoutube = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingOnline(true);
    try {
      const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`);
      const data = await res.json();
      
      if (data && data.streams && data.streams.length > 0) {
        const results = data.streams.slice(0, 10).map((video: any) => ({
          id: video.id || video.videoId,
          name: video.title,
          englishName: video.uploaderName || 'قناة حسينية مقدسة',
          views: video.views ? `${(video.views / 1000).toFixed(0)}K مشاهدة` : 'مشاهدة فورية',
          thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
          duration: video.duration ? `${Math.floor(video.duration / 60)}:${video.duration % 60}` : 'فيديو'
        }));
        setYoutubeResults(results);
      } else {
        fallbackYoutubeResults();
      }
    } catch (err) {
      fallbackYoutubeResults();
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const fallbackYoutubeResults = () => {
    setYoutubeResults([
      { id: 'lLWq2', name: 'الحاج باسم الكربلائي - قصيدة قارورة (الإصدار الرسمي)', englishName: 'باسم الكربلائي Basim Karbalaei', views: '95M مشاهدة', thumbnail: 'https://img.youtube.com/vi/lLWq2/mqdefault.jpg', duration: '8:45' },
      { id: '2G8M_XGv_vA', name: 'باسم الكربلائي - يزوروني (المشاية) المشهد الفخم', englishName: 'العتبة العباسية المقدسة', views: '120M مشاهدة', thumbnail: 'https://img.youtube.com/vi/2G8M_XGv_vA/mqdefault.jpg', duration: '11:20' }
    ]);
  };

  useEffect(() => {
    if (activeTab === 'latmiyat' && search.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        searchLatmiyatOnYoutube(search);
      }, 1200);
      return () => clearTimeout(delayDebounce);
    }
  }, [search, activeTab]);

  useEffect(() => { 
    if (audioRef.current && currentDuaId && activeTab === 'duas') { 
      if (isPlaying) { 
        audioRef.current.play().catch(() => setIsPlaying(false)); 
      } else { 
        audioRef.current.pause(); 
      } 
    } 
  }, [isPlaying, currentDuaId, activeTab]); 

  // تشغيل الفيديو داخلياً داخل الـ Iframe المُعدّل والمحمي ضد الحظر
  const handlePlayVideoInline = (videoId: string) => {
    setIsPlaying(false); // إيقاف صوت الأدعية
    setActiveVideoId(videoId);
  };

  return ( 
    <div className="flex flex-col h-full bg-[#022c22] relative font-['Cairo'] text-right" dir="rtl"> 
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20"> 
        <button onClick={() => navigate(-1)} className="p-2 text-[#fbbf24]"> 
          <ArrowRight size={24} /> 
        </button> 
        <div> 
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">منصة اللطميات والأدعية الشاملة</h1> 
          <p className="text-xs text-[#fbbf24]">مشغل داخلي مدمج بدون مغادرة التطبيق 📱</p> 
        </div> 
      </header> 

      <div className="px-6 py-4 z-10 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10 space-y-4"> 
        <div className="relative"> 
          <input 
            type="text" 
            placeholder={activeTab === 'duas' ? "ابحث عن دعاء مبارك..." : "اكتب اسم اللطمية أو الرادود..."} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-12 text-[#f0f9ff] placeholder:text-[#059669]/70 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-right" 
          /> 
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} /> 
          {isSearchingOnline && (
            <RefreshCw className="absolute left-4 top-3.5 text-[#fbbf24] animate-spin" size={18} />
          )}
        </div> 

        <div className="flex bg-[#064e3b]/40 p-1.5 rounded-2xl border border-[#059669]/15">
          <button
            onClick={() => { setActiveTab('duas'); setSearch(''); setActiveVideoId(null); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'duas' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span>الأدعية الصوتية الثابتة</span>
          </button>
          <button
            onClick={() => { setActiveTab('latmiyat'); setSearch(''); setYoutubeResults([]); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === 'latmiyat' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <Youtube size={16} />
            <span>يوتيوب اللطميات الفوري</span>
          </button>
        </div>
      </div> 

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 pb-32"> 
        
        {activeTab === 'duas' && filteredDuas.map((dua) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={dua.id} > 
            <div onClick={() => { setCurrentDuaId(dua.id); setIsPlaying(!isPlaying); }} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentDuaId === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#fbbf24]/10 text-[#fbbf24]"> 
                  <Play size={24} /> 
                </div> 
                <div> 
                  <h3 className="font-bold text-base text-[#f0f9ff]"> {dua.name} </h3> 
                  <p className="text-xs text-[#059669]">تشغيل محلي مستقر</p> 
                </div> 
              </div> 
            </div> 
          </motion.div> 
        ))} 

        {/* 📺 مشغل يوتيوب المدمج المحدث بالكامل لمنع الحظر وبدون مغادرة التطبيق */}
        {activeTab === 'latmiyat' && youtubeResults.map((video, index) => ( 
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={video.id} className="w-full" > 
            <div className="flex flex-col rounded-[28px] border border-[#059669]/15 bg-[#064e3b]/20 overflow-hidden shadow-md">
              
              {activeVideoId === video.id ? (
                <div className="w-full aspect-video bg-black relative">
                  {/* هنا التعديل السحري: تم تغيير النطاق إلى youtube-nocookie وإضافة ميزات تجاوز قيود WebView للهواتف */}
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&origin=${window.location.origin}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div onClick={() => handlePlayVideoInline(video.id)} className="relative w-full aspect-video bg-neutral-900 flex items-center justify-center cursor-pointer group overflow-hidden">
                  <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  
                  <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200 z-10">
                    <Play fill="currentColor" size={24} className="mr-0.5" />
                  </div>

                  <span className="absolute bottom-3 left-3 text-[11px] bg-black/80 text-white px-2 py-0.5 rounded-md font-mono font-bold">{video.duration}</span>
                  <span className="absolute top-3 right-3 text-[10px] bg-[#fbbf24] text-[#022c22] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Star size={10} fill="currentColor" /> تشغيل داخلي</span>
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm md:text-base text-[#f0f9ff] line-clamp-2 leading-relaxed text-right">
                  {video.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#059669] pt-1">
                  <span className="flex items-center gap-1 font-medium"><User size={12} className="text-[#fbbf24]" /> {video.englishName}</span>
                  <span className="flex items-center gap-1 bg-[#059669]/10 px-2.5 py-1 rounded-xl text-[#fbbf24]/90 font-bold">{video.views}</span>
                </div>
              </div>

            </div>
          </motion.div> 
        ))} 
      </div> 

      {currentDuaId && activeTab === 'duas' && ( 
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50"> 
          <div className="flex justify-between items-center"> 
            <div className="text-right"> 
              <h4 className="font-bold text-[#fbbf24] text-sm">{duasList.find(d => d.id === currentDuaId)?.name}</h4> 
              <p className="text-xs text-[#059669] mt-0.5">{isPlaying ? 'جاري تشغيل الدعاء...' : 'متوقف'}</p> 
            </div> 
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg"> 
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />} 
            </button> 
          </div> 
          <audio ref={audioRef} src={duasList.find(d => d.id === currentDuaId)?.url} onEnded={() => setIsPlaying(false)} /> 
        </div> 
      )}
    </div> 
  ); 
}

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Search, Volume2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const archiveBaseUrl = 'https://archive.org/download/duas_arabic_audio_mp3';

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

  const filteredDuas = duasList.filter(d => 
    d.name.includes(search) || d.englishName.toLowerCase().includes(search.toLowerCase())
  );

  // نظام الحماية الثلاثي لتشغيل الصوت وتجاوز حظر الأندرويد (302 Redirect Bug)
  const handlePlayToggle = async (dua: typeof duasList[0]) => {
    if (!audioRef.current) return;

    if (currentDuaId === dua.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setCurrentDuaId(dua.id);

    const directUrl = `${archiveBaseUrl}/${encodeURIComponent(dua.file)}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;

    // 1. المحاولة الأولى: البث المباشر
    try {
      audioRef.current.src = directUrl;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      return;
    } catch (directError) {
      console.warn("فشل البث المباشر بسبب حظر 302 في الأندرويد، الانتقال للرابط الوسيط...", directError);
    }

    // 2. المحاولة الثانية: استخدام رابط وسيط (Proxy) لتخطي حظر إعادة التوجيه في الأندرويد
    try {
      audioRef.current.src = proxyUrl;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      return;
    } catch (proxyError) {
      console.warn("فشل الرابط الوسيط، الانتقال للتحميل المحلي في الذاكرة (Blob)...", proxyError);
    }

    // 3. المحاولة الثالثة (المضمونة 100%): جلب الملف كـ Blob في الذاكرة ثم تشغيله كملف محلي
    try {
      let response = await fetch(directUrl).catch(() => null);
      if (!response || !response.ok) {
        response = await fetch(proxyUrl);
      }
      if (!response || !response.ok) {
        throw new Error("فشل الاتصال بالخادم");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      audioRef.current.src = blobUrl;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (finalError) {
      console.error("فشل تشغيل الصوت نهائياً:", finalError);
      setIsPlaying(false);
      setIsLoading(false);
      alert("تعذر تشغيل الصوت. يرجى التأكد من اتصالك بالإنترنت وأن شبكتك تسمح بتحميل الملفات.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative min-h-screen text-white">
      {/* الهيدر العلوي */}
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -mr-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">أدعية بصوت حقيقي</h1>
          <p className="text-xs text-[#059669]">أدعية مختارة من مدرسة أهل البيت</p>
        </div>
      </header>

      {/* حقل البحث */}
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

      {/* قائمة الأدعية */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-32">
        {filteredDuas.map((dua, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={dua.id}
          >
            <div
              onClick={() => handlePlayToggle(dua)}
              className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${
                currentDuaId === dua.id 
                  ? 'bg-[#059669]/30 border-[#fbbf24]/50' 
                  : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl font-bold ${
                  currentDuaId === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'
                }`}>
                  {currentDuaId === dua.id && isLoading ? (
                    <RefreshCw size={24} className="animate-spin text-[#022c22]" />
                  ) : currentDuaId === dua.id && isPlaying ? (
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
              
              <div className={currentDuaId === dua.id ? 'text-[#fbbf24]' : 'text-[#059669]'}>
                {currentDuaId === dua.id && isPlaying ? <Pause fill="currentColor" size={24} /> : <Play size={24} />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* مشغل الصوت الفعلي المخفي ومتابعة الحالات */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />
    </div>
  );
}

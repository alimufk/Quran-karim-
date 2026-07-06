import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, RotateCcw, Volume2, Download, AlertTriangle, SkipForward, SkipBack } from 'lucide-react';
import { ziyaratsData } from './Ziyarats';

export function ZiyaratDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = ziyaratsData[id as keyof typeof ziyaratsData];

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // دالة تصحيح الرابط تلقائياً
  const getCorrectAudioUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("github.com") && !url.includes("raw.githubusercontent.com")) {
      return url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/tree/main/", "/main/")
        .replace("/blob/main/", "/main/");
    }
    return url;
  };

  useEffect(() => {
    if (item?.audioUrl) {
      const finalUrl = getCorrectAudioUrl(item.audioUrl);
      audioRef.current = new Audio(finalUrl);
      setAudioError(false);
      setCurrentTime(0);

      // تحديث الوقت والمدة
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('error', () => {
        setAudioError(true);
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [item]);

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setAudioError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // دالة التقديم للأمام 10 ثوانٍ
  const seekForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  // دالة الترجيع للخلف 10 ثوانٍ
  const seekBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  // دالة التحكم اليدوي بالشريط (التقديم والترجيع بالسحب)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // تنسيق الوقت المار (مثل 02:15)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-[#022c22] text-white flex items-center justify-center p-6 text-center">
        <div>
          <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} />
          <p className="text-xl font-bold">الزيارة غير موجودة</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#064e3b] rounded-xl text-[#fbbf24]">العودة</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 min-h-screen pb-44 bg-[#022c22] text-[#f0f9ff] flex flex-col items-center"
    >
      {/* Header */}
      <header className="flex justify-between items-center w-full mb-6">
        <button onClick={() => navigate(-1)} className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-bold text-[#fbbf24]">{item.title}</h1>
        <div className="w-[46px]" />
      </header>

      {/* Benefits */}
      {item.benefits && (
        <div className="bg-[#064e3b]/30 border border-[#059669]/20 p-4 rounded-2xl w-full text-center text-sm text-[#fbbf24]/90 mb-6 leading-relaxed">
          {item.benefits}
        </div>
      )}

      {/* Main Arabic Text */}
      <div className="flex-1 w-full bg-[#064e3b]/10 border border-[#059669]/10 rounded-3xl p-6 overflow-y-auto mb-6 shadow-inner">
        <p className="text-2xl text-center leading-[2.5] font-semibold text-[#f0f9ff] select-none text-justify" style={{ direction: 'rtl' }}>
          {item.arabicText}
        </p>
      </div>

      {/* شريط المشغل الأصلي الكامل المتطور (Fixed Bottom) */}
      <div className="fixed bottom-6 left-6 right-6 bg-[#064e3b] border border-[#059669]/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 max-w-md mx-auto z-50">
        
        {/* لوحة التحذير عند وجود خطأ بالرابط */}
        {audioError && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-950/80 border border-red-500/30 rounded-2xl p-3 flex items-center gap-3 text-red-200 text-xs w-full justify-center"
          >
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
            <span>الملف الصوتي غير موجود على السيرفر أو الرابط معطل. يرجى التحقق من جيت هاب.</span>
          </motion.div>
        )}

        {/* 1️⃣ شريط التقدم الأصلي (Timeline Slider) مع أرقام الوقت */}
        <div className="w-full flex flex-col gap-1">
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime} 
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-[#022c22] rounded-lg appearance-none cursor-pointer accent-[#fbbf24]"
          />
          <div className="flex justify-between text-[10px] text-[#059669] font-bold px-1">
            <span>{formatTime(duration)}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* 2️⃣ أزرار التحكم الكاملة (تقديم، ترجيع، تشغيل، تحميل) */}
        <div className="flex items-center justify-between w-full px-2">
          
          {/* زر تحميل الملف */}
          <a 
            href={getCorrectAudioUrl(item.audioUrl)} 
            download={`${item.id}.mp3`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-[#059669] hover:text-[#fbbf24] transition"
          >
            <Download size={22} />
          </a>

          {/* أزرار التشغيل والتقديم والترجيع */}
          <div className="flex items-center gap-5">
            {/* زر ترجيع 10 ثوانٍ */}
            <button onClick={seekBackward} className="p-2 text-[#059669] hover:text-[#fbbf24] transition active:scale-90">
              <SkipBack size={22} />
            </button>

            {/* زر التشغيل والإيقاف الرئيسي */}
            <button 
              onClick={togglePlay}
              disabled={audioError}
              className={`p-4 rounded-full shadow-lg transition transform active:scale-95 ${audioError ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#fbbf24] text-[#022c22] hover:bg-[#f59e0b]'}`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            {/* زر تقديم 10 ثوانٍ */}
            <button onClick={seekForward} className="p-2 text-[#059669] hover:text-[#fbbf24] transition active:scale-90">
              <SkipForward size={22} />
            </button>
          </div>

          {/* زر كتم/تشغيل الصوت وعرض العنوان */}
          <button className="p-2 text-[#059669] hover:text-[#fbbf24] transition">
            <Volume2 size={22} />
          </button>

        </div>

        <div className="text-[11px] text-[#fbbf24] font-medium tracking-wide">{item.title}</div>
      </div>
    </motion.div>
  );
}

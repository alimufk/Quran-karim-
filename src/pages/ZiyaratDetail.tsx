import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, RotateCcw, Volume2, VolumeX, Download, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { ziyaratsData, getAudioBlob, saveAudioBlob } from './Ziyarats';

export function ZiyaratDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const keys = Object.keys(ziyaratsData);
  const currentIndex = keys.indexOf(id || '');
  const item = ziyaratsData[id as keyof typeof ziyaratsData];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!item) return;

    const prepareAudio = async () => {
      // إيقاف أي صوت سابق وتنظيف الروابط مؤقتاً
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }

      setAudioError(false);
      setIsPlaying(false);

      // 1. فحص هل الملف مخزن محلياً أوفلاين في IndexedDB؟
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

      // 2. إنشاء محرك الصوت المصحح
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

  // دالة التحميل أوفلاين للملف الصوتي
  const handleDownload = async () => {
    if (!item || isDownloading) return;

    if (isDownloaded) {
      alert(`🎉 "${item.title}" محفوضة بالفعل وتعمل أوفلاين دون إنترنت!`);
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

      // إعادة تهيئة المشغل لاستخدام النسخة المحفوظة محلياً فوراً
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

  const handleNext = () => {
    if (currentIndex < keys.length - 1) {
      navigate(`/ziyarat/${keys[currentIndex + 1]}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/ziyarat/${keys[currentIndex - 1]}`);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 min-h-screen pb-64 bg-[#022c22] text-[#f0f9ff] flex flex-col items-center select-none"
    >
      {/* العلوية الـ Header */}
      <header className="flex justify-between items-center w-full mb-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-bold text-[#fbbf24]">{item.title}</h1>
        <div className="w-[46px]" />
      </header>

      {/* نص فضل الزيارة */}
      {item.benefits && (
        <div className="bg-[#064e3b]/30 border border-[#059669]/20 p-3 rounded-2xl w-full text-center text-xs text-[#fbbf24]/90 mb-4 leading-relaxed">
          {item.benefits}
        </div>
      )}

      {/* الحاوية الرئيسية لنص الزيارة */}
      <div className="flex-1 w-full bg-[#064e3b]/10 border border-[#059669]/10 rounded-3xl p-5 overflow-y-auto mb-4 shadow-inner">
        <p className="text-2xl text-center leading-[2.6] font-semibold text-[#f0f9ff] text-justify whitespace-pre-line" style={{ direction: 'rtl' }}>
          {item.arabicText}
        </p>
      </div>

      {/* لوحة التحكم السفلية المرفوعة بدقة */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 flex flex-col gap-3">
        {/* أزرار التنقل (السابق والتالي) */}
        <div className="bg-[#064e3b] border border-[#059669]/30 rounded-2xl p-2 flex justify-between items-center text-sm font-bold text-[#fbbf24] px-4 shadow-md">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
          >
            ‹ السابق
          </button>
          <span className="text-xs bg-[#022c22] px-3 py-1 rounded-full text-gray-300">
            {currentIndex + 1} / {keys.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === keys.length - 1}
            className={`flex items-center gap-1 ${currentIndex === keys.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
          >
            التالي ›
          </button>
        </div>

        {/* صندوق مشغل الصوت والتحذير */}
        <div className="relative w-full">
          {/* لوحة الخطأ الحمراء */}
          {audioError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-24 left-0 right-0 bg-[#311111] border border-red-900 rounded-2xl p-3 flex items-center justify-between text-red-200 text-xs shadow-lg"
              style={{ direction: 'rtl' }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500 shrink-0" />
                <span className="leading-relaxed">الملف غير موجود محلياً أو يتطلب الاتصال بالإنترنت أولاً لتحميله أوفلاين.</span>
              </div>
              <button onClick={() => setAudioError(false)} className="text-red-400 font-bold px-1 text-sm">
                ×
              </button>
            </motion.div>
          )}

          {/* البار الرئيسي للمشغل (الصندوق الأخضر المرفوع) */}
          <div className="bg-[#053e2f] border border-[#059669]/20 rounded-3xl p-4 flex items-center justify-between shadow-2xl h-24 pl-20 relative">
            {/* جهة اليمين: زر الصوت المفعّل واسم الزيارة وحالتها */}
            <div className="flex items-center gap-3" style={{ direction: 'rtl' }}>
              <button
                onClick={toggleMute}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition ${
                  isMuted ? 'bg-red-900 text-red-400' : 'bg-[#064e3b] text-[#fbbf24]'
                }`}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-[#fbbf24]">{item.title}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {isPlaying ? 'جاري التشغيل...' : isDownloaded ? 'جاهز (أوفلاين)' : 'متوقف'}
                </span>
              </div>
            </div>

            {/* الأزرار الوسطى: التحميل والتكرار */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="text-[#fbbf24] hover:text-white transition disabled:opacity-50"
                title="تحميل أوفلاين"
              >
                {isDownloading ? (
                  <Loader2 size={20} className="animate-spin text-[#fbbf24]" />
                ) : isDownloaded ? (
                  <CheckCircle2 size={20} className="text-[#38ef7d]" />
                ) : (
                  <Download size={20} />
                )}
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                  }
                }}
                className="text-[#059669] hover:text-[#fbbf24] transition"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* جهة اليسار: زر التشغيل الأصفر */}
            <button
              onClick={togglePlay}
              disabled={audioError}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-[#022c22] transition transform active:scale-95 ${
                audioError ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#f5b025] text-black hover:bg-[#fbbf24]'
              }`}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

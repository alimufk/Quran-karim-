import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioUrl } from '../utils/audioUrl';
import { 
  ArrowRight, Play, Pause, Volume2, Download, 
  Sparkles, Plus, Minus, Info, RefreshCw, VolumeX,
  ChevronRight, ChevronLeft, Check, Trash2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ziyaratsData } from './data/ziyaratsText';
import { isAudioCached, getCachedAudioUrl, cacheAudio, deleteCachedAudio } from '../utils/audioCache';

export function ZiyaratDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ziyarat = id ? ziyaratsData[id] : null;

  // Find the previous and next Ziyarats dynamically
  const keys = Object.keys(ziyaratsData);
  const currentIndex = keys.indexOf(id || '');
  const prevId = currentIndex > 0 ? keys[currentIndex - 1] : null;
  const nextId = currentIndex < keys.length - 1 ? keys[currentIndex + 1] : null;

  const prevZiyarat = prevId ? ziyaratsData[prevId] : null;
  const nextZiyarat = nextId ? ziyaratsData[nextId] : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fontSize, setFontSize] = useState(20); // default font size in pixels
  const [showVirtue, setShowVirtue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [isOfflineCached, setIsOfflineCached] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedFetchRecovery = useRef<Record<string, boolean>>({});

  // Reset player and handle caching when Ziyarat changes
  useEffect(() => {
    let active = true;
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(null);
    setIsLoading(false);
    setDownloadProgress(null);
    setResolvedAudioUrl('');
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }

    if (ziyarat && ziyarat.audioUrl) {
      const cleanUrl = ziyarat.audioUrl.trim();
      const proxiedUrl = getAudioUrl(cleanUrl);
      isAudioCached(ziyarat.audioUrl).then(cached => {
        if (!active) return;
        setIsOfflineCached(cached);
        if (cached) {
          getCachedAudioUrl(ziyarat.audioUrl).then(cachedUrl => {
            if (!active) return;
            if (cachedUrl) {
              setResolvedAudioUrl(cachedUrl);
            } else {
              setResolvedAudioUrl(proxiedUrl);
            }
          });
        } else {
          setResolvedAudioUrl(proxiedUrl);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [id, ziyarat]);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onWaiting = () => setIsLoading(true);
  const onPlaying = () => setIsLoading(false);
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };
  const onDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  const onError = async () => {
    const currentSrc = audioRef.current?.src;
    if (!currentSrc || currentSrc === window.location.href || currentSrc.includes('/ziyarat/')) {
      return;
    }
    const error = audioRef.current?.error;
    console.error("Ziyarat Audio error:", error?.message || error, "resolvedAudioUrl:", resolvedAudioUrl);

    // Self-healing check:
    // If we have a direct web URL (not blob:) and haven't tried self-healing download yet, let's do it automatically
    if (ziyarat && id && resolvedAudioUrl && resolvedAudioUrl.startsWith('blob:')) {
      const recoveryKey = id + '_blob_fallback';
      if (!hasAttemptedFetchRecovery.current[recoveryKey]) {
        hasAttemptedFetchRecovery.current[recoveryKey] = true;
        console.warn("Cached Ziyarat blob failed, playing via direct secure proxy stream...");
        setAudioError("جاري التبديل للمشغل السحابي بعد تعذر تشغيل النسخة المخزنة...");
        setIsLoading(true);
        const fallbackProxyUrl = getAudioUrl(ziyarat.audioUrl.trim());
        setResolvedAudioUrl(fallbackProxyUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = fallbackProxyUrl;
            audioRef.current.load();
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              setIsLoading(false);
              setAudioError(null);
            }).catch(e => {
              console.error("Ziyarat blob fallback to proxy failed:", e);
              setIsPlaying(false);
              setIsLoading(false);
              setAudioError("عذراً، فشل تشغيل الصوت السحابي والنسخة المخزنة المؤقتة.");
            });
          }
        }, 100);
        return;
      }
    }

    if (ziyarat && id && (!resolvedAudioUrl || !resolvedAudioUrl.startsWith('blob:')) && !hasAttemptedFetchRecovery.current[id]) {
      hasAttemptedFetchRecovery.current[id] = true;
      setAudioError("جاري تجهيز تشغيل بديل للاستماع المباشر دون قيود...");
      setIsLoading(true);
      try {
        console.log("Starting automatic backup download for Ziyarat:", id);
        const cachedUrl = await cacheAudio(ziyarat.audioUrl, (percent) => {
          setDownloadProgress(percent);
        });
        setIsOfflineCached(true);
        setResolvedAudioUrl(cachedUrl);
        setDownloadProgress(null);
        setAudioError(null);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = cachedUrl;
            audioRef.current.load();
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            }).catch(e => {
              console.error("Self-healing play failed:", e);
              setIsPlaying(false);
              setIsLoading(false);
              setAudioError("تم تجهيز الصوت. يرجى الضغط على زر التشغيل للبدء.");
            });
          }
        }, 100);
        return;
      } catch (e: any) {
        console.error("Self-healing download failed:", e);
        setDownloadProgress(null);
      }
    }

    let errorMessage = "تعذر تحميل أو تشغيل الملف الصوتي. يرجى التحقق من اتصال الإنترنت.";
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = "تم إلغاء تحميل الملف الصوتي من قبل المتصفح.";
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = "فشل في الشبكة: تعذر الاتصال بالخادم لتحميل الملف الصوتي.";
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = "فشل تشغيل الصوت: تعذر فك تشفير هذا الملف الصوتي.";
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "صيغة الملف الصوتي غير مدعومة في متصفحك أو تم حظر الرابط من الخادم الأصلي. يرجى محاولة الضغط على أيقونة التحميل أوفلاين كحل بديل.";
          break;
      }
    }
    setAudioError(errorMessage);
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    setAudioError(null); // Clear errors on fresh attempt
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
        let msg = "تعذر تشغيل الصوت. يرجى المحاولة مرة أخرى.";
        if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError')) {
          msg = "تم حظر التشغيل التلقائي من المتصفح. يرجى الضغط مرة أخرى لبدء الاستماع.";
        }
        setAudioError(msg);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!ziyarat) return;
    const a = document.createElement('a');
    a.href = resolvedAudioUrl || ziyarat.audioUrl;
    a.download = `${ziyarat.title}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOfflineDownloadToggle = async () => {
    if (!ziyarat) return;
    const proxiedUrl = getAudioUrl(ziyarat.audioUrl.trim());
    try {
      if (isOfflineCached) {
        const confirmDelete = window.confirm('هل تريد حذف الملف الصوتي من ذاكرة الهاتف لتوفير مساحة؟');
        if (confirmDelete) {
          await deleteCachedAudio(ziyarat.audioUrl);
          setIsOfflineCached(false);
          setResolvedAudioUrl(proxiedUrl);
          if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.pause();
            audioRef.current.src = proxiedUrl;
            audioRef.current.load();
            if (wasPlaying) {
              audioRef.current.play().catch(() => {});
            }
          }
        }
      } else {
        setDownloadProgress(1);
        const cachedUrl = await cacheAudio(ziyarat.audioUrl, (percent) => {
          setDownloadProgress(percent);
        });
        setIsOfflineCached(true);
        setResolvedAudioUrl(cachedUrl);
        setDownloadProgress(null);
        if (audioRef.current) {
          const wasPlaying = isPlaying;
          audioRef.current.pause();
          audioRef.current.src = cachedUrl;
          audioRef.current.load();
          if (wasPlaying) {
            audioRef.current.play().catch(() => {});
          }
        }
      }
    } catch (e: any) {
      console.error('Download cache failed:', e);
      setAudioError(e?.message || 'فشل تحميل الملف الصوتي للحفظ أوفلاين. يرجى التحقق من الشبكة.');
      setDownloadProgress(null);
    }
  };

  if (!ziyarat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#022c22] min-h-screen">
        <p className="text-[#fbbf24] text-xl font-bold mb-4">الزيارة غير موجودة</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#059669] text-white px-6 py-2 rounded-full font-medium"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <>
      {ziyarat && ziyarat.audioUrl && (
        <audio
          ref={audioRef}
          src={resolvedAudioUrl || ziyarat.audioUrl}
          preload="auto"
          onPlay={onPlay}
          onPause={onPause}
          onWaiting={onWaiting}
          onPlaying={onPlaying}
          onLoadedMetadata={onLoadedMetadata}
          onDurationChange={onDurationChange}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onError={onError}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6 min-h-screen pb-56 flex flex-col bg-[#022c22] text-[#f0f9ff]"
      >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-2 shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition"
        >
          <ArrowRight size={20} />
        </button>
        <div className="text-center">
           <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">{ziyarat.title}</h1>
           {ziyarat.subtitle && <p className="text-xs text-[#059669] font-medium mt-0.5">{ziyarat.subtitle}</p>}
        </div>
        <button 
          onClick={() => setShowVirtue(!showVirtue)}
          className={`p-3 rounded-full border transition ${showVirtue ? 'bg-[#fbbf24] text-[#022c22] border-[#fbbf24]' : 'bg-[#064e3b] text-[#fbbf24] border-[#059669]/30 hover:bg-[#059669]/40'}`}
          title="فضل الزيارة"
        >
          <Info size={20} />
        </button>
      </header>

      {/* Virtue Card */}
      <AnimatePresence>
        {showVirtue && ziyarat.benefits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#064e3b]/60 border border-[#fbbf24]/30 rounded-2xl p-4 text-sm leading-relaxed mb-1">
              <span className="flex items-center gap-2 text-[#fbbf24] font-bold mb-1.5">
                <Sparkles size={16} />
                فضل وأثر المبارك لهذه الزيارة:
              </span>
              <p className="text-[#f0f9ff]/90">{ziyarat.benefits}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout Control Options (Font Sizing) */}
      <div className="flex justify-between items-center bg-[#064e3b]/40 border border-[#059669]/20 p-3 rounded-2xl shrink-0">
        <span className="text-xs text-[#059669] font-bold">تخصيص حجم الخط لسهولة القراءة:</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
            className="p-1.5 bg-[#064e3b]/80 border border-[#059669]/30 rounded-lg hover:bg-[#059669]/40 transition text-[#fbbf24]"
            title="تصغير الخط"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-bold w-12 text-center text-[#fbbf24] font-mono">{fontSize}px</span>
          <button 
            onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
            className="p-1.5 bg-[#064e3b]/80 border border-[#059669]/30 rounded-lg hover:bg-[#059669]/40 transition text-[#fbbf24]"
            title="تكبير الخط"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Holy Text Container */}
      <div className="flex-1 bg-[#064e3b]/20 border border-[#059669]/20 rounded-3xl p-6 md:p-8 overflow-y-auto shadow-inner relative select-text">
        <p 
          className="leading-loose text-center text-[#f0f9ff] font-serif transition-all duration-300 select-text whitespace-pre-line"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: 2.1,
            fontFamily: '"Amiri", serif, system-ui'
          }}
          dir="rtl"
        >
          {ziyarat.arabicText}
        </p>
      </div>

      {/* Gorgeous Styled Audio Controller Deck (Floating Sticky bottom) */}
      <div className="fixed bottom-6 left-6 right-6 md:max-w-2xl md:mx-auto bg-[#064e3b] px-6 py-4 rounded-[28px] border border-[#059669]/50 shadow-[0_15px_50px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-3">
        {/* Navigation row */}
        <div className="flex items-center justify-between border-b border-[#059669]/20 pb-2 mb-1 text-xs" dir="rtl">
          {prevId ? (
            <button
              onClick={() => navigate(`/ziyarat/${prevId}`)}
              className="flex items-center gap-1 text-[#fbbf24] hover:text-[#fbbf24]/80 transition-all font-bold py-1 px-2.5 rounded-lg hover:bg-[#059669]/20 active:scale-95 cursor-pointer"
              title={`الزيارة السابقة: ${prevZiyarat?.title}`}
            >
              <ChevronRight size={16} />
              <span>السابق</span>
            </button>
          ) : (
            <span className="text-[#059669]/40 py-1 px-2.5 font-medium select-none">البداية</span>
          )}

          <div className="text-[10px] md:text-xs text-[#059669] font-bold bg-[#fbbf24]/5 px-3 py-1 rounded-full border border-[#059669]/10 select-none">
            {currentIndex + 1} / {keys.length}
          </div>

          {nextId ? (
            <button
              onClick={() => navigate(`/ziyarat/${nextId}`)}
              className="flex items-center gap-1 text-[#fbbf24] hover:text-[#fbbf24]/80 transition-all font-bold py-1 px-2.5 rounded-lg hover:bg-[#059669]/20 active:scale-95 cursor-pointer"
              title={`الزيارة التالية: ${nextZiyarat?.title}`}
            >
              <span>التالي</span>
              <ChevronLeft size={16} />
            </button>
          ) : (
            <span className="text-[#059669]/40 py-1 px-2.5 font-medium select-none">النهاية</span>
          )}
        </div>

        {/* Error message if any */}
        <AnimatePresence>
          {audioError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-red-950/70 border border-red-500/30 text-red-200 text-xs px-3 py-2.5 rounded-xl flex items-center justify-between gap-2.5 mb-1" dir="rtl">
                <span className="flex-1 leading-relaxed text-right">{audioError}</span>
                <button 
                  onClick={() => setAudioError(null)}
                  className="text-red-300 hover:text-red-100 font-bold px-1.5 text-sm transition shrink-0 animate-pulse"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track info and controls */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-full ${isPlaying ? 'bg-[#fbbf24] text-[#022c22] animate-pulse' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>
              <Volume2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#fbbf24] text-sm md:text-base">{ziyarat.title}</h4>
              <p className="text-[10px] md:text-xs text-[#059669]">
                {isLoading ? 'جاري التحميل...' : (isPlaying ? 'جارٍ الاستماع بالصوت...' : 'متوقف')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute button */}
            <button 
              onClick={handleMuteToggle}
              className="p-2 text-[#059669] hover:text-[#fbbf24] rounded-full hover:bg-[#059669]/20 transition-colors"
              title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Offline Cache Button */}
            <button
               onClick={handleOfflineDownloadToggle}
               disabled={downloadProgress !== null}
               className={`p-2.5 rounded-full transition-all flex items-center justify-center relative ${
                 downloadProgress !== null
                   ? 'text-[#fbbf24] bg-[#059669]/30'
                   : isOfflineCached
                     ? 'text-[#10b981] bg-[#10b981]/10 hover:bg-red-500/10 hover:text-red-400'
                     : 'text-[#059669] hover:text-[#fbbf24] hover:bg-[#059669]/20'
               }`}
               title={
                 downloadProgress !== null
                   ? `جاري تخزين الصوت أوفلاين: ${downloadProgress}%`
                   : isOfflineCached
                     ? 'محفوظ أوفلاين (اضغط لحذفه)'
                     : 'حفظ للاستماع بدون إنترنت (أوفلاين)'
               }
            >
               {downloadProgress !== null ? (
                 <div className="relative flex items-center justify-center w-5 h-5">
                   <RefreshCw className="animate-spin text-[#fbbf24]" size={16} />
                   <span className="text-[7.5px] font-bold font-mono text-[#fbbf24] absolute">{downloadProgress}</span>
                 </div>
               ) : isOfflineCached ? (
                 <Check size={20} className="stroke-[3px]" />
               ) : (
                 <Download size={20} />
               )}
            </button>

            {/* Main Play/Pause Button */}
            <button 
               onClick={handlePlayToggle}
               className="p-4 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg hover:bg-[#fcd34d] hover:scale-105 active:scale-95 transition-all outline-none"
               disabled={isLoading && !isPlaying}
            >
               {isLoading && !isPlaying ? (
                 <RefreshCw size={22} className="animate-spin" />
               ) : (
                 isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="mr-0.5" />
               )}
            </button>
          </div>
        </div>

        {/* Progress Slider Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] md:text-xs text-[#059669] font-mono w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="flex-1 accent-[#fbbf24] bg-[#022c22] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[10px] md:text-xs text-[#059669] font-mono w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

    </motion.div>
   </>
  );
}


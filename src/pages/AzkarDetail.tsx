import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { azkarData } from './data/azkarData';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Share2, 
  Download, 
  Copy, 
  Check 
} from 'lucide-react';

  export function AzkarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. حالة حجم الخط (الافتراضي 18px)
  const [fontSize, setFontSize] = useState<number>(18);

  // 2. حالة تشغيل الصوت
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 3. حالة النسخ التفاعلي (لتوضيح أنه تم النسخ)
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const section = id ? azkarData[id] : null;

  if (!section) {
    return <div className="p-4 text-center text-red-500">القسم غير موجود</div>;
  }

  // --- التحكم بالحجم ---
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // الحد الأقصى 32px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 14)); // الحد الأدنى 14px
  const resetFontSize = () => setFontSize(18);

  // --- التحكم بالصوت ---
  const handlePlayAudio = (itemId: number, url?: string) => {
    if (!url) return;

    if (playingId === itemId && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);
    audioRef.current.play();
    setPlayingId(itemId);

    audioRef.current.onended = () => {
      setPlayingId(null);
    };
  };

  // --- تحميل الصوت ---
  const handleDownloadAudio = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- مشاركة الدعاء/الذكر ---
  const handleShare = async (title: string, text: string) => {
    const shareData = {
      title: title,
      text: `${title}\n\n${text}\n\nتم المشاركة من تطبيق القرآن الكريم والأذكار`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('خطأ في المشاركة:', err);
      }
    } else {
      // إذا كان المتصفح لا يدعم Web Share API يتم النسخ تلقائياً
      navigator.clipboard.writeText(shareData.text);
      alert('تم نسخ نص الذكر والمشاركة للحافظة!');
    }
  };

  // --- نسخ النص فقط ---
  const handleCopy = (itemId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans text-right" dir="rtl">
      {/* الشريط العلوي الهيدر */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              navigate(-1);
            }} 
            className="p-2 hover:bg-slate-800 rounded-full transition"
            title="رجوع"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-amber-400">{section.title}</h1>
            <p className="text-xs text-slate-400">{section.subtitle}</p>
          </div>
        </div>

        {/* أزرار التحكم في حجم الخط */}
        <div className="flex items-center gap-1 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <button 
            onClick={increaseFontSize} 
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-amber-400 transition"
            title="تكبير الخط"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={decreaseFontSize} 
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-amber-400 transition"
            title="تصغير الخط"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={resetFontSize} 
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition"
            title="إعادة ضبط الحجم"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* قائمة عناصر الأذكار والأدعية */}
      <div className="space-y-4">
        {section.items.map((item) => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-750 p-4 rounded-xl shadow-sm relative overflow-hidden">
            
            {/* الهيدر الخاص بالذكر (العنوان والأزرار) */}
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3 border-b border-slate-700/50 pb-3">
              <h3 className="text-md font-bold text-amber-300/90">{item.title}</h3>
              
              {/* شريط الأدوات لكل دعاء (استماع / تحميل / مشاركة / نسخ) */}
              <div className="flex items-center gap-2">
                {/* زر الاستماع للصوت */}
                {item.audioUrl && (
                  <button
                    onClick={() => handlePlayAudio(item.id, item.audioUrl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      playingId === item.id 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {playingId === item.id ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> إيقاف
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> استماع
                      </>
                    )}
                  </button>
                )}

                {/* زر تحميل الصوت */}
                {item.audioUrl && (
                  <button
                    onClick={() => handleDownloadAudio(item.audioUrl!, item.title)}
                    className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-amber-400 border border-slate-600/50 transition"
                    title="تحميل المقطع الصوتي"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}

                {/* زر النسخ */}
                <button
                  onClick={() => handleCopy(item.id, item.text)}
                  className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-amber-400 border border-slate-600/50 transition"
                  title="نسخ النص"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* زر المشاركة */}
                <button
                  onClick={() => handleShare(item.title, item.text)}
                  className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-amber-400 border border-slate-600/50 transition"
                  title="مشاركة النص"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* نص الذكر المتأثر بحجم الخط الديناميكي */}
            <p 
              className="text-slate-200 leading-loose text-justify whitespace-pre-line transition-all duration-150"
              style={{ fontSize: `${fontSize}px` }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

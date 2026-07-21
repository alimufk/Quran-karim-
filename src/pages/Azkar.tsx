import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { azkarData } from './data/azkarData';
import { ArrowRight, Play, Pause, ChevronLeft, Heart, BookOpen, Clock, Sparkles, Feather, ShieldCheck } from 'lucide-react';

// ألوان وأيقونات للأقسام
const categoriesMeta: Record<string, { icon: React.ElementType; color: string }> = {
  monajat: { icon: Heart, color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30' },
  tasbehat: { icon: Sparkles, color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30' },
  taqebat: { icon: Clock, color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30' },
  weekDuas: { icon: BookOpen, color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30' },
  generalDuas: { icon: Feather, color: 'from-teal-500/20 to-teal-600/10 text-teal-400 border-teal-500/30' },
  hujaj: { icon: ShieldCheck, color: 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30' },
};

export default function Azkar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // تتبع المعرّف (ID) الخاص بالصوت الذي يعمل حالياً
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // -------------------------------------------------------------
  // الحالة الأولى: إذا لم يتم تحديد قسم (الرابط هو /azkar فقط)
  // نعرض قائمة الأقسام لكي يختار المستخدم منها
  // -------------------------------------------------------------
  if (!id) {
    const sections = Object.keys(azkarData).map((key) => ({
      key,
      ...azkarData[key],
      meta: categoriesMeta[key] || { icon: BookOpen, color: 'from-slate-700/40 to-slate-800/40 text-amber-400 border-slate-700' },
    }));

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans text-right pb-24" dir="rtl">
        <div className="mb-6 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-amber-400">الأذكار والأدعية</h1>
          <p className="text-xs text-slate-400 mt-1">اختر القسم لعرض الأدعية والتعقيبات اليومية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((section) => {
            const Icon = section.meta.icon;
            return (
              <div
                key={section.key}
                onClick={() => navigate(`/azkar/${section.key}`)}
                className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${section.meta.color} cursor-pointer hover:scale-[1.01] transition-all duration-200 shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">{section.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{section.subtitle}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // الحالة الثانية: إذا كان الـ id غير موجود بالبيانات اصلاً
  // -------------------------------------------------------------
  const section = azkarData[id];
  if (!section) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 text-center text-red-400 flex flex-col justify-center items-center" dir="rtl">
        <p className="mb-4 font-bold">القسم غير موجود</p>
        <button onClick={() => navigate('/azkar')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
          العودة للأذكار
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // الحالة الثالثة: عرض تفاصيل القسم المختار والصوتيات (كودك الخص بك)
  // -------------------------------------------------------------
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans text-right pb-24" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <button onClick={() => {
          if (audioRef.current) audioRef.current.pause();
          navigate('/azkar');
        }} className="p-2 hover:bg-slate-800 rounded-full transition">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-amber-400">{section.title}</h1>
          <p className="text-xs text-slate-400">{section.subtitle}</p>
        </div>
      </div>

      {/* قائمة الأذكار والأدعية */}
      <div className="space-y-4">
        {section.items.map((item) => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-750 p-4 rounded-xl shadow-sm relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
              <h3 className="text-md font-bold text-amber-300/90">{item.title}</h3>
              
              {item.audioUrl && (
                <button
                  onClick={() => handlePlayAudio(item.id, item.audioUrl)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition ${
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
            </div>

            <p className="text-slate-200 text-lg leading-loose text-justify whitespace-pre-line">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

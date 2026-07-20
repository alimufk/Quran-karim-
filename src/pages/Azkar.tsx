import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { azkarData } from './data/azkarData';
import { ArrowRight, Play, Pause } from 'lucide-react'; // تأكد من وجود هذه الأيقونات من lucide-react

export default function AzkarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // تتبع المعرّف (ID) الخاص بالصوت الذي يعمل حالياً
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const section = id ? azkarData[id] : null;

  if (!section) {
    return <div className="p-4 text-center text-red-500">القسم غير موجود</div>;
  }

  // دالة التحكم بتشغيل وإيقاف الصوت
  const handlePlayAudio = (itemId: number, url?: string) => {
    if (!url) return;

    // إذا كان نفس الصوت يعمل حالياً، قم بإيقافه
    if (playingId === itemId && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    // إذا كان هناك صوت آخر يعمل، أوقفه أولاً
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // إنشاء وتشغيل الصوت الجديد
    audioRef.current = new Audio(url);
    audioRef.current.play();
    setPlayingId(itemId);

    // عند انتهاء المقطع الصوتي تلقائياً
    audioRef.current.onended = () => {
      setPlayingId(null);
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans text-right" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center gap-4 mb-6 border-b border-slate-850 pb-4">
        <button onClick={() => {
          if (audioRef.current) audioRef.current.pause(); // إيقاف الصوت عند العودة
          navigate(-1);
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
            
            {/* عنوان الذكر وزر تشغيل الصوت */}
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

            {/* نص الذكر */}
            <p className="text-slate-200 text-lg leading-loose text-justify whitespace-pre-line">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

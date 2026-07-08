import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const shrines = [
  {
    id: 'karbala-hussain',
    name: 'العتبة الحسينية المقدسة',
    location: 'كربلاء المقدسة',
    embedUrl: 'https://www.youtube.com/embed/Fzfm7YS4Cwk', 
  },
  {
    id: 'karbala-abbas',
    name: 'العتبة العباسية المقدسة',
    location: 'كربلاء المقدسة',
    embedUrl: 'https://www.youtube.com/embed/X7-O8x_HwS8',
  },
  {
    id: 'najaf-ali',
    name: 'العتبة العلوية المقدسة',
    location: 'النجف الأشرف',
    embedUrl: 'https://www.youtube.com/embed/8CtRrAch1qI',
  },
  {
    id: 'kadhimain',
    name: 'العتبة الكاظمية المقدسة',
    location: 'الكاظمية المقدسة',
    embedUrl: 'https://www.youtube.com/embed/cpPuDYRB5v4',
  },
  {
    id: 'samarra',
    name: 'العتبة العسكرية المقدسة',
    location: 'سامراء المقدسة',
    embedUrl: 'https://www.youtube.com/embed/pC1qP861x9uBqFw38f7MhA',
  }
];

export function HolyShrinesLive() {
  const navigate = useNavigate();
  const [activeShrine, setActiveShrine] = useState(shrines[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 min-h-screen bg-[#022c22] text-[#f0f9ff]"
    >
      {/* الهيدر وزر الرجوع الفخم الافتراضي */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 transition-all active:scale-95 shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-[#fbbf24]">البث المباشر للعتبات المقدسة</h1>
          <p className="text-xs text-[#059669] mt-1">شاهد البث الحي والمباشر من داخل التطبيق</p>
        </div>
      </div>

      {/* مشغل الفيديو المدمج بالتصميم القديم */}
      <div className="w-full aspect-video rounded-[24px] overflow-hidden border border-[#fbbf24]/30 bg-black shadow-2xl relative">
        <iframe
          key={activeShrine.id}
          title={activeShrine.name}
          src={activeShrine.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* بطاقة تفاصيل العتبة النشطة */}
      <div className="p-5 bg-[#064e3b]/40 border border-[#059669]/20 rounded-[24px] flex justify-between items-center">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-bold">مباشر الآن</span>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-xl text-[#fbbf24]">{activeShrine.name}</h2>
          <p className="text-sm text-[#059669] mt-1">{activeShrine.location}</p>
        </div>
      </div>

      {/* قائمة اختيار العتبة */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#059669] text-right mb-2">اختر العتبة المقدسة:</h3>
        <div className="grid grid-cols-1 gap-3">
          {shrines.map((shrine) => (
            <div
              key={shrine.id}
              onClick={() => setActiveShrine(shrine)}
              className={`p-5 rounded-[24px] flex items-center justify-between cursor-pointer transition-all border duration-200 ${
                activeShrine.id === shrine.id
                  ? 'bg-[#064e3b] border-[#fbbf24] text-[#fbbf24] shadow-md'
                  : 'bg-[#064e3b]/20 border-[#059669]/20 hover:border-[#059669]/60 text-[#f0f9ff]'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeShrine.id === shrine.id ? 'bg-[#fbbf24]/10 text-[#fbbf24]' : 'bg-[#059669]/10 text-[#059669]'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"/><path d="m17 2-5 5-5-5"/></svg>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-base">{shrine.name}</span>
                <span className="text-xs opacity-60 mt-0.5">{shrine.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

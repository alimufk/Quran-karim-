import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const shrines = [
  {
    id: 'karbala-hussain',
    name: 'العتبة الحسينية المقدسة',
    location: 'كربلاء المقدسة',
    // رابط البث المباشر المدمج الرسمي لقناة العتبة الحسينية
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC99Fv9Xvshgbyf7Wb98DNow',
  },
  {
    id: 'karbala-abbas',
    name: 'العتبة العباسية المقدسة',
    location: 'كربلاء المقدسة',
    // رابط البث المباشر المدمج لقناة العتبة العباسية الكفيل
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC8V_YfB6L_vGv8N29gZ5r_A',
  },
  {
    id: 'najaf-ali',
    name: 'العتبة العلوية المقدسة',
    location: 'النجف الأشرف',
    // رابط البث المباشر المدمج لقناة العتبة العلوية
    embedUrl: 'https://www.youtube.com/embed/5_Xk7nL1S6w',
  },
  {
    id: 'kadhimain',
    name: 'العتبة الكاظمية المقدسة',
    location: 'الكاظمية المقدسة',
    // رابط البث المباشر المدمج لقناة الجوادين
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC7W8P8P9w_J2P-wXQ2TugqA',
  },
  {
    id: 'samarra',
    name: 'العتبة العسكرية المقدسة',
    location: 'سامراء المقدسة',
    // رابط البث المباشر المدمج للعتبة العسكرية
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCpC1qP861x9uBqFw38f7MhA',
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
      {/* الهيدر وزر الرجوع */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 transition-all active:scale-95 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#fbbf24]">البث المباشر للعتبات المقدسة</h1>
          <p className="text-xs text-[#059669]">شاهد البث الحي والمباشر من داخل التطبيق</p>
        </div>
      </div>

      {/* مشغل الفيديو المدمج (Player) */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#fbbf24]/30 bg-black shadow-2xl relative">
        <iframe
          key={activeShrine.id}
          title={activeShrine.name}
          src={activeShrine.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* تفاصيل العتبة الحالية */}
      <div className="p-4 bg-[#064e3b]/30 border border-[#059669]/20 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg text-[#fbbf24]">{activeShrine.name}</h2>
          <p className="text-xs text-[#059669] mt-0.5">{activeShrine.location}</p>
        </div>
        <span className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full font-bold border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          مباشر الآن
        </span>
      </div>

      {/* قائمة اختيار العتبة المشعة */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#059669] px-1">اختر العتبة المقدسة:</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {shrines.map((shrine) => (
            <div
              key={shrine.id}
              onClick={() => setActiveShrine(shrine)}
              className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all border duration-200 ${
                activeShrine.id === shrine.id
                  ? 'bg-[#064e3b] border-[#fbbf24] text-[#fbbf24] shadow-md'
                  : 'bg-[#064e3b]/40 border-[#059669]/20 hover:border-[#059669]/60 text-[#f0f9ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeShrine.id === shrine.id ? 'bg-[#fbbf24]/20 text-[#fbbf24]' : 'bg-[#059669]/20 text-[#059669]'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z"/><path d="m17 2-5 5-5-5"/></svg>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-sm">{shrine.name}</span>
                  <span className="text-xs opacity-70">{shrine.location}</span>
                </div>
              </div>
              {activeShrine.id === shrine.id && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Mic, BookOpen, Clock, Fingerprint, Heart } from 'lucide-react';

const DEPARTMENTS = [
  {
    id: 'daily',
    title: 'الأذكار اليومية',
    desc: 'أذكار الصباح، المساء، والنوم',
    icon: <Clock size={24} />,
    color: 'text-[#fbbf24]',
    bg: 'bg-[#fbbf24]/10',
    path: '/azkar/daily'
  },
  {
    id: 'text-duas',
    title: 'أدعية مقروءة',
    desc: 'أدعية الأيام والمناسبات',
    icon: <BookOpen size={24} />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    path: '/azkar/text-duas'
  },
  {
    id: 'munajat',
    title: 'المناجاة',
    desc: 'دعاء وتضرع لله عز وجل الخمسة عشر',
    icon: <Heart size={24} />,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    path: '/azkar/munajat'
  },
];

export function Azkar() {
  const navigate = useNavigate();

  return (
    <div className="p-6 h-full flex flex-col pb-24">
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-bold font-sans text-[#fbbf24] tracking-tight">الأذكار والأدعية</h1>
        <div className="w-[46px]" />
      </header>
      
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Special Sections mapping to existing pages */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Link to="/shia-duas" className="bg-[#064e3b]/80 border border-[#059669]/40 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/50 transition-all text-center">
             <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-1">
               <Mic size={24} />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-[#f0f9ff]">أدعية مسموعة</span>
             </div>
          </Link>
          <Link to="/tasbeeh" className="bg-[#064e3b]/80 border border-[#059669]/40 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/50 transition-all text-center">
             <div className="w-12 h-12 bg-[#fbbf24]/20 text-[#fbbf24] rounded-full flex items-center justify-center mb-1">
               <Fingerprint size={24} />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-[#f0f9ff]">التسبيحات</span>
             </div>
          </Link>
        </div>

        {/* Text Sections */}
        <h2 className="text-[#059669] font-bold text-sm mb-2 mt-4 px-2">أقسام القراءة</h2>
        {DEPARTMENTS.map((dept, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={dept.id}
          >
            <Link
              to={dept.path}
              className="bg-[#064e3b]/40 p-5 rounded-[24px] border border-[#059669]/20 flex items-center justify-between hover:bg-[#059669]/30 hover:border-[#059669]/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`${dept.bg} ${dept.color} w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform`}>
                  {dept.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#f0f9ff] mb-1">{dept.title}</h3>
                  <p className="text-xs text-[#059669] font-medium">{dept.desc}</p>
                </div>
              </div>
              <ChevronLeft className="text-[#059669] group-hover:text-[#fbbf24] transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

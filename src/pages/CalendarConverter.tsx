import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Bell, Share2, RefreshCw, ChevronLeft } from 'lucide-react';

// تعريف متغيرات الحركة الاحترافية
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function CalendarConverter() {
  const [view, setView] = useState<'main' | 'converter'>('main');

  return (
    <div className="w-full h-full bg-[#121212] overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'main' ? (
          <MainCalendarView key="main" onNavigate={() => setView('converter')} />
        ) : (
          <ConverterView key="converter" onBack={() => setView('main')} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- واجهة التقويم الرئيسية (الدارك مود) ---
function MainCalendarView({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full bg-[#121212]"
    >
      {/* هيدر الصورة */}
      <div className="relative h-56 bg-zinc-900 overflow-hidden flex flex-col justify-end p-6 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800')] bg-cover bg-center opacity-30" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-1">٢٤ محرم ١٤٤٨ هـ</h1>
          <p className="text-sm text-zinc-400 font-medium">الجمعة، ١٠ تموز ٢٠٢٦</p>
        </div>
      </div>

      {/* التقويم */}
      <div className="p-4 grid grid-cols-7 gap-y-4 text-center mt-2">
        {['ع', 'ث', 'ل', 'ك', 'ي', 'ن', 'ا'].map((d) => (
          <div key={d} className="text-xs text-zinc-600 font-bold">{d}</div>
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex justify-center items-center">
            {i + 1 === 24 ? (
              <motion.div layoutId="active-date" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/30">
                ٢٤
              </motion.div>
            ) : (
              <span className="text-sm text-zinc-400">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* أزرار التحويل */}
      <div className="px-4 py-6 grid grid-cols-2 gap-3">
        <button onClick={onNavigate} className="p-4 bg-[#1e1e1e] rounded-2xl text-right border border-white/5 hover:border-amber-500/50 transition-all">
          <Calendar className="text-amber-500 mb-2" size={20} />
          <p className="text-xs font-bold text-white">تحويل التاريخ</p>
        </button>
      </div>

      {/* كارت الحدث القادم */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-4 p-5 bg-[#1e1e1e] rounded-2xl border border-white/5"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded">الحدث القادم</span>
          <Share2 size={16} className="text-zinc-500" />
        </div>
        <h2 className="text-sm font-bold text-white mb-4 leading-relaxed">شهادة الإمام علي بن الحسين السجاد (عليهما السلام) في المدينة المنورة سنة ٩٥هـ</h2>
        <button className="w-full py-3 bg-red-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
          <Bell size={14} /> إضافة تذكير
        </button>
      </motion.div>
    </motion.div>
  );
}

// --- واجهة المحول (اللون الأخضر) ---
function ConverterView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full bg-[#022c22] p-6"
    >
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#064e3b] flex items-center justify-center mb-8">
        <ArrowRight size={20} className="text-yellow-500" />
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#ffcc29] mb-2">محول التقويم الإسلامي</h2>
        <p className="text-emerald-300 text-sm">تحويل التاريخ الميلادي إلى ما يقابله بالهجري</p>
      </div>

      <div className="bg-[#064e3b] p-6 rounded-2xl border border-emerald-700/50 shadow-xl">
        <label className="block text-emerald-100 text-xs font-bold mb-3">اختر التاريخ الميلادي</label>
        <div className="flex items-center justify-between p-4 bg-[#022c22] rounded-xl border border-emerald-800">
           <span className="text-emerald-500">10 / 07 / 2026</span>
           <Calendar className="text-yellow-500" size={20} />
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        className="mt-auto w-full py-4 bg-[#ffcc29] text-[#022c22] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/20"
      >
        <RefreshCw size={20} /> تحويل الآن
      </motion.button>
    </motion.div>
  );
}


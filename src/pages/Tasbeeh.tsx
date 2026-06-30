import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const TASBEEH_TYPES = [
  { id: 1, text: 'سُبْحَانَ اللَّهِ', count: 33 },
  { id: 2, text: 'الْحَمْدُ لِلَّهِ', count: 33 },
  { id: 3, text: 'اللَّهُ أَكْبَرُ', count: 34 },
  { id: 4, text: 'لَا إِلَٰهَ إِلَّا اللَّهُ', count: 100 },
  { id: 5, text: 'مفتوح (بدون حد)', count: 0 },
];

export function Tasbeeh() {
  const [count, setCount] = useState(0);
  const [activeType, setActiveType] = useState(TASBEEH_TYPES[0]);
  const [totalCount, setTotalCount] = useState(() => {
    return parseInt(localStorage.getItem('total_tasbeeh') || '0', 10);
  });

  useEffect(() => {
    localStorage.setItem('total_tasbeeh', totalCount.toString());
  }, [totalCount]);

  useEffect(() => {
    setCount(0);
  }, [activeType]);

  const handleIncrement = () => {
    if (activeType.count > 0 && count >= activeType.count) {
       // Optionally vibrate or play sound when target reached
       if ('vibrate' in navigator) navigator.vibrate(200);
       return;
    }
    
    // Light vibration on tap
    if ('vibrate' in navigator) navigator.vibrate(30);
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من تصفير العداد؟')) {
       setCount(0);
    }
  };

  const progress = activeType.count > 0 ? (count / activeType.count) * 100 : 0;

  return (
    <div className="min-h-[100dvh] bg-[#022c22] flex flex-col relative pb-safe">
      <div className="sticky top-0 bg-[#064e3b]/90 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-[#059669]/30">
        <Link to="/" className="p-2 -mr-2 text-[#059669] hover:text-[#fbbf24] transition-colors rounded-full">
          <ArrowRight />
        </Link>
        <span className="text-xl font-bold text-[#fbbf24]">المسبحة الإلكترونية</span>
        <button 
           className="p-2 -ml-2 text-[#059669] hover:text-[#fbbf24]"
           onClick={handleReset}
        >
           <RotateCcw size={22} />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col pt-8">
        {/* Total stats */}
        <div className="flex items-center justify-between bg-[#064e3b]/30 p-4 rounded-3xl border border-[#059669]/20 mb-8">
          <div className="flex flex-col">
            <span className="text-xs text-[#059669] mb-1">المجموع الكلي للذكر</span>
            <span className="text-2xl font-bold text-[#fbbf24]">{totalCount}</span>
          </div>
          <Target className="text-[#059669]/50" size={32} />
        </div>

        {/* Current Dhikr Types */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-6 px-6 relative z-10 snap-x">
          {TASBEEH_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveType(type)}
              className={`snap-center shrink-0 uppercase tracking-wider px-6 py-3 rounded-full text-sm font-semibold transition-all border ${
                activeType.id === type.id 
                  ? 'bg-[#fbbf24] text-[#022c22] border-[#fbbf24]' 
                  : 'bg-[#064e3b]/50 text-[#f0f9ff] border-[#059669]/50 hover:bg-[#064e3b]'
              }`}
            >
              {type.text} {type.count > 0 ? `(${type.count})` : ''}
            </button>
          ))}
        </div>

        {/* The Clicker Area */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          <motion.div 
            className="text-2xl font-bold mb-10 text-center text-[#f0f9ff] h-10 drop-shadow-md"
            key={activeType.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeType.text}
          </motion.div>

          <button 
             className="relative group focus:outline-none touch-manipulation"
             onClick={handleIncrement}
          >
             <div className="absolute inset-0 bg-[#fbbf24] blur-[60px] opacity-20 group-active:opacity-40 transition-opacity rounded-full"></div>
             <div className="w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-tr from-[#064e3b] to-[#042f2e] border-8 border-[#059669]/30 rounded-full flex flex-col items-center justify-center shadow-2xl relative z-10 active:scale-[0.98] transition-transform duration-75 overflow-hidden">
                
                {/* Progress Ring */}
                {activeType.count > 0 && (
                   <div className="absolute inset-0">
                      <svg className="w-full h-full -rotate-90">
                         <circle 
                            cx="50%" cy="50%" r="48%" 
                            fill="transparent" 
                            stroke="#059669" 
                            strokeWidth="8" 
                            strokeOpacity="0.2"
                         />
                         <circle 
                            cx="50%" cy="50%" r="48%" 
                            fill="transparent" 
                            stroke="#fbbf24" 
                            strokeWidth="8" 
                            strokeDasharray={2 * Math.PI * 120 /* Rough estimate, since r is 48% */} 
                            strokeDashoffset={2 * Math.PI * 120 * (1 - progress/100)}
                            className="transition-all duration-300 ease-out"
                         />
                      </svg>
                   </div>
                )}

                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={count}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.2, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-7xl font-black tracking-tighter"
                    style={{ color: activeType.count > 0 && count === activeType.count ? '#fbbf24' : '#f0f9ff' }}
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
                
                {activeType.count > 0 && (
                  <span className="text-[#059669] font-medium text-lg mt-2">
                    / {activeType.count}
                  </span>
                )}
             </div>
          </button>
        </div>
      </div>
    </div>
  );
}

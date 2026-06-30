import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRAYERS = [
  { id: 'fajr', name: 'الفجر', rakats: 2 },
  { id: 'dhuhr', name: 'الظهر', rakats: 4 },
  { id: 'asr', name: 'العصر', rakats: 4 },
  { id: 'maghrib', name: 'المغرب', rakats: 3 },
  { id: 'isha', name: 'العشاء', rakats: 4 },
];

export function RakatCounter() {
  const navigate = useNavigate();
  const [selectedPrayer, setSelectedPrayer] = useState(PRAYERS[0]);
  const [sujudCount, setSujudCount] = useState(0);
  const [message, setMessage] = useState('');
  const maxSujuds = selectedPrayer.rakats * 2;
  const currentRakat = Math.min(Math.floor(sujudCount / 2) + 1, selectedPrayer.rakats);
  const currentSujudInRakat = (sujudCount % 2) + 1;
  const tapAreaRef = useRef<HTMLDivElement>(null);

  const triggerVibratePattern = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const handleTap = () => {
    if (sujudCount >= maxSujuds) return;

    const newCounter = sujudCount + 1;
    setSujudCount(newCounter);

    let msg = '';
    if (newCounter === maxSujuds) {
      msg = 'التشهد الأخير والتسليم';
      triggerVibratePattern([200, 100, 200, 100, 200]);
    } else if (newCounter === 4 && selectedPrayer.rakats > 2) {
      msg = 'التشهد الأول';
      triggerVibratePattern([200, 100, 200]);
      
      // Auto clear message after 5 seconds so they can see Rakat 3 counters
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } else {
      triggerVibratePattern(100);
      msg = '';
    }
    
    setMessage(msg);
  };

  const handleReset = () => {
    setSujudCount(0);
    setMessage('');
    triggerVibratePattern(50);
  };

  const isCompleted = sujudCount >= maxSujuds;

  const bgGradient = isCompleted 
    ? 'from-[#fbbf24]/20 to-[#022c22]' 
    : 'from-[#064e3b] to-[#022c22]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 h-full flex flex-col justify-start"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full shrink-0 mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">عداد الركع</h1>
        <div className="w-[46px]" />
      </header>

      {/* Prayer Selection */}
      <div className="flex bg-[#064e3b]/50 p-2 rounded-2xl border border-[#059669]/30 overflow-x-auto shrink-0 mb-2 gap-2 hide-scrollbar">
        {PRAYERS.map((prayer) => (
          <button
            key={prayer.id}
            onClick={() => {
              setSelectedPrayer(prayer);
              setSujudCount(0);
              setMessage('');
              triggerVibratePattern(50);
            }}
            className={`flex-1 min-w-[60px] py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedPrayer.id === prayer.id
                ? 'bg-[#fbbf24] text-[#022c22] shadow-lg'
                : 'text-[#059669] hover:bg-[#059669]/20'
            }`}
          >
            {prayer.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center shrink-0 mb-4 px-2">
         <div className="flex items-center gap-2 text-[#f0f9ff]">
           <Activity size={20} className="text-[#059669]" />
           <span className="font-medium text-[#059669]">الصلاة: {selectedPrayer.name} ({selectedPrayer.rakats} ركعات)</span>
         </div>
         <button 
           onClick={handleReset}
           className="p-3 text-[#f0f9ff] flex items-center gap-2 bg-[#064e3b]/40 rounded-full hover:bg-[#fbbf24]/20 transition-colors border border-[#059669]/30 text-sm"
         >
           <RefreshCw size={16} />
           إعادة
         </button>
      </div>

      {/* Touch Area */}
      <div 
        ref={tapAreaRef}
        onClick={handleTap}
        className={`flex-1 mt-4 relative w-full rounded-[40px] border-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
          ${isCompleted ? 'border-[#fbbf24]' : 'border-[#059669]/40 hover:border-[#059669]'}
        `}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} transition-colors duration-500`} />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -right-10 w-40 h-40 bg-[#fbbf24]/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-10 w-40 h-40 bg-[#059669]/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full pointer-events-none">
          <AnimatePresence mode="wait">
            {message ? (
               <motion.div 
                 key="message"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.8, opacity: 0 }}
                 className="flex flex-col items-center justify-center space-y-6"
               >
                 <div className="text-[#fbbf24] text-5xl md:text-6xl font-black px-4 leading-tight drop-shadow-lg">
                   {message}
                 </div>
                 {isCompleted ? (
                   <p className="text-[#059669] text-xl">تقبل الله أعمالكم</p>
                 ) : (
                   <p className="text-[#059669] text-xl">انقر للمتابعة</p>
                 )}
               </motion.div>
            ) : (
              <motion.div 
                key="counters"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#059669] text-2xl font-bold mb-2">الركعة</span>
                  <span className="text-[#fbbf24] text-8xl md:text-9xl font-black drop-shadow-2xl">
                     {currentRakat}
                  </span>
                </div>
                <div className="h-px w-3/4 max-w-[200px] bg-[#059669]/30" />
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#059669] text-2xl font-bold mb-2">السجدة</span>
                  <span className="text-[#f0f9ff] text-7xl md:text-8xl font-black opacity-90 drop-shadow-xl">
                    {sujudCount >= maxSujuds ? 2 : currentSujudInRakat}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {!isCompleted && !message && (
           <div className="absolute bottom-8 left-0 right-0 text-center text-[#059669] text-sm animate-pulse pointer-events-none">
             اضغط هنا عند كل سجدة
           </div>
        )}
      </div>

    </motion.div>
  );
}

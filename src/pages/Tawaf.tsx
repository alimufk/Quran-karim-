import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Tawaf() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    if (count < 7) setCount(count + 1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 flex flex-col h-[85dvh] justify-between">
      <div>
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 active:scale-95 transition-all">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#fbbf24]">عداد الطواف والسعي</h1>
            <p className="text-[#059669] text-xs">حساب الأشواط بسهولة لضمان عدم النسيان</p>
          </div>
        </header>

        <div className="bg-[#064e3b]/30 border border-[#059669]/20 p-4 rounded-2xl text-center text-sm text-[#f0f9ff]">
          يبدأ كل شوط من أمام **الحجر الأسود** وينتهي عنده (الطواف 7 أشواط كاملة).
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 my-auto">
        <button onClick={handleIncrement} className="w-52 h-52 bg-gradient-to-br from-[#064e3b] to-[#042f2e] border-4 border-[#059669]/60 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-all relative group">
          <span className="text-6xl font-black text-[#fbbf24]">{count}</span>
          <span className="text-xs text-emerald-100/60 mt-2 font-medium">اضغط بعد كل شوط</span>
        </button>

        {count === 7 && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/30 text-sm font-bold">
            <CheckCircle2 size={18} /> اكتملت السبعة أشواط بحمد الله
          </motion.div>
        )}
      </div>

      <button onClick={() => setCount(0)} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-98">
        <RotateCcw size={18} /> تصفير العداد لإعادة البدء
      </button>
    </motion.div>
  );
}

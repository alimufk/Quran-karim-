import { ArrowRight, Info, Heart, Code2, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function About() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-[100dvh] bg-[#022c22] relative">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <Link to="/" className="p-2 -mr-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">حول التطبيق</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#064e3b]/80 border border-[#059669] rounded-3xl p-6 text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/5 rounded-full blur-3xl -mx-10 -my-10" />
          
          <div className="w-20 h-20 bg-[#059669]/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#fbbf24]/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Info size={40} className="text-[#fbbf24]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#f0f9ff] mb-2 tracking-tight">تطبيق نور القرآن</h2>
          <p className="text-[#059669] text-sm mb-6 leading-relaxed">
            رفيقك اليومي للقرآن الكريم، الأذكار، أوقات الصلاة والمزيد.
          </p>

          <div className="space-y-4">
            <button 
              onClick={toggleTheme}
              className="w-full bg-[#022c22]/50 p-4 rounded-2xl flex items-center justify-between border border-[#059669]/30 transition-colors hover:border-[#059669]/60 active:scale-[0.98] outline-none"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={22} className="text-[#fbbf24]" /> : <Sun size={22} className="text-[#fbbf24]" />}
                <span className="text-[#f0f9ff] text-sm font-bold">مظهر التطبيق</span>
              </div>
              <span className="text-[#fbbf24] text-xs font-bold bg-[#fbbf24]/10 px-3 py-1 rounded-full">
                {theme === 'dark' ? 'الوضع المظلم' : 'الوضع الفاتح'}
              </span>
            </button>

            <div className="bg-[#022c22]/50 p-4 rounded-2xl flex flex-col items-center justify-center border border-[#059669]/30 transition-colors hover:border-[#059669]/60">
              <Code2 className="text-[#fbbf24] mb-2" size={24} />
              <span className="text-[#f0f9ff] text-sm font-bold mb-1">المطور</span>
              <span className="text-[#fbbf24] font-bold text-xl drop-shadow-md">علاوي النعيمي</span>
            </div>

            <div className="bg-[#022c22]/50 p-4 rounded-2xl border border-[#059669]/30 mt-4 leading-relaxed">
              <p className="text-[#f0f9ff] text-sm flex items-center justify-center gap-2">
                <Heart size={16} className="text-red-500 fill-red-500" />
                <span>تم تطوير هذا التطبيق كصدقة جارية.</span>
              </p>
              <p className="text-[#059669] text-xs mt-2">
                نسأل الله أن ينفع به ويجعله في ميزان الحسنات.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

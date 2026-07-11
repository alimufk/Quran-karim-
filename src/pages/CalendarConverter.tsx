import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CalendarConverter() {
  const navigate = useNavigate();
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriResult, setHijriResult] = useState('');

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gregorianDate) return;
    
    try {
      const dateObj = new Date(gregorianDate);
      const formatted = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
      setHijriResult(formatted);
    } catch (err) {
      setHijriResult('يرجى إدخال تاريخ صحيح');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <header className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 active:scale-95 transition-all">
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#fbbf24]">محول التقويم الإسلامي</h1>
          <p className="text-[#059669] text-xs">تحويل التاريخ الميلادي إلى ما يقابله بالهجري</p>
        </div>
      </header>

      <form onSubmit={handleConvert} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-emerald-100/80">اختر التاريخ الميلادي:</label>
          <input type="date" value={gregorianDate} onChange={(e) => setGregorianDate(e.target.value)} className="w-full p-4 bg-[#064e3b]/40 text-[#f0f9ff] border border-[#059669]/30 rounded-xl focus:outline-none focus:border-[#fbbf24] transition-all text-right" />
        </div>

        <button type="submit" className="w-full py-4 bg-[#fbbf24] text-[#022c22] font-black rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#fcd34d] transition-colors active:scale-98">
          <RefreshCw size={18} /> تحويل الآن
        </button>
      </form>

      {hijriResult && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-gradient-to-r from-[#064e3b] to-[#042f2e] border border-[#fbbf24]/30 rounded-2xl text-center">
          <CalendarDays className="w-10 h-10 text-[#fbbf24] mx-auto mb-2" />
          <p className="text-xs text-[#059669] font-bold mb-1">التاريخ الهجري المقابل هو:</p>
          <p className="text-xl font-black text-[#f0f9ff]">{hijriResult}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

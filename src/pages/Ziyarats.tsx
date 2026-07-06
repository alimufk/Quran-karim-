import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// الـ IDs هنا مطابقة تماماً للمفاتيح المتوقعة في صفحة التفاصيل ومشغل الصوتيات
const generalZiyarats = [
  { id: 'ashura', name: 'زيارة عاشوراء' },
  { id: 'warith', name: 'زيارة وارث' },
  { id: 'aminullah', name: 'زيارة أمين الله' },
  { id: 'jamia', name: 'الزيارة الجامعة الكبيرة' },
  { id: 'aleyasin', name: 'زيارة آل ياسين' },
  { id: 'nahiya', name: 'زيارة الناحية المقدسة' },
  { id: 'arbaeen', name: 'زيارة الأربعين' },
];

const weeklyZiyarats = [
  { id: 'saturday', name: 'يوم السبت', title: 'زيارة النبي محمد (ص)', color: 'from-amber-600 to-amber-900' },
  { id: 'sunday', name: 'يوم الأحد', title: 'زيارة أمير المؤمنين والزهراء (ع)', color: 'from-blue-600 to-blue-900' },
  { id: 'monday', name: 'يوم الإثنين', title: 'زيارة الحسن والحسين (ع)', color: 'from-green-600 to-green-900' },
  { id: 'tuesday', name: 'يوم الثلاثاء', title: 'زيارة السجاد والباقر والصادق (ع)', color: 'from-purple-600 to-purple-900' },
  { id: 'wednesday', name: 'يوم الأربعاء', title: 'زيارة الكاظم والرضا والجواد والهادي (ع)', color: 'from-teal-600 to-teal-900' },
  { id: 'thursday', name: 'يوم الخميس', title: 'زيارة الحسن العسكري (ع)', color: 'from-rose-600 to-rose-900' },
  { id: 'friday', name: 'يوم الجمعة', title: 'زيارة الحجة المهدي (عج)', color: 'from-indigo-600 to-indigo-900' },
];

export function Ziyarats() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'weekly'>('general');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // 🎨 تم تثبيت الخلفية الزمردية العميقة ولون النصوص لتتطابق تماماً مع صفحة المشغل
      className="p-6 space-y-6 min-h-screen pb-24 bg-[#022c22] text-[#f0f9ff]"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition active:scale-95"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">الزيارات</h1>
        <div className="w-[46px]" />
      </header>

      {/* Tabs */}
      <div className="flex bg-[#064e3b]/50 p-2 rounded-2xl border border-[#059669]/30 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#fbbf24] text-[#022c22] shadow-lg'
              : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <BookOpen size={18} />
          الزيارات العامة
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weekly'
              ? 'bg-[#fbbf24] text-[#022c22] shadow-lg'
              : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <Calendar size={18} />
          أيام الأسبوع
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.div
            key="general"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            {generalZiyarats.map((ziyarat) => (
              <Link
                to={`/ziyarat/${ziyarat.id}`}
                key={ziyarat.id}
                className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-2xl flex items-center justify-between hover:bg-[#059669]/30 transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#fbbf24]/10 rounded-full text-[#fbbf24] group-hover:bg-[#fbbf24] group-hover:text-[#022c22] transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#f0f9ff] text-lg">{ziyarat.name}</h3>
                  </div>
                </div>
                <ChevronLeft className="text-[#059669] group-hover:text-[#fbbf24] transition-colors" />
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3"
          >
            {weeklyZiyarats.map((ziyarat) => (
              <Link
                to={`/ziyarat/${ziyarat.id}`}
                key={ziyarat.id}
                className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-2xl flex items-center justify-between hover:bg-[#059669]/30 transition-all group relative overflow-hidden active:scale-[0.99]"
              >
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${ziyarat.color}`} />
                <div className="flex items-center gap-4 pr-3">
                  <div className="p-3 bg-[#059669]/20 rounded-2xl text-[#fbbf24]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-[#059669] mb-1 font-bold">{ziyarat.name}</p>
                    <h3 className="font-bold text-[#f0f9ff]">{ziyarat.title}</h3>
                  </div>
                </div>
                <ChevronLeft className="text-[#059669] group-hover:text-[#fbbf24] transition-colors" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

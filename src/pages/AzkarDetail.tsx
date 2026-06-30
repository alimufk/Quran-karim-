import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { azkarData, ZikrSection } from './data/azkarData';

const dataConfig: Record<string, { title: string, subtitle: string }> = {
  'daily': { title: 'الأذكار اليومية', subtitle: 'أذكار الصباح والمساء' },
  'text-duas': { title: 'أدعية مقروءة', subtitle: 'مجموعة من الأدعية المباركة' },
  'munajat': { title: 'المناجاة', subtitle: 'المناجاة الخمسة عشر' },
};

export function AzkarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const info = id ? dataConfig[id] : null;
  const sections = id ? azkarData[id] || [] : [];
  
  const [selectedSection, setSelectedSection] = useState<ZikrSection | null>(null);
  const [counters, setCounters] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load counters when section changes
    if (selectedSection && id) {
      const storageKey = `azkar_progress_${id}_${selectedSection.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCounters(parsed);
          return;
        } catch (e) {
          // fallback
        }
      }
      
      const initialCounters: Record<string, number> = {};
      selectedSection.items.forEach(item => {
        initialCounters[item.id] = item.count;
      });
      setCounters(initialCounters);
    }
  }, [selectedSection, id]);

  const handleTap = (itemId: string, defaultCount: number) => {
    if (!selectedSection || !id) return;
    setCounters(prev => {
      const current = prev[itemId] ?? defaultCount;
      const nextVal = Math.max(0, current - 1);
      const updated = {
        ...prev,
        [itemId]: nextVal
      };
      
      // Save progress dynamically
      const storageKey = `azkar_progress_${id}_${selectedSection.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetSection = () => {
    if (selectedSection && id && window.confirm('هل تريد إعادة تعيين العدادات لهذا القسم؟')) {
      const initialCounters: Record<string, number> = {};
      selectedSection.items.forEach(item => {
        initialCounters[item.id] = item.count;
      });
      setCounters(initialCounters);
      const storageKey = `azkar_progress_${id}_${selectedSection.id}`;
      localStorage.setItem(storageKey, JSON.stringify(initialCounters));
    }
  };

  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-[#fbbf24] text-xl font-bold mb-4">القسم غير موجود</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#059669] text-white px-6 py-2 rounded-full font-medium"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 min-h-[100dvh] flex flex-col pb-24"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-2 shrink-0">
        <button 
          onClick={() => {
            if (selectedSection) {
              setSelectedSection(null);
            } else {
              navigate(-1);
            }
          }}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition"
        >
          <ArrowRight size={20} />
        </button>
        <div className="text-center">
           <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">
             {selectedSection ? selectedSection.title : info.title}
           </h1>
           <p className="text-sm text-[#059669] font-medium">
             {selectedSection ? info.title : info.subtitle}
           </p>
        </div>
        {selectedSection ? (
          <button 
            onClick={handleResetSection}
            title="إعادة ضبط العدادات لهذا القسم"
            className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#059669]/40 transition"
          >
            <RotateCcw size={20} />
          </button>
        ) : (
          <div className="w-[46px]" />
        )}
      </header>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {!selectedSection ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-3 mt-4"
            >
              {sections.length > 0 ? (
                sections.map(sec => (
                  <button 
                    key={sec.id}
                    onClick={() => setSelectedSection(sec)}
                    className="flex items-center justify-between bg-[#064e3b]/40 border border-[#059669]/30 p-5 rounded-2xl hover:bg-[#059669]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#fbbf24]/10 rounded-xl flex items-center justify-center text-[#fbbf24] group-hover:scale-110 transition-transform">
                        <BookOpen size={24} />
                      </div>
                      <span className="text-[#f0f9ff] font-bold text-lg">{sec.title}</span>
                    </div>
                    <ChevronRight className="text-[#059669] group-hover:text-[#fbbf24] transition-colors rotate-180" />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center bg-[#064e3b]/30 border border-[#059669]/20 rounded-3xl p-8 text-center mt-4">
                  <div className="bg-[#fbbf24]/10 p-5 rounded-full mb-6">
                    <BookOpen size={48} className="text-[#fbbf24]" />
                  </div>
                  <h2 className="text-[#f0f9ff] text-2xl font-bold mb-4 leading-relaxed">
                    جاري التحضير لإضافة نصوص الأدعية والمناجاة قريباً
                  </h2>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 mt-2"
            >
              {/* Progress Bar */}
              {(() => {
                const completedCount = selectedSection.items.filter(item => (counters[item.id] ?? item.count) === 0).length;
                const progressPercent = Math.round((completedCount / selectedSection.items.length) * 100);
                return (
                  <div className="bg-[#064e3b]/30 border border-[#059669]/20 p-4 rounded-[24px] flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#f0f9ff]">تقدم القراءة والإنجاز</span>
                      <span className="font-mono text-[#fbbf24] font-bold">{completedCount} / {selectedSection.items.length} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-[#022c22] h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-[#fbbf24] h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {progressPercent === 100 && (
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-xs text-[#10b981] font-bold mt-1"
                      >
                        🎉 تقبل الله طاعاتكم! لقد أتممتم قراءة وتحميد أذكار هذا القسم بالكامل.
                      </motion.p>
                    )}
                  </div>
                );
              })()}

              {selectedSection.items.map((item, idx) => {
                const count = counters[item.id] ?? item.count;
                const isDone = count === 0;

                return (
                  <motion.button
                    whileTap={{ scale: isDone ? 1 : 0.98 }}
                    key={item.id}
                    onClick={() => handleTap(item.id, item.count)}
                    disabled={isDone}
                    className={`text-right w-full p-6 rounded-3xl border transition-all ${
                      isDone 
                        ? 'bg-[#064e3b]/20 border-[#059669]/10 opacity-60 cursor-default' 
                        : 'bg-[#064e3b]/60 border-[#059669]/40 hover:bg-[#059669]/30 shadow-lg cursor-pointer'
                    }`}
                  >
                    <p className={`text-xl leading-loose font-medium mb-6 whitespace-pre-wrap ${isDone ? 'text-[#059669]' : 'text-[#f0f9ff]'}`}>
                      {item.text}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-[#059669]/20 pt-4">
                      <span className="text-sm font-bold text-[#059669]">
                        {idx + 1} / {selectedSection.items.length}
                      </span>
                      
                      <div className={`flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg transition-colors ${
                        isDone 
                          ? 'bg-[#10b981]/20 text-[#10b981]' 
                          : 'bg-[#fbbf24] text-[#022c22] shadow-md'
                      }`}>
                        {isDone ? <Check size={24} /> : count}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, MapPin, ChevronLeft, Bookmark, Hub, Building2, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { visitorGuideData, GuideItem } from './visitorGuideData';

// واجهة تعريف بوابات وأقسام التبويب العلوي
interface TabItem {
  id: GuideItem['category'];
  label: string;
}

export function VisitorGuide() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<GuideItem['category']>('selected');
  const [searchTerm, setSearchTerm] = useState('');

  // قائمة التبويبات العلوية المطابقة تماماً لصور التطبيق (بدون الفنادق)
  const tabs: TabItem[] = [
    { id: 'selected', label: 'الأماكن المختارة' },
    { id: 'hussainiyat', label: 'الحسينيات' },
    { id: 'shrines', label: 'المزارات' },
    { id: 'mawakeb', label: 'المواكب الخدمية' },
    { id: 'medical', label: 'المرافق الصحية والخدمية' },
    { id: 'waypoints', label: 'نقاط دالة' },
  ];

  // فلترة وتصفية البيانات بناءً على القسم المختار ونص البحث
  const filteredItems = useMemo(() => {
    return visitorGuideData.filter(item => {
      const matchesTab = item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.locationDescription.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  // دالة جلب الأيقونة والخلفية الملونة المناسبة لكل فئة حسب صور التطبيق
  const getCategoryIcon = (category: GuideItem['category']) => {
    switch (category) {
      case 'selected':
      case 'waypoints':
        return {
          icon: <MapPin size={22} className="text-white" />,
          bgColor: 'bg-red-600'
        };
      case 'hussainiyat':
        return {
          icon: <Building2 size={22} className="text-white" />,
          bgColor: 'bg-red-600'
        };
      case 'shrines':
        return {
          icon: <div className="w-5 h-5 bg-white rounded-t-full border border-red-600" style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }} />,
          bgColor: 'bg-red-600'
        };
      case 'mawakeb':
        return {
          icon: <div className="w-4 h-6 bg-white rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />,
          bgColor: 'bg-red-600'
        };
      case 'medical':
        return {
          icon: <Stethoscope size={22} className="text-white" />,
          bgColor: 'bg-red-600'
        };
      default:
        return {
          icon: <MapPin size={22} className="text-white" />,
          bgColor: 'bg-red-600'
        };
    }
  };

  // فتح الموقع على خرائط جوجل عند الضغط على الموقع
  const handleLocationClick = (item: GuideItem) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-red-600 selection:text-white" dir="rtl">
      {/* الشريط العلوي الثابت للهيدر */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-zinc-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">دليل زائر الاربعين</h1>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* شريط البحث الذكي المدمج */}
        <div className="px-4 pb-3">
          <div className="relative flex items-center bg-[#242424] rounded-2xl border border-zinc-800 focus-within:border-red-600/50 transition-all">
            <Search className="absolute right-4 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="ابحث عن حسينية، موكب، مزار، أو نقطة دالة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-3 pr-11 pl-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none"
            />
          </div>
        </div>

        {/* شريط التبويبات العلوي الأفقي القابل للتمرير */}
        <div className="overflow-x-auto flex items-center gap-2 px-4 pb-2 scrollbar-none mask-image">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-xl focus:outline-none text-zinc-400 hover:text-zinc-200"
              >
                <span className={isActive ? "text-white font-bold" : ""}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* قائمة عرض المواقع والمقاصد الدينية والخدمية */}
      <main className="p-4 space-y-3 max-w-2xl mx-auto pb-24">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const { icon, bgColor } = getCategoryIcon(item.category);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleLocationClick(item)}
                  className="bg-[#1a1a1a] border border-zinc-900 hover:border-zinc-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                >
                  {/* زر السهم للانتقال جهة اليسار */}
                  <div className="p-2 text-zinc-500">
                    <ChevronLeft size={20} />
                  </div>

                  {/* التفاصيل والعناوين في المنتصف */}
                  <div className="flex-1 text-right px-4 space-y-1">
                    <h3 className="font-bold text-base text-zinc-100">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span>يبعد عنك {item.distance.toLocaleString('ar-IQ')} كم</span>
                      <span className="text-zinc-600">•</span>
                      <span className="truncate max-w-[200px]">{item.locationDescription}</span>
                    </div>
                  </div>

                  {/* الأيقونة الدائرية الحمراء جهة اليمين */}
                  <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center shadow-lg shadow-red-900/10 shrink-0`}>
                    {icon}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-500 text-sm"
            >
              لا توجد نتائج تطابق بحثك في هذا القسم حالياً.
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

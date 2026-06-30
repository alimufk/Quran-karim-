import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Share2, Grid, Sparkles, Image as ImageIcon, Check, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Import our beautiful generated wallpaper assets
import wallKarbala from './assets/images/wall_karbala_1781726361237.jpg';
import wallKadhimiya from './assets/images/wall_kadhimiya_1781726376523.jpg';
import wallCalligraphy from './assets/images/wall_calligraphy_1781726389493.jpg';
import wallNajaf from './assets/images/wall_najaf_1781726405702.jpg';
import wallOccasion from './assets/images/wall_occasion_1781726420418.jpg';

interface Wallpaper {
  id: string;
  title: string;
  category: 'shrines' | 'occasions' | 'calligraphy';
  categoryLabel: string;
  src: string;
  location?: string;
  description: string;
}

const wallpapersData: Wallpaper[] = [
  {
    id: 'karbala',
    title: 'مرقد الإمام الحسين (ع)',
    category: 'shrines',
    categoryLabel: 'المراقد المقدسة',
    src: wallKarbala,
    location: 'كربلاء المقدسة',
    description: 'لقطة روحانية خلابة للقبة الذهبية والمآذن الشريفة لمرقد سيد الشهداء عند الغروب مع انعكاس أشعة الشمس الدافئة.'
  },
  {
    id: 'najaf',
    title: 'مرقد أمير المؤمنين (ع)',
    category: 'shrines',
    categoryLabel: 'المراقد المقدسة',
    src: wallNajaf,
    location: 'النجف الأشرف',
    description: 'القبة الذهبية والموزاييك الكاشاني الأزرق لمرقد الإمام علي عليه السلام في لحظات بزوغ الفجر.'
  },
  {
    id: 'kadhimiya',
    title: 'مرقد الجوادين (ع)',
    category: 'shrines',
    categoryLabel: 'المراقد المقدسة',
    src: wallKadhimiya,
    location: 'الكاظمية المقدسة',
    description: 'القبتان الذهبيتان المتطابقتان لمرقد الإمامين الكاظم والجواد عليهما السلام تحت سماء الليل المرصعة بالنجوم.'
  },
  {
    id: 'calligraphy',
    title: 'مخطوطة لفظ الجلالة (يا الله)',
    category: 'calligraphy',
    categoryLabel: 'الخط العربي والزخارف',
    src: wallCalligraphy,
    location: 'فن إسلامي حديث',
    description: 'تصميم فني عصري يجسد مخطوطة ذهبية مشعة للفظ الجلالة على خلفية رخامية بلون الزمرد الداكن وزخارف هندسية دقيقة.'
  },
  {
    id: 'occasion',
    title: 'الهلال والفانوس الروحاني',
    category: 'occasions',
    categoryLabel: 'المناسبات الإسلامية',
    src: wallOccasion,
    location: 'ليالي المناسبات المباركة',
    description: 'أجواء صوفية رائعة تضم هلالاً ذهبياً ونجوماً متلألئة في عمق السماء الليلية تتدلى من قوس أرابيسك بنقوش دقيقة.'
  }
];

export function Wallpapers() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wallpaper_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('wallpaper_favs', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleDownload = async (wp: Wallpaper) => {
    try {
      // Create a virtual safe helper anchor for downloading
      const response = await fetch(wp.src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${wp.id}_wallpaper.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn('Fallback standard download due to restriction:', error);
      // Fallback
      const link = document.createElement('a');
      link.href = wp.src;
      link.download = `${wp.id}_wallpaper.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = (wp: Wallpaper, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: wp.title,
        text: `قم بتحميل خلفية هاتف عالية الدقة: ${wp.title}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${wp.src}`);
      setCopiedId(wp.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'shrines', label: 'المراقد المقدسة' },
    { id: 'occasions', label: 'المناسبات' },
    { id: 'calligraphy', label: 'الخط العربي' },
    { id: 'favorites', label: 'المفضلة ❤️' }
  ];

  const filteredWallpapers = wallpapersData.filter(wp => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return favorites.includes(wp.id);
    return wp.category === selectedCategory;
  });

  return (
    <div className={`p-6 min-h-[100dvh] pb-24 relative overflow-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f4f8f5]' : 'bg-[#022c22]'
    }`} dir="rtl">
      
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/5 blur-[70px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#059669]/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-2.5 rounded-2xl transition-all active:scale-95 duration-200 shadow-md ${
              theme === 'light' 
                ? 'bg-white hover:bg-slate-100 text-[#1e293b]' 
                : 'bg-[#064e3b] hover:bg-[#059669]/30 text-[#fbbf24] border border-[#059669]/30'
            }`}
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${
              theme === 'light' ? 'text-slate-800' : 'text-[#fbbf24]'
            }`}>خلفيات الهاتف</h1>
            <p className="text-[#059669] text-xs mt-0.5">مشاهدة وتحميل خلفيات إسلامية متميزة بجودة عالية</p>
          </div>
        </div>
        <div className={`p-2.5 rounded-2xl ${
          theme === 'light' ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'
        }`}>
          <Sparkles size={20} />
        </div>
      </header>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 shrink-0 hide-scrollbar scroll-smooth relative z-10">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap active:scale-95 ${
                isSelected
                  ? (theme === 'light' 
                      ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/20' 
                      : 'bg-[#fbbf24] text-[#022c22] shadow-lg shadow-[#fbbf24]/10')
                  : (theme === 'light'
                      ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                      : 'bg-[#064e3b]/40 text-[#f0f9ff]/80 border border-[#059669]/20 hover:bg-[#064e3b]')
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid Wallpapers */}
      {filteredWallpapers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center mt-8 relative z-10"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            theme === 'light' ? 'bg-[#059669]/5 text-slate-400' : 'bg-[#064e3b]/30 text-[#059669]'
          }`}>
            <ImageIcon size={32} />
          </div>
          <h3 className={`text-lg font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-[#f0f9ff]'}`}>
            {selectedCategory === 'favorites' ? 'لا توجد خلفيات مفضلة بعد' : 'لا تتوفر خلفيات حالياً لهذا القسم'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            {selectedCategory === 'favorites' 
              ? 'اضغط على أيقونة القلب على أي خلفية لإضافتها إلى قائمتك المفضلة للوصول السريع إليها.'
              : 'يرجى مراجعة التصنيفات الأخرى لاكتشاف خلفيات دينية مذهلة.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
          {filteredWallpapers.map((wp, idx) => {
            const isFavorite = favorites.includes(wp.id);
            return (
              <motion.div
                key={wp.id}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedWallpaper(wp)}
                className={`group cursor-pointer overflow-hidden rounded-[24px] border transition-all duration-300 flex flex-col hover:shadow-xl hover:scale-[1.02] ${
                  theme === 'light' 
                    ? 'bg-white border-slate-100 shadow-sm' 
                    : 'bg-[#064e3b]/40 border-[#059669]/20 shadow-lg'
                }`}
              >
                {/* Image Container with aspect ratio 9:16 */}
                <div className="relative aspect-[9/16] overflow-hidden bg-slate-900/5 select-none touch-none">
                  <img
                    src={wp.src}
                    alt={wp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Category Pill Tag Overlay */}
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/10">
                    {wp.categoryLabel}
                  </span>

                  {/* Favorite button overlay */}
                  <button
                    onClick={(e) => toggleFavorite(wp.id, e)}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition active:scale-90"
                  >
                    <Heart size={14} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'} />
                  </button>

                  {/* Quick Action Overlay on bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(wp); }}
                      className="p-1.5 rounded-full bg-[#fbbf24] text-[#022c22] hover:bg-white transition-colors"
                    >
                      <Download size={13} />
                    </button>
                    <button 
                      onClick={(e) => handleShare(wp, e)}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                    >
                      {copiedId === wp.id ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                    </button>
                  </div>
                </div>

                {/* Sub-text information */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className={`text-xs font-bold line-clamp-1 ${
                    theme === 'light' ? 'text-slate-800' : 'text-[#f0f9ff]'
                  }`}>
                    {wp.title}
                  </h3>
                  {wp.location && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Grid size={10} className="text-[#059669]" />
                      {wp.location}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal overlay */}
      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex flex-col justify-between p-6 overflow-y-auto"
            dir="rtl"
          >
            {/* Modal TOP bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedWallpaper(null)}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-colors"
                id="close-lightbox"
              >
                رجوع
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => toggleFavorite(selectedWallpaper.id, e)}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors active:scale-95"
                >
                  <Heart 
                    size={20} 
                    className={favorites.includes(selectedWallpaper.id) ? 'fill-rose-500 text-rose-500' : 'text-white'} 
                  />
                </button>
                <button
                  onClick={(e) => handleShare(selectedWallpaper, e)}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors active:scale-95"
                >
                  {copiedId === selectedWallpaper.id ? (
                    <span className="text-emerald-400 font-bold text-xs">تم النسخ!</span>
                  ) : (
                    <Share2 size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Middle Big Preview Image Aspect-[9/16] matching mobile perfectly */}
            <div className="my-auto py-4 flex justify-center items-center">
              <motion.div 
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="relative aspect-[9/16] max-h-[60vh] md:max-h-[50vh] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 bg-slate-900 select-none touch-none"
              >
                <img
                  src={selectedWallpaper.src}
                  alt={selectedWallpaper.title}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category absolute Pill */}
                <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-[#fbbf24] text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                  {selectedWallpaper.categoryLabel}
                </span>
              </motion.div>
            </div>

            {/* Bottom Actions and description */}
            <div className="bg-[#111827]/80 border border-white/5 p-6 rounded-[32px] max-w-md mx-auto w-full backdrop-blur-md space-y-4">
              <div className="text-right">
                <h2 className="text-xl font-bold text-white mb-1">{selectedWallpaper.title}</h2>
                {selectedWallpaper.location && (
                  <p className="text-[#fbbf24] text-xs font-semibold">{selectedWallpaper.location}</p>
                )}
                <p className="text-slate-400 text-xs mt-3 leading-relaxed text-right font-light">
                  {selectedWallpaper.description}
                </p>
              </div>

              {/* DOWNLOAD button */}
              <button
                onClick={() => handleDownload(selectedWallpaper)}
                className="w-full bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-[#022c22] py-4 rounded-[20px] font-bold transition flex items-center justify-center gap-2.5 shadow-xl shadow-[#fbbf24]/10 active:scale-95 duration-200"
              >
                <Download size={18} />
                <span>تحميل الخلفية بجودة عالية</span>
              </button>
              
              <p className="text-[10px] text-center text-slate-500">
                ملاحظة: سيتم تنزيل الصورة مباشرةً إلى مجلد التحميلات الخاص بجهازك بجودة فائقة.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

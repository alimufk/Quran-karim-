import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ZoomIn, ZoomOut, Moon, Sun, Heart, Bookmark, X, Share2, Sparkles, RotateCw, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

function FormattedAiText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-3.5 text-right leading-relaxed" dir="rtl">
      {lines.map((line, index) => {
        let clean = line.trim();
        if (!clean) return <div key={index} className="h-2" />;
        
        // Headers starting with ## or * or ###
        if (clean.startsWith('## ') || clean.startsWith('### ') || clean.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-[#fbbf24] font-black text-xs md:text-sm mt-4 mb-2 flex items-center justify-start gap-1">
              <span className="inline-block w-1.5 h-3 bg-[#fbbf24] rounded-full shrink-0"></span>
              {clean.replace(/^[#\s]+/, '')}
            </h4>
          );
        }
        
        // Bullet points starting with * or -
        if (clean.startsWith('* ') || clean.startsWith('- ')) {
          return (
            <div key={index} className="flex gap-2 items-start text-xs pr-2 text-gray-200">
              <span className="text-[#fbbf24] mt-1.5 text-sm leading-none">•</span>
              <span>{clean.slice(2)}</span>
            </div>
          );
        }
        
        // Standard lines with bold segments **text**
        const parts = clean.split(/(\*\*.*?\*\*)/);
        return (
          <p key={index} className="text-[11px] leading-relaxed text-slate-100/90 font-sans">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="text-[#fbbf24] font-black mx-0.5">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function Surah() {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [tafsirAyahs, setTafsirAyahs] = useState<Ayah[]>([]);
  const [translationAyahs, setTranslationAyahs] = useState<Ayah[]>([]);
  const [viewMode, setViewMode] = useState<'continuous' | 'tafsir' | 'translation'>(() => {
    return (localStorage.getItem('quran_view_mode') as 'continuous' | 'tafsir' | 'translation') || 'continuous';
  });
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // AI Tafsir States
  const [aiExplainText, setAiExplainText] = useState<string | null>(null);
  const [aiExplainLoading, setAiExplainLoading] = useState<boolean>(false);
  const [aiExplainError, setAiExplainError] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('quran_font_size');
    return saved ? parseInt(saved, 10) : 28;
  });
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('quran_night_mode') === 'true';
  });

  // Load last read to scroll to it if opened from "Continue Reading"
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useEffect(() => {
    localStorage.setItem('quran_font_size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('quran_night_mode', isNightMode.toString());
  }, [isNightMode]);

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        // Fetch Quran Uthmani, Tafsir Al-Muyassar, and English Sahih Translation in parallel or as multiple editions
        const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,ar.muyassar,en.sahih`);
        if (response.data && response.data.data && response.data.data.length >= 3) {
          setSurah(response.data.data[0]);
          setTafsirAyahs(response.data.data[1].ayahs);
          setTranslationAyahs(response.data.data[2].ayahs);
        } else {
          // Fallback to single edition
          const fallback = await axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`);
          setSurah(fallback.data.data);
        }
        setLoading(false);
        
        // Mark as read for progress tracking
        if (surahId) {
          try {
            const readSurahs = JSON.parse(localStorage.getItem('read_surahs') || '[]');
            if (!readSurahs.includes(parseInt(surahId))) {
               readSurahs.push(parseInt(surahId));
               localStorage.setItem('read_surahs', JSON.stringify(readSurahs));
            }
          } catch(e) {}
        }
      } catch (error) {
        console.error("Error fetching surah ayahs with editions", error);
        // Secondary fallback
        try {
          const fallback = await axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`);
          setSurah(fallback.data.data);
        } catch (err) {
          console.error("Failed to load even Uthmani fallback", err);
        }
        setLoading(false);
      }
    };
    fetchSurahData();
  }, [surahId]);

  useEffect(() => {
    if (surah && !initialScrollDone) {
      const urlParams = new URLSearchParams(window.location.search);
      const targetAyah = urlParams.get('ayah');
      if (targetAyah) {
        setTimeout(() => {
          const el = document.getElementById(`ayah-${targetAyah}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const ayahData = surah.ayahs.find(a => a.numberInSurah.toString() === targetAyah);
            if (ayahData) setSelectedAyah(ayahData);
          }
        }, 500);
      }
      setInitialScrollDone(true);
    }
  }, [surah, initialScrollDone]);

  const handleFavorite = () => {
    if (!selectedAyah || !surah) return;
    try {
      const favs = JSON.parse(localStorage.getItem('quran_favorites') || '[]');
      const newFav = {
        surahId: surah.number,
        surahName: surah.name,
        ayahNumber: selectedAyah.numberInSurah,
        text: selectedAyah.text
      };
      // Check if already exists
      const exists = favs.findIndex((f: any) => f.surahId === newFav.surahId && f.ayahNumber === newFav.ayahNumber);
      if (exists >= 0) {
        favs.splice(exists, 1); // remove if exists
      } else {
        favs.push(newFav);
      }
      localStorage.setItem('quran_favorites', JSON.stringify(favs));
      setSelectedAyah(null); // deselect
    } catch(e) { console.error(e) }
  };

  const handleBookmark = () => {
     if (!selectedAyah || !surah) return;
     try {
       const bookmark = {
         surahId: surah.number,
         surahName: surah.name,
         ayahNumber: selectedAyah.numberInSurah
       };
       localStorage.setItem('quran_last_read', JSON.stringify(bookmark));
       setSelectedAyah(null);
     } catch(e) { console.error(e) }
  };

  const handleShare = () => {
    if (!selectedAyah || !surah) return;
    const shareText = `قال الله تعالى في سورة ${surah.name} (آية ${selectedAyah.numberInSurah}):\n\n« ${selectedAyah.text} »\n\nتطبيق صائمون`;
    
    if (navigator.share) {
      navigator.share({
        title: `سورة ${surah.name}`,
        text: shareText,
      })
      .then(() => {
        setToastMessage('تمت المشاركة بنجاح!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch((err) => {
        console.log("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          setToastMessage('تم نسخ الآية الكريمة للمشاركة!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          setToastMessage('عذراً، فشل نسخ الآية.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        });
    }
  };

  const handleAiExplain = async () => {
    if (!selectedAyah || !surah) return;
    setAiExplainLoading(true);
    setAiExplainError(null);
    setAiExplainText(null);
    setShowAiModal(true);
    
    try {
      const response = await axios.post('/api/gemini/explain-ayah', {
        surahName: surah.name,
        ayahNumber: selectedAyah.numberInSurah,
        ayahText: selectedAyah.text
      });
      if (response.data && response.data.text) {
        setAiExplainText(response.data.text);
      } else {
        throw new Error('فشل جلب التفسير من المساعد الذكي.');
      }
    } catch (err: any) {
      console.error(err);
      const serverErr = err.response?.data?.error || err.message || 'حدث خطأ غير متوقع.';
      setAiExplainError(serverErr);
    } finally {
      setAiExplainLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-screen flex items-center justify-center bg-[#022c22]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24]"></div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="p-6 text-center text-[#fbbf24] bg-[#022c22] h-full min-h-screen flex items-center justify-center font-bold">
        حدث خطأ في تحميل السورة الكريمة
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] flex flex-col transition-colors duration-500 relative ${isNightMode ? 'bg-black text-[#a3a3a3]' : 'bg-[#022c22] text-[#f0f9ff]'}`}>
      {/* Header */}
      <header className={`sticky top-0 shadow-lg border-b px-4 py-3 flex items-center justify-between z-20 transition-colors duration-500 ${isNightMode ? 'bg-[#111] border-[#333]' : 'bg-[#064e3b] border-[#059669]/30'}`}>
        <button onClick={() => navigate(-1)} className={`p-2 -mr-2 transition-colors ${isNightMode ? 'text-gray-400 hover:text-gray-200' : 'text-[#fbbf24]'}`}>
          <ArrowRight size={24} />
        </button>
        <h1 className={`font-bold text-lg tracking-tight transition-colors ${isNightMode ? 'text-gray-300' : 'text-[#f0f9ff]'}`}>{surah.name}</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsNightMode(!isNightMode)} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${isNightMode ? 'bg-[#222] hover:bg-[#333] text-[#059669]' : 'bg-[#059669]/30 hover:bg-[#059669]/50 text-[#fbbf24]'}`}>
            {isNightMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setFontSize(s => Math.min(s + 4, 60))} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${isNightMode ? 'bg-[#222] hover:bg-[#333] text-gray-400' : 'bg-[#059669]/30 hover:bg-[#059669]/50 text-[#fbbf24]'}`}>
            <ZoomIn size={20} />
          </button>
          <button onClick={() => setFontSize(s => Math.max(s - 4, 16))} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${isNightMode ? 'bg-[#222] hover:bg-[#333] text-gray-400' : 'bg-[#059669]/30 hover:bg-[#059669]/50 text-[#fbbf24]'}`}>
            <ZoomOut size={20} />
          </button>
        </div>
      </header>

      {/* View Mode Sticky Tabs Switcher */}
      <div 
        className={`sticky top-[64px] px-4 py-2 border-b flex items-center justify-center gap-2 z-10 transition-colors duration-500 shadow-sm ${
          isNightMode ? 'bg-[#18181b] border-zinc-800' : 'bg-[#047857] border-[#047857]/30'
        }`}
        id="quran-view-mode-tabs"
      >
        <button
          id="btn-view-continuous"
          onClick={() => {
            setViewMode('continuous');
            localStorage.setItem('quran_view_mode', 'continuous');
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${
            viewMode === 'continuous'
              ? isNightMode ? 'bg-[#fbbf24] text-black shadow-md' : 'bg-[#fbbf24] text-[#064e3b] shadow-md'
              : isNightMode ? 'text-zinc-400 hover:text-white bg-zinc-900/40' : 'text-emerald-100 hover:bg-emerald-800/40'
          }`}
        >
          📖 قراءة مستمرة
        </button>
        <button
          id="btn-view-tafsir"
          onClick={() => {
            setViewMode('tafsir');
            localStorage.setItem('quran_view_mode', 'tafsir');
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${
            viewMode === 'tafsir'
              ? isNightMode ? 'bg-[#fbbf24] text-black shadow-md' : 'bg-[#fbbf24] text-[#064e3b] shadow-md'
              : isNightMode ? 'text-zinc-400 hover:text-white bg-zinc-900/40' : 'text-emerald-100 hover:bg-emerald-800/40'
          }`}
        >
          💡 التفسير الميسر
        </button>
        <button
          id="btn-view-translation"
          onClick={() => {
            setViewMode('translation');
            localStorage.setItem('quran_view_mode', 'translation');
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${
            viewMode === 'translation'
              ? isNightMode ? 'bg-[#fbbf24] text-black shadow-md' : 'bg-[#fbbf24] text-[#064e3b] shadow-md'
              : isNightMode ? 'text-zinc-400 hover:text-white bg-zinc-900/40' : 'text-emerald-100 hover:bg-emerald-800/40'
          }`}
        >
          🌐 English Trans
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24" ref={contentRef} onClick={(e) => {
        // Deselect if clicked outside ayahs
        if (e.target === contentRef.current) setSelectedAyah(null);
      }}>
        
        {/* Bismillah Header if not Surah Tawbah (9) or Fatiha (1) which includes it in Ayah 1 */}
        {surah.number !== 1 && surah.number !== 9 && viewMode === 'continuous' && (
          <div className={`text-center mb-8 quran-text transition-colors duration-500 ${isNightMode ? 'text-gray-500' : 'text-[#fbbf24]'}`} style={{ fontSize: `${fontSize}px` }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {viewMode === 'continuous' ? (
          <div className={`text-center quran-text leading-loose transition-colors duration-500 ${isNightMode ? 'text-[#a3a3a3]' : 'text-[#f0f9ff]'}`} style={{ fontSize: `${fontSize}px` }}>
            {surah.ayahs.map((ayah) => {
               // For Surahs other than Fatiha, the API sometimes includes Bismillah in string if it's the first ayah. Clean it up for display.
               let ayahText = ayah.text;
               if (surah.number !== 1 && ayah.numberInSurah === 1 && ayahText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')) {
                 ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
               }
               
               const isSelected = selectedAyah?.numberInSurah === ayah.numberInSurah;
               
               return (
                 <span 
                   id={`ayah-${ayah.numberInSurah}`}
                   key={ayah.number}
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedAyah(isSelected ? null : ayah);
                   }}
                   className={`cursor-pointer inline transition-all duration-300 rounded px-1 ${isSelected ? (isNightMode ? 'bg-[#333] text-white' : 'bg-[#059669]/30 text-white shadow-[0_0_0_4px_rgba(5,150,105,0.3)]') : ''}`}
                 >
                    {ayahText}
                    <span className={`inline-flex items-center justify-center w-auto min-w-[2rem] p-1 aspect-square mx-2 relative align-middle text-[0.4em] font-sans border-2 rounded-full transition-colors ${isSelected ? 'text-[#fbbf24] border-[#fbbf24]' : isNightMode ? 'text-gray-600 border-gray-800 bg-gray-900/50' : 'text-[#fbbf24] border-[#fbbf24]/50 bg-[#fbbf24]/10'}`}>
                      {ayah.numberInSurah.toLocaleString('ar-SA')}
                    </span>
                 </span>
               );
            })}
          </div>
        ) : (
          /* Verse-by-verse list for Tafsir or Translation */
          <div className="space-y-4" id="quran-verse-list">
            {/* Show Bismillah outside of cards as elegant title if not Surah Tawbah/Fatiha */}
            {surah.number !== 1 && surah.number !== 9 && (
              <div className={`text-center mb-6 quran-text transition-colors duration-500 ${isNightMode ? 'text-gray-500' : 'text-[#fbbf24]'}`} style={{ fontSize: `${fontSize - 4}px` }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}

            {surah.ayahs.map((ayah, i) => {
               let ayahText = ayah.text;
               if (surah.number !== 1 && ayah.numberInSurah === 1 && ayahText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')) {
                 ayahText = ayahText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
               }
               
               const isSelected = selectedAyah?.numberInSurah === ayah.numberInSurah;
               
               // Retrieve translation or tafsir safely
               const tafsirText = tafsirAyahs[i]?.text || 'جاري تحميل التفسير الميسر...';
               const translationText = translationAyahs[i]?.text || 'Loading translation...';
               
               return (
                 <div
                   id={`ayah-${ayah.numberInSurah}`}
                   key={ayah.number}
                   className={`p-4 rounded-[24px] border transition-all duration-300 cursor-pointer ${
                     isSelected 
                       ? isNightMode 
                         ? 'bg-zinc-900 border-zinc-700 shadow-lg' 
                         : 'bg-[#059669]/20 border-[#fbbf24]/40 shadow-md scale-[0.99]'
                       : isNightMode
                         ? 'bg-[#111] border-zinc-900/80 hover:border-zinc-800'
                         : 'bg-[#064e3b]/30 border-[#059669]/15 hover:bg-[#059669]/20'
                   }`}
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedAyah(isSelected ? null : ayah);
                   }}
                 >
                   {/* Arabic Verse Header */}
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center justify-between gap-2">
                       {/* Ayah Number Badge */}
                       <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl border text-[11px] font-sans font-bold shadow-sm ${
                         isSelected 
                           ? 'text-[#fbbf24] border-[#fbbf24] bg-[#fbbf24]/10 animate-pulse' 
                           : isNightMode 
                             ? 'text-zinc-500 border-zinc-800 bg-zinc-900/40' 
                             : 'text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/5'
                       }`}>
                         {ayah.numberInSurah}
                       </span>
                     </div>
                     
                     <p 
                       className={`quran-text leading-loose text-right transition-colors duration-300 ${
                         isNightMode ? 'text-zinc-100' : 'text-[#f0f9ff]'
                       }`}
                       style={{ fontSize: `${fontSize - 2}px` }}
                     >
                       {ayahText}
                     </p>
                   </div>
                   
                   {/* Secondary Content Box */}
                   <div className="mt-3.5 pt-3.5 border-t border-dashed border-emerald-950/20 dark:border-zinc-800/80">
                     {viewMode === 'tafsir' ? (
                       <div className="space-y-1 text-right">
                         <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-lg inline-block ${
                           isNightMode ? 'text-[#fbbf24] border-[#fbbf24]/20 bg-[#fbbf24]/5' : 'text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/10'
                         }`}>التفسير الميسر</span>
                         <p className={`text-sm leading-relaxed font-sans ${isNightMode ? 'text-zinc-400' : 'text-emerald-100/90'}`}>
                           {tafsirText}
                         </p>
                       </div>
                     ) : (
                       <div className="space-y-1 text-left" dir="ltr">
                         <span className="text-[10px] font-bold text-[#10b981] border border-[#10b981]/20 px-1.5 py-0.5 rounded-lg bg-[#10b981]/5 inline-block font-sans">English Translation</span>
                         <p className={`text-xs leading-relaxed font-sans ${isNightMode ? 'text-zinc-400' : 'text-slate-200/95'}`}>
                           {translationText}
                         </p>
                       </div>
                     )}
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
      
      {showToast && (
        <motion.div
           initial={{ opacity: 0, y: -20, x: "-50%" }}
           animate={{ opacity: 1, y: 0, x: "-50%" }}
           exit={{ opacity: 0, y: -20, x: "-50%" }}
           className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#fbbf24] text-[#064e3b] font-bold px-4 py-2.5 rounded-2xl text-center shadow-lg z-50 pointer-events-none text-xs"
        >
          {toastMessage}
        </motion.div>
      )}

      {/* Action Bar for selected Ayah */}
      {selectedAyah && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#064e3b]/95 backdrop-blur-md border border-[#059669] px-6 py-3 rounded-full flex gap-3.5 items-center shadow-2xl z-30 animate-in slide-in-from-bottom-4 fade-in min-w-[320px] justify-center">
          <button onClick={handleFavorite} className="flex flex-col items-center gap-1 text-[#fbbf24] hover:text-white transition-colors flex-1">
            <Heart size={18} />
            <span className="text-[10px] font-bold">مفضلة</span>
          </button>
          <div className="w-[1px] h-6 bg-[#059669]/50"></div>
          <button onClick={handleBookmark} className="flex flex-col items-center gap-1 text-[#fbbf24] hover:text-white transition-colors flex-1">
            <Bookmark size={18} />
            <span className="text-[10px] font-bold">علامة</span>
          </button>
          <div className="w-[1px] h-6 bg-[#059669]/50"></div>
          <button onClick={handleShare} className="flex flex-col items-center gap-1 text-[#fbbf24] hover:text-white transition-colors flex-1">
            <Share2 size={18} />
            <span className="text-[10px] font-bold">مشاركة</span>
          </button>
          <div className="w-[1px] h-6 bg-[#059669]/50"></div>
          <button onClick={handleAiExplain} className="flex flex-col items-center gap-1 text-[#fbbf24] hover:text-white transition-all duration-300 flex-1 relative group">
            <div className="absolute -inset-1.5 bg-[#fbbf24]/10 rounded-xl blur-sm group-hover:bg-[#fbbf24]/20 transition-all"></div>
            <Sparkles size={18} className="relative text-[#fbbf24] animate-pulse" />
            <span className="text-[10px] font-black relative text-[#fbbf24]">تفسير (AI)</span>
          </button>
          <div className="w-[1px] h-6 bg-[#059669]/50"></div>
          <button onClick={() => setSelectedAyah(null)} className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors flex-1">
            <X size={18} />
            <span className="text-[10px] font-bold">إغلاق</span>
          </button>
        </div>
      )}

      {/* AI Deep Explanation Drawer Interface */}
      {showAiModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`w-full max-w-lg rounded-[32px] border p-6 flex flex-col gap-4 max-h-[75vh] overflow-hidden transition-colors ${
              isNightMode 
                ? 'bg-[#121214] border-zinc-800 text-zinc-100' 
                : 'bg-[#043327] border-[#059669]/25 text-[#f0f9ff]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dashed border-emerald-950/20 dark:border-zinc-800/80 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-black text-[#fbbf24]">
                <Sparkles size={16} className="text-[#fbbf24] animate-pulse" />
                <span>البيان القرآني ومصباح التدبر (AI)</span>
              </span>
              <button 
                onClick={() => {
                  setShowAiModal(false);
                  setAiExplainText(null);
                  setAiExplainError(null);
                }}
                className={`p-1.5 rounded-xl transition-all ${
                  isNightMode ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-[#059669]/30 text-[#fbbf24]'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Selected Verse Context */}
            {selectedAyah && (
              <div className={`p-4 rounded-2xl border text-right space-y-1.5 ${
                isNightMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-[#03221a]/60 border-[#059669]/20'
              }`}>
                <span className="text-[10px] opacity-60">الآية {selectedAyah.numberInSurah} من سورة {surah.name}:</span>
                <p className="font-serif text-sm leading-relaxed text-[#fbbf24]">{selectedAyah.text}</p>
              </div>
            )}

            {/* Explanation Content */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 scrollbar-thin scrollbar-thumb-emerald-500 max-h-[45vh]">
              {aiExplainLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <RotateCw size={32} className="text-[#fbbf24] animate-spin" />
                  <p className="text-xs text-gray-300 font-bold">يتدبّر الذكاء الاصطناعي في الآية الكريمة...</p>
                </div>
              )}

              {aiExplainError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-2xl flex flex-col gap-2 text-right">
                  <p className="font-bold flex items-center justify-end gap-1.5">
                    <span>تعذر جلب التفسير من الخادم</span>
                    <Info size={14} className="shrink-0 text-red-500" />
                  </p>
                  <p className="opacity-85 leading-relaxed font-sans">{aiExplainError}</p>
                  <button 
                    onClick={handleAiExplain}
                    className="mt-2 text-[10px] w-fit mr-auto py-1.5 px-3.5 bg-red-500/20 text-red-200 rounded-xl hover:bg-red-500/30 transition-all font-bold"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              {aiExplainText && (
                <FormattedAiText text={aiExplainText} />
              )}
            </div>
            
            {/* Disclaimer Footer */}
            <div className="text-[9px] text-[#fbbf24]/50 text-center border-t border-dashed border-emerald-950/20 dark:border-zinc-800/80 pt-3">
              تم التوليد في لحظات عبر الذكاء الاصطناعي التفسيري المتقدم.
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

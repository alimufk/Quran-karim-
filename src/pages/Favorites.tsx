import { useState, useEffect } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  const removeFavorite = (surahId: number, ayahNumber: number) => {
    const newFavs = favorites.filter(f => !(f.surahId === surahId && f.ayahNumber === ayahNumber));
    setFavorites(newFavs);
    localStorage.setItem('quran_favorites', JSON.stringify(newFavs));
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#022c22]">
      <header className="sticky top-0 bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-6 py-4 flex items-center gap-4 z-20">
        <button onClick={() => navigate(-1)} className="text-[#fbbf24] hover:bg-[#059669]/20 p-2 rounded-xl transition-colors">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#f0f9ff]">المحفوظات</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {favorites.length === 0 ? (
           <div className="text-center text-[#059669] my-20">
             <p className="text-xl font-bold mb-2">لا توجد آيات محفوظة</p>
             <p className="text-sm">يمكنك حفظ الآيات من خلال الضغط عليها أثناء القراءة</p>
           </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={`${fav.surahId}-${fav.ayahNumber}`} 
                className="bg-[#064e3b]/40 border border-[#059669]/30 p-5 rounded-3xl"
              >
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-widest bg-[#fbbf24]/10 px-2 py-1 rounded-full">سورة {fav.surahName}</span>
                     <span className="text-[#059669] text-xs font-bold mx-2 block mt-2">الآية {fav.ayahNumber}</span>
                   </div>
                   <button 
                     onClick={() => removeFavorite(fav.surahId, fav.ayahNumber)}
                     className="text-[#059669] hover:text-red-400 p-2"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
                <p className="quran-text text-xl leading-loose text-[#f0f9ff] text-center" dir="rtl">
                  {fav.text}
                </p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => navigate(`/quran/${fav.surahId}?ayah=${fav.ayahNumber}`)} className="text-sm text-[#fbbf24] font-bold hover:underline">
                    الذهاب للآية ←
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    try {
      const readSurahs = JSON.parse(localStorage.getItem('read_surahs') || '[]');
      setReadCount(readSurahs.length);
    } catch(e) {}
  }, []);

  useEffect(() => {
    // Fetch Surahs index from alquran.cloud API
    const fetchSurahs = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/meta');
        setSurahs(response.data.data.surahs.references);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surahs", error);
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[\u0617-\u061A\u064B-\u0652\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      .replace(/[أإآاٱ]/g, 'ا')
      .replace(/[يى]/g, 'ي')
      .replace(/ة/g, 'ه');
  };

  const searchNormalized = normalizeArabic(search);
  const filteredSurahs = surahs.filter(s => 
    normalizeArabic(s.name).includes(searchNormalized) || s.englishName.toLowerCase().includes(search.toLowerCase())
  );

  const progressPercentage = Math.round((readCount / 114) * 100);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="sticky top-0 bg-[#022c22]/90 backdrop-blur-md z-10 pt-2 pb-4">
        <h1 className="text-2xl font-bold font-sans text-[#fbbf24] tracking-tight mb-4">القرآن الكريم</h1>
        
        {/* Progress Tracker */}
        <div className="bg-[#064e3b]/80 border border-[#059669]/30 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#f0f9ff] text-sm font-medium">نسبة الإنجاز (الختمة)</span>
            <div className="flex items-center gap-3">
              <span className="text-[#fbbf24] font-bold text-sm">{progressPercentage}%</span>
              {readCount > 0 && (
                <button 
                  onClick={() => {
                    if(window.confirm('هل أنت متأكد من تصفير الختمة؟')) {
                      localStorage.setItem('read_surahs', '[]');
                      setReadCount(0);
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-2 py-1 rounded-lg"
                >
                  إعادة تعيين
                </button>
              )}
            </div>
          </div>
          <div className="w-full bg-[#022c22] rounded-full h-2.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-[#fbbf24] h-2.5 rounded-full"
            ></motion.div>
          </div>
          <p className="text-[#059669] text-xs mt-2 text-left">
            {readCount} من 114 سورة
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن سورة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-4 space-y-3">
          {filteredSurahs.map((surah, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              key={surah.number}
            >
              <Link
                to={`/quran/${surah.number}`}
                className="flex items-center justify-between p-4 rounded-[24px] border border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-12 h-12 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] font-bold text-sm group-hover:scale-110 transition-transform">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none text-[#f0f9ff] mb-1">{surah.name}</h3>
                    <p className="text-xs text-[#059669]">
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                    </p>
                  </div>
                </div>
                <div className="text-[#059669] group-hover:text-[#fbbf24] transition-colors">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, PlayCircle } from 'lucide-react';
import axios from 'axios';

export function Reciters() {
  const [search, setSearch] = useState('');
  const [reciters, setReciters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await axios.get('https://mp3quran.net/api/v3/reciters?language=ar');
        setReciters(response.data.reciters);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reciters", error);
        setLoading(false);
      }
    };
    fetchReciters();
  }, []);

  const filtered = reciters.filter(r => 
    r.name.includes(search) || (r.letter && r.letter.includes(search))
  );

  return (
    <div className="p-6 h-full flex flex-col pt-12">
      <div className="sticky top-0 bg-[#022c22]/90 backdrop-blur-md z-10 pt-2 pb-4">
        <h1 className="text-2xl font-bold font-sans text-[#fbbf24] tracking-tight mb-4">الاستماع للقرآن</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن قارئ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 space-y-3">
        {loading ? (
           <div className="flex justify-center p-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24]"></div>
           </div>
        ) : (
          filtered.map((reciter, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 15) * 0.05 }}
              key={reciter.id}
            >
              <Link
                to={`/listen/${reciter.id}`}
                state={{ 
                  reciterName: reciter.name, 
                  server: reciter.moshaf?.[0]?.server,
                  surah_list: reciter.moshaf?.[0]?.surah_list,
                  moshafName: reciter.moshaf?.[0]?.name
                }}
                className="flex items-center justify-between p-4 rounded-[24px] border border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-12 h-12 bg-[#fbbf24]/10 rounded-full text-[#fbbf24] group-hover:scale-110 transition-transform shadow-sm">
                    <PlayCircle size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-[#f0f9ff] mb-1">{reciter.name}</h3>
                    {reciter.moshaf && reciter.moshaf[0] && (
                      <p className="text-xs text-[#059669]">
                        {reciter.moshaf[0].name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

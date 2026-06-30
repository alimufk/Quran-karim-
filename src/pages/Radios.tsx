import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Search, Radio as RadioIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAudioUrl } from '../utils/audioUrl';

export function Radios() {
  const [radios, setRadios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [currentRadioId, setCurrentRadioId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const response = await axios.get('https://mp3quran.net/api/v3/radios?language=ar');
        setRadios(response.data.radios);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching radios", error);
        setLoading(false);
      }
    };
    fetchRadios();
  }, []);

  const handlePlayToggle = (radioId: number, url: string) => {
    if (currentRadioId === radioId) {
      if (isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
             playPromise.catch(e => {
                 console.error("Audio playback error:", e);
                 setIsPlaying(false);
             });
          }
        }
        setIsPlaying(true);
      }
    } else {
      setCurrentRadioId(radioId);
      setIsPlaying(true);
      if (audioRef.current) {
         const proxiedUrl = getAudioUrl(url);
         audioRef.current.src = proxiedUrl;
         audioRef.current.load();
         const playPromise = audioRef.current.play();
         if (playPromise !== undefined) {
             playPromise.catch(e => {
                 if (e.name !== 'AbortError') {
                     console.error("Radio play error", e);
                     setIsPlaying(false);
                 }
             });
         }
      }
    }
  };

  const currentRadio = radios.find(r => r.id === currentRadioId);
  const filteredRadios = radios.filter(r => r.name.includes(search));

  return (
    <div className="flex flex-col h-[100dvh] bg-[#022c22] relative">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <Link to="/" className="p-2 -mr-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">إذاعات القرآن</h1>
          <p className="text-xs text-[#059669]">بث مباشر على مدار الساعة</p>
        </div>
      </header>

      <div className="px-6 py-4 z-10 sticky top-0 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن إذاعة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-32">
        {loading ? (
           <div className="flex justify-center p-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24]"></div>
           </div>
        ) : (
          filteredRadios.map((radio, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 15) * 0.05 }}
              key={radio.id}
            >
              <div
                onClick={() => handlePlayToggle(radio.id, radio.url)}
                className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentRadioId === radio.id ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentRadioId === radio.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>
                    {currentRadioId === radio.id && isPlaying ? (
                      <RadioIcon size={24} className="animate-pulse" />
                    ) : (
                      <Play size={24} />
                    )}
                  </div>
                  <h3 className={`font-bold text-[15px] leading-snug max-w-[200px] ${currentRadioId === radio.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}>
                    {radio.name}
                  </h3>
                </div>
                <div className={currentRadioId === radio.id ? 'text-[#fbbf24]' : 'text-[#059669]'}>
                  {currentRadioId === radio.id && isPlaying ? <Pause fill="currentColor" size={24} /> : <Play size={24} />}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {currentRadioId && currentRadio && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-[#fbbf24] text-lg max-w-[220px] truncate">{currentRadio.name}</h4>
              <p className="text-sm text-[#059669] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                بث مباشر (Live)
              </p>
            </div>
            
            <button 
               onClick={() => handlePlayToggle(currentRadio.id, currentRadio.url)}
               className="p-5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg shadow-[#fbbf24]/20 hover:bg-[#fcd34d] hover:scale-105 active:scale-95 transition-all"
            >
               {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
            </button>
          </div>
        </div>
      )}

      <audio 
         ref={audioRef}

         onEnded={() => setIsPlaying(false)}
         onError={(e) => {
             const currentSrc = audioRef.current?.src;
             if (!currentSrc || currentSrc === window.location.href || currentSrc.includes('/radios')) {
                 return;
             }
             console.error("Radio playback error:", e.currentTarget.error?.message, "src:", currentSrc);
             
             // Fallback: If proxy failed, try playing direct URL
             if (currentSrc.includes('/api/proxy')) {
                 try {
                     const urlParams = new URLSearchParams(currentSrc.split('?')[1]);
                     const originalUrl = urlParams.get('url');
                     if (originalUrl && audioRef.current) {
                         console.log("Falling back to direct URL:", originalUrl);
                         audioRef.current.src = originalUrl;
                         audioRef.current.load();
                         const playPromise = audioRef.current.play();
                         if (playPromise !== undefined) {
                             playPromise.catch(() => setIsPlaying(false));
                         }
                         return; // Wait for fallback to succeed or fail
                     }
                 } catch (fallbackErr) {
                     console.error("Fallback failed", fallbackErr);
                 }
             }
             
             setIsPlaying(false);
         }}
      />
    </div>
  );
}

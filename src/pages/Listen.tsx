import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Play, Pause, SkipForward, SkipBack, Search, Volume2, Repeat, Repeat1, Download } from 'lucide-react';
import axios from 'axios';
import { getAudioUrl } from '../utils/audioUrl';

export function Listen() {
  const { reciterId } = useParams<{ reciterId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const reciterName = location.state?.reciterName || 'القارئ';
  const initialServer = location.state?.server || '';
  const initialSurahList = location.state?.surah_list || '';
  const initialMoshafName = location.state?.moshafName || '';

  const [server, setServer] = useState(initialServer);
  const [surahList, setSurahList] = useState(initialSurahList);
  const [moshafName, setMoshafName] = useState(initialMoshafName);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    // If server or surahList is not in state (e.g., refresh/deep link), fetch reciter info from API
    if (!server || !surahList) {
      const getReciterDetail = async () => {
        try {
          const res = await axios.get(`https://mp3quran.net/api/v3/reciters?language=ar&reciter=${reciterId}`);
          if (res.data.reciters && res.data.reciters.length > 0) {
            const r = res.data.reciters[0];
            const moshaf = r.moshaf?.[0];
            if (moshaf) {
              setServer(moshaf.server || '');
              setSurahList(moshaf.surah_list || '');
              setMoshafName(moshaf.name || '');
            }
          }
        } catch (err) {
          console.error("Error fetching reciter detail", err);
        }
      };
      getReciterDetail();
    }
  }, [reciterId, server, surahList]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handlePlayToggle = async (surahNumber: number) => {
    setPlaybackError(null); // Clear previous errors
    if (currentSurah === surahNumber) {
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
              setPlaybackError("عذراً، حدث خطأ أثناء تشغيل الملف الصوتي.");
              setIsPlaying(false);
            });
          }
          audioRef.current.playbackRate = playbackRate;
        }
        setIsPlaying(true);
      }
    } else {
      setCurrentSurah(surahNumber);
      setIsPlaying(true);
      try {
        let audioUrl = '';
        if (server) {
           const cleanServer = server.endsWith('/') ? server : `${server}/`;
           audioUrl = `${cleanServer}${surahNumber.toString().padStart(3, '0')}.mp3`;
        } else {
           const response = await axios.get(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}`);
           audioUrl = response.data.audio_file.audio_url;
           if (audioUrl && audioUrl.startsWith('//')) {
               audioUrl = `https:${audioUrl}`;
           }
        }
        if (audioRef.current) {
          const proxiedAudioUrl = getAudioUrl(audioUrl);
          audioRef.current.src = proxiedAudioUrl;
          audioRef.current.load();
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
             playPromise.then(() => {
                 if (audioRef.current) audioRef.current.playbackRate = playbackRate;
             }).catch(e => {
                 if (e.name !== 'AbortError') {
                     console.error("Audio playback error during play", e);
                     setPlaybackError("عذراً، فشل تحميل الصوت. قد يكون الملف غير متوفر أو تعذر الاتصال بالخادم.");
                     setIsPlaying(false);
                 }
             });
          }
        }
      } catch (error) {
        console.error("Error fetching audio url", error);
        setPlaybackError("عذراً، تعذر العثور على الملف الصوتي الخاص بهذه السورة.");
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnded = () => {
     if (repeatMode === 'one' && currentSurah) {
         if (audioRef.current) {
             audioRef.current.currentTime = 0;
             audioRef.current.play();
             setIsPlaying(true);
         }
     } else if (repeatMode === 'all' && currentSurah && currentSurah < 114) {
         setIsPlaying(false);
         // Find next available surah from the current list
         const availableIds = surahList 
           ? surahList.split(',').map((id: string) => parseInt(id.trim(), 10))
           : Array.from({ length: 114 }, (_, i) => i + 1);
         const nextIds = availableIds.filter(id => id > currentSurah);
         if (nextIds.length > 0) {
           handlePlayToggle(nextIds[0]);
         } else {
           setIsPlaying(false);
         }
     } else {
         setIsPlaying(false);
     }
  };

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[\u0617-\u061A\u064B-\u0652\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      .replace(/[أإآاٱ]/g, 'ا')
      .replace(/[يى]/g, 'ي')
      .replace(/ة/g, 'ه');
  };

  const searchNormalized = normalizeArabic(search);
  const filteredSurahs = surahs.filter(s => {
    const matchesSearch = normalizeArabic(s.name).includes(searchNormalized) || 
                          s.englishName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (surahList) {
      const availableIds = surahList.split(',').map((id: string) => parseInt(id.trim(), 10));
      return availableIds.includes(s.number);
    }
    return true;
  });

  return (
    <div className="h-[100dvh] flex flex-col bg-[#022c22] relative">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -mr-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">{reciterName}</h1>
          <p className="text-xs text-[#059669]">{moshafName || 'استماع القرآن الكريم'}</p>
        </div>
      </header>

      <div className="px-6 py-4 z-10 sticky top-0 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10">
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

      {playbackError && (
        <div className="mx-6 mb-2 mt-1 p-3.5 bg-red-950/70 border border-red-500/30 text-red-200 text-sm rounded-2xl flex items-center justify-between shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{playbackError}</span>
          </div>
          <button onClick={() => setPlaybackError(null)} className="text-red-400 font-bold px-2 hover:text-red-200 transition-colors">
            حذف
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-40">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24]"></div>
          </div>
        ) : (
          filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => handlePlayToggle(surah.number)}
              className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentSurah === surah.number ? 'bg-[#059669]/30 border-[#fbbf24]/50' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 hover:border-[#059669]/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl font-bold text-sm ${currentSurah === surah.number ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>
                  {currentSurah === surah.number && isPlaying ? (
                    <Volume2 size={24} className="animate-pulse" />
                  ) : (
                    surah.number
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-lg leading-none mb-1 ${currentSurah === surah.number ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}>{surah.name}</h3>
                  <p className="text-xs text-[#059669]">
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                  </p>
                </div>
              </div>
              <div className={currentSurah === surah.number ? 'text-[#fbbf24]' : 'text-[#059669]'}>
                {currentSurah === surah.number && isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </div>
            </div>
          ))
        )}
      </div>

      {currentSurah && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-[#fbbf24] text-lg">سورة {surahs.find(s => s.number === currentSurah)?.name || ''}</h4>
                <p className="text-sm text-[#059669] shrink-0 max-w-[180px] truncate">{reciterName}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                   onClick={() => {
                     const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
                     const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
                     setPlaybackRate(rates[nextIdx]);
                   }}
                   className="px-3 py-1.5 bg-[#059669]/20 text-[#fbbf24] rounded-lg text-sm font-bold min-w-[3.5rem] text-center transition-colors hover:bg-[#059669]/40"
                   dir="ltr"
                >
                   {playbackRate}x
                </button>
                <button
                   onClick={() => {
                     const modes = ['none', 'all', 'one'] as const;
                     const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
                     setRepeatMode(modes[nextIdx]);
                   }}
                   className={`p-2 rounded-lg transition-colors hover:bg-[#059669]/30 ${repeatMode !== 'none' ? 'text-[#fbbf24] bg-[#059669]/20' : 'text-[#059669]'}`}
                >
                   {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} className={repeatMode === 'none' ? 'opacity-50' : ''} />}
                </button>
                <button
                   onClick={() => {
                     if (audioRef.current?.src) {
                       const a = document.createElement('a');
                       a.href = audioRef.current.src;
                       a.download = `Surah_${currentSurah}_${reciterName}.mp3`;
                       a.target = '_blank';
                       document.body.appendChild(a);
                       a.click();
                       document.body.removeChild(a);
                     }
                   }}
                   className="p-2 text-[#059669] hover:text-[#fbbf24] rounded-lg transition-colors hover:bg-[#059669]/30"
                >
                   <Download size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 pb-2" dir="ltr">
                <button 
                   onClick={() => currentSurah > 1 && handlePlayToggle(currentSurah - 1)}
                   className="p-3 text-[#059669] hover:text-[#fbbf24] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                   disabled={currentSurah <= 1}
                >
                   <SkipBack size={28} />
                </button>
                <button 
                   onClick={() => handlePlayToggle(currentSurah)}
                   className="p-5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg shadow-[#fbbf24]/20 hover:bg-[#fcd34d] hover:scale-105 active:scale-95 transition-all"
                >
                   {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
                </button>
                <button 
                   onClick={() => currentSurah < 114 && handlePlayToggle(currentSurah + 1)}
                   className="p-3 text-[#059669] hover:text-[#fbbf24] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                   disabled={currentSurah >= 114}
                >
                   <SkipForward size={28} />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      <audio 
         ref={audioRef}
         onEnded={handleAudioEnded}
         onError={async (e) => {
             const currentSrc = audioRef.current?.src;
             if (!currentSrc || currentSrc === window.location.href || currentSrc.includes('/listen/')) {
                 return;
             }
             console.error("Audio playback error:", e.currentTarget.error?.message, "src:", currentSrc);
             
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
             setPlaybackError("عذراً، فشل تحميل الصوت. قد يكون الملف غير متوفر أو تعذر الاتصال بالخادم.");
         }}
      />
    </div>
  );
}

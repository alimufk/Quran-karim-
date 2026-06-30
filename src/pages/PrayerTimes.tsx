import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, BellOff, Loader2, MapPin, Clock, Volume2, Mic, Play, Square, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

export function PrayerTimes() {
  const navigate = useNavigate();
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('جاري التحديد...');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeStr: string; diffStr: string } | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const {
    adhanEnabled,
    setAdhanEnabled,
    earlyReminderMinutes,
    setEarlyReminderMinutes,
    earlyReminderVoiceEnabled,
    setEarlyReminderVoiceEnabled,
    adhanVoice,
    setAdhanVoice,
    audioRef
  } = usePrayerTimes();

  const prayerNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  const currentPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlayingPreview(true);
    const onPause = () => setIsPlayingPreview(false);
    const onEnded = () => setIsPlayingPreview(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    // Sync current playing state
    setIsPlayingPreview(!audio.paused);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioRef, adhanVoice]); // Trigger on voice change too so the listener stays robust

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
            const data = await res.json();
            setTimings(data.data.timings);
            setLocationName('موقعي الحالي');
            setLoading(false);
          } catch (e) {
             console.error("Aladhan API fetch error:", e);
             setLoading(false);
          }
        },
        async (error) => {
          console.warn("Geolocation denied, using default (Makkah)", error);
          try {
             // Fallback to Makkah
             const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=SA&method=4`);
             const data = await res.json();
             setTimings(data.data.timings);
             setLocationName('مكة المكرمة');
             setLoading(false);
          } catch (e) {
             console.error("Aladhan API fetch error fallback:", e);
             setLoading(false);
          }
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!timings) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      let upcomingPrayer: any = null;
      let minDiff = Infinity;
      
      currentPrayers.forEach(p => {
         const timeStr = timings[p];
         if (!timeStr) return;
         const [hStr, mStr] = timeStr.split(':');
         
         const pt = new Date(now.getTime());
         pt.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
         
         let diff = pt.getTime() - now.getTime();
         if (diff < 0) {
           pt.setDate(pt.getDate() + 1);
           diff = pt.getTime() - now.getTime();
         }
         
         if (diff < minDiff) {
           minDiff = diff;
           upcomingPrayer = { name: prayerNames[p], timeStr: timeStr };
         }
      });

      if (upcomingPrayer) {
        const d = Math.floor(minDiff / 1000);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        const s = Math.floor(d % 60);
        setNextPrayer({
          name: upcomingPrayer.name,
          timeStr: upcomingPrayer.timeStr,
          diffStr: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  return (
    <div className="flex flex-col h-full bg-[#022c22]">
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -mr-2 text-[#fbbf24]">
            <ArrowRight size={24} />
          </button>
          <div>
            <h1 className="font-bold text-xl text-[#f0f9ff] tracking-tight">أوقات الصلاة</h1>
          </div>
        </div>
        <button
          onClick={() => setAdhanEnabled(!adhanEnabled)}
          className={`p-2 rounded-xl transition-all ${adhanEnabled ? 'bg-[#fbbf24]/20 text-[#fbbf24]' : 'bg-[#059669]/20 text-[#059669]'}`}
          title={adhanEnabled ? 'إيقاف صوت الأذان' : 'تفعيل صوت الأذان'}
        >
          {adhanEnabled ? <Bell size={24} /> : <BellOff size={24} />}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-center gap-2 text-[#059669] mb-4">
           <MapPin size={20} />
           <span className="font-bold">{locationName}</span>
        </div>

        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#064e3b] to-[#022c22] p-6 rounded-3xl border border-[#059669]/30 text-center shadow-xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fbbf24]/5 rounded-full blur-3xl"></div>
            <p className="text-[#059669] font-medium mb-1">الصلاة القادمة</p>
            <h2 className="text-3xl font-bold text-[#fbbf24] mb-3">{nextPrayer.name}</h2>
            <div className="text-4xl font-mono text-[#f0f9ff] tracking-widest font-bold">
              {nextPrayer.diffStr}
            </div>
          </motion.div>
        )}

        {/* Early Reminder Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#064e3b]/30 border border-[#059669]/30 rounded-3xl p-5 space-y-4 shadow-md"
        >
          <div className="flex items-center gap-2.5 text-[#fbbf24]">
            <Clock size={22} className="shrink-0" />
            <h3 className="font-bold text-lg text-[#f0f9ff]">منبه اقتراب وقت الصلاة</h3>
          </div>
          <p className="text-sm text-[#a7f3d0] leading-relaxed">
            سيقوم التطبيق بتنبيهك بصوت رنين هادئ بالإضافة إلى قراءة صوتية باللغة العربية مع اقتراب موعد الأذان لكي تستعد للوضوء والصلاة في وقتها المبارك.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#a7f3d0] font-medium">وقت التنبيه المبكر</label>
              <select
                value={earlyReminderMinutes}
                onChange={(e) => setEarlyReminderMinutes(Number(e.target.value))}
                className="bg-[#042f2e]/80 border border-[#059669]/40 text-[#fbbf24] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fbbf24]/50 w-full cursor-pointer font-bold"
              >
                <option value={0}>إيقاف التنبيه</option>
                <option value={5}>قبل الصلاة بـ 5 دقائق</option>
                <option value={10}>قبل الصلاة بـ 10 دقائق</option>
                <option value={15}>قبل الصلاة بـ 15 دقيقة</option>
                <option value={30}>قبل الصلاة بـ 30 دقيقة</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-end">
              <button
                onClick={() => {
                  try {
                    const chimeUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
                    const chimeAudio = new Audio(chimeUrl);
                    chimeAudio.volume = 0.6;
                    chimeAudio.play().catch(e => console.log("Blocked:", e));
                  } catch (e) {
                     console.log(e);
                  }

                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance();
                    utterance.text = "تجربة التنبيه المبكر: اقترب موعد صلاة الظهر، يرجى الاستعداد.";
                    utterance.lang = 'ar-SA';
                    utterance.rate = 0.9;
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                disabled={earlyReminderMinutes === 0}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold rounded-xl transition-all ${
                  earlyReminderMinutes === 0 
                  ? 'bg-gray-600/10 text-gray-400 cursor-not-allowed border border-transparent' 
                  : 'bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/30 active:scale-95'
                }`}
              >
                <Volume2 size={16} />
                <span>تجربة التنبيه</span>
              </button>
            </div>
          </div>

          {earlyReminderMinutes > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-[#059669]/15">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-[#fbbf24]" />
                <span className="text-sm text-[#f0f9ff]">القارئ الصوتي الآلي (نطق بالعربية)</span>
              </div>
              <button
                onClick={() => setEarlyReminderVoiceEnabled(!earlyReminderVoiceEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  earlyReminderVoiceEnabled ? 'bg-[#fbbf24]' : 'bg-[#042f2e]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#064e3b] shadow ring-0 transition duration-200 ease-in-out ${
                    earlyReminderVoiceEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </motion.div>

        {/* Adhan Voice Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#064e3b]/30 border border-[#059669]/30 rounded-3xl p-5 space-y-4 shadow-md"
        >
          <div className="flex items-center gap-2.5 text-[#fbbf24]">
            <Settings size={22} className="shrink-0" />
            <h3 className="font-bold text-lg text-[#f0f9ff]">إعدادات صوت الأذان</h3>
          </div>
          <p className="text-sm text-[#a7f3d0] leading-relaxed">
            اختر صوت الأذان المفضل لديك ليتم تشغيله تلقائياً عند دخول وقت كل صلاة مباركة.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-1 font-sans">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#a7f3d0] font-medium">مؤذن الصلاة</label>
              <select
                value={adhanVoice}
                onChange={(e) => setAdhanVoice(e.target.value)}
                className="bg-[#042f2e]/80 border border-[#059669]/40 text-[#fbbf24] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#fbbf24]/50 w-full cursor-pointer font-bold"
              >
                <option value="makkah">أذان الحرم المكي (علي ملا)</option>
                <option value="universal">الأذان الافتراضي (صوت هادئ)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-end">
              <button
                onClick={() => {
                  if (!audioRef.current) return;
                  if (isPlayingPreview) {
                    audioRef.current.pause();
                  } else {
                    audioRef.current.play().catch(e => console.error("Adhan preview failed", e));
                  }
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  isPlayingPreview 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                  : 'bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/30 active:scale-95'
                }`}
              >
                {isPlayingPreview ? <Square size={14} /> : <Play size={14} />}
                <span>{isPlayingPreview ? 'إيقاف الأذان' : 'تجربة الأذان'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-[#fbbf24]" size={36} />
          </div>
        ) : timings ? (
          <div className="grid gap-4">
            {currentPrayers.map((prayer, index) => {
               const time = timings[prayer];
               return (
                  <motion.div
                    key={prayer}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-5 rounded-[24px] border border-[#059669]/20 bg-[#064e3b]/40 shadow-sm"
                  >
                    <h3 className="font-bold text-xl text-[#f0f9ff]">{prayerNames[prayer]}</h3>
                    <span className="text-2xl font-mono text-[#fbbf24]">{time}</span>
                  </motion.div>
               );
            })}
          </div>
        ) : (
          <div className="text-center text-red-400 p-8 font-bold">
            حدث خطأ أثناء جلب أوقات الصلاة. تأكد من اتصالك بالإنترنت.
          </div>
        )}
      </div>
    </div>
  );
}

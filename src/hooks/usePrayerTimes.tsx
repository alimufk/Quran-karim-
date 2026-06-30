import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { getAudioUrl } from '../utils/audioUrl';

const prayerNamesAr: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

const voicesConfig: Record<string, { url: string }> = {
  makkah: {
    url: "https://www.islamcan.com/audio/adhan/azan1.mp3"
  },
  universal: {
    url: "https://www.islamcan.com/audio/adhan/azan3.mp3"
  }
};

interface PrayerTimesContextType {
  timings: Record<string, string> | null;
  adhanEnabled: boolean;
  setAdhanEnabled: (enabled: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  earlyReminderMinutes: number;
  setEarlyReminderMinutes: (mins: number) => void;
  earlyReminderVoiceEnabled: boolean;
  setEarlyReminderVoiceEnabled: (enabled: boolean) => void;
  adhanVoice: string;
  setAdhanVoice: (voice: string) => void;
  resolvedUrl: string | null;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [adhanEnabled, setAdhanEnabled] = useState(
    localStorage.getItem('adhanEnabled') !== 'false'
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  const [adhanVoice, setAdhanVoiceState] = useState<string>(() => {
    return localStorage.getItem('adhanVoice') || 'makkah';
  });

  const setAdhanVoice = (voice: string) => {
    localStorage.setItem('adhanVoice', voice);
    setAdhanVoiceState(voice);
    window.dispatchEvent(new Event('adhanVoiceChanged'));
  };

  useEffect(() => {
    const handleVoiceChange = () => {
      setAdhanVoiceState(localStorage.getItem('adhanVoice') || 'makkah');
    };
    window.addEventListener('adhanVoiceChanged', handleVoiceChange);
    return () => window.removeEventListener('adhanVoiceChanged', handleVoiceChange);
  }, []);

  useEffect(() => {
    const config = voicesConfig[adhanVoice] || voicesConfig.makkah;
    setResolvedUrl(getAudioUrl(config.url));
  }, [adhanVoice]);

  useEffect(() => {
    if (audioRef.current && resolvedUrl) {
      try {
        audioRef.current.load();
      } catch (err) {
        console.warn("Could not reload audio element:", err);
      }
    }
  }, [resolvedUrl]);

  useEffect(() => {
    localStorage.setItem('adhanEnabled', String(adhanEnabled));
    window.dispatchEvent(new Event('adhanStateChanged'));
    
    if (adhanEnabled && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [adhanEnabled]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAdhanEnabled(localStorage.getItem('adhanEnabled') !== 'false');
    };
    window.addEventListener('adhanStateChanged', handleStorageChange);
    return () => window.removeEventListener('adhanStateChanged', handleStorageChange);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
            const data = await res.json();
            setTimings(data.data.timings);
          } catch (e) {
             console.error("Aladhan API fetch error:", e);
          }
        },
        async (error) => {
          console.warn("Geolocation denied, using default (Makkah)", error);
          try {
             // Fallback to Makkah
             const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=SA&method=4`);
             const data = await res.json();
             setTimings(data.data.timings);
          } catch (e) {
             console.error("Aladhan API fetch error fallback:", e);
          }
        }
      );
    }
  }, []);

  const lastFiredTime = useRef<string | null>(null);
  const lastFiredEarly = useRef<string | null>(null);

  const [earlyReminderMinutes, setEarlyReminderMinutesState] = useState<number>(() => {
    const val = localStorage.getItem('earlyReminderMinutes');
    return val !== null ? parseInt(val, 10) : 10;
  });

  const [earlyReminderVoiceEnabled, setEarlyReminderVoiceEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('earlyReminderVoiceEnabled') !== 'false';
  });

  const setEarlyReminderMinutes = (val: number) => {
    localStorage.setItem('earlyReminderMinutes', String(val));
    setEarlyReminderMinutesState(val);
    window.dispatchEvent(new Event('earlyReminderStateChanged'));
  };

  const setEarlyReminderVoiceEnabled = (val: boolean) => {
    localStorage.setItem('earlyReminderVoiceEnabled', String(val));
    setEarlyReminderVoiceEnabledState(val);
    window.dispatchEvent(new Event('earlyReminderStateChanged'));
  };

  useEffect(() => {
    const handleEarlyChange = () => {
      const val = localStorage.getItem('earlyReminderMinutes');
      setEarlyReminderMinutesState(val !== null ? parseInt(val, 10) : 10);
      setEarlyReminderVoiceEnabledState(localStorage.getItem('earlyReminderVoiceEnabled') !== 'false');
    };
    window.addEventListener('earlyReminderStateChanged', handleEarlyChange);
    return () => window.removeEventListener('earlyReminderStateChanged', handleEarlyChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timings) return;
      
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      
      // 1. Regular Adhan Playback at Prayer Time
      if (adhanEnabled) {
        const playPrayer = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].find(
          prayer => timings[prayer] === currentTimeStr
        );

        // Avoid playing multiple times within the same minute by tracking the last fired time
        if (playPrayer && lastFiredTime.current !== currentTimeStr) {
          lastFiredTime.current = currentTimeStr;
          
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Adhan playback requires user interaction", e));
          }
          
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("حان الآن موعد الصلاة", {
              body: `حان الآن موعد أذان صلاة ${prayerNamesAr[playPrayer]}`,
              icon: "/favicon.ico"
            });
          }
        }
      }

      // 2. Early Approaching Prayer Notification & Vocal Reminder
      if (earlyReminderMinutes > 0) {
        const approachingPrayer = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].find(
          prayer => {
            const timeStr = timings[prayer];
            if (!timeStr) return false;
            
            const [hStr, mStr] = timeStr.split(':');
            let h = parseInt(hStr, 10);
            let m = parseInt(mStr, 10);
            
            m -= earlyReminderMinutes;
            if (m < 0) {
              h -= Math.ceil(Math.abs(m) / 60);
              m = (m % 60 + 60) % 60;
            }
            if (h < 0) {
              h = (h % 24 + 24) % 24;
            }
            const alarmTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            return alarmTimeStr === currentTimeStr;
          }
        );

        if (approachingPrayer && lastFiredEarly.current !== currentTimeStr) {
          lastFiredEarly.current = currentTimeStr;

          // Sound tone
          try {
            const chimeUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
            const chimeAudio = new Audio(chimeUrl);
            chimeAudio.volume = 0.6;
            chimeAudio.play().catch(e => console.log("Alert chime play blocked or failed", e));
          } catch (e) {
            console.error("Failed to construct audio alert", e);
          }

          // Vocal speech notification
          if (earlyReminderVoiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = `اقترب موعد صلاة ${prayerNamesAr[approachingPrayer]}، يرجى الاستعداد.`;
            utterance.lang = 'ar-SA';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
          }

          // Browser notifications
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("اقترب موعد الصلاة", {
              body: `بقي قرابة ${earlyReminderMinutes} دقائق على موعد أذان صلاة ${prayerNamesAr[approachingPrayer]}`,
              icon: "/favicon.ico"
            });
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings, adhanEnabled, earlyReminderMinutes, earlyReminderVoiceEnabled]);

  return (
    <PrayerTimesContext.Provider value={{
      timings, 
      adhanEnabled, 
      setAdhanEnabled, 
      audioRef, 
      earlyReminderMinutes, 
      setEarlyReminderMinutes, 
      earlyReminderVoiceEnabled, 
      setEarlyReminderVoiceEnabled,
      adhanVoice,
      setAdhanVoice,
      resolvedUrl
    }}>
      {children}
    </PrayerTimesContext.Provider>
  );
}

export function usePrayerTimes() {
  const context = useContext(PrayerTimesContext);
  if (context === undefined) {
    throw new Error('usePrayerTimes must be used within a PrayerTimesProvider');
  }
  return context;
}

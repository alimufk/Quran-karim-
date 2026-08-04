import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const prayerNamesAr: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

const voicesConfig: Record<string, { url: string }> = {
  makkah: {
    url: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/adhan1.mp3"
  },
  universal: {
    url: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/adhan2.mp3"
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
  const [adhanEnabled, setAdhanEnabled] = useState<boolean>(() => {
    return localStorage.getItem('adhanEnabled') !== 'false';
  });
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
    setResolvedUrl(config.url);
  }, [adhanVoice]);

  useEffect(() => {
    localStorage.setItem('adhanEnabled', String(adhanEnabled));
    window.dispatchEvent(new Event('adhanStateChanged'));
  }, [adhanEnabled]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAdhanEnabled(localStorage.getItem('adhanEnabled') !== 'false');
    };
    window.addEventListener('adhanStateChanged', handleStorageChange);
    return () => window.removeEventListener('adhanStateChanged', handleStorageChange);
  }, []);

  // طلب صلاحيات الإشعارات
  useEffect(() => {
    LocalNotifications.requestPermissions().catch(() => {});
  }, []);

  // جلب أوقات الصلاة
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
        async () => {
          try {
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

  // 🧪 جدولة مخصصة للاختبار المحلي (تنبيه بعد دقيقة واحدة من الآن)
  useEffect(() => {
    if (!adhanEnabled) return;

    const scheduleTestAdhan = async () => {
      try {
        await LocalNotifications.cancel(await LocalNotifications.getPending());

        // تجربة منبه بعد دقيقة واحدة بالضبط من الآن
        const testDate = new Date();
        testDate.setMinutes(testDate.getMinutes() + 1);

        await LocalNotifications.schedule({
          notifications: [
            {
              title: "تجربة الأذان المحلي",
              body: "اختبار تشغيل صوت الأذان المحلي بدون إنترنت",
              id: 999,
              schedule: { 
                at: testDate, 
                allowWhileIdle: true 
              },
              extra: {
                test: true
              }
            }
          ]
        });
      } catch (err) {
        console.error("Local Notifications Schedule Error:", err);
      }
    };

    scheduleTestAdhan();
  }, [adhanEnabled]);

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

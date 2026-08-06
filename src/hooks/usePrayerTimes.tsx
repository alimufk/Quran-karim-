import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const prayerNamesAr: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

// قائمة أصوات الأذان المتاحة داخل مجلد android/app/src/main/res/raw/
export const ADHAN_SOUNDS = [
  { id: 'adhan_eamir', name: 'أذان عامر الكاظمي' },
  { id: 'adhan_makkah', name: 'أذان الحرم المكي' },
  { id: 'adhan_madinah', name: 'أذان الحرم المدني' }
];

// قائمة القراء الافتراضية لحماية التطبيق عند استدعائها
export const DEFAULT_RECITERS = [
  { identifier: 'ar.alafasy', name: 'مشاري العفاسي', englishName: 'Mishary Rashid Alafasy' },
  { identifier: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', englishName: 'AbdulBaset AbdulSamad' },
  { identifier: 'ar.saoodshuraym', name: 'سعود الشريم', englishName: 'Saood ash-Shuraym' },
  { identifier: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', englishName: 'Maher Al Muaiqly' },
  { identifier: 'ar.hudhaify', name: 'علي الحذيفي', englishName: 'Ali Al-Hudhaify' }
];

interface PrayerTimesContextType {
  timings: Record<string, string> | null;
  adhanEnabled: boolean;
  setAdhanEnabled: (enabled: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  testAdhanNow: () => Promise<void>;
  
  // التحكم بصوت الأذان المختار
  selectedAdhanSound: string;
  setSelectedAdhanSound: (soundId: string) => void;

  // التحكم بالقارئ
  reciter: string;
  setReciter: (reciter: string) => void;
  selectedReciter: any;
  setSelectedReciter: (reciter: any) => void;
  changeReciter: (reciterObj: any) => void;
  reciters: any[];
  fetchReciters?: () => void;
  
  // التحكم بمشغل الصوتيات والسور
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentSurah: any;
  setCurrentSurah: (surah: any) => void;
  playAudio: (url?: string) => void;
  pauseAudio: () => void;
  togglePlay: () => void;
  playSurah?: (surah: any, reciterId?: string) => void;
  selectSurah?: (surah: any) => void;
  audioUrl: string;
  setAudioUrl: (url: string) => void;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [adhanEnabled, setAdhanEnabled] = useState<boolean>(() => {
    return localStorage.getItem('adhanEnabled') !== 'false';
  });

  // حالة صوت الأذان المختار
  const [selectedAdhanSound, setSelectedAdhanSoundState] = useState<string>(() => {
    return localStorage.getItem('selectedAdhanSound') || 'adhan_eamir';
  });

  const setSelectedAdhanSound = (soundId: string) => {
    setSelectedAdhanSoundState(soundId);
    localStorage.setItem('selectedAdhanSound', soundId);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // حالة تشغيل السور والقراء والصوتيات
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSurah, setCurrentSurah] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [reciters] = useState<any[]>(DEFAULT_RECITERS);

  const [reciter, setReciterState] = useState<string>(() => {
    return localStorage.getItem('selectedReciter') || 'ar.alafasy';
  });

  const [selectedReciter, setSelectedReciterState] = useState<any>(() => {
    const saved = localStorage.getItem('selectedReciterObj');
    return saved ? JSON.parse(saved) : { identifier: 'ar.alafasy', name: 'مشاري العفاسي' };
  });

  const setReciter = (newReciter: string) => {
    setReciterState(newReciter);
    localStorage.setItem('selectedReciter', newReciter);
  };

  const setSelectedReciter = (newReciterObj: any) => {
    setSelectedReciterState(newReciterObj);
    if (typeof newReciterObj === 'string') {
      setReciterState(newReciterObj);
      localStorage.setItem('selectedReciter', newReciterObj);
    } else if (newReciterObj?.identifier) {
      setReciterState(newReciterObj.identifier);
      localStorage.setItem('selectedReciter', newReciterObj.identifier);
      localStorage.setItem('selectedReciterObj', JSON.stringify(newReciterObj));
    }
  };

  const changeReciter = (reciterObj: any) => {
    setSelectedReciter(reciterObj);
  };

  // دوال تشغيل الصوت والسور مع أمان عالي لمنع Runtime Errors
  const playAudio = (url?: string) => {
    const targetUrl = url || audioUrl;
    if (audioRef.current && targetUrl) {
      if (url) {
        audioRef.current.src = url;
        setAudioUrl(url);
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.error("Audio error:", e));
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) pauseAudio();
    else playAudio();
  };

  const playSurah = (surah: any, customReciterId?: string) => {
    setCurrentSurah(surah);
    const reciterId = customReciterId || reciter;
    const surahNumber = typeof surah === 'number' ? surah : surah?.number || 1;
    const formattedNumber = String(surahNumber).padStart(3, '0');
    const url = `https://download.quranicaudio.com/quran/${reciterId}/${formattedNumber}.mp3`;
    playAudio(url);
  };

  const selectSurah = (surah: any) => {
    setCurrentSurah(surah);
  };

  // 1. إنشاء قناة الإشعارات لصوت الأذان المحدد
  const createAdhanChannel = async (soundId: string) => {
    const channelId = `adhan_channel_${soundId}`;
    try {
      await LocalNotifications.createChannel({
        id: channelId,
        name: `أوقات الصلاة - ${soundId}`,
        description: 'تشغيل صوت الأذان عند حلول موعد الصلاة',
        sound: `${soundId}.mp3`,
        importance: 5,
        visibility: 1,
        vibration: true,
      });
    } catch (e) {
      console.error("خطأ في إنشاء القناة:", e);
    }
    return channelId;
  };

  // 2. جلب أوقات الصلاة
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
             console.error("API error:", e);
          }
        },
        async () => {
          try {
             const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=SA&method=4`);
             const data = await res.json();
             setTimings(data.data.timings);
          } catch (e) {
             console.error("API fallback error:", e);
          }
        }
      );
    }
  }, []);

  // 3. دالة تجربة الأذان بعد 10 ثوانٍ
  const testAdhanNow = async () => {
    try {
      const channelId = await createAdhanChannel(selectedAdhanSound);
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "الله أكبر - حان الآن وقت الصلاة 🕌",
            body: "حي على الصلاة، حي على الفلاح",
            id: 999,
            schedule: { at: new Date(Date.now() + 10000) },
            sound: `${selectedAdhanSound}.mp3`,
            channelId: channelId,
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (e) {
      console.error("خطأ في دالة التجربة:", e);
    }
  };

  // 4. جدولة الصلوات الخمس الحقيقية
  useEffect(() => {
    if (!adhanEnabled || !timings) return;

    const scheduleAllPrayers = async () => {
      try {
        const channelId = await createAdhanChannel(selectedAdhanSound);
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const notificationsList = [];
        let idCounter = 100;

        for (const prayer of prayers) {
          const timeStr = timings[prayer];
          if (!timeStr) continue;

          const [hours, minutes] = timeStr.split(':').map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);

          if (prayerDate.getTime() <= Date.now()) {
            prayerDate.setDate(prayerDate.getDate() + 1);
          }

          notificationsList.push({
            title: `الله أكبر - حان الآن وقت صلاة ${prayerNamesAr[prayer] || prayer}`,
            body: "حي على الصلاة، حي على الفلاح",
            id: idCounter++,
            schedule: { at: prayerDate },
            sound: `${selectedAdhanSound}.mp3`,
            channelId: channelId
          });
        }

        if (notificationsList.length > 0) {
          await LocalNotifications.schedule({ notifications: notificationsList });
        }
      } catch (e) {
        console.error("فشل جدولة الصلوات:", e);
      }
    };

    scheduleAllPrayers();
  }, [timings, adhanEnabled, selectedAdhanSound]);

  return (
    <PrayerTimesContext.Provider value={{
      timings, 
      adhanEnabled, 
      setAdhanEnabled, 
      audioRef,
      testAdhanNow,
      selectedAdhanSound,
      setSelectedAdhanSound,
      reciter,
      setReciter,
      selectedReciter,
      setSelectedReciter,
      changeReciter,
      reciters,
      isPlaying,
      setIsPlaying,
      currentSurah,
      setCurrentSurah,
      playAudio,
      pauseAudio,
      togglePlay,
      playSurah,
      selectSurah,
      audioUrl,
      setAudioUrl
    }}>
      <audio ref={audioRef} style={{ display: 'none' }} />
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

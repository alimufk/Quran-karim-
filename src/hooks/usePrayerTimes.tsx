import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

const prayerNamesAr: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

interface PrayerTimesContextType {
  timings: Record<string, string> | null;
  adhanEnabled: boolean;
  setAdhanEnabled: (enabled: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  testAdhanNow: () => Promise<void>;
  // دوال ومتغيرات اختيار القارئ
  reciter: string;
  setReciter: (reciter: string) => void;
  selectedReciter: any;
  setSelectedReciter: (reciter: any) => void;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [adhanEnabled, setAdhanEnabled] = useState<boolean>(() => {
    return localStorage.getItem('adhanEnabled') !== 'false';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- حالات اختيار القارئ ---
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

  // 1. إنشاء قناة الإشعارات المخصصة لصوت الأذان
  const createAdhanChannel = async () => {
    try {
      await LocalNotifications.createChannel({
        id: 'adhan_channel',
        name: 'أوقات الصلاة والآذان',
        description: 'تشغيل صوت الأذان عند حلول موعد الصلاة',
        sound: 'adhan.mp3',
        importance: 5,
        visibility: 1,
        vibration: true,
      });
    } catch (e) {
      console.error("خطأ في إنشاء قناة الإشعارات:", e);
    }
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

  // 3. دالة تجربة الأذان
  const testAdhanNow = async () => {
    try {
      await createAdhanChannel();
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "الله أكبر - حان الآن وقت الصلاة 🕌",
            body: "حي على الصلاة، حي على الفلاح",
            id: 999,
            schedule: { at: new Date(Date.now() + 10000) },
            sound: 'adhan.mp3',
            channelId: 'adhan_channel',
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (e) {
      console.error("خطأ في دالة التجربة:", e);
    }
  };

  // 4. التجربة التلقائية عند الفتح
  useEffect(() => {
    const runAutoTest = async () => {
      try {
        await createAdhanChannel();
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== 'granted') return;

        await LocalNotifications.schedule({
          notifications: [
            {
              title: "الله أكبر - حان الآن وقت الصلاة 🕌",
              body: "حي على الصلاة، حي على الفلاح",
              id: 999,
              schedule: { at: new Date(Date.now() + 10000) },
              sound: 'adhan.mp3',
              channelId: 'adhan_channel',
              actionTypeId: "",
              extra: null
            }
          ]
        });
      } catch (e) {
        console.error("خطأ التنبيه التلقائي:", e);
      }
    };

    runAutoTest();
  }, []);

  // 5. جدولة الصلوات الخمس الحقيقية
  useEffect(() => {
    if (!adhanEnabled || !timings) return;

    const scheduleAllPrayers = async () => {
      try {
        await createAdhanChannel();
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
            sound: 'adhan.mp3',
            channelId: 'adhan_channel'
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
  }, [timings, adhanEnabled]);

  return (
    <PrayerTimesContext.Provider value={{
      timings, 
      adhanEnabled, 
      setAdhanEnabled, 
      audioRef,
      testAdhanNow,
      reciter,
      setReciter,
      selectedReciter,
      setSelectedReciter
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

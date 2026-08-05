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
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [adhanEnabled, setAdhanEnabled] = useState<boolean>(() => {
    return localStorage.getItem('adhanEnabled') !== 'false';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // دالة تجريبية للأذان بعد 10 ثوانٍ فقط
  const testAdhanNow = async () => {
    try {
      // 1. طلب إذن الإشعارات من الهاتف
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') {
        alert("يرجى إعطاء إذن الإشعارات للتطبيق ليتمكن من التنبيه!");
        return;
      }

      // 2. جدولة إشعار الأذان بعد 10 ثوانٍ
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "الله أكبر - حان الآن وقت الصلاة 🕌",
            body: "حي على الصلاة، حي على الفلاح",
            id: 999,
            schedule: { at: new Date(Date.now() + 10000) }, // بعد 10 ثوانٍ
            sound: 'adhan.mp3', // الملف في android/app/src/main/res/raw/adhan.mp3
            actionTypeId: "",
            extra: null
          }
        ]
      });

      alert("🟢 تمت جدولة الأذان التجريبي! اقفل الشاشة وانتظر 10 ثوانٍ.");
    } catch (err: any) {
      alert("خطأ في الجدولة: " + (err?.message || JSON.stringify(err)));
    }
  };

  // جدولة الصلوات الخمس الحقيقية
  useEffect(() => {
    if (!adhanEnabled || !timings) return;

    const scheduleAllPrayers = async () => {
      try {
        await LocalNotifications.requestPermissions();
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
            sound: 'adhan.mp3'
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
      testAdhanNow
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

import { useState, useEffect, useCallback } from 'react';
import { registerPlugin } from '@capacitor/core';

interface AdhanSchedulerPluginType {
  scheduleAdhan(options: { timeInMillis: number; requestCode: number }): Promise<void>;
}

const AdhanScheduler = registerPlugin<AdhanSchedulerPluginType>('AdhanScheduler');

export interface NotificationSettings {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningTime: string;
  eveningTime: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  morningEnabled: true,
  eveningEnabled: true,
  morningTime: "08:00",
  eveningTime: "18:00",
};

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const morningTime = localStorage.getItem('local_morning_time') || DEFAULT_SETTINGS.morningTime;
    const eveningTime = localStorage.getItem('local_evening_time') || DEFAULT_SETTINGS.eveningTime;
    const morningEnabled = localStorage.getItem('local_morning_enabled') !== 'false';
    const eveningEnabled = localStorage.getItem('local_evening_enabled') !== 'false';

    return {
      morningEnabled,
      eveningEnabled,
      morningTime,
      eveningTime,
    };
  });

  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('local_morning_time', newSettings.morningTime);
    localStorage.setItem('local_evening_time', newSettings.eveningTime);
    localStorage.setItem('local_morning_enabled', String(newSettings.morningEnabled));
    localStorage.setItem('local_evening_enabled', String(newSettings.eveningEnabled));
  }, []);

  // دالة حساب وقت الجدولة القادم بـ Milliseconds
  const getNextTriggerTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    // إذا مضى التوقيت اليوم، نجدوله للغد
    if (targetDate.getTime() <= Date.now()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    return targetDate.getTime();
  };

  // 🧪 تجربة إشعار فوري للأذكار
  const triggerNotificationNow = useCallback(async (
    title = "تنبيه الأذكار 🔔", 
    body = "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨"
  ) => {
    try {
      if (AdhanScheduler && typeof AdhanScheduler.scheduleAdhan === 'function') {
        // جدولة بعد 2 ثانية فقط للاختبار الفوري عبر النظام
        await AdhanScheduler.scheduleAdhan({
          timeInMillis: Date.now() + 2000,
          requestCode: 9999
        });
        return;
      }
    } catch (e) {
      console.warn("Native Notification test failed:", e);
    }

    // fallback للويب فقط
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: "/favicon.ico" });
    } else {
      alert(`${title}\n${body}`);
    }
  }, []);

  // 🚀 جدولة أذكار الصباح والمساء في النظام المباشر (Native Scheduler)
  useEffect(() => {
    const scheduleAthkar = async () => {
      try {
        if (!AdhanScheduler || typeof AdhanScheduler.scheduleAdhan !== 'function') return;

        // 1. جدولة أذكار الصباح (requestCode = 2001)
        if (settings.morningEnabled && settings.morningTime) {
          const morningTimeMs = getNextTriggerTime(settings.morningTime);
          await AdhanScheduler.scheduleAdhan({
            timeInMillis: morningTimeMs,
            requestCode: 2001
          });
          console.log(`تمت جدولة أذكار الصباح بنجاح: ${new Date(morningTimeMs).toLocaleString()}`);
        }

        // 2. جدولة أذكار المساء (requestCode = 2002)
        if (settings.eveningEnabled && settings.eveningTime) {
          const eveningTimeMs = getNextTriggerTime(settings.eveningTime);
          await AdhanScheduler.scheduleAdhan({
            timeInMillis: eveningTimeMs,
            requestCode: 2002
          });
          console.log(`تمت جدولة أذكار المساء بنجاح: ${new Date(eveningTimeMs).toLocaleString()}`);
        }
      } catch (err) {
        console.error("خطأ في جدولة الأذكار عبر النظام المحمول:", err);
      }
    };

    scheduleAthkar();
  }, [settings]);

  return {
    settings,
    saveSettings,
    triggerNotificationNow,
  };
}

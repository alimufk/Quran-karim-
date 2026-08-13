import { useState, useEffect, useCallback } from 'react';
import { registerPlugin } from '@capacitor/core';

export interface ScheduleOptions {
  timeInMillis: number;
  requestCode: number;
  title?: string;
  body?: string;
  type?: 'adhan' | 'athkar';
  sound?: string;
}

interface AdhanSchedulerPluginType {
  scheduleAdhan(options: ScheduleOptions): Promise<void>;
  cancelAdhan?(options: { requestCode: number }): Promise<void>;
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

// المعرفات المخصصة للأذكار
export class AthkarRequestCodes {
  static MORNING = 2001;
  static EVENING = 2002;
  static TEST = 9999;
}

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
        await AdhanScheduler.scheduleAdhan({
          timeInMillis: Date.now() + 2000,
          requestCode: AthkarRequestCodes.TEST,
          title,
          body,
          type: 'athkar'
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

  // 🚀 جدولة وإلغاء أذكار الصباح والمساء تلقائياً
  useEffect(() => {
    const syncAthkarSchedule = async () => {
      try {
        if (!AdhanScheduler || typeof AdhanScheduler.scheduleAdhan !== 'function') return;

        // 1. أذكار الصباح (requestCode = 2001)
        if (settings.morningEnabled && settings.morningTime) {
          const morningTimeMs = getNextTriggerTime(settings.morningTime);
          await AdhanScheduler.scheduleAdhan({
            timeInMillis: morningTimeMs,
            requestCode: AthkarRequestCodes.MORNING,
            title: "أذكار الصباح ☀️",
            body: "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح",
            type: 'athkar'
          });
          console.log(`تمت جدولة أذكار الصباح: ${new Date(morningTimeMs).toLocaleString()}`);
        } else if (AdhanScheduler.cancelAdhan) {
          await AdhanScheduler.cancelAdhan({ requestCode: AthkarRequestCodes.MORNING });
        }

        // 2. أذكار المساء (requestCode = 2002)
        if (settings.eveningEnabled && settings.eveningTime) {
          const eveningTimeMs = getNextTriggerTime(settings.eveningTime);
          await AdhanScheduler.scheduleAdhan({
            timeInMillis: eveningTimeMs,
            requestCode: AthkarRequestCodes.EVENING,
            title: "أذكار المساء 🌙",
            body: "أمسينا وأمسى الملك لله، حان موعد أذكار المساء",
            type: 'athkar'
          });
          console.log(`تمت جدولة أذكار المساء: ${new Date(eveningTimeMs).toLocaleString()}`);
        } else if (AdhanScheduler.cancelAdhan) {
          await AdhanScheduler.cancelAdhan({ requestCode: AthkarRequestCodes.EVENING });
        }
      } catch (err) {
        console.error("خطأ في جدولة الأذكار عبر النظام المحمول:", err);
      }
    };

    syncAthkarSchedule();
  }, [settings]);

  return {
    settings,
    saveSettings,
    triggerNotificationNow,
  };
}

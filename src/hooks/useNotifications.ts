import { useState, useEffect, useCallback, useRef } from 'react';

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

  const lastFiredMorning = useRef<string | null>(null);
  const lastFiredEvening = useRef<string | null>(null);

  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('local_morning_time', newSettings.morningTime);
    localStorage.setItem('local_evening_time', newSettings.eveningTime);
    localStorage.setItem('local_morning_enabled', String(newSettings.morningEnabled));
    localStorage.setItem('local_evening_enabled', String(newSettings.eveningEnabled));
  }, []);

  const triggerNotificationNow = useCallback(async (
    title = "تنبيه الأذكار 🔔", 
    body = "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨"
  ) => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, {
            body: body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            vibrate: [200, 100, 200],
            tag: 'athkar-notification'
          });
          return;
        }
      } catch (e) {
        console.warn("Service Worker Notification error:", e);
      }
    }

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: "/favicon.ico" });
          return;
        } catch (e) {
          console.error("Direct notification failed:", e);
        }
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body, icon: "/favicon.ico" });
          return;
        }
      }
    }

    alert("لضمان وصول الإشعارات، يرجى تفعيل إذن الإشعارات من إعدادات المتصفح 🔔");
  }, []);

  useEffect(() => {
    const checkNotificationTime = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (
        settings.morningEnabled &&
        settings.morningTime === currentTimeStr &&
        lastFiredMorning.current !== currentTimeStr
      ) {
        lastFiredMorning.current = currentTimeStr;
        triggerNotificationNow(
          "🌅 أذكار الصباح",
          "أصبحنا وأصبح الملك لله، حان وقت أذكار الصباح المباركة."
        );
      }

      if (
        settings.eveningEnabled &&
        settings.eveningTime === currentTimeStr &&
        lastFiredEvening.current !== currentTimeStr
      ) {
        lastFiredEvening.current = currentTimeStr;
        triggerNotificationNow(
          "🌇 أذكار المساء",
          "أمسينَا وأمسَى المُلْكُ لله، حان وقت قراءة أذكار المساء العطرة."
        );
      }
    };

    const interval = setInterval(checkNotificationTime, 10000);
    return () => clearInterval(interval);
  }, [settings, triggerNotificationNow]);

  return {
    settings,
    saveSettings,
    triggerNotificationNow,
  };
}

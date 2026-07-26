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

  // حفظ الإعدادات وتحديث المزامنة
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('local_morning_time', newSettings.morningTime);
    localStorage.setItem('local_evening_time', newSettings.eveningTime);
    localStorage.setItem('local_morning_enabled', String(newSettings.morningEnabled));
    localStorage.setItem('local_evening_enabled', String(newSettings.eveningEnabled));
  }, []);

  // دالة إرسال الإشعار المباشرة والمضمونة
  const triggerNotificationNow = useCallback(async (
    title = "تنبيه الأذكار 🔔", 
    body = "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨"
  ) => {
    if (!('Notification' in window)) {
      alert("المتصفح لا يدعم الإشعارات");
      return;
    }

    // 1. طلب الصلاحية إذا لم تكن مقبولة مسبقاً
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('local_notification_permission', 'granted');
      } else {
        alert("يرجى السماح بالإشعارات من إعدادات المتصفح أولاً 🔔");
        return;
      }
    }

    // 2. المحاولة الأولى: الإرسال عبر الـ Service Worker (يدعم الخلفية والأجهزة المحمولة)
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
        console.warn("Service Worker Notification Failed, falling back:", e);
      }
    }

    // 3. المحاولة الثانية (Fallback): إشعار مباشر فوراً
    try {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico"
      });
    } catch (e) {
      console.error("Failed to trigger direct notification:", e);
    }
  }, []);

  // متابعة الوقت وفحص مواعيد الأذكار كل 10 ثوانٍ
  useEffect(() => {
    const checkNotificationTime = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // أذكار الصباح
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

      // أذكار المساء
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

    const interval = setInterval(checkNotificationTime, 10000); // يفحص كل 10 ثوانٍ
    return () => clearInterval(interval);
  }, [settings, triggerNotificationNow]);

  return {
    settings,
    saveSettings,
    triggerNotificationNow,
  };
}

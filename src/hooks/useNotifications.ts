import { useEffect, useRef } from 'react';

export interface NotificationSettings {
  morningEnabled: boolean;
  morningTime: string; // "HH:MM" format
  eveningEnabled: boolean;
  eveningTime: string; // "HH:MM" format
  sleepEnabled: boolean;
  sleepTime: string; // "HH:MM" format
  lastTriggered: {
    morning?: string; // "YYYY-MM-DD" style
    evening?: string;
    sleep?: string;
  };
}

const DEFAULT_SETTINGS: NotificationSettings = {
  morningEnabled: true,
  morningTime: '07:00',
  eveningEnabled: true,
  eveningTime: '17:00',
  sleepEnabled: true,
  sleepTime: '22:00',
  lastTriggered: {}
};

export function useNotifications() {
  const isChecking = useRef<boolean>(false);

  // Helper to load settings from storage safely
  const getSettings = (): NotificationSettings => {
    try {
      const stored = localStorage.getItem('azkar_notification_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse notification settings', e);
    }
    return DEFAULT_SETTINGS;
  };

  // Helper to save settings to storage safely
  const saveSettings = (settings: NotificationSettings) => {
    try {
      localStorage.setItem('azkar_notification_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save notification settings', e);
    }
  };

  // Immediate single notification trigger
  const triggerNotificationNow = (title: string, body: string, path: string = '/azkar/daily') => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        const n = new Notification(title, {
          body,
          icon: '/assets/icon.png', // Try fallback icon
          badge: '/assets/icon.png',
          dir: 'rtl',
          requireInteraction: true
        });

        n.onclick = () => {
          window.focus();
          window.location.hash = path; // Standard hash routing fallback if routing is hash-based, or navigation trigger
          n.close();
        };
      } catch (err) {
        console.error('Unable to post notification from window environment:', err);
      }
    }
  };

  // Notification background scheduling loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkScheduler = () => {
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
          isChecking.current = false;
          return;
        }

        const settings = getSettings();
        const now = new Date();
        
        // Format local date parts
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinute = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHour}:${currentMinute}`;

        let changed = false;

        // 1. Morning Azkar Reminders
        if (
          settings.morningEnabled &&
          settings.morningTime === currentTimeStr &&
          settings.lastTriggered.morning !== todayStr
        ) {
          triggerNotificationNow(
            '☀️ حان وقت أذكار الصباح المباركة',
            '«أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ».. تفضل بقراءة أذكار الصباح لحفظك ويومك المبارك.',
            '/azkar/daily'
          );
          settings.lastTriggered.morning = todayStr;
          changed = true;
        }

        // 2. Evening Azkar Reminders
        if (
          settings.eveningEnabled &&
          settings.eveningTime === currentTimeStr &&
          settings.lastTriggered.evening !== todayStr
        ) {
          triggerNotificationNow(
            '🌙 حان وقت أذكار المساء المباركة',
            'أقبل المساء، فاجعل لسانك رطباً بذكر الله بقراءة أذكار المساء المأثورة.',
            '/azkar/daily'
          );
          settings.lastTriggered.evening = todayStr;
          changed = true;
        }

        // 3. Sleep Azkar Reminders
        if (
          settings.sleepEnabled &&
          settings.sleepTime === currentTimeStr &&
          settings.lastTriggered.sleep !== todayStr
        ) {
          triggerNotificationNow(
            '🛌 حان وقت أذكار السرير والنوم',
            'قبل النوم، لُذْ بذكر المولى عز وجل واقرأ أذكار النوم المباركة لنوم هادئ وحفظ تام.',
            '/azkar/daily'
          );
          settings.lastTriggered.sleep = todayStr;
          changed = true;
        }

        if (changed) {
          saveSettings(settings);
        }
      } catch (err) {
        console.error('Error running alarm scheduler', err);
      } finally {
        isChecking.current = false;
      }
    };

    // Run first check after 2 seconds
    const startTimeout = setTimeout(checkScheduler, 2000);

    // Then schedule to check once every 30 seconds
    const intervalId = setInterval(checkScheduler, 30000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return {
    getSettings,
    saveSettings,
    triggerNotificationNow
  };
}

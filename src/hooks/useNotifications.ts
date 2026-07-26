const triggerNotificationNow = useCallback(async (
  title = "تنبيه الأذكار 🔔", 
  body = "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨"
) => {
  // 1. المحاولة عبر Service Worker مباشرة (للهواتف المتوافقة)
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

  // 2. المحاولة عبر Notification API العادية
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

  // 3. رسالة لطيفة وتنبيه داخل التطبيق بدلاً من Alert مفاجئ
  alert("لضمان وصول الإشعارات على الجوال، يرجى فتح التطبيق في متصفح Chrome أو Safari وتثبيته على الشاشة الرئيسية 📱");
}, []);

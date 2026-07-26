export const triggerNotificationNow = async () => {
  if (!('Notification' in window)) {
    alert("المتصفح لا يدعم الإشعارات");
    return;
  }

  // 1. طلب الصلاحية إذا لم تكن مفعّلة
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert("يرجى السماح بالإشعارات من إعدادات المتصفح أولاً 🔔");
      return;
    }
  }

  // 2. إرسال الإشعار عبر الـ Service Worker المسجّل
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification("تنبيه الأذكار 🔔", {
          body: "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          vibrate: [200, 100, 200],
          tag: 'test-notification'
        });
        return;
      }
    } catch (e) {
      console.warn("Service worker notification fallback:", e);
    }
  }

  // 3. طريقة بديلة فورية إذا لم يكن الـ SW جاهزاً
  try {
    new Notification("تنبيه الأذكار 🔔", {
      body: "أصبحنا وأصبح الملك لله، حان موعد أذكار الصباح العطرة ✨",
      icon: "/favicon.ico"
    });
  } catch (e) {
    console.error("Failed to show notification:", e);
  }
};

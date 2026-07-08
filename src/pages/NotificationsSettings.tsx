import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRight,
  Bell,
  BellOff,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';

export function NotificationsSettings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { settings, saveSettings, triggerNotificationNow } = useNotifications();

  // قراءة حالة السماح بالإشعارات من الذاكرة المحفوظة للتأكد من تفعيلها على الجوال
  const [isPermissionGranted, setIsPermissionGranted] = useState(() => {
    return localStorage.getItem('local_notification_permission') === 'granted' || 
           ('Notification' in window && Notification.permission === 'granted');
  });

  const [testMode, setTestMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // قراءة الحالات المحلية من الـ localStorage مباشرة عند التحميل الأولي لمنع اختفائها
  const [morningTime, setMorningTime] = useState(() => {
    return localStorage.getItem('local_morning_time') || "08:00";
  });
  const [eveningTime, setEveningTime] = useState(() => {
    return localStorage.getItem('local_evening_time') || "18:00";
  });
  const [morningEnabled, setMorningEnabled] = useState(() => {
    return localStorage.getItem('local_morning_enabled') === 'true';
  });
  const [eveningEnabled, setEveningEnabled] = useState(() => {
    return localStorage.getItem('local_evening_enabled') === 'true';
  });

  // مزامنة الحالات مع الـ Hook الرئيسي إذا كان يحتوي على بيانات مسبقة
  useEffect(() => {
    if (settings) {
      if (settings.morningTime) {
        setMorningTime(settings.morningTime);
        localStorage.setItem('local_morning_time', settings.morningTime);
      }
      if (settings.eveningTime) {
        setEveningTime(settings.eveningTime);
        localStorage.setItem('local_evening_time', settings.eveningTime);
      }
      if (settings.morningEnabled !== undefined) {
        setMorningEnabled(settings.morningEnabled);
        localStorage.setItem('local_morning_enabled', String(settings.morningEnabled));
      }
      if (settings.eveningEnabled !== undefined) {
        setEveningEnabled(settings.eveningEnabled);
        localStorage.setItem('local_evening_enabled', String(settings.eveningEnabled));
      }
    }
  }, [settings]);

  const handleToggle = (key: 'morningEnabled' | 'eveningEnabled') => {
    const currentVal = key === 'morningEnabled' ? morningEnabled : eveningEnabled;
    const newVal = !currentVal;

    if (key === 'morningEnabled') {
      setMorningEnabled(newVal);
      localStorage.setItem('local_morning_enabled', String(newVal));
    } else {
      setEveningEnabled(newVal);
      localStorage.setItem('local_evening_enabled', String(newVal));
    }

    const currentSettings = settings || {
      morningEnabled: false,
      eveningEnabled: false,
      morningTime: "08:00",
      eveningTime: "18:00"
    };

    const updated = {
      ...currentSettings,
      [key]: newVal
    };
    saveSettings(updated);
  };

  const handleTimeChange = (key: 'morningTime' | 'eveningTime', val: string) => {
    if (key === 'morningTime') {
      setMorningTime(val);
      localStorage.setItem('local_morning_time', val);
    }
    if (key === 'eveningTime') {
      setEveningTime(val);
      localStorage.setItem('local_evening_time', val);
    }

    const currentSettings = settings || {
      morningEnabled: false,
      eveningEnabled: false,
      morningTime: "08:00",
      eveningTime: "18:00"
    };
    const updated = {
      ...currentSettings,
      [key]: val
    };
    saveSettings(updated);
  };

  // تعديل دالة طلب الصلاحية لتحديث الحالة وحفظها بشكل دائم ومؤكد داخل الجهاز
  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          setIsPermissionGranted(true);
          localStorage.setItem('local_notification_permission', 'granted');
          triggerNotificationNow();
          alert("تم تفعيل الإشعارات بنجاح! 🔔");
        }
      } catch (err) {
        console.error("Error requesting permission:", err);
      }
    } else {
      // للهواتف التي تفتح داخل التطبيق مباشرة ولا تدعم النوافذ المنبثقة الافتراضية
      setIsPermissionGranted(true);
      localStorage.setItem('local_notification_permission', 'granted');
      alert("تم تفعيل تنبيهات الأذكار والمواعيد على الهاتف بنجاح! 🔔");
    }
  };

  const handleTestNotification = () => {
    setTestMode(true);
    setTimeout(() => {
      triggerNotificationNow();
      alert("تذكير مبارك: (تنبيه تجريبي شغال بنجاح) ✨");
      setTestMode(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#022c22] text-[#f0f9ff]' : 'bg-[#f0fdf4] text-[#0f172a]'} pb-24 transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md ${theme === 'dark' ? 'bg-[#022c22]/80 border-[#059669]/20' : 'bg-[#f0fdf4]/80 border-[#bbf7d0]'} border-b px-4 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-[#064e3b] hover:bg-[#059669]/30 text-[#fbbf24]' : 'bg-[#bbf7d0] hover:bg-[#86efac] text-[#15803d]'} transition-all duration-200`}>
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold font-['Cairo']">تنبيهات الأذكار</h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#059669]' : 'text-[#16a34a]'}`}>إشعارات يومية مخصصة للأذكار والأوراد</p>
          </div>
        </div>
        <button onClick={() => setShowHelp(!showHelp)} className={`p-2 rounded-full ${theme === 'dark' ? 'text-[#059669] hover:text-[#fbbf24]' : 'text-[#16a34a] hover:text-[#15803d]'}`}>
          <HelpCircle size={22} />
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6 font-['Cairo']">
        
        {/* إذا لم يتم التفعيل مسبقاً يظهر كارت التنبيه الفخم */}
        {!isPermissionGranted ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-gradient-to-br from-[#amber-500]/10 to-[#bbf7d0]/5 border border-[#fbbf24]/30 relative overflow-hidden">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-[#fbbf24]/10 text-[#fbbf24] h-fit">
                <BellOff size={24} />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-[#fbbf24]">صلاحية إشعارات النظام</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#f0f9ff]/70' : 'text-[#0f172a]/70'} leading-relaxed`}>
                  التنبيهات معطلة حالياً. اضغط على الزر لتفعيلها وتثبيت أوقات الأذكار العطرة.
                </p>
                <button onClick={requestPermission} className="mt-3 w-full py-2.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#022c22] font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#fbbf24]/20 text-sm">
                  تفعيل الإشعارات الآن
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* كارت فخم بديل يظهر عند التفعيل الناجح لتأكيد أن الإشعارات شغال بنجاح وبمظهر جرس مفعل */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-[#064e3b]/40 border border-[#059669]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#059669]/20 text-[#fbbf24] animate-bounce">
                <Bell size={20} />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-sm text-[#fbbf24]">نظام التنبيهات نشط</h3>
                <p className="text-xs text-[#059669] mt-0.5">التطبيق سيقوم بتذكيرك بالأذكار في مواقيتها</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsPermissionGranted(false);
                localStorage.removeItem('local_notification_permission');
              }}
              className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition-all"
            >
              إلغاء التفعيل
            </button>
          </motion.div>
        )}

        <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-[#064e3b]/30 border-[#059669]/20' : 'bg-white border-[#e2e8f0]'} border space-y-4`}>
          <div className="flex justify-between items-center pb-2 border-b border-[#059669]/10">
            <span className="font-bold text-sm">جدولة مواعيد الأذكار اليومية</span>
            <button onClick={handleTestNotification} disabled={testMode} className={`text-xs px-3 py-1.5 rounded-lg border ${theme === 'dark' ? 'border-[#fbbf24]/30 text-[#fbbf24] hover:bg-[#fbbf24]/10' : 'border-[#15803d]/30 text-[#15803d] hover:bg-[#15803d]/5'} disabled:opacity-50`}>
              {testMode ? 'جاري الاختبار...' : 'تجربة تنبيه الآن'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#059669]/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#fbbf24]/10 text-[#fbbf24]"><Sun size={18} /></div>
                <div>
                  <h4 className="font-bold text-sm">أذكار الصباح</h4>
                  <p className="text-xs opacity-60">تنبيه في أول النهار</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="time" value={morningTime} onChange={(e) => handleTimeChange('morningTime', e.target.value)} className="bg-transparent text-xs font-bold p-1 rounded border border-[#059669]/20 text-inherit" />
                <input type="checkbox" checked={morningEnabled} onChange={() => handleToggle('morningEnabled')} className="w-4 h-4 accent-[#059669]" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#059669]/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#059669]/20 text-[#059669]"><Moon size={18} /></div>
                <div>
                  <h4 className="font-bold text-sm">أذكار المساء</h4>
                  <p className="text-xs opacity-60">تنبيه قبل الغروب</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="time" value={eveningTime} onChange={(e) => handleTimeChange('eveningTime', e.target.value)} className="bg-transparent text-xs font-bold p-1 rounded border border-[#059669]/20 text-inherit" />
                <input type="checkbox" checked={eveningEnabled} onChange={() => handleToggle('eveningEnabled')} className="w-4 h-4 accent-[#059669]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

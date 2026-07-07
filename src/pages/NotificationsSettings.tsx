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
  Trash2,
  Sparkles,
  HelpCircle,
  Volume2,
  Smartphone
} from 'lucide-react';

export function NotificationsSettings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { settings, saveSettings, triggerNotificationNow } = useNotifications();

  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'default'
  );
  const [testMode, setTestMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleToggle = (key: any) => {
    if (!settings) return;
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    saveSettings(updated);
  };

  const handleTimeChange = (key: any, val: string) => {
    if (!settings) return;
    const updated = {
      ...settings,
      [key]: val
    };
    saveSettings(updated);
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          triggerNotificationNow();
          alert("تم تفعيل الإشعارات بنجاح! 🔔");
        }
      } catch (err) {
        console.error("Error requesting permission:", err);
      }
    } else {
      setPermission('granted');
      alert("تم تفعيل تنبيهات الأذكار والمواعيد على الهاتف بنجاح! 🔔");
    }
  };

  const handleTestNotification = () => {
    setTestMode(true);
    setTimeout(() => {
      triggerNotificationNow();
      alert("تذكير مبارك: (تنبيه تجريبي شغال بنجاح) ✨");
      setTestMode(false);
    }, 3000);
  };

  if (!settings) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#022c22] text-[#f0f9ff]' : 'bg-[#f0fdf4] text-[#0f172a]'}`}>
        <p className="font-['Cairo'] text-sm opacity-70">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

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
        {permission !== 'granted' && (
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
                <input type="time" value={settings?.morningTime || "07:00"} onChange={(e) => handleTimeChange('morningTime', e.target.value)} className="bg-transparent text-xs font-bold p-1 rounded border border-[#059669]/20 text-inherit" />
                <input type="checkbox" checked={!!settings?.morningEnabled} onChange={() => handleToggle('morningEnabled')} className="w-4 h-4 accent-[#059669]" />
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
                <input type="time" value={settings?.eveningTime || "17:00"} onChange={(e) => handleTimeChange('eveningTime', e.target.value)} className="bg-transparent text-xs font-bold p-1 rounded border border-[#059669]/20 text-inherit" />
                <input type="checkbox" checked={!!settings?.eveningEnabled} onChange={() => handleToggle('eveningEnabled')} className="w-4 h-4 accent-[#059669]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

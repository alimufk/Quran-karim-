import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications, NotificationSettings } from '../hooks/useNotifications';
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
  VolumeX,
  Smartphone
} from 'lucide-react';

export function NotificationsSettings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { getSettings, saveSettings, triggerNotificationNow } = useNotifications();

  // Load state
  const [settings, setSettings] = useState<NotificationSettings>(() => getSettings());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testMode, setTestMode] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Update permission on load
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleToggle = (key: keyof Pick<NotificationSettings, 'morningEnabled' | 'eveningEnabled' | 'sleepEnabled'>) => {
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleTimeChange = (key: keyof Pick<NotificationSettings, 'morningTime' | 'eveningTime' | 'sleepTime'>, val: string) => {
    const updated = {
      ...settings,
      [key]: val
    };
    setSettings(updated);
    saveSettings(updated);
  };

  // Ask for Web Notification permission
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
    }, 3000);
  };

  // Send test notification in 3 seconds
    setTestMode(true);
    setTimeout(() => {
      triggerNotificationNow(
        '✨ تذكير مبارك (تجربة)',
        '«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ»'
      );
      setTestMode(false);
    }, 1500);
  };

  // Reset Trigger Dates so they can trigger again today if times are changed
  const resetTriggerHistory = () => {
    const updated = {
      ...settings,
      lastTriggered: {}
    };
    setSettings(updated);
    saveSettings(updated);
    alert("تم تصفير سجلات الإطلاق المسبقة اليوم، ستبدأ التنبيهات من جديد فور مطابقة الأوقات.");
  };

  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-6 pb-28 min-h-[100dvh]"
      id="notifications-container"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-2 shrink-0" id="notif-header">
        <button 
          id="notif-back-btn"
          onClick={() => navigate(-1)}
          className={`p-3 rounded-full border transition active:scale-95 duration-200 ${
            isLight 
              ? 'bg-white text-[#059669] border-[#059669]/10 hover:bg-[#059669]/5 shadow-sm'
              : 'bg-[#064e3b] text-[#fbbf24] border-[#059669]/30 hover:bg-[#059669]/40'
          }`}
        >
          <ArrowRight size={20} />
        </button>
        <div className="text-center">
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-[#064e3b]' : 'text-[#fbbf24]'}`} id="notif-title">
            تنبيهات الأذكار
          </h1>
          <p className={`text-sm font-medium ${isLight ? 'text-[#059669]' : 'text-[#34d399]'}`} id="notif-subtitle">
            إشعارات يومية مخصصة للأذكار والأوراد
          </p>
        </div>
        <button
          id="notif-help-btn"
          onClick={() => setShowHelp(!showHelp)}
          className={`p-3 rounded-full border transition ${
            isLight 
              ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm' 
              : 'bg-[#064e3b] text-[#fbbf24] border-[#059669]/30'
          }`}
        >
          <HelpCircle size={20} />
        </button>
      </header>

      {/* Permission Section */}
      <section 
        className={`p-5 rounded-[28px] border shrink-0 transition-all ${
          permission === 'granted'
            ? isLight
              ? 'bg-[#e6f4ea] border-[#10b981]/20 text-emerald-900'
              : 'bg-[#064e3b]/40 border-[#10b981]/30 text-emerald-200'
            : permission === 'denied'
              ? isLight
                ? 'bg-rose-50 border-rose-100 text-rose-900'
                : 'bg-rose-950/20 border-rose-900/30 text-rose-200'
              : isLight
                ? 'bg-amber-50 border-amber-100 text-amber-900'
                : 'bg-amber-950/20 border-amber-900/30 text-amber-200'
        }`}
        id="permission-badge-section"
      >
        <div className="flex gap-4 items-start">
          <div className={`p-3.5 rounded-2xl ${
            permission === 'granted' 
              ? 'bg-emerald-500/20 text-emerald-500' 
              : permission === 'denied'
                ? 'bg-rose-500/20 text-rose-500' 
                : 'bg-amber-500/20 text-amber-500'
          }`} id="permission-icon-container">
            {permission === 'granted' ? <Bell size={28} /> : <BellOff size={28} />}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-bold text-[17px] leading-snug">صلاحية إشعارات النظام</h3>
            <p className="text-xs opacity-85 leading-relaxed">
              {permission === 'granted' 
                ? 'مفعّلة بالكامل! ستصلك التنبيهات اليومية في الأوقات التي تحددها بنجاح.' 
                : permission === 'denied'
                  ? 'حالة الصلاحية: محظورة. يرجى تصفح إعدادات المتصفح وإتاحة إرسال الإشعارات لإيراد التذكير.'
                  : 'التنبيهات معطلة حالياً. اضغط على الزر لتفعيلها وتثبيت أوقات الأذكار العطرة.'}
            </p>
            {permission !== 'granted' && (
              <button
                id="btn-enable-notifications"
                onClick={requestPermission}
                className={`mt-3 py-2 px-5 text-xs font-bold rounded-xl transition active:scale-95 duration-100 ${
                  isLight
                    ? 'bg-[#059669] hover:bg-[#047857] text-white'
                    : 'bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950'
                }`}
              >
                تفعيل الإشعارات الآن
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Help Instructions block if active */}
      {showHelp && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-5 rounded-[24px] border text-xs leading-relaxed space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/30 border-slate-800 text-slate-300'
          }`}
          id="help-instructions-box"
        >
          <h4 className="font-bold text-sm text-[#fbbf24]">ملاحظات حول عمل التنبيهات:</h4>
          <p>• تعتمد هذه الصفحة على تقنية الإشعارات المباشرة بالمتصفح (Push Notifications API).</p>
          <p>• ستعمل التنبيهات بكفاءة طالما أن تطبيق "القرآن الكريم" مفتوح في خلفية متصفح الهاتف أو الكمبيوتر.</p>
          <p>• إذا توقفت الإشعارات فجأة، تأكد من عدم تفعيل وضع "عدم الإزعاج" أو "توفير الطاقة" في جهازك لكي لا يقيد المتصفح.</p>
        </motion.div>
      )}

      {/* Alarm Schedules */}
      <div className="space-y-4" id="alarms-section">
        <h2 className={`font-bold px-2 text-sm uppercase tracking-wider ${isLight ? 'text-emerald-800' : 'text-[#059669]'}`}>جدولة مواعيد الأذكار اليومية</h2>

        {/* 1. Morning Azkar Card */}
        <div 
          id="morning-notif-card"
          className={`p-5 rounded-[28px] border transition-all ${
            isLight 
              ? 'bg-white border-[#059669]/10 shadow-sm' 
              : 'bg-[#064e3b]/30 border-[#059669]/20'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-400/10 text-amber-500 rounded-2xl">
                <Sun size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg ${isLight ? 'text-[#064e3b]' : 'text-[#f0f9ff]'}`}>أذكار الصباح</span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#059669]'}`}>تنبيه في وقت السحر والصباح الباكر</span>
              </div>
            </div>
            {/* Toggle */}
            <button
              id="toggle-morning-btn"
              onClick={() => handleToggle('morningEnabled')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                settings.morningEnabled 
                  ? 'bg-emerald-500 justify-end' 
                  : 'bg-slate-400/40 justify-start'
              }`}
            >
              <span className="bg-white w-6 h-6 rounded-full shadow-md block transition-transform duration-300" />
            </button>
          </div>

          {settings.morningEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-dashed border-[#059669]/10 flex items-center justify-between text-sm"
              id="morning-time-picker-row"
            >
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>تحديد موعد التنبيه:</span>
              <div className="flex items-center gap-2">
                <input 
                  id="morning-time-input"
                  type="time" 
                  value={settings.morningTime}
                  onChange={(e) => handleTimeChange('morningTime', e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-center font-bold text-md tracking-wider ${
                    isLight 
                      ? 'bg-white text-slate-800 border-slate-300 focus:outline-[#059669]' 
                      : 'bg-[#064e3b] text-white border-[#059669]/40 focus:outline-[#fbbf24]'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* 2. Evening Azkar Card */}
        <div 
          id="evening-notif-card"
          className={`p-5 rounded-[28px] border transition-all ${
            isLight 
              ? 'bg-white border-[#059669]/10 shadow-sm' 
              : 'bg-[#064e3b]/30 border-[#059669]/20'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-400/10 text-indigo-400 rounded-2xl">
                <Moon size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg ${isLight ? 'text-[#064e3b]' : 'text-[#f0f9ff]'}`}>أذكار المساء</span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#059669]'}`}>تنبيه في المساء وقبل الغروب</span>
              </div>
            </div>
            {/* Toggle */}
            <button
              id="toggle-evening-btn"
              onClick={() => handleToggle('eveningEnabled')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                settings.eveningEnabled 
                  ? 'bg-emerald-500 justify-end' 
                  : 'bg-slate-400/40 justify-start'
              }`}
            >
              <span className="bg-white w-6 h-6 rounded-full shadow-md block transition-transform duration-300" />
            </button>
          </div>

          {settings.eveningEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-dashed border-[#059669]/10 flex items-center justify-between text-sm"
              id="evening-time-picker-row"
            >
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>تحديد موعد التنبيه:</span>
              <div className="flex items-center gap-2">
                <input 
                  id="evening-time-input"
                  type="time" 
                  value={settings.eveningTime}
                  onChange={(e) => handleTimeChange('eveningTime', e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-center font-bold text-md tracking-wider ${
                    isLight 
                      ? 'bg-white text-slate-800 border-slate-300 focus:outline-[#059669]' 
                      : 'bg-[#064e3b] text-white border-[#059669]/40 focus:outline-[#fbbf24]'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* 3. Sleep Azkar Card */}
        <div 
          id="sleep-notif-card"
          className={`p-5 rounded-[28px] border transition-all ${
            isLight 
              ? 'bg-white border-[#059669]/10 shadow-sm' 
              : 'bg-[#064e3b]/30 border-[#059669]/20'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-400/10 text-violet-400 rounded-2xl">
                <Smartphone size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg ${isLight ? 'text-[#064e3b]' : 'text-[#f0f9ff]'}`}>أذكار النوم</span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#059669]'}`}>تنبيه مبارك مع حلول ساعة النوم والراحة</span>
              </div>
            </div>
            {/* Toggle */}
            <button
              id="toggle-sleep-btn"
              onClick={() => handleToggle('sleepEnabled')}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                settings.sleepEnabled 
                  ? 'bg-emerald-500 justify-end' 
                  : 'bg-slate-400/40 justify-start'
              }`}
            >
              <span className="bg-white w-6 h-6 rounded-full shadow-md block transition-transform duration-300" />
            </button>
          </div>

          {settings.sleepEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-dashed border-[#059669]/10 flex items-center justify-between text-sm"
              id="sleep-time-picker-row"
            >
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>تحديد موعد التنبيه:</span>
              <div className="flex items-center gap-2">
                <input 
                  id="sleep-time-input"
                  type="time" 
                  value={settings.sleepTime}
                  onChange={(e) => handleTimeChange('sleepTime', e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-center font-bold text-md tracking-wider ${
                    isLight 
                      ? 'bg-white text-slate-800 border-slate-300 focus:outline-[#059669]' 
                      : 'bg-[#064e3b] text-white border-[#059669]/40 focus:outline-[#fbbf24]'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action panel & test */}
      <div className="space-y-3 pt-2" id="notif-action-panel">
        <button
          id="btn-test-instant-notif"
          onClick={handleTestNotification}
          disabled={testMode}
          className={`w-full py-4 rounded-[20px] transition-all flex items-center justify-center gap-2 font-bold shadow-md active:scale-[0.98] ${
            permission !== 'granted'
              ? 'opacity-50 cursor-not-allowed bg-slate-500 text-white'
              : isLight
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950'
          }`}
        >
          <Sparkles size={20} />
          <span>{testMode ? 'جاري إطلاق الاختبار...' : 'تجربة إرسال إشعار فوري (بعد ثانيتين)'}</span>
        </button>

        <div className="flex gap-2">
          <button
            id="btn-reset-triggered"
            onClick={resetTriggerHistory}
            className={`flex-1 py-3 rounded-[16px] border transition flex items-center justify-center gap-2 text-xs font-bold ${
              isLight 
                ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 shadow-sm'
                : 'border-rose-900/30 text-rose-400 bg-rose-950/20 hover:bg-rose-950/40'
            }`}
          >
            <Trash2 size={16} />
            <span>تصفير سجلات تكرار التذكير</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

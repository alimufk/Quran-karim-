import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bell, Volume2, MapPin, Search, Check, ChevronLeft, Clock, VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveModal = null | 'notifications' | 'azan_settings' | 'location';

export function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // --- الحالات المحفوظة للإعدادات ---
  const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
  const [searchCity, setSearchCity] = useState('');

  // إعدادات كتم وتفعيل الأذان لكل صلاة
  const [azanSettings, setAzanSettings] = useState(() => {
    const saved = localStorage.getItem('azan_settings');
    return saved ? JSON.parse(saved) : {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    };
  });

  // الإشعارات العامة
  const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
  const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
  const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

  // قاعدة بيانات المحافظات والمدن
  const locationsList = [
    { name: 'بغداد', country: 'العراق' },
    { name: 'كربلاء المقدسة', country: 'العراق' },
    { name: 'النجف الأشرف', country: 'العراق' },
    { name: 'البصرة', country: 'العراق' },
    { name: 'الموصل', country: 'العراق' },
    { name: 'أربيل', country: 'العراق' },
    { name: 'بابل', country: 'العراق' },
    { name: 'الناصرية', country: 'العراق' },
    { name: 'مكة المكرمة', country: 'السعودية' },
    { name: 'المدينة المنورة', country: 'السعودية' },
    { name: 'القدس الشريف', country: 'فلسطين' },
  ];

  // مواقيت الصلاة الحالية لعرضها بشكل احترافي داخل الصفحة (محاكاة تفاعلية ذكية)
  const prayerTimes = [
    { name: 'الفجر', time: '04:12 ص', active: azanSettings.fajr, key: 'fajr' },
    { name: 'الظهر', time: '12:20 م', active: azanSettings.dhuhr, key: 'dhuhr' },
    { name: 'العصر', time: '03:55 م', active: azanSettings.asr, key: 'asr' },
    { name: 'المغرب', time: '07:15 م', active: azanSettings.maghrib, key: 'maghrib' },
    { name: 'العشاء', time: '08:45 م', active: azanSettings.isha, key: 'isha' },
  ];

  useEffect(() => { localStorage.setItem('set_location', location); }, [location]);
  useEffect(() => { localStorage.setItem('azan_settings', JSON.stringify(azanSettings)); }, [azanSettings]);
  useEffect(() => { localStorage.setItem('notif_daily_dua', String(notifDailyDua)); }, [notifDailyDua]);
  useEffect(() => { localStorage.setItem('notif_quran_ayah', String(notifQuranAyah)); }, [notifQuranAyah]);
  useEffect(() => { localStorage.setItem('notif_imsak', String(notifImsak)); }, [notifImsak]);

  const toggleAzan = (key: string) => {
    setAzanSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCities = locationsList.filter(item => 
    item.name.includes(searchCity) || item.country.includes(searchCity)
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
      
      {/* الهيدر الأنيق */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#fbbf24] transition-all"
        >
          <ArrowRight size={22} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight">إعدادات التطبيق</h1>
          <p className="text-xs text-zinc-500 mt-0.5">تحكم في مواقيتك وتنبيهاتك الإيمانية</p>
        </div>
      </header>

      {/* ================= قسم 1: بطاقة مواقيت الصلاة الاحترافية ================= */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-[#16161a] to-[#111113] border border-zinc-800/80 rounded-[28px] p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-[#10b981] rounded-lg"><Clock size={16} /></span>
              <h2 className="text-[14px] font-bold text-zinc-300">مواقيت الصلاة لليوم</h2>
            </div>
            <span className="text-[11px] bg-emerald-500/10 text-[#10b981] px-2.5 py-1 rounded-full font-bold">نشط حالياً</span>
          </div>

          {/* جدول أوقات الصلاة التفاعلي */}
          <div className="grid grid-cols-5 gap-2">
            {prayerTimes.map((prayer) => (
              <div 
                key={prayer.name} 
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-between min-h-[90px]"
              >
                <span className="text-xs text-zinc-400 font-bold">{prayer.name}</span>
                <span className="text-sm font-black text-white my-1.5 font-mono">{prayer.time}</span>
                <button 
                  onClick={() => toggleAzan(prayer.key)}
                  className={`p-1 rounded-full transition-all ${prayer.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-zinc-800 text-zinc-600'}`}
                >
                  {prayer.active ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= قسم 2: خيارات الإعدادات الرئيسية ================= */}
      <main className="space-y-4">
        <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40">
          
          {/* خيار الإشعارات */}
          <button 
            onClick={() => setActiveModal('notifications')} 
            className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Bell size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">تنبيهات الإشعارات</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">الأدعية والآيات اليومية وقت الإمساك</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

          {/* خيار التحكم بصوت الأذان */}
          <button 
            onClick={() => setActiveModal('azan_settings')} 
            className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl"><Volume2 size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">أصوات المؤذن</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">تفعيل وتخصيص صوت الأذان لكل فريضة</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

          {/* خيار الموقع الجغرافي */}
          <button 
            onClick={() => setActiveModal('location')} 
            className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-teal-500/10 text-teal-400 rounded-2xl"><MapPin size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">تحديد موقعك الجغرافي</span>
                <span className="text-xs text-[#10b981] font-bold mt-0.5 block">{location}</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

        </div>
      </main>

      {/* ==================== النوافذ المنبثقة التفاعلية ==================== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-[#0e0e10] border-t border-zinc-800 rounded-t-[32px] max-h-[80vh] flex flex-col pb-12"
            >
              {/* ترويسة النافذة */}
              <div className="sticky top-0 bg-[#0e0e10] z-10 px-6 py-5 border-b border-zinc-800/40 flex justify-between items-center">
                <span className="text-base font-black text-[#fbbf24]">
                  {activeModal === 'notifications' && 'إعدادات الإشعارات'}
                  {activeModal === 'azan_settings' && 'أصوات الأذان والتنبيهات'}
                  {activeModal === 'location' && 'تغيير الموقع الجغرافي'}
                </span>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full transition-all"
                >
                  إغلاق
                </button>
              </div>

              <div className="p-6 overflow-y-auto">

                {/* نافذة: الإشعارات */}
                {activeModal === 'notifications' && (
                  <div className="space-y-4">
                    {[
                      { id: 'dua', label: 'دعاء اليوم والأذكار الصباحية والمسائية', desc: 'إشعار تذكيري لقراءة الأدعية اليومية المباركة.', state: notifDailyDua, setter: setNotifDailyDua },
                      { id: 'ayah', label: 'آية وتدبر يومي', desc: 'إرسال آيات قرآنية مختارة يومياً للتأمل والتدبر.', state: notifQuranAyah, setter: setNotifQuranAyah },
                      { id: 'imsak', label: 'تنبيه وقت الإمساك قبل الفجر', desc: 'تنبيهك قبل أذان الفجر بـ 15 دقيقة للتأهب للإمساك.', state: notifImsak, setter: setNotifImsak }
                    ].map((item) => (
                      <div key={item.id} className="bg-zinc-900/50 p-4.5 rounded-[20px] border border-zinc-800/60 flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-sm font-bold text-zinc-200 block">{item.label}</span>
                          <span className="text-xs text-zinc-500 mt-1 block">{item.desc}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.state} 
                            onChange={(e) => item.setter(e.target.checked)} 
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] peer-checked:after:bg-[#0c0c0e]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* نافذة: أصوات الأذان وتخصيص التنبيهات لكل صلاة */}
                {activeModal === 'azan_settings' && (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-2">قم بتفعيل الأذان لكل صلاة بشكل مستقل لضمان تنبيهك بصوت المؤذن المختار.</p>
                    {prayerTimes.map((p) => (
                      <div key={p.key} className="bg-zinc-900/50 px-5 py-4 rounded-[20px] border border-zinc-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl ${p.active ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-zinc-800 text-zinc-600'}`}>
                            {p.active ? <Volume2 size={18} /> : <VolumeX size={18} />}
                          </span>
                          <div>
                            <span className="text-sm font-bold block">صلاة {p.name}</span>
                            <span className="text-xs text-zinc-500 mt-0.5 block">صوت المؤذن التلقائي</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleAzan(p.key)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${p.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-zinc-800 text-zinc-400'}`}
                        >
                          {p.active ? 'مفعّل' : 'صامت'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* نافذة: تغيير الموقع الجغرافي */}
                {activeModal === 'location' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute right-4 top-3.5 text-zinc-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="ابحث عن محافظتك أو دولتك..." 
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full bg-zinc-900/80 text-zinc-100 placeholder-zinc-500 pr-11 pl-4 py-3.5 rounded-2xl border border-zinc-800 outline-none text-sm text-start"
                      />
                    </div>
                    
                    <div className="bg-zinc-900/40 rounded-[24px] max-h-[30vh] overflow-y-auto border border-zinc-800/60 divide-y divide-zinc-800/50">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((item, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setLocation(`${item.country}، ${item.name}`);
                              setActiveModal(null);
                              setSearchCity('');
                            }}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start transition-all"
                          >
                            <div>
                              <p className="font-bold text-[14px]">{item.name}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{item.country}</p>
                            </div>
                            {location.includes(item.name) && <Check size={18} className="text-[#10b981]" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                          لم نعثر على مدن مطابقة..
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => { setLocation('العراق، بغداد'); setActiveModal(null); setSearchCity(''); }} 
                      className="w-full bg-[#10b981] hover:bg-[#0da06f] text-[#0c0c0e] font-black py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/20"
                    >
                      تحديد تلقائي للموقع (بغداد)
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

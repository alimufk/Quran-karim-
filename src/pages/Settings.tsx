import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, Volume2, MapPin, Search, Check, ChevronLeft, Clock, VolumeX, ShieldCheck, FileText, Share2, Loader2, Footprints, Play, Square, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveModal = null | 'notifications' | 'azan_settings' | 'location';

export function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // --- الحالات المحفوظة للإعدادات ---
  const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
  const [searchCity, setSearchCity] = useState('');
  const [loadingPrayers, setLoadingPrayers] = useState(false);

  // --- إعدادات عداد المشي الحقيقي ---
  const [steps, setSteps] = useState(() => Number(localStorage.getItem('walk_steps') || 0));
  const [isTracking, setIsTracking] = useState(false);

  // مواقيت الصلاة الحقيقية
  const [realTimes, setRealTimes] = useState({
    fajr: '04:12 ص',
    dhuhr: '12:20 م',
    asr: '03:55 م',
    maghrib: '07:15 م',
    isha: '08:45 م'
  });

  // إعدادات كتم وتفعيل الأذان لكل صلاة
  const [azanSettings, setAzanSettings] = useState(() => {
    const saved = localStorage.getItem('azan_settings');
    return saved ? JSON.parse(saved) : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
  });

  // الإشعارات العامة
  const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
  const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
  const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

  const locationsList = [
    { name: 'Baghdad', arName: 'بغداد', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Karbala', arName: 'كربلاء المقدسة', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Najaf', arName: 'النجف الأشرف', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Basra', arName: 'البصرة', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Mosul', arName: 'الموصل', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Erbil', arName: 'أربيل', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Babylon', arName: 'بابل', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Nasiriyah', arName: 'الناصرية', country: 'Iraq', arCountry: 'العراق' },
    { name: 'Mecca', arName: 'مكة المكرمة', country: 'Saudi Arabia', arCountry: 'السعودية' },
    { name: 'Medina', arName: 'المدينة المنورة', country: 'Saudi Arabia', arCountry: 'السعودية' },
    { name: 'Jerusalem', arName: 'القدس الشريف', country: 'Palestine', arCountry: 'فلسطين' },
  ];

  // تأثير تتبع الخطوات الحقيقي عن طريق مستشعر تسارع الهاتف (Motion Sensor)
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;
    const SHAKE_THRESHOLD = 11; // الحساسية لمعرفة الخطوة (يمكن تقليلها لـ 9 إذا كان الحساس ثقيلاً)

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!isTracking) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const curTime = Date.now();
      // فحص الحركات كل 100 مللي ثانية لمنع الحساب العشوائي
      if ((curTime - lastUpdate) > 100) {
        const diffTime = curTime - lastUpdate;
        lastUpdate = curTime;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        // حساب سرعة الضربة أو الاهتزاز الناتجة عن خطوة القدم
        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
          setSteps((prevSteps) => {
            const newSteps = prevSteps + 1;
            localStorage.setItem('walk_steps', String(newSteps));
            return newSteps;
          });
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    if (isTracking) {
      // طلب الإذن للهواتف الحديثة (مثل آيفون iOS) التي تتطلب إذن الوصول للحساسات
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            } else {
              alert('تنبيه: يتطلب عداد المشي إذن الحساسات لكي يعمل بشكل حقيقي.');
              setIsTracking(false);
            }
          })
          .catch(() => setIsTracking(false));
      } else {
        // للهواتف العادية وأنظمة أندرويد تعمل مباشرة
        window.addEventListener('devicemotion', handleMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isTracking]);

  const formatTime12 = (time24: string) => {
    if (!time24) return '--:--';
    const [hrs, mins] = time24.split(':');
    let hours = parseInt(hrs, 10);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${mins} ${ampm}`;
  };

  const fetchPrayerTimes = async (cityName: string, countryName: string) => {
    setLoadingPrayers(true);
    try{
      // نستخدم طريقة الحساب الشيعية (المذهب الجعفري/مؤسسة لوا) رقم 4، أو يمكنك تغيير طريقة الحساب (method)
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=${countryName}&method=4`);
      const data = await res.json();
      if (data && data.data && data.data.timings) {
        const t = data.data.timings;
        setRealTimes({
          fajr: formatTime12(t.Fajr),
          dhuhr: formatTime12(t.Dhuhr),
          asr: formatTime12(t.Asr),
          maghrib: formatTime12(t.Maghrib),
          isha: formatTime12(t.Isha)
        
    } catch (error) {
      console.error("خطأ في جلب مواقيت الصلاة الحقيقية:", error);
    } finally {
      setLoadingPrayers(false);

  useEffect(() => {
    localStorage.setItem('set_location', location);
    const currentLoc = locationsList.find(item => location.includes(item.arName)) || locationsList[0];
    fetchPrayerTimes(currentLoc.name, currentLoc.country);
  }, [location]);

  const prayerTimes = [
    { name: 'الفجر', time: realTimes.fajr, active: azanSettings.fajr, key: 'fajr' },
    { name: 'الظهر', time: realTimes.dhuhr, active: azanSettings.dhuhr, key: 'dhuhr' },
    { name: 'العصر', time: realTimes.asr, active: azanSettings.asr, key: 'asr' },
    { name: 'المغرب', time: realTimes.maghrib, active: azanSettings.maghrib, key: 'maghrib' },
    { name: 'العشاء', time: realTimes.isha, active: azanSettings.isha, key: 'isha' },
  ];

  useEffect(() => localStorage.setItem('azan_settings', JSON.stringify(azanSettings)), [azanSettings]);
  useEffect(() => localStorage.setItem('notif_daily_dua', String(notifDailyDua)), [notifDailyDua]);
  useEffect(() => localStorage.setItem('notif_quran_ayah', String(notifQuranAyah)), [notifQuranAyah]);
  useEffect(() => localStorage.setItem('notif_imsak', String(notifImsak)), [notifImsak]);

  const toggleAzan = (key: string) => {
    setAzanSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShareApp = async () => {
    const shareUrl = 'https://alimufk.github.io/saeesaee1985/';
    const shareTitle = 'تطبيق القرآن الكريم';
    const shareText = 'حمل الآن تطبيق القرآن الكريم الشامل (أوقات الصلاة الحقيقية، الأذكار، ومساعد الذكاء الاصطناعي) بتطوير علاوي النعيمي.';
    try {
      const response = await fetch('https://alimufk.github.io/saeesaee1985/logo.png');
      const blob = await response.blob();
      const file = new File([blob], 'quran_app.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: shareTitle, text: `${shareText}\n\nرابط التطبيق:\n${shareUrl}`, files: [file] });
      } else {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      }
    } catch (error) {
      if (navigator.share) {
        try { await navigator.share({ title: shareTitle, text: shareText, url: shareUrl }); } catch (e) { navigator.clipboard.writeText(shareUrl); }
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('تم نسخ رابط التطبيق بنجاح!');
      }
    }
  };

  const filteredCities = locationsList.filter(item =>
    item.arName.includes(searchCity) || item.arCountry.includes(searchCity)
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
      {/* الهيدر */}
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#fbbf24] transition-all" >
          <ArrowRight size={22} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight">إعدادات التطبيق</h1>
          <p className="text-xs text-zinc-500 mt-0.5">تحكم في مواقيتك وتنبيهاتك الإيمانية</p>
        </div>
      </header>

      {/* ================= مواقيت الصلاة الحقيقية ================= */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-[#16161a] to-[#111113] border border-zinc-800/80 rounded-[28px] p-5 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-[#10b981] rounded-lg"><Clock size={16} /></span>
              <h2 className="text-[14px] font-bold text-zinc-300">مواقيت الصلاة لليوم ({location.split('، ')[1]})</h2>
            </div>
            {loadingPrayers ? (
              <span className="flex items-center gap-1 text-[11px] bg-amber-500/10 text-[#fbbf24] px-2.5 py-1 rounded-full font-bold animate-pulse">
                <Loader2 size={12} className="animate-spin" /> جاري التحديث...
              </span>
            ) : (
              <span className="text-[11px] bg-emerald-500/10 text-[#10b981] px-2.5 py-1 rounded-full font-bold">تحديث حيّ</span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {prayerTimes.map((prayer) => (
              <div key={prayer.name} className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-between min-h-[90px]" >
                <span className="text-xs text-zinc-400 font-bold">{prayer.name}</span>
                <span className="text-xs font-black text-white my-1.5 font-mono">{prayer.time}</span>
                <button onClick={() => toggleAzan(prayer.key)} className={`p-1 rounded-full transition-all ${prayer.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-zinc-800 text-zinc-600'}`} >
                  {prayer.active ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 👟 قسم عداد الخطوات والمشي الحقيقي الجديد 👟 ================= */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-[#18181b] to-[#121214] border border-zinc-800/90 rounded-[28px] p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-[#fbbf24] rounded-lg"><Footprints size={18} /></span>
              <h2 className="text-[14px] font-bold text-zinc-300">عداد الخطوات والمشي الحقيقي</h2>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-all ${isTracking ? 'bg-emerald-500/10 text-[#10b981] animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
              {isTracking ? 'جاري التتبع حياً' : 'متوقف'}
            </span>
          </div>

          {/* لوحة عرض البيانات التفاعلية */}
          <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-4 mb-4">
            <div className="text-right">
              <span className="text-[32px] font-black text-white font-mono block leading-none">{steps}</span>
              <span className="text-[11px] text-zinc-500 font-bold mt-1 block">خطوة مـمشية</span>
            </div>
            
            <div className="flex gap-4 border-r border-zinc-800/80 pr-4 text-center">
              <div>
                <span className="text-sm font-black text-zinc-300 font-mono block">{(steps * 0.00075).toFixed(2)}</span>
                <span className="text-[10px] text-zinc-500 font-bold">كم</span>
              </div>
              <div>
                <span className="text-sm font-black text-zinc-300 font-mono block">{(steps * 0.04).toFixed(0)}</span>
                <span className="text-[10px] text-zinc-500 font-bold">سعرة</span>
              </div>
            </div>
          </div>

          {/* أزرار التحكم بالعداد */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsTracking(!isTracking)} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${isTracking ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#10b981] hover:bg-[#0da06f] text-[#0c0c0e]'}`}
            >
              {isTracking ? <Square size={14} /> : <Play size={14} />}
              {isTracking ? 'إيقاف مؤقت' : 'ابدأ حساب المشي'}
            </button>
            <button 
              onClick={() => { if(confirm('هل تود تصفير العداد؟')) { setSteps(0); localStorage.setItem('walk_steps', '0'); } }} 
              className="px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl border border-zinc-800/80 flex items-center justify-center transition-all"
              title="إعادة ضبط"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= خيارات الإعدادات الرئيسية ================= */}
      <main className="space-y-4">
        <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40">
          <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all" >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Bell size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">تنبيهات الإشعارات</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">الأدعية والآيات اليومية وقت الإمساك</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

          <button onClick={() => setActiveModal('azan_settings')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all" >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl"><Volume2 size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">أصوات المؤذن</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">تفعيل وتخصيص صوت الأذان لكل فريضة</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

          <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all" >
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

        {/* روابط السياسات والمشاركة */}
        <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40 mt-4">
          <button onClick={handleShareApp} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all" >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl"><Share2 size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">مشاركة التطبيق</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">انشر التطبيق لتنال الأجر والثواب الإلهي</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </button>

          <a href="https://alimufk.github.io/saeesaee1985/privacy.html" target="_blank" rel="noopener noreferrer" className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all block" >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-zinc-800 text-[#fbbf24] rounded-2xl"><ShieldCheck size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">سياسة الخصوصية</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">كيفية الحفاظ على سلامة بياناتك وتفضيلاتك</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </a>

          <a href="https://alimufk.github.io/saeesaee1985/terms.html" target="_blank" rel="noopener noreferrer" className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all block" >
            <div className="flex items-center gap-4">
              <span className="p-2.5 bg-zinc-800 text-zinc-300 rounded-2xl"><FileText size={20} /></span>
              <div>
                <span className="font-bold text-[15px] block">Terms of Use</span>
                <span className="text-xs text-zinc-500 mt-0.5 block">شروط وأحكام استخدام وتصفح التطبيق</span>
              </div>
            </div>
            <ChevronLeft size={16} className="text-zinc-600" />
          </a>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[11px] text-zinc-600 font-medium">تطبيق القرآن الكريم v1.0.0</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">تطوير المبرمج <span className="text-[#fbbf24] font-bold">علاوي النعيمي</span></p>
        </div>
      </main>

      {/* ==================== النوافذ المنبثقة ==================== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end" >
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#0e0e10] border-t border-zinc-800 rounded-t-[32px] max-h-[80vh] flex flex-col pb-12" >
              <div className="sticky top-0 bg-[#0e0e10] z-10 px-6 py-5 border-b border-zinc-800/40 flex justify-between items-center">
                <span className="text-base font-black text-[#fbbf24]">
                  {activeModal === 'notifications' && 'إعدادات الإشعارات'}
                  {activeModal === 'azan_settings' && 'أصوات الأذان والتنبيهات'}
                  {activeModal === 'location' && 'تغيير الموقع الجغرافي'}
                </span>
                <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full transition-all" >
                  إغلاق
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
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
                          <input type="checkbox" checked={item.state} onChange={(e) => item.setter(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] peer-checked:after:bg-[#0c0c0e]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

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
                        <button onClick={() => toggleAzan(p.key)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${p.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-zinc-800 text-zinc-400'}`} >
                          {p.active ? 'مفعّل' : 'صامت'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'location' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute right-4 top-3.5 text-zinc-500" size={18} />
                      <input type="text" placeholder="ابحث عن محافظتك أو دولتك..." value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="w-full bg-zinc-900/80 text-zinc-100 placeholder-zinc-500 pr-11 pl-4 py-3.5 rounded-2xl border border-zinc-800 outline-none text-sm text-start" />
                    </div>
                    <div className="bg-zinc-900/40 rounded-[24px] max-h-[30vh] overflow-y-auto border border-zinc-800/60 divide-y divide-zinc-800/50">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((item, idx) => (
                          <button key={idx} onClick={() => { setLocation(`${item.arCountry}، ${item.arName}`); setActiveModal(null); setSearchCity(''); }} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start transition-all" >
                            <div>
                              <p className="font-bold text-[14px]">{item.arName}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{item.arCountry}</p>
                            </div>
                            {location.includes(item.arName) && <Check size={18} className="text-[#10b981]" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">لم نعثر على مدن مطابقة..</div>
                      )}
                    </div>
                    <button onClick={() => { setLocation('العراق، بغداد'); setActiveModal(null); setSearchCity(''); }} className="w-full bg-[#10b981] hover:bg-[#0da06f] text-[#0c0c0e] font-black py-4 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/20" >
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

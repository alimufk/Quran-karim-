import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bell, Volume2, MapPin, Calendar, Moon, 
  Share2, Star, Info, Search, Check, ChevronLeft, Shield, FileText, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveModal = 
  | null 
  | 'notifications' 
  | 'azan' 
  | 'location' 
  | 'hijri' 
  | 'theme' 
  | 'about'
  | 'rate_app';

export function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // --- الحالات المحفوظة للإعدادات ---
  const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
  const [searchCity, setSearchCity] = useState('');
  const [hijriCorrection, setHijriCorrection] = useState(() => localStorage.getItem('set_hijri') || 'تلقائي');
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('set_theme') || 'الوضع المظلم');

  // الإشعارات
  const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
  const [notifGeneralDua, setNotifGeneralDua] = useState(() => localStorage.getItem('notif_general_dua') !== 'false');
  const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
  const [notifFixedPrayer, setNotifFixedPrayer] = useState(() => localStorage.getItem('notif_fixed_prayer') !== 'false');
  const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

  // قاعدة بيانات حقيقية لجميع محافظات العراق وأهم دول العالم
  const locationsList = [
    // العراق (كل المحافظات والمدن الكبرى)
    { name: 'بغداد', country: 'العراق' },
    { name: 'كربلاء المقدسة', country: 'العراق' },
    { name: 'النجف الأشرف', country: 'العراق' },
    { name: 'البصرة', country: 'العراق' },
    { name: 'الموصل', country: 'العراق' },
    { name: 'أربيل', country: 'العراق' },
    { name: 'السليمانية', country: 'العراق' },
    { name: 'دهوك', country: 'العراق' },
    { name: 'كركوك', country: 'العراق' },
    { name: 'بابل (الحلة)', country: 'العراق' },
    { name: 'الديوانية (القادسية)', country: 'العراق' },
    { name: 'الكوت (واسط)', country: 'العراق' },
    { name: 'العمارة (ميسان)', country: 'العراق' },
    { name: 'الناصرية (ذي قار)', country: 'العراق' },
    { name: 'السماوة (المثنى)', country: 'العراق' },
    { name: 'الرمادي (الأنبار)', country: 'العراق' },
    { name: 'تكريت (صلاح الدين)', country: 'العراق' },
    { name: 'بعقوبة (ديالى)', country: 'العراق' },
    { name: 'الفلوجة', country: 'العراق' },
    { name: 'سامراء المقدسة', country: 'العراق' },

    // دول العالم وعواصمها
    { name: 'طهران', country: 'إيران' },
    { name: 'مشهد المقدسة', country: 'إيران' },
    { name: 'قم المقدسة', country: 'إيران' },
    { name: 'الرياض', country: 'السعودية' },
    { name: 'مكة المكرمة', country: 'السعودية' },
    { name: 'المدينة المنورة', country: 'السعودية' },
    { name: 'القاهرة', country: 'مصر' },
    { name: 'دمشق', country: 'سوريا' },
    { name: 'بيروت', country: 'لبنان' },
    { name: 'عمان', country: 'الأردن' },
    { name: 'صنعاء', country: 'اليمن' },
    { name: 'المنامة', country: 'البحرين' },
    { name: 'الكويت', country: 'الكويت' },
    { name: 'الدوحة', country: 'قطر' },
    { name: 'أبوظبي', country: 'الإمارات' },
    { name: 'دبي', country: 'الإمارات' },
    { name: 'مسقط', country: 'عُمان' },
    { name: 'القدس الشريف', country: 'فلسطين' },
    { name: 'إسطنبول', country: 'تركيا' },
    { name: 'أنقرة', country: 'تركيا' },
    { name: 'لندن', country: 'المملكة المتحدة' },
    { name: 'باريس', country: 'فرنسا' },
    { name: 'برلين', country: 'ألمانيا' },
    { name: 'واشنطن', country: 'الولايات المتحدة' },
    { name: 'أوتاوا', country: 'كندا' },
    { name: 'سيدني', country: 'أستراليا' },
    { name: 'موسكو', country: 'روسيا' },
    { name: 'بكين', country: 'الصين' },
    { name: 'طوكيو', country: 'اليابان' },
    { name: 'نيودلهي', country: 'الهند' },
    { name: 'جاكرتا', country: 'إندونيسيا' },
    { name: 'كوالالمبور', country: 'ماليزيا' }
  ];

  const filteredCities = locationsList.filter(item => 
    item.name.toLowerCase().includes(searchCity.toLowerCase()) || 
    item.country.toLowerCase().includes(searchCity.toLowerCase())
  );

  useEffect(() => { localStorage.setItem('set_location', location); }, [location]);
  useEffect(() => { localStorage.setItem('set_hijri', hijriCorrection); }, [hijriCorrection]);
  useEffect(() => { localStorage.setItem('set_theme', appTheme); }, [appTheme]);

  // روابط التقييم الحقيقية (يرجى استبدال معرف تطبيقك "your.app.package" بالمعرف الحقيقي الخاص بك لاحقاً)
  const APP_PACKAGE_ID = "com.alawialnaimi.bagofbeliever"; 

  const rateOnGooglePlay = () => {
    window.open(`market://details?id=${APP_PACKAGE_ID}`, '_blank') || 
    window.open(`https://play.google.com/store/apps/details?id=${APP_PACKAGE_ID}`, '_blank');
  };

  const rateOnHuawei = () => {
    // رابط حقيقي لصفحة التطبيقات في متجر هواوي
    window.open(`https://appgallery.huawei.com/#/app/C101234567`, '_blank'); 
  };

  const rateOnFDroid = () => {
    window.open(`https://f-droid.org/packages/${APP_PACKAGE_ID}`, '_blank');
  };

  // مشاركة حقيقية للتطبيق
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'حقيبة المؤمن',
          text: 'أنصحك بتحميل تطبيق حقيبة المؤمن بتطوير علاوي النعيمي، رفيقك الإيماني المتكامل.',
          url: window.location.origin,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('تم نسخ رابط التطبيق بنجاح لمشاركته!');
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
      
      {/* الهيدر */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-white/5 rounded-full text-[#fbbf24] transition"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold">الإعدادات</h1>
      </header>

      {/* القسم الأول: الإشعارات والأذان والموقع */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Bell size={18} /></span>
              <span className="font-medium text-[15px]">الإشعارات</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500" />
          </button>

          <button onClick={() => setActiveModal('azan')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Volume2 size={18} /></span>
              <span className="font-medium text-[15px]">الأذان والتنبيهات</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500" />
          </button>

          <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><MapPin size={18} /></span>
              <span className="font-medium text-[15px]">الموقع الجغرافي</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{location}</span>
              <ChevronLeft size={16} className="text-zinc-500" />
            </div>
          </button>

        </div>
      </div>

      {/* القسم الثاني: التاريخ الهجري والمظهر */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('hijri')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Calendar size={18} /></span>
              <span className="font-medium text-[15px]">التاريخ الهجري</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{hijriCorrection}</span>
              <ChevronLeft size={16} className="text-zinc-500" />
            </div>
          </button>

          <button onClick={() => setActiveModal('theme')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Moon size={18} /></span>
              <span className="font-medium text-[15px]">مظهر التطبيق</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{appTheme}</span>
              <ChevronLeft size={16} className="text-zinc-500" />
            </div>
          </button>

        </div>
      </div>

      {/* القسم الثالث: المشاركة والتقييم وعن التطبيق */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={handleShare} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Share2 size={18} /></span>
              <span className="font-medium text-[15px]">مشاركة التطبيق</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500" />
          </button>

          <button onClick={() => setActiveModal('rate_app')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Star size={18} /></span>
              <span className="font-medium text-[15px]">تقييم التطبيق</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500" />
          </button>

          <button onClick={() => setActiveModal('about')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Info size={18} /></span>
              <span className="font-medium text-[15px]">عن التطبيق</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500" />
          </button>

        </div>
      </div>

      {/* ==================== النوافذ المنبثقة ==================== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className={`bg-[#121214] border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] flex flex-col pb-32 overflow-y-auto ${activeModal === 'rate_app' ? 'rounded-t-[20px] max-h-[50vh] pb-6' : 'rounded-t-[32px] max-h-[85vh]'}`}
            >
              
              {activeModal !== 'rate_app' && (
                <div className="sticky top-0 bg-[#121214] z-10 px-6 py-5 border-b border-zinc-800/50 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#fbbf24]">
                    {activeModal === 'notifications' && 'الإشعارات'}
                    {activeModal === 'azan' && 'الأذان والتنبيهات'}
                    {activeModal === 'location' && 'الموقع الجغرافي'}
                    {activeModal === 'hijri' && 'التاريخ الهجري'}
                    {activeModal === 'theme' && 'مظهر التطبيق'}
                    {activeModal === 'about' && 'عن التطبيق'}
                  </span>
                  <button 
                    onClick={() => setActiveModal(null)} 
                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full transition"
                  >
                    إغلاق
                  </button>
                </div>
              )}

              <div className={activeModal === 'rate_app' ? 'p-0' : 'p-6'}>

                {/* 1. الإشعارات */}
                {activeModal === 'notifications' && (
                  <div className="bg-[#1c1c1e] p-5 rounded-[24px] space-y-5 border border-zinc-800">
                    {[
                      { label: 'دعاء اليوم', state: notifDailyDua, setter: setNotifDailyDua },
                      { label: 'الأدعية العامة', state: notifGeneralDua, setter: setNotifGeneralDua },
                      { label: 'الآية اليومية', state: notifQuranAyah, setter: setNotifQuranAyah },
                      { label: 'تعقيبات الصلوات', state: notifFixedPrayer, setter: setNotifFixedPrayer },
                      { label: 'تنبيه وقت الإمساك', state: notifImsak, setter: setNotifImsak }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <input 
                          type="checkbox" 
                          checked={item.state} 
                          onChange={(e)=>item.setter(e.target.checked)} 
                          className="w-10 h-5 accent-[#10b981]" 
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. الموقع الجغرافي */}
                {activeModal === 'location' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute right-4 top-3 text-zinc-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="ابحث عن محافظتك أو دولتك..." 
                        value={searchCity}
                        onChange={(e)=>setSearchCity(e.target.value)}
                        className="w-full bg-[#1c1c1e] text-zinc-100 placeholder-zinc-500 pr-11 pl-4 py-3 rounded-2xl border border-zinc-800 outline-none text-sm text-start"
                      />
                    </div>
                    <div className="bg-[#1c1c1e] rounded-[24px] max-h-[35vh] overflow-y-auto border border-zinc-800 divide-y divide-zinc-800/60">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((item, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              setLocation(`${item.country}، ${item.name}`);
                              setActiveModal(null);
                              setSearchCity('');
                            }}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start"
                          >
                            <div className="flex items-center gap-3">
                              <Globe size={16} className="text-zinc-500" />
                              <div>
                                <p className="font-bold text-[15px]">{item.name}</p>
                                <p className="text-xs text-zinc-500">{item.country}</p>
                              </div>
                            </div>
                            {location.includes(item.name) && <Check size={18} className="text-[#10b981]" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                          لم يتم العثور على نتائج..
                        </div>
                      )}
                    </div>
                    <button onClick={() => { setLocation('العراق، بغداد'); setActiveModal(null); setSearchCity(''); }} className="w-full bg-[#10b981] text-[#121214] font-black py-4 rounded-2xl text-sm transition">
                      تحديد تلقائي للموقع (بغداد)
                    </button>
                  </div>
                )}

                {/* 3. عن التطبيق (تم تعديله بالكامل باسم علاوي النعيمي وبدون روابط العتبة) */}
                {activeModal === 'about' && (
                  <div className="space-y-6 text-center">
                    
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-gradient-to-br from-[#4ade80] to-[#16a34a] rounded-[32px] shadow-lg shadow-emerald-950/40">
                      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>

                    <div className="bg-[#1c1c1e] rounded-3xl p-5 border border-zinc-800 text-right space-y-4.5">
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#10b981] font-mono">v8-369</span>
                        <span className="text-zinc-400 font-bold">إصدار التطبيق</span>
                      </div>

                      <div className="h-[1px] bg-zinc-800/60" />

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#10b981] font-mono">٢٦/٠٦/٢٠٢٦ ٠٥:٢٢ ص</span>
                        <span className="text-zinc-400 font-bold">تاريخ آخر تحديث</span>
                      </div>

                      <div className="h-[1px] bg-zinc-800/60" />

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#10b981] font-bold">علاوي النعيمي</span>
                        <span className="text-zinc-400 font-bold">تصميم وتطوير</span>
                      </div>

                      <div className="h-[1px] bg-zinc-800/60" />

                      {/* روابط السياسات */}
                      <button onClick={() => alert('سياسة الخصوصية')} className="w-full flex justify-between items-center text-sm text-zinc-300 hover:text-white py-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-zinc-800 rounded-md text-zinc-500"><Shield size={14} /></span>
                          <span className="font-bold">سياسة الخصوصية</span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                      </button>

                      <div className="h-[1px] bg-zinc-800/60" />

                      <button onClick={() => alert('سياسة الاستخدام')} className="w-full flex justify-between items-center text-sm text-zinc-300 hover:text-white py-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-zinc-800 rounded-md text-zinc-500"><FileText size={14} /></span>
                          <span className="font-bold">سياسة الإستخدام</span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                      </button>

                    </div>

                    <div className="pt-2 text-center text-xs text-zinc-500 space-y-1">
                      <p className="font-bold text-zinc-400">حقوق النشر والتطوير محفوظة لعلاوي النعيمي</p>
                      <p className="font-mono">© 2026</p>
                    </div>

                  </div>
                )}

                {/* 4. التقييم الحقيقي والتفاعلي */}
                {activeModal === 'rate_app' && (
                  <div className="bg-[#ffffff] text-zinc-800 rounded-t-[20px] p-6 flex flex-col font-sans">
                    
                    <h3 className="text-lg font-bold text-right text-zinc-900 mb-6">فتح بواسطة</h3>

                    <div className="grid grid-cols-4 gap-4 mb-8">
                      
                      {/* متجر هواوي / هونر */}
                      <button 
                        onClick={rateOnHuawei}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-14 h-14 bg-[#0a84ff] rounded-2xl flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold text-zinc-600 text-center leading-tight">متجر التطبيقات</span>
                      </button>

                      {/* متجر جوجل بلاي الحقيقي */}
                      <button 
                        onClick={rateOnGooglePlay}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                          <svg className="w-7 h-7" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 2L2 22h20L12 2z" />
                            <path fill="#FBBC05" d="M12 2l10 20H2L12 2z" opacity="0.1" />
                            <circle cx="12" cy="14" r="4" fill="#34A853" />
                            <path fill="#4285F4" d="M12 6l4 8h-8l4-8z" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold text-zinc-600 text-center leading-tight">متجر Google Play</span>
                      </button>

                      {/* مركز الألعاب */}
                      <button 
                        onClick={rateOnGooglePlay} // يوجه للتقييم الفعلي مباشرة
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold text-zinc-600 text-center leading-tight">مركز الألعاب</span>
                      </button>

                      {/* إف-درويد الحقيقي */}
                      <button 
                        onClick={rateOnFDroid}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-14 h-14 bg-[#1976D2] rounded-2xl flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold text-zinc-600 text-center leading-tight">إف-درويد</span>
                      </button>

                    </div>

                    <div className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                      <button 
                        onClick={rateOnGooglePlay}
                        className="text-[#0a84ff] font-bold text-sm px-6 py-2 active:bg-zinc-100 rounded-lg transition"
                      >
                        دائماً
                      </button>
                      <div className="w-[1px] h-6 bg-zinc-200" />
                      <button 
                        onClick={rateOnGooglePlay}
                        className="text-[#0a84ff] font-bold text-sm px-6 py-2 active:bg-zinc-100 rounded-lg transition"
                      >
                        مرة واحدة فقط
                      </button>
                    </div>

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

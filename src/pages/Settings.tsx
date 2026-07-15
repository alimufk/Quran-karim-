import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // تم تصحيح المكتبة هنا بالكامل!
import { 
  ArrowRight, Bell, Volume2, Clock, MapPin, Calendar, Globe, Moon, Sun, 
  User, Share2, Star, Info, Search, Check, ChevronLeft, Plus, Minus,
  Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppLanguage, Language } from '../context/LanguageContext';

type ActiveModal = 
  | null 
  | 'notifications' 
  | 'azan' 
  | 'prayer_times' 
  | 'location' 
  | 'hijri' 
  | 'language' 
  | 'theme' 
  | 'account'
  | 'about';

export function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const { language, setLanguage, t } = useAppLanguage();

  // 1. الموقع
  const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
  const [searchCity, setSearchCity] = useState('');

  // 2. التاريخ الهجري والمظهر
  const [hijriCorrection, setHijriCorrection] = useState(() => localStorage.getItem('set_hijri') || 'تصحيح تلقائي');
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('set_theme') || 'الوضع المظلم');

  // 3. الإشعارات
  const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
  const [notifGeneralDua, setNotifGeneralDua] = useState(() => localStorage.getItem('notif_general_dua') !== 'false');
  const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
  const [notifFixedPrayer, setNotifFixedPrayer] = useState(() => localStorage.getItem('notif_fixed_prayer') !== 'false');
  const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

  // 4. الأذان
  const [azanAlarmType, setAzanAlarmType] = useState(() => localStorage.getItem('azan_alarm_type') || 'إستخدام صوت المنبه');

  // 5. حساب أوقات الصلاة وتعديل الدقائق
  const [dst, setDst] = useState(() => localStorage.getItem('prayer_dst') || 'تلقائي');
  const [prayerCalc, setPrayerCalc] = useState(() => localStorage.getItem('prayer_calc') || 'المذهب الجعفري');
  const [midnightCalc, setMidnightCalc] = useState(() => localStorage.getItem('prayer_midnight') || 'من الغروب إلى الفجر');
  const [showAsrIsha, setShowAsrIsha] = useState(() => localStorage.getItem('show_asr_isha') === 'true');
  const [prayerOffsets, setPrayerOffsets] = useState(() => {
    const saved = localStorage.getItem('prayer_offsets');
    return saved ? JSON.parse(saved) : { sobh: 0, zohr: 0, asr: 0 };
  });

  // الحساب
  const [accountTab, setAccountTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cities = [
    { name: 'كربلاء المقدسة', country: 'العراق' },
    { name: 'النجف الأشرف', country: 'العراق' },
    { name: 'بغداد', country: 'العراق' },
    { name: 'البصرة', country: 'العراق' }
  ];

  const filteredCities = cities.filter(city => 
    city.name.includes(searchCity) || city.country.includes(searchCity)
  );

  // حفظ الإعدادات تلقائياً عند تغييرها
  useEffect(() => { localStorage.setItem('set_location', location); }, [location]);
  useEffect(() => { localStorage.setItem('set_hijri', hijriCorrection); }, [hijriCorrection]);
  useEffect(() => { localStorage.setItem('set_theme', appTheme); }, [appTheme]);
  useEffect(() => {
    localStorage.setItem('notif_daily_dua', String(notifDailyDua));
    localStorage.setItem('notif_general_dua', String(notifGeneralDua));
    localStorage.setItem('notif_quran_ayah', String(notifQuranAyah));
    localStorage.setItem('notif_fixed_prayer', String(notifFixedPrayer));
    localStorage.setItem('notif_imsak', String(notifImsak));
  }, [notifDailyDua, notifGeneralDua, notifQuranAyah, notifFixedPrayer, notifImsak]);
  useEffect(() => { localStorage.setItem('azan_alarm_type', azanAlarmType); }, [azanAlarmType]);
  useEffect(() => { localStorage.setItem('prayer_dst', dst); }, [dst]);
  useEffect(() => { localStorage.setItem('prayer_calc', prayerCalc); }, [prayerCalc]);
  useEffect(() => { localStorage.setItem('prayer_midnight', midnightCalc); }, [midnightCalc]);
  useEffect(() => { localStorage.setItem('show_asr_isha', String(showAsrIsha)); }, [showAsrIsha]);

  const changeOffset = (prayer: 'sobh' | 'zohr' | 'asr', amount: number) => {
    const updated = { ...prayerOffsets, [prayer]: prayerOffsets[prayer] + amount };
    setPrayerOffsets(updated);
    localStorage.setItem('prayer_offsets', JSON.stringify(updated));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'حقيبة المؤمن',
          text: 'تطبيق حقيبة المؤمن والقرآن الكريم الشامل.',
          url: window.location.origin,
        });
      } catch (err) { console.log(err); }
    } else {
      alert('تم نسخ الرابط بنجاح!');
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 p-4 pb-24 font-sans select-none" dir={language === 'en' ? 'ltr' : 'rtl'}>
      
      {/* الهيدر */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-white/5 rounded-full text-[#fbbf24] transition transform rotate-0 ltr:rotate-180"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('settings')}</h1>
      </header>

      {/* القسم الأول: الإشعارات والأذان */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Bell size={18} /></span>
              <span className="font-medium text-[15px]">{t('notifications')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('azan')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Volume2 size={18} /></span>
              <span className="font-medium text-[15px]">{t('azan')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('prayer_times')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Clock size={18} /></span>
              <span className="font-medium text-[15px]">{t('prayerTimes')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><MapPin size={18} /></span>
              <span className="font-medium text-[15px]">{t('location')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{location}</span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

        </div>
      </div>

      {/* القسم الثاني: الإعدادات العامة */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('hijri')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Calendar size={18} /></span>
              <span className="font-medium text-[15px]">{t('hijriCorrection')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{hijriCorrection}</span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

          <button onClick={() => setActiveModal('language')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Globe size={18} /></span>
              <span className="font-medium text-[15px]">{t('appLanguage')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">
                {language === 'ar' && 'العربية'}
                {language === 'en' && 'English'}
                {language === 'fa' && 'فارسی'}
              </span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

          <button onClick={() => setActiveModal('theme')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Moon size={18} /></span>
              <span className="font-medium text-[15px]">{t('appTheme')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{appTheme}</span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

          <button onClick={() => setActiveModal('account')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><User size={18} /></span>
              <span className="font-medium text-[15px]">{t('myAccount')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

        </div>
      </div>

      {/* القسم الثالث: أدعم التطبيق */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={handleShare} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Share2 size={18} /></span>
              <span className="font-medium text-[15px]">{t('shareApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => alert('شكراً لتقييمك!')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Star size={18} /></span>
              <span className="font-medium text-[15px]">{t('rateApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('about')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Info size={18} /></span>
              <span className="font-medium text-[15px]">{t('aboutApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

        </div>
      </div>

      {/* ==================== المودالز المنبثقة التفاعلية ==================== */}
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
              className="bg-[#121214] border-t border-zinc-800 rounded-t-[32px] max-h-[92vh] overflow-y-auto flex flex-col"
            >
              
              <div className="sticky top-0 bg-[#121214] z-10 px-6 py-5 border-b border-zinc-800/50 flex justify-between items-center">
                <span className="text-lg font-bold text-[#fbbf24]">
                  {activeModal === 'notifications' && t('notifications')}
                  {activeModal === 'azan' && t('azan')}
                  {activeModal === 'prayer_times' && t('prayerTimes')}
                  {activeModal === 'location' && t('location')}
                  {activeModal === 'hijri' && t('hijriCorrection')}
                  {activeModal === 'language' && t('appLanguage')}
                  {activeModal === 'theme' && t('appTheme')}
                  {activeModal === 'account' && t('myAccount')}
                  {activeModal === 'about' && t('aboutApp')}
                </span>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-full transition"
                >
                  {t('close')}
                </button>
              </div>

              <div className="p-6">

                {/* 1. الإشعارات */}
                {activeModal === 'notifications' && (
                  <div className="bg-[#1c1c1e] p-5 rounded-[24px] space-y-5 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('dailyDua')}</span>
                      <input type="checkbox" checked={notifDailyDua} onChange={(e)=>setNotifDailyDua(e.target.checked)} className="w-10 h-5 accent-[#10b981]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('generalDua')}</span>
                      <input type="checkbox" checked={notifGeneralDua} onChange={(e)=>setNotifGeneralDua(e.target.checked)} className="w-10 h-5 accent-[#10b981]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('quranAyah')}</span>
                      <input type="checkbox" checked={notifQuranAyah} onChange={(e)=>setNotifQuranAyah(e.target.checked)} className="w-10 h-5 accent-[#10b981]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('fixedPrayer')}</span>
                      <input type="checkbox" checked={notifFixedPrayer} onChange={(e)=>setNotifFixedPrayer(e.target.checked)} className="w-10 h-5 accent-[#10b981]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('imsakTime')}</span>
                      <input type="checkbox" checked={notifImsak} onChange={(e)=>setNotifImsak(e.target.checked)} className="w-10 h-5 accent-[#10b981]" />
                    </div>
                  </div>
                )}

                {/* 2. اختيار لغة التطبيق */}
                {activeModal === 'language' && (
                  <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
                    {[
                      { code: 'ar', label: 'العربية' },
                      { code: 'en', label: 'English' },
                      { code: 'fa', label: 'فارسی' }
                    ].map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setActiveModal(null);
                        }}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right"
                      >
                        <span className="text-sm font-bold">{lang.label}</span>
                        {language === lang.code && <Check size={18} className="text-[#10b981]" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. واجهة الموقع */}
                {activeModal === 'location' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute right-4 top-3 text-zinc-500 ltr:right-auto ltr:left-4" size={18} />
                      <input 
                        type="text" 
                        placeholder={t('searchCity')} 
                        value={searchCity}
                        onChange={(e)=>setSearchCity(e.target.value)}
                        className="w-full bg-[#1c1c1e] text-zinc-100 placeholder-zinc-500 pr-11 pl-4 ltr:pl-11 ltr:pr-4 py-3 rounded-2xl border border-zinc-800 outline-none text-sm"
                      />
                    </div>
                    <div className="bg-[#1c1c1e] rounded-[24px] max-h-[35vh] overflow-y-auto border border-zinc-800 divide-y divide-zinc-800/60">
                      {filteredCities.map((city) => (
                        <button 
                          key={city.name}
                          onClick={() => {
                            setLocation(`${city.country}، ${city.name}`);
                            setActiveModal(null);
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-right"
                        >
                          <div>
                            <p className="font-bold text-[15px]">{city.name}</p>
                            <p className="text-xs text-zinc-500">{city.country}</p>
                          </div>
                          {location.includes(city.name) && <Check size={18} className="text-[#10b981]" />}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => { setLocation('بغداد، العراق'); setActiveModal(null); }} className="w-full bg-[#10b981] text-[#121214] font-black py-4 rounded-2xl text-sm transition">
                      {t('autoLocation')}
                    </button>
                  </div>
                )}

                {/* 4. عن التطبيق */}
                {activeModal === 'about' && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-[#10b981] rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl">
                      ح
                    </div>
                    <h4 className="text-lg font-black text-[#fbbf24]">حقيبة المؤمن</h4>
                    <p className="text-xs text-zinc-400">{t('version')}: 1.0.0</p>
                    <p className="text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
                      تطبيق إسلامي رائع يحتوي على القرآن الكريم، أوقات الصلاة، الأذكار والأدعية الشريفة.
                    </p>
                    <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                      {t('rights')} © 2026
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

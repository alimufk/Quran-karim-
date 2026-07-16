import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bell, Volume2, Clock, MapPin, Calendar, Globe, Moon, 
  User, Share2, Star, Info, Search, Check, ChevronLeft,
  Mail, Lock, Eye, EyeOff, UserPlus, LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppLanguage, Language } from '../context/LanguageContext';

type ActiveModal = 
  | null 
  | 'notifications' 
  | 'azan' 
  | 'location' 
  | 'hijri' 
  | 'language' 
  | 'theme' 
  | 'account'
  | 'about';

export function Settings() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  
  // استخدام الـ Hook مباشرة للترجمة وإدارة اتجاه اللغة عالمياً
  const { language, setLanguage, t } = useAppLanguage();

  const isRtl = language !== 'en';

  // --- الحالات المحفوظة للإعدادات ---
  const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
  const [searchCity, setSearchCity] = useState('');
  const [hijriCorrection, setHijriCorrection] = useState(() => localStorage.getItem('set_hijri') || t('auto'));
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('set_theme') || t('themeDark'));

  // الإشعارات
  const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
  const [notifGeneralDua, setNotifGeneralDua] = useState(() => localStorage.getItem('notif_general_dua') !== 'false');
  const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
  const [notifFixedPrayer, setNotifFixedPrayer] = useState(() => localStorage.getItem('notif_fixed_prayer') !== 'false');
  const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

  // حسابي
  const [accountTab, setAccountTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cities = [
    { name: 'كربلاء المقدسة', country: 'العراق' },
    { name: 'النجف الأشرف', country: 'العراق' },
    { name: 'بغداد', country: 'العراق' },
    { name: 'طهران', country: 'إيران' },
    { name: 'مشهد المقدسة', country: 'إيران' }
  ];

  const filteredCities = cities.filter(city => 
    city.name.includes(searchCity) || city.country.includes(searchCity)
  );

  useEffect(() => { localStorage.setItem('set_location', location); }, [location]);
  useEffect(() => { localStorage.setItem('set_hijri', hijriCorrection); }, [hijriCorrection]);
  useEffect(() => { localStorage.setItem('set_theme', appTheme); }, [appTheme]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'حقيبة المؤمن',
          text: t('aboutText'),
          url: window.location.origin,
        });
      } catch (err) { console.log(err); }
    } else {
      alert(t('copied'));
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 p-4 pb-32 font-sans select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
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

      {/* القسم الأول: الإشعارات والأذان والموقع */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Bell size={18} /></span>
              <span className="font-medium text-[15px]">{t('notifications')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('azan')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Volume2 size={18} /></span>
              <span className="font-medium text-[15px]">{t('azan')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
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

      {/* القسم الثاني: الإعدادات العامة ولغة التطبيق وحسابي */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={() => setActiveModal('hijri')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Calendar size={18} /></span>
              <span className="font-medium text-[15px]">{t('hijriCorrection')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{hijriCorrection}</span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

          <button onClick={() => setActiveModal('language')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
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

          <button onClick={() => setActiveModal('theme')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Moon size={18} /></span>
              <span className="font-medium text-[15px]">{t('appTheme')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#10b981] font-medium">{appTheme}</span>
              <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
            </div>
          </button>

          <button onClick={() => setActiveModal('account')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><User size={18} /></span>
              <span className="font-medium text-[15px]">{t('myAccount')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

        </div>
      </div>

      {/* القسم الثالث: المشاركة والتقييم */}
      <div className="space-y-1 mb-6">
        <div className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-zinc-800 divide-y divide-zinc-800/60">
          
          <button onClick={handleShare} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Share2 size={18} /></span>
              <span className="font-medium text-[15px]">{t('shareApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => alert(t('rateApp'))} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Star size={18} /></span>
              <span className="font-medium text-[15px]">{t('rateApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

          <button onClick={() => setActiveModal('about')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-zinc-800/50 text-zinc-400 rounded-xl"><Info size={18} /></span>
              <span className="font-medium text-[15px]">{t('aboutApp')}</span>
            </div>
            <ChevronLeft size={16} className="text-zinc-500 ltr:rotate-180" />
          </button>

        </div>
      </div>

      {/* ==================== النوافذ التفاعلية المنبثقة ==================== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end"
          >
            {/* حل مشكلة الحجب: إضافة pb-32 ليرتفع المودال فوق شريط الأيقونات بالأسفل تماماً بمسافة كافية ورائعة */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-[#121214] border-t border-zinc-800 rounded-t-[32px] max-h-[82vh] overflow-y-auto flex flex-col pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]"
            >
              
              <div className="sticky top-0 bg-[#121214] z-10 px-6 py-5 border-b border-zinc-800/50 flex justify-between items-center">
                <span className="text-lg font-bold text-[#fbbf24]">
                  {activeModal === 'notifications' && t('notifications')}
                  {activeModal === 'azan' && t('azan')}
                  {activeModal === 'location' && t('location')}
                  {activeModal === 'hijri' && t('hijriCorrection')}
                  {activeModal === 'language' && t('appLanguage')}
                  {activeModal === 'theme' && t('appTheme')}
                  {activeModal === 'account' && t('myAccount')}
                  {activeModal === 'about' && t('aboutApp')}
                </span>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full transition"
                >
                  {t('close')}
                </button>
              </div>

              <div className="p-6">

                {/* 1. الإشعارات */}
                {activeModal === 'notifications' && (
                  <div className="bg-[#1c1c1e] p-5 rounded-[24px] space-y-5 border border-zinc-800">
                    {[
                      { key: 'dailyDua', state: notifDailyDua, setter: setNotifDailyDua },
                      { key: 'generalDua', state: notifGeneralDua, setter: setNotifGeneralDua },
                      { key: 'quranAyah', state: notifQuranAyah, setter: setNotifQuranAyah },
                      { key: 'fixedPrayer', state: notifFixedPrayer, setter: setNotifFixedPrayer },
                      { key: 'imsakTime', state: notifImsak, setter: setNotifImsak }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t(item.key)}</span>
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

                {/* 2. اختيار اللغات */}
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
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start"
                      >
                        <span className="text-sm font-bold">{lang.label}</span>
                        {language === lang.code && <Check size={18} className="text-[#10b981]" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. شاشة "حسابي" الاحترافية والكاملة بالهوك واللغات */}
                {activeModal === 'account' && (
                  <div className="space-y-6">
                    <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                      <button 
                        onClick={() => setAccountTab('login')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${accountTab === 'login' ? 'bg-[#10b981] text-[#121214]' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <LogIn size={16} />
                        {t('login')}
                      </button>
                      <button 
                        onClick={() => setAccountTab('signup')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${accountTab === 'signup' ? 'bg-[#10b981] text-[#121214]' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <UserPlus size={16} />
                        {t('signup')}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* حقل البريد الإلكتروني */}
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-semibold block text-start">{t('email')}</label>
                        <div className="relative">
                          <Mail className="absolute right-4 top-3.5 text-zinc-500 ltr:right-auto ltr:left-4" size={18} />
                          <input 
                            type="email" 
                            placeholder="example@mail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1c1c1e] text-zinc-100 placeholder-zinc-600 pr-12 pl-4 ltr:pl-12 ltr:pr-4 py-3.5 rounded-2xl border border-zinc-800 outline-none text-sm focus:border-[#10b981]/50 transition text-start"
                          />
                        </div>
                      </div>

                      {/* حقل كلمة المرور */}
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-semibold block text-start">{t('password')}</label>
                        <div className="relative">
                          <Lock className="absolute right-4 top-3.5 text-zinc-500 ltr:right-auto ltr:left-4" size={18} />
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1c1c1e] text-zinc-100 placeholder-zinc-600 pr-12 pl-12 py-3.5 rounded-2xl border border-zinc-800 outline-none text-sm focus:border-[#10b981]/50 transition text-start"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-4 top-3.5 text-zinc-500 hover:text-zinc-300 ltr:left-auto ltr:right-4"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* حقل تأكيد كلمة المرور عند التسجيل */}
                      {accountTab === 'signup' && (
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-400 font-semibold block text-start">{t('confirmPassword')}</label>
                          <div className="relative">
                            <Lock className="absolute right-4 top-3.5 text-zinc-500 ltr:right-auto ltr:left-4" size={18} />
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              placeholder="••••••••" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-[#1c1c1e] text-zinc-100 placeholder-zinc-600 pr-12 pl-12 py-3.5 rounded-2xl border border-zinc-800 outline-none text-sm focus:border-[#10b981]/50 transition text-start"
                            />
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => alert(accountTab === 'login' ? t('loginBtn') : t('signupBtn'))}
                        className="w-full bg-[#10b981] hover:bg-[#0ea573] text-[#121214] font-black py-4 rounded-2xl text-sm transition mt-2 shadow-lg shadow-[#10b981]/10"
                      >
                        {accountTab === 'login' ? t('loginBtn') : t('signupBtn')}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. تحديد الموقع */}
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
                    <div className="bg-[#1c1c1e] rounded-[24px] max-h-[25vh] overflow-y-auto border border-zinc-800 divide-y divide-zinc-800/60">
                      {filteredCities.map((city) => (
                        <button 
                          key={city.name}
                          onClick={() => {
                            setLocation(`${city.country}، ${city.name}`);
                            setActiveModal(null);
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 text-start"
                        >
                          <div>
                            <p className="font-bold text-[15px]">{city.name}</p>
                            <p className="text-xs text-zinc-500">{city.country}</p>
                          </div>
                          {location.includes(city.name) && <Check size={18} className="text-[#10b981]" />}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => { setLocation(language === 'fa' ? 'ایران، تهران' : 'العراق، بغداد'); setActiveModal(null); }} className="w-full bg-[#10b981] text-[#121214] font-black py-4 rounded-2xl text-sm transition">
                      {t('autoLocation')}
                    </button>
                  </div>
                )}

                {/* 5. حول التطبيق */}
                {activeModal === 'about' && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-[#10b981] rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl">
                      ح
                    </div>
                    <h4 className="text-lg font-black text-[#fbbf24]">{t('settings')}</h4>
                    <p className="text-xs text-zinc-400">{t('version')}: 1.0.0</p>
                    <p className="text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
                      {t('aboutText')}
                    </p>
                    <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                      {t('rights')}
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

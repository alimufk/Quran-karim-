import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, Volume2, MapPin, Search, Check, ChevronLeft, Clock, VolumeX, ShieldCheck, FileText, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveModal = null | 'notifications' | 'azan_settings' | 'location';

export function Settings() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [showShareMenu, setShowShareMenu] = useState(false); // الحالة الجديدة لقائمة المشاركة

    // --- الحالات المحفوظة ---
    const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
    const [searchCity, setSearchCity] = useState('');

    const [azanSettings, setAzanSettings] = useState(() => {
        const saved = localStorage.getItem('azan_settings');
        return saved ? JSON.parse(saved) : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true, };
    });

    const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
    const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
    const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

    // --- دالة المشاركة الذكية ---
    const handleShareApp = async () => {
        const shareData = {
            title: 'تطبيق القرآن الكريم',
            text: 'أوصيكم بتحميل تطبيق القرآن الكريم الشامل (أوقات الصلاة، الأذكار، دليل الزائرين ومساعد الذكاء الاصطناعي).',
            url: 'https://alimufk.github.io/saeesaee1985/'
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                setShowShareMenu(true);
            }
        } else {
            setShowShareMenu(true);
        }
    };

    // --- بقية البيانات والوظائف ---
    const locationsList = [
        { name: 'بغداد', country: 'العراق' }, { name: 'كربلاء المقدسة', country: 'العراق' },
        { name: 'النجف الأشرف', country: 'العراق' }, { name: 'البصرة', country: 'العراق' },
        { name: 'الموصل', country: 'العراق' }, { name: 'أربيل', country: 'العراق' },
        { name: 'بابل', country: 'العراق' }, { name: 'الناصرية', country: 'العراق' },
        { name: 'مكة المكرمة', country: 'السعودية' }, { name: 'المدينة المنورة', country: 'السعودية' },
        { name: 'القدس الشريف', country: 'فلسطين' },
    ];

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

    const toggleAzan = (key: string) => { setAzanSettings((prev: any) => ({ ...prev, [key]: !prev[key] })); };
    const filteredCities = locationsList.filter(item => item.name.includes(searchCity) || item.country.includes(searchCity));

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
            {/* الهيدر */}
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#fbbf24] transition-all"><ArrowRight size={22} /></button>
                <div>
                    <h1 className="text-xl font-black tracking-tight">إعدادات التطبيق</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">تحكم في مواقيتك وتنبيهاتك الإيمانية</p>
                </div>
            </header>

            {/* الخيارات والقسم الرئيسي */}
            <main className="space-y-4">
                {/* ... (بقية كود الإعدادات كما هو) ... */}
                <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40 mt-4">
                    <button onClick={handleShareApp} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20"><Share2 size={20} /></span>
                            <div>
                                <span className="font-bold text-[15px] block text-emerald-400">شارك التطبيق</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">انشر الأجر والثواب مع أصدقائك</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    {/* ... (بقية الروابط: الخصوصية والشروط) ... */}
                </div>
            </main>

            {/* 🌟 نافذة المشاركة الاحترافية (Modal) 🌟 */}
            {showShareMenu && (
                <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#141416] border border-zinc-800 rounded-[32px] p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 text-center">شارك التطبيق</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a href={`https://wa.me/?text=تطبيق القرآن الكريم الشامل: https://alimufk.github.io/saeesaee1985/`} className="bg-green-600/10 text-green-400 p-4 rounded-2xl text-center font-bold text-sm">واتساب</a>
                            <a href={`https://t.me/share/url?url=https://alimufk.github.io/saeesaee1985/&text=حمل تطبيق القرآن الكريم الشامل`} className="bg-blue-600/10 text-blue-400 p-4 rounded-2xl text-center font-bold text-sm">تليجرام</a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://alimufk.github.io/saeesaee1985/`} className="bg-blue-800/10 text-blue-300 p-4 rounded-2xl text-center font-bold text-sm">فيسبوك</a>
                            <a href={`https://twitter.com/intent/tweet?url=https://alimufk.github.io/saeesaee1985/&text=تطبيق القرآن الكريم الشامل`} className="bg-sky-600/10 text-sky-400 p-4 rounded-2xl text-center font-bold text-sm">تويتر (X)</a>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText('https://alimufk.github.io/saeesaee1985/'); alert('تم نسخ الرابط!'); setShowShareMenu(false); }} className="w-full mt-4 bg-zinc-800 py-3 rounded-2xl text-zinc-300 font-bold text-sm">نسخ الرابط</button>
                        <button onClick={() => setShowShareMenu(false)} className="w-full mt-2 text-zinc-500 text-xs">إلغاء</button>
                    </div>
                </div>
            )}

            {/* (هنا مكان الـ Modals القديمة للأذان والموقع - لا تحذفها) */}
            <AnimatePresence>
                {/* ... (أضف هنا كود الـ Modals الخاص بك الذي كان في الملف سابقاً) ... */}
            </AnimatePresence>
        </div>
    );
}

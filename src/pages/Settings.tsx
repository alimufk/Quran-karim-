import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, Volume2, MapPin, Search, Check, ChevronLeft, Clock, VolumeX, ShieldCheck, FileText, Share2 } from 'lucide-react';
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
        return saved ? JSON.parse(saved) : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true, };
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

    // --- دالة المشاركة الذكية (Native Share API) ---
    const handleShareApp = async () => {
        const shareData = {
            title: 'تطبيق القرآن الكريم',
            text: 'أوصيكم بتحميل تطبيق القرآن الكريم الشامل (أوقات الصلاة، الأذكار، دليل الزائرين ومساعد الذكاء الاصطناعي).',
            url: 'https://alimufk.github.io/saeesaee1985/' 
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('تم إلغاء المشاركة أو حدث خطأ', error);
            }
        } else {
            // حل بديل للنسخ
            navigator.clipboard.writeText(shareData.url);
            alert('تم نسخ رابط التطبيق!');
        }
    };

    const filteredCities = locationsList.filter(item => item.name.includes(searchCity) || item.country.includes(searchCity));

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
            
            {/* الهيدر الأنيق */}
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#fbbf24] transition-all">
                    <ArrowRight size={22} />
                </button>
                <div>
                    <h1 className="text-xl font-black tracking-tight">إعدادات التطبيق</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">تحكم في مواقيتك وتنبيهاتك الإيمانية</p>
                </div>
            </header>

            {/* قسم مواقيت الصلاة */}
            <section className="mb-6">
                <div className="bg-gradient-to-br from-[#16161a] to-[#111113] border border-zinc-800/80 rounded-[28px] p-5 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-500/10 text-[#10b981] rounded-lg"><Clock size={16} /></span>
                            <h2 className="text-[14px] font-bold text-zinc-300">مواقيت الصلاة لليوم</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {prayerTimes.map((prayer) => (
                            <div key={prayer.name} className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-between min-h-[90px]">
                                <span className="text-xs text-zinc-400 font-bold">{prayer.name}</span>
                                <span className="text-sm font-black text-white my-1.5 font-mono">{prayer.time}</span>
                                <button onClick={() => toggleAzan(prayer.key)} className={`p-1 rounded-full transition-all ${prayer.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-zinc-800 text-zinc-600'}`}>
                                    {prayer.active ? <Volume2 size={13} /> : <VolumeX size={13} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* الخيارات الرئيسية */}
            <main className="space-y-4">
                <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40">
                    <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Bell size={20} /></span>
                            <div>
                                <span className="font-bold text-[15px] block">تنبيهات الإشعارات</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">الأدعية والآيات اليومية وقت الإمساك</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    <button onClick={() => setActiveModal('azan_settings')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl"><Volume2 size={20} /></span>
                            <div>
                                <span className="font-bold text-[15px] block">أصوات المؤذن</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">تفعيل وتخصيص صوت الأذان لكل فريضة</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
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

                {/* 🌟 القسم الجديد: المشاركة والقوانين 🌟 */}
                <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40 mt-4">
                    
                    {/* زر المشاركة الجديد والمحسّن */}
                    <button onClick={handleShareApp} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                                <Share2 size={20} />
                            </span>
                            <div>
                                <span className="font-bold text-[15px] block text-emerald-400">شارك التطبيق</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">انشر الأجر والثواب مع أصدقائك</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>

                    <a href="https://alimufk.github.io/saeesaee1985/privacy.html" target="_blank" rel="noopener noreferrer" className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all block">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-zinc-800 text-[#fbbf24] rounded-2xl"><ShieldCheck size={20} /></span>
                            <div>
                                <span className="font-bold text-[15px] block">سياسة الخصوصية</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">الحفاظ على سلامة بياناتك وتفضيلاتك</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </a>

                    <a href="https://alimufk.github.io/saeesaee1985/terms.html" target="_blank" rel="noopener noreferrer" className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all block">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-zinc-800 text-zinc-300 rounded-2xl"><FileText size={20} /></span>
                            <div>
                                <span className="font-bold text-[15px] block">شروط الاستخدام</span>
                                <span className="text-xs text-zinc-500 mt-0.5 block">أحكام تصفح واستخدام التطبيق</span>
                            </div>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </a>
                </div>

                {/* تذييل الصفحة */}
                <div className="pt-4 text-center">
                    <p className="text-[11px] text-zinc-600 font-medium">تطبيق القرآن الكريم v1.0.0</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">تطوير المبرمج <span className="text-[#fbbf24] font-bold">علاوي النعيمي</span></p>
                </div>
            </main>
            
            {/* بقية كود النوافذ المنبثقة (Modals) كما هو في ملفك الأصلي لا تغيير عليه */}
            {/* (ملاحظة: يمكنك لصق كود النوافذ المنبثقة من ملفك الأصلي هنا للانتهاء من التحديث) */}
        </div>
    );
}

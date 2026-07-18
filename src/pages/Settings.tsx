import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bell, Volume2, MapPin, Search, Check, ChevronLeft, Clock, VolumeX, ShieldCheck, FileText, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveModal = null | 'notifications' | 'azan_settings' | 'location';

export function Settings() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // --- الحالات المحفوظة للإعدادات ---
    const [location, setLocation] = useState(() => localStorage.getItem('set_location') || 'العراق، بغداد');
    const [searchCity, setSearchCity] = useState('');

    const [azanSettings, setAzanSettings] = useState(() => {
        const saved = localStorage.getItem('azan_settings');
        return saved ? JSON.parse(saved) : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true, };
    });

    const [notifDailyDua, setNotifDailyDua] = useState(() => localStorage.getItem('notif_daily_dua') !== 'false');
    const [notifQuranAyah, setNotifQuranAyah] = useState(() => localStorage.getItem('notif_quran_ayah') !== 'false');
    const [notifImsak, setNotifImsak] = useState(() => localStorage.getItem('notif_imsak') !== 'false');

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

    const handleShareApp = async () => {
        const shareData = { title: 'تطبيق القرآن الكريم', text: 'تطبيق القرآن الكريم الشامل.', url: 'https://alimufk.github.io/saeesaee1985/' };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) { setShowShareMenu(true); }
        } else { setShowShareMenu(true); }
    };

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 p-4 pb-32 font-sans select-none" dir="rtl">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-[#fbbf24] transition-all"><ArrowRight size={22} /></button>
                <div>
                    <h1 className="text-xl font-black tracking-tight">إعدادات التطبيق</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">تحكم في مواقيتك وتنبيهاتك</p>
                </div>
            </header>

            <section className="mb-6">
                <div className="bg-gradient-to-br from-[#16161a] to-[#111113] border border-zinc-800/80 rounded-[28px] p-5 shadow-xl">
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

            <main className="space-y-4">
                <div className="bg-[#141416] rounded-[24px] overflow-hidden border border-zinc-800/80 divide-y divide-zinc-800/40">
                    <button onClick={() => setActiveModal('notifications')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Bell size={20} /></span>
                            <span className="font-bold text-[15px]">تنبيهات الإشعارات</span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    <button onClick={() => setActiveModal('azan_settings')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl"><Volume2 size={20} /></span>
                            <span className="font-bold text-[15px]">أصوات المؤذن</span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    <button onClick={() => setActiveModal('location')} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-teal-500/10 text-teal-400 rounded-2xl"><MapPin size={20} /></span>
                            <span className="font-bold text-[15px]">الموقع: <span className="text-[#10b981]">{location}</span></span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                    <button onClick={handleShareApp} className="w-full px-5 py-4.5 flex items-center justify-between hover:bg-zinc-800/20 text-start transition-all">
                        <div className="flex items-center gap-4">
                            <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl"><Share2 size={20} /></span>
                            <span className="font-bold text-[15px] text-emerald-400">شارك التطبيق</span>
                        </div>
                        <ChevronLeft size={16} className="text-zinc-600" />
                    </button>
                </div>
            </main>

            {/* نافذة المشاركة اليدوية */}
            {showShareMenu && (
                <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#141416] border border-zinc-800 rounded-[32px] p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-white mb-6 text-center">شارك التطبيق</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a href={`https://wa.me/?text=حمل تطبيق القرآن الكريم: https://alimufk.github.io/saeesaee1985/`} className="bg-green-600/10 text-green-400 p-4 rounded-2xl text-center font-bold text-sm">واتساب</a>
                            <a href={`https://t.me/share/url?url=https://alimufk.github.io/saeesaee1985/&text=حمل تطبيق القرآن الكريم`} className="bg-blue-600/10 text-blue-400 p-4 rounded-2xl text-center font-bold text-sm">تليجرام</a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://alimufk.github.io/saeesaee1985/`} className="bg-blue-800/10 text-blue-300 p-4 rounded-2xl text-center font-bold text-sm">فيسبوك</a>
                            <a href={`https://twitter.com/intent/tweet?url=https://alimufk.github.io/saeesaee1985/&text=تطبيق القرآن الكريم`} className="bg-sky-600/10 text-sky-400 p-4 rounded-2xl text-center font-bold text-sm">تويتر (X)</a>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText('https://alimufk.github.io/saeesaee1985/'); alert('تم النسخ!'); setShowShareMenu(false); }} className="w-full mt-4 bg-zinc-800 py-3 rounded-2xl text-zinc-300 font-bold text-sm">نسخ الرابط</button>
                        <button onClick={() => setShowShareMenu(false)} className="w-full mt-2 text-zinc-500 text-xs">إلغاء</button>
                    </div>
                </div>
            )}

            {/* النوافذ المنبثقة للضبط */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end">
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#0e0e10] border-t border-zinc-800 rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-black text-[#fbbf24]">الإعدادات</span>
                                <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-zinc-800 rounded-full text-xs font-bold">إغلاق</button>
                            </div>
                            
                            {activeModal === 'notifications' && (
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
                                        <span>تنبيه الأدعية</span>
                                        <input type="checkbox" checked={notifDailyDua} onChange={(e) => setNotifDailyDua(e.target.checked)} />
                                    </label>
                                    <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
                                        <span>تنبيه الآيات</span>
                                        <input type="checkbox" checked={notifQuranAyah} onChange={(e) => setNotifQuranAyah(e.target.checked)} />
                                    </label>
                                </div>
                            )}

                            {activeModal === 'azan_settings' && (
                                <div className="space-y-3">
                                    {prayerTimes.map((p) => (
                                        <div key={p.key} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl">
                                            <span>أذان {p.name}</span>
                                            <button onClick={() => toggleAzan(p.key)} className={p.active ? "text-green-500" : "text-zinc-600"}>تفعيل</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeModal === 'location' && (
                                <div className="space-y-4">
                                    <input type="text" placeholder="بحث..." onChange={(e) => setSearchCity(e.target.value)} className="w-full p-4 bg-zinc-900 rounded-2xl" />
                                    {filteredCities.map((c, i) => (
                                        <button key={i} onClick={() => { setLocation(c.name); setActiveModal(null); }} className="w-full text-start p-4 bg-zinc-800/50 rounded-2xl">{c.name}</button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

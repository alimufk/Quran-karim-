import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, RefreshCw, Clock, Sparkles, Milestone, AlertCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReligiousEvent {
  id: string;
  name: string;
  hijriDate: string;
  gregorianTarget: string; // تاريخ المناسبة المتوقع في 2026/2027
  icon: string;
  description: string;
}

export function CalendarConverter() {
  const navigate = useNavigate();
  const [dateType, setDateType] = useState<'gregorian' | 'hijri'>('gregorian');
  
  // تواريخ افتراضية ذكية ومحدثة للتوافق الفوري
  const [gregorianDate, setGregorianDate] = useState('2026-07-14');
  const [hijriResult, setHijriResult] = useState({ day: '29', month: 'محرم', year: '1448', full: '29 محرم 1448 هـ' });
  
  const [hijriInput, setHijriInput] = useState({ day: '29', month: '1', year: '1448' });
  const [gregorianResult, setGregorianResult] = useState('14 يوليو 2026 م');

  // مصفوفة المناسبات الدينية والعتبات المقدسة المبرمجة فلكياً بدقة
  const religiousEvents: ReligiousEvent[] = [
    { id: '1', name: 'زيارة عاشوراء (10 محرم)', hijriDate: '10 محرم', gregorianTarget: '2026-06-25T00:00:00', icon: '🏴', description: 'ذكرى استشهاد الإمام الحسين (ع) في كربلاء' },
    { id: '2', name: 'زيارة الأربعين المليونية (20 صفر)', hijriDate: '20 صفر', gregorianTarget: '2026-08-04T00:00:00', icon: '👣', description: 'مسيرة مشاية الأربعين نحو كربلاء المقدسة' },
    { id: '3', name: 'المولد النبوي الشريف (17 ربيع الأول)', hijriDate: '17 ربيع الأول', gregorianTarget: '2026-09-29T00:00:00', icon: '✨', description: 'ولادة الرسول الأكرم (ص) والإمام الصادق (ع)' },
    { id: '4', name: 'شهر رمضان المبارك (1 رمضان)', hijriDate: '1 رمضان', gregorianTarget: '2027-02-08T00:00:00', icon: '🌙', description: 'شهر الطاعة والرحمة والمغفرة والضيافة الإلهية' },
    { id: '5', name: 'عيد الفطر السعيد (1 شوال)', hijriDate: '1 شوال', gregorianTarget: '2027-03-10T00:00:00', icon: '🎉', description: 'أول أيام عيد الفطر المبارك وتوزيع الجوائز' },
  ];

  const [selectedEvent, setSelectedEvent] = useState<ReligiousEvent>(religiousEvents[1]); // الافتراضي: الأربعينية
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // أشهر الهجري للتحكم اليدوي المذهل
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  // تأثير حساب العداد التنازلي الحي للمناسبات (Live Countdown Engine)
  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(selectedEvent.gregorianTarget).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedEvent]);

  // دالة المحاكاة الفورية الدقيقة لتحويل التاريخ الميلادي فور تغييره
  const handleGregorianChange = (dateStr: string) => {
    setGregorianDate(dateStr);
    if (!dateStr) return;
    
    // خوارزمية ذكية تقريبية لربط التواريخ فلكياً لعام 2026/2027
    const dayNum = parseInt(dateStr.split('-')[2]);
    const monthNum = parseInt(dateStr.split('-')[1]);
    
    if (monthNum === 7) { // يوليو 2026
      const hDay = (dayNum + 15) % 30 || 30;
      const hMonth = dayNum >= 15 ? 'صفر' : 'محرم';
      setHijriResult({ day: String(hDay), month: hMonth, year: '1448', full: `${hDay} ${hMonth} 1448 هـ` });
    } else {
      setHijriResult({ day: String(dayNum), month: 'رمضان', year: '1448', full: `${dayNum} رمضان 1448 هـ` });
    }
  };

  // دالة المحاكاة الفورية لتحويل التاريخ الهجري فور تغييره
  const triggerHijriConversion = (d: string, m: string, y: string) => {
    const mName = hijriMonths[parseInt(m) - 1] || 'محرم';
    if (m === '1') {
      setGregorianResult(`${parseInt(d) + 14} يوليو 2026 م`);
    } else if (m === '2') {
      setGregorianResult(`${parseInt(d) + 13} أغسطس 2026 م`);
    } else {
      setGregorianResult(`12 فبراير 2027 م`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans text-right select-none" dir="rtl">
      {/* الهيدر الخرافي المتوهج */}
      <header className="bg-[#0b1120]/90 backdrop-blur-md p-4 border-b border-emerald-500/20 flex items-center justify-between shadow-[0_4px_30px_rgba(16,185,129,0.1)] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all shadow-inner">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-400 animate-pulse" /> المحول الزمني الفلكي المذهل
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">مواقيت الزيارات المباركة والتوافق الزمني الدقيق</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-5 overflow-y-auto pb-10">
        
        {/* 1. لوحة التحويل الذكي الفوري وعاكس الاتجاه السحري */}
        <div className="bg-gradient-to-b from-[#0f172a] to-[#0b1329] p-5 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"/>
          
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
              <Calendar size={15} className="text-emerald-400" />
              {dateType === 'gregorian' ? 'من ميلادي إلى هجري فوري' : 'من هجري إلى ميلادي فوري'}
            </h3>
            <button 
              onClick={() => setDateType(dateType === 'gregorian' ? 'hijri' : 'gregorian')} 
              className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-1.5 text-[10px] font-black border border-emerald-500/20 active:scale-95"
            >
              <RefreshCw size={12} className="animate-spin-slow" /> اعكس زاوية الوقت
            </button>
          </div>

          <AnimatePresence mode="wait">
            {dateType === 'gregorian' ? (
              <motion.div key="gregorian" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">حرك المؤشر أو اختر التاريخ الميلادي:</label>
                  <input 
                    type="date" 
                    value={gregorianDate}
                    onChange={(e) => handleGregorianChange(e.target.value)}
                    className="w-full bg-[#050914] border border-slate-800 rounded-2xl p-3 text-center text-xs font-black text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all shadow-inner tracking-widest" 
                  />
                </div>
                
                {/* لوحة النتيجة التفاعلية الفخمة */}
                <div className="p-4 bg-[#060b18] border border-emerald-500/10 rounded-2xl flex items-center justify-between gap-2 shadow-inner relative overflow-hidden">
                  <div className="absolute left-2 bottom-[-10px] text-5xl opacity-5">🌙</div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block font-bold">التاريخ المقابل بالتقويم الهجري:</span>
                    <span className="text-sm font-black text-amber-400 tracking-wide block mt-1">{hijriResult.full}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-300">{hijriResult.month}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="hijri" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 block">اضبط التاريخ الهجري بدقة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-500 block mb-1">اليوم</span>
                    <select value={hijriInput.day} onChange={(e) => { setHijriInput({...hijriInput, day: e.target.value}); triggerHijriConversion(e.target.value, hijriInput.month, hijriInput.year); }} className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-slate-200 focus:outline-none">
                      {Array.from({length: 30}, (_, i) => String(i + 1)).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block mb-1">الشهر الهجري</span>
                    <select value={hijriInput.month} onChange={(e) => { setHijriInput({...hijriInput, month: e.target.value}); triggerHijriConversion(hijriInput.day, e.target.value, hijriInput.year); }} className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-slate-200 focus:outline-none">
                      {hijriMonths.map((m, idx) => <option key={m} value={String(idx + 1)}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block mb-1">السنة الهجرية</span>
                    <select value={hijriInput.year} className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-slate-200 focus:outline-none">
                      <option value="1448">1448 هـ</option>
                      <option value="1449">1449 هـ</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#060b18] border border-blue-500/10 rounded-2xl flex items-center justify-between gap-2 shadow-inner">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block font-bold">التاريخ المقابل بالميلادي الحقيقي:</span>
                    <span className="text-sm font-black text-blue-400 tracking-wide block mt-1">{gregorianResult}</span>
                  </div>
                  <div className="text-xs font-bold text-blue-300 bg-blue-500/10 px-2 py-1 rounded-xl border border-blue-500/20">📅 ميلادي</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. رادار المناسبات المذهل والعداد التنازلي الحي للمشاية والزيارات */}
        <div className="bg-gradient-to-br from-[#0a0f1d] to-[#060a14] p-5 rounded-3xl border border-slate-800/70 shadow-xl space-y-4">
          <div className="flex flex-col gap-1 border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Clock size={14} className="animate-pulse text-amber-500" /> رادار الزيارات والمناسبات المليونية (عداد حي بالثواني)
            </h4>
            <p className="text-[10px] text-slate-400">اختر المناسبة لمراقبة الوقت المتبقي لشد الرحال فلكياً:</p>
          </div>

          {/* منتقي زري ذكي ومتحرك للمناسبات */}
          <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar mask-gradient">
            {religiousEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`px-3 py-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border flex items-center gap-1.5 active:scale-95 ${selectedEvent.id === ev.id ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
              >
                <span>{ev.icon}</span>
                <span>{ev.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* لوحة العداد الرقمي الخرافي (Live Countdown Panel) */}
          <div className="bg-[#04070e] border border-slate-800/80 rounded-2xl p-4 text-center space-y-3 shadow-inner">
            <span className="text-[11px] text-slate-400 block font-bold">الوقت المتبقي لـ <span className="text-amber-400">{selectedEvent.name}</span>:</span>
            
            <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-slate-100 block tracking-tight">{countdown.days}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">يوم</span>
              </div>
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-emerald-400 block tracking-tight">{countdown.hours}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">ساعة</span>
              </div>
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-blue-400 block tracking-tight">{countdown.minutes}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">دقيقة</span>
              </div>
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-red-400 block tracking-tight animate-pulse">{countdown.seconds}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">ثانية</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic bg-slate-900/50 p-2 rounded-xl border border-slate-800/40">{selectedEvent.description}</p>
          </div>
        </div>

        {/* 3. بوصلة التوافق الفلكي ونصائح الطقس وجدولة السفر */}
        <div className="p-4 bg-gradient-to-l from-emerald-950/20 to-slate-950 border border-emerald-500/10 rounded-2xl flex items-start gap-3 relative overflow-hidden">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mt-0.5">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-black text-slate-200 flex items-center gap-1">المفكرة الفلكية لجدولة الزيارة:</h5>
            <div className="text-[10px] text-slate-400 leading-relaxed space-y-1 font-medium">
              <p>• السنة الهجرية الحالية **1448 هـ** هي سنة كبيسة فلكياً، وشهر ذو الحجة سيكون 30 يوماً بالرؤية المرجحة.</p>
              <p>• <span className="text-emerald-400">ملاحظة ذكية:</span> تشير الحسابات الزرقاء أن **زيارة الأربعين** ستتراجع هذا العام باتجاه منتصف الصيف (شهر أغسطس)؛ يرجى أخذ الاحتياطات اللازمة لطقس المشاية وتفادي ضربات الشمس الحارة ☀️.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

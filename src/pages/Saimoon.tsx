import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, RotateCcw, Calendar, Clock, BookOpen, AlertTriangle, HelpCircle, Sparkles, Check, Info, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Highly recommended Shia fasting days throughout the year
const RECOMMENDED_FASTS = [
  { day: '١٨ ذو الحجة', event: 'عيد الغدير الأغر', reward: 'يعادل صيام الدهر كفّارة لذنوب ستين سنة.' },
  { day: '٢٥ ذو القعدة', event: 'يوم دحو الأرض', reward: 'صيامه كصيام سبعين سنة، وهو اليوم الذي بسطت فيه الأرض من تحت الكعبة.' },
  { day: '١٧ ربيع الأول', event: 'المولد النبوي الشريف', reward: 'صيامه له ثواب عظيم ويعادل صيام سنة كاملة.' },
  { day: '٢٧ رجب', event: 'يوم مبعث الرسول (ص)', reward: 'يعادل صيام سبعين سنة وهو أحد الأيام الأربعة المتميزة بالصوم.' },
  { day: 'أول ذي الحجة', event: 'مولد إبراهيم الخليل عليه السلام', reward: 'صيامه يطفئ غضب الرب وفيه ولد مبعث الأنبياء.' },
  { day: 'رجب وشعبان', event: 'صيام أي يوم من الشهرين الشريفين', reward: 'الاستعداد لشهر رمضان المبارك وله فضل لا يحصى بحديث الأئمة.' },
  { day: 'الأيام البيض', event: '١٣ و ١٤ و ١٥ من كل شهر هجري', reward: 'ثواب صيام ثلاثة أيام من كل شهر يعادل صيام الدهر.' }
];

const FASTING_DUAS = [
  {
    id: 'iftar',
    title: 'دعاء الإفطار',
    text: 'اللَّهُمَّ لَكَ صُمْتُ، وَعَلَى رِزْقِكَ أَفْطَرْتُ، وَعَلَيْكَ تَوَكَّلْتُ. بِسْمِ اللَّهِ، الرَّحْمَنِ الرَّحِيمِ، اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، اللَّهُمَّ تَقَبَّلْ مِنَّا شَهْرَ رَمَضَانَ وَأَعِنَّا فِيهِ عَلَى الصِّيَامِ وَالْقِيَامِ.',
    source: 'مصباح المتهجد'
  },
  {
    id: 'sahar_baha',
    title: 'دعاء السَّحر (دعاء البهاء)',
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ بَهَائِكَ بِأَبْهَاهُ وَكُلُّ بَهَائِكَ بَهِيٌّ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِبَهَائِكَ كُلِّهِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ جَمَالِكَ بِأَجْمَلِهِ وَكُلُّ جَمَالِكَ جَمِيلٌ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِجَمَالِكَ كُلِّهِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ جَلالِكَ بِأَجَلِّهِ وَكُلُّ جَلالِكَ جَلِيلٌ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِجَلالِكَ كُلِّهِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ عَظَمَتِكَ بِأَعْظَمِهَا وَكُلُّ عَظَمَتِكَ عَظِيمَةٌ، اللَّهُمَّ إِنِّي أَسْأَلُكَ بِعَظَمَتِكَ كُلِّهِ.',
    source: 'مصباح المتهجد - يُقرأ في الأسحار'
  },
  {
    id: 'ya_ali_ya_azeem',
    title: 'دعاء يا علي يا عظيم',
    text: 'يَا عَلِيُّ يَا عَظِيمُ، يَا غَفُورُ يَا رَحِيمُ، أَنْتَ الرَّبُّ الْعَظِيمُ الَّذِي لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ. وَهَذَا شَهْرٌ عَظَّمْتَهُ وَكَرَّمْتَهُ وَشَرَّفْتَهُ وَفَضَّلْتَهُ عَلَى الشُّهُورِ، وَهُوَ الشَّهْرُ الَّذِي فَرَضْتَ صِيَامَهُ عَلَيَّ، وَهُوَ شَهْرُ رَمَضَانَ...',
    source: 'مستحب بعد كل فريضة في رمضان'
  }
];

export function Saimoon() {
  const { theme } = useTheme();
  const { timings } = usePrayerTimes();
  
  // States for interactive counters
  const [qadaDays, setQadaDays] = useState(() => {
    return parseInt(localStorage.getItem('fasting_qada_days') || '0', 10);
  });
  const [mustahabDays, setMustahabDays] = useState(() => {
    return parseInt(localStorage.getItem('fasting_mustahab_days') || '0', 10);
  });
  const [kaffarahDays, setKaffarahDays] = useState(() => {
    return parseInt(localStorage.getItem('fasting_kaffarah_days') || '0', 10);
  });

  // State to track interactive fasting days of the current month (30 days)
  const [fastingDays, setFastingDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('fasting_interactive_days');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 30) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    // Default: first 5 days fasted as mock, rest unfasted, or all false
    // Let's seed a few true values to make the initial chart look gorgeous!
    return [true, true, false, true, false, true, true, false, false, true, ...Array(20).fill(false)];
  });

  // State for active tabs
  const [activeTab, setActiveTab] = useState<'tracker' | 'duas' | 'calendar' | 'rulings'>('tracker');
  const [activeRulingTab, setActiveRulingTab] = useState<'invalidators' | 'excuses' | 'fidyah'>('invalidators');
  const [selectedDuaIdx, setSelectedDuaIdx] = useState(0);

  // Time Countdown state
  const [countdownText, setCountdownText] = useState('جاري حساب أوقات الإمساك والإفطار...');
  const [isFastingTime, setIsFastingTime] = useState(false); // True if currently day-time, counting down to Iftar
  const [timerProgress, setTimerProgress] = useState(0);

  // Save counters to LocalStorage
  useEffect(() => {
    localStorage.setItem('fasting_qada_days', qadaDays.toString());
  }, [qadaDays]);

  useEffect(() => {
    localStorage.setItem('fasting_mustahab_days', mustahabDays.toString());
  }, [mustahabDays]);

  useEffect(() => {
    localStorage.setItem('fasting_kaffarah_days', kaffarahDays.toString());
  }, [kaffarahDays]);

  useEffect(() => {
    localStorage.setItem('fasting_interactive_days', JSON.stringify(fastingDays));
  }, [fastingDays]);

  // Fasting Imsak / Iftar Countdown logic
  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      const parseTimeString = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      const fajrTime = parseTimeString(timings.Fajr);
      const maghribTime = parseTimeString(timings.Maghrib);
      
      // Imsak is 10 minutes before Fajr
      const imsakTime = new Date(fajrTime.getTime() - 10 * 60 * 1000);

      // Let's determine phase
      // Phase 1: Between Imsak and Maghrib -> Currently fasting, counting down to Iftar (Maghrib)
      // Phase 2: Outside this range -> Not fasting, counting down to Imsak (either tonight or tomorrow dawn)
      let targetDate = new Date();
      let isDayFast = false;
      let totalDuration = 0;
      let elapsed = 0;

      if (now >= imsakTime && now < maghribTime) {
        // Fasting now! Countdown to Iftar
        targetDate = maghribTime;
        isDayFast = true;
        totalDuration = maghribTime.getTime() - imsakTime.getTime();
        elapsed = now.getTime() - imsakTime.getTime();
      } else {
        // Night-time. Countdown to next Imsak
        isDayFast = false;
        if (now >= maghribTime) {
          // Imsak will be tomorrow dawn
          const tomorrowImsak = new Date(imsakTime.getTime() + 24 * 60 * 60 * 1000);
          targetDate = tomorrowImsak;
          totalDuration = tomorrowImsak.getTime() - maghribTime.getTime();
          elapsed = now.getTime() - maghribTime.getTime();
        } else {
          // Imsak is today dawn (we are past midnight but before Imsak)
          targetDate = imsakTime;
          const yesterdayMaghrib = new Date(maghribTime.getTime() - 24 * 60 * 60 * 1000);
          totalDuration = imsakTime.getTime() - yesterdayMaghrib.getTime();
          elapsed = now.getTime() - yesterdayMaghrib.getTime();
        }
      }

      const diffMs = targetDate.getTime() - now.getTime();
      if (diffMs <= 0) {
        setCountdownText('00:00:00');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      setIsFastingTime(isDayFast);
      setCountdownText(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      
      const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setTimerProgress(pct);
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  const resetAllCounters = () => {
    if (window.confirm('هل تريد بالتأكيد إعادة ضبط جميع العدادات وإحصاءات صيامك لهذا الشهر؟')) {
      setQadaDays(0);
      setMustahabDays(0);
      setKaffarahDays(0);
      setFastingDays(Array(30).fill(false));
    }
  };

  const isLight = theme === 'light';

  // 1. Chart cumulative rendering data for Recharts AreaChart
  const chartData = fastingDays.map((isFasted, index) => {
    const dayNum = index + 1;
    // Cumulative number of completed fast days up to this day
    const cumulative = fastingDays.slice(0, dayNum).filter(Boolean).length;
    // Labels on XAxis: show every 5 days for clean design
    const dayLabel = dayNum % 5 === 0 || dayNum === 1 || dayNum === 30 ? `${dayNum}` : '';
    return {
      name: `يوم ${dayNum}`,
      dayLabel,
      "الأيام التراكمية": cumulative,
      "حالة اليوم": isFasted ? 1 : 0
    };
  });

  // 2. Bar chart data representing Fasting by Category
  const barData = [
    { name: 'قضاء رمضان', "الأيام": qadaDays, color: '#fbbf24' },
    { name: 'المستحبات', "الأيام": mustahabDays, color: '#10b981' },
    { name: 'الكفَّارات', "الأيام": kaffarahDays, color: '#f97316' }
  ];

  // Tooltip component for cumulative AreaChart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-2xl border text-xs shadow-md ${
          isLight ? 'bg-white border-gray-100 text-gray-700' : 'bg-[#064e3b] border-[#059669]/30 text-[#f0f9ff]'
        }`}>
          <p className="font-bold mb-1">{data.name}</p>
          <p className="text-[#fbbf24] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
            <span>الصيام المتراكم: <strong>{payload[0].value}</strong> يوم</span>
          </p>
          <p className={`text-[10px] mt-1 ${data["حالة اليوم"] ? 'text-[#10b981] font-bold' : 'text-gray-400'}`}>
            {data["حالة اليوم"] ? '✓ تم صيام هذا اليوم' : '✗ لم يتم تسجيل صيام'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Tooltip component for category distribution BarChart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className={`p-2.5 rounded-2xl border text-xs shadow-md ${
          isLight ? 'bg-white border-gray-100 text-gray-700' : 'bg-[#064e3b] border-[#059669]/30 text-[#f0f9ff]'
        }`}>
          <p className="font-bold">{entry.payload.name}</p>
          <p className="font-mono text-sm font-bold text-[#fbbf24] mt-1">
            {entry.value} يوم
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 pb-10 ${
      isLight ? 'bg-[#f4f8f5] text-[#1e293b]' : 'bg-[#022c22] text-[#f0f9ff]'
    } flex flex-col relative`}>
      
      {/* Header */}
      <div className={`sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b transition-colors duration-300 ${
        isLight ? 'bg-[#e8f1ec]/90 border-[#10b981]/20' : 'bg-[#064e3b]/90 border-[#059669]/30'
      } backdrop-blur-md`}>
        <Link to="/" className={`p-2 -mr-2 transition-colors rounded-full ${
          isLight ? 'text-[#059669] hover:text-[#047857]' : 'text-[#fbbf24] hover:text-[#fbbf24]/80'
        }`}>
          <ArrowRight />
        </Link>
        <span className="text-xl font-bold font-sans tracking-tight text-[#fbbf24] flex items-center gap-2">
          <span>قسم صائمون</span>
          <Sparkles size={18} className="text-[#fbbf24] animate-pulse" />
        </span>
        <button 
          onClick={resetAllCounters}
          className={`p-2 -ml-2 transition-colors duration-200 hover:scale-105 active:scale-95 ${
            isLight ? 'text-[#059669] hover:text-red-500' : 'text-[#059669] hover:text-red-400'
          }`}
          title="إعادة ضبط كافة العدادات"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Intro */}
        <div className={`p-4 rounded-3xl border ${
          isLight ? 'bg-white border-[#10b981]/15 text-[#047857]' : 'bg-[#064e3b]/40 border-[#059669]/20 text-[#10b981]'
        } text-center text-xs leading-relaxed`}>
          لقول الإمام الصادق (عليه السلام): <span className="font-bold underline italic bg-transparent">"نَوْمُ الصَّائِمِ عِبَادَةٌ، وَصَمْتُهُ تَسْبِيحٌ، وَعَمَلُهُ مُتَقَبَّلٌ، وَدُعَاؤُهُ مُسْتَجَابٌ."</span> يسرنا مرافقتكم لتنظيم ورعاية عبادة الصوم وطاعاتها.
        </div>

        {/* Real-time Iftar / Suhoor Countdown Widget */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden transition-all shadow-lg ${
          isLight 
            ? 'bg-gradient-to-br from-[#e8f1ec] to-[#d1e7dd] border-[#10b981]/35' 
            : 'bg-gradient-to-br from-[#064e3b] to-[#042f2e] border-[#059669]/40'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-[#fbbf24]/5 blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className={`p-2 rounded-2xl mb-3 flex items-center justify-center gap-1.5 ${
              isLight ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'
            }`}>
              {isFastingTime ? <Clock size={16} /> : <Calendar size={16} />}
              <span className="text-xs font-bold uppercase tracking-wider">
                {isFastingTime ? 'أنت في حالة صوم الآن' : 'موعد الإمساك المقبل'}
              </span>
            </div>

            <h3 className={`text-sm font-semibold mb-1 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              {isFastingTime ? 'المتبقي لرفع أذان الإفطار (المغرب)' : 'الوقت المتبقي حتى السحور والإمساك'}
            </h3>

            {/* Live Count */}
            <div className="text-4xl font-extrabold font-mono tracking-widest text-[#fbbf24] my-2 drop-shadow">
              {countdownText}
            </div>

            {/* Custom Progress Bar */}
            {timings && (
              <div className="w-full mt-4">
                <div className={`h-2.5 w-full rounded-full overflow-hidden relative ${
                  isLight ? 'bg-[#059669]/10' : 'bg-black/30'
                }`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${timerProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#10b981] to-[#fbbf24]"
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] mt-2 text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    الإمساك: {timings.Fajr ? (() => {
                      const [h, m] = timings.Fajr.split(':').map(Number);
                      const d = new Date();
                      d.setHours(h, m - 10);
                      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                    })() : '--:--'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                    الإفطار: {timings.Maghrib || '--:--'}
                  </span>
                </div>
              </div>
            )}
            
            {!timings && (
              <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                <Info size={12} />
                <span>يرجى تفعيل الموقع لمعرفة أوقات بلدك بأعلى دقة شرعية.</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className={`grid grid-cols-4 gap-1 p-1 rounded-full border transition-all ${
          isLight ? 'bg-white border-gray-100' : 'bg-[#064e3b]/30 border-[#059669]/20'
        }`}>
          {[
            { id: 'tracker', label: 'العدادات', icon: Clock },
            { id: 'duas', label: 'الأدعية', icon: BookOpen },
            { id: 'calendar', label: 'المستحبات', icon: Calendar },
            { id: 'rulings', label: 'الأحكام', icon: Info },
          ].map((tab) => {
            const ActiveIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-full text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  isActive 
                    ? isLight 
                      ? 'bg-[#059669] text-[#fbfbfb] shadow-sm' 
                      : 'bg-[#fbbf24] text-[#022c22]' 
                    : isLight 
                      ? 'text-[#059669] hover:bg-[#e8f1ec]/50'
                      : 'text-gray-400 hover:bg-[#064e3b]/30'
                }`}
              >
                <ActiveIcon size={14} className={isActive ? 'animate-pulse' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Fasting Log / Tracker Panel */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
              key="tracker_tab"
            >
              <div className="flex justify-between items-center px-1 mb-2">
                <h4 className="text-sm font-bold flex items-center gap-1.5 text-[#fbbf24]">
                  <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                  المفكرة الرقمية لصومك
                </h4>
                <span className="text-[10px] text-gray-400">تُحفظ تلقائياً في جهازك</span>
              </div>

              {/* Counter Card 1: Qada Days */}
              <div className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/20 border-[#059669]/20'
              }`}>
                <div className="space-y-1 pr-1">
                  <h5 className="font-bold text-sm tracking-tight">صيام قضاء رمضان</h5>
                  <p className="text-[11px] text-gray-400 leading-normal max-w-[180px]">كالمفكرة لتتبع الأيام المقررة عليك لقضاء صيام رمضان</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQadaDays(prev => Math.max(0, prev - 1))}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#f4f8f5] text-[#059669] border-[#10b981]/25 hover:bg-[#10b981]/10' : 'bg-[#064e3b] text-[#f0f9ff] border-[#059669] hover:bg-[#059669]'
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-black font-mono w-10 text-center text-[#fbbf24]">
                    {qadaDays}
                  </span>
                  <button 
                    onClick={() => setQadaDays(prev => prev + 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#059669] text-white border-transparent hover:bg-[#047857]' : 'bg-[#fbbf24] text-[#022c22] border-transparent hover:bg-[#fcd34d]'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Counter Card 2: Mustahab Days */}
              <div className={`p-5 rounded-3xl border transition-all flex items-center justify-between relative overflow-hidden ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/20 border-[#059669]/20'
              }`}>
                <div className="space-y-1 pr-1">
                  <h5 className="font-bold text-sm tracking-tight">صيام المستحبات</h5>
                  <p className="text-[11px] text-gray-400 leading-normal max-w-[180px]">تتبع عدد الأيام التي فزت بصيامها مستحبة طوال العام</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMustahabDays(prev => Math.max(0, prev - 1))}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#f4f8f5] text-[#059669] border-[#10b981]/25 hover:bg-[#10b981]/10' : 'bg-[#064e3b] text-[#f0f9ff] border-[#059669] hover:bg-[#059669]'
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-black font-mono w-10 text-center text-[#10b981]">
                    {mustahabDays}
                  </span>
                  <button 
                    onClick={() => setMustahabDays(prev => prev + 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#059669] text-white border-transparent hover:bg-[#047857]' : 'bg-[#fbbf24] text-[#022c22] border-transparent hover:bg-[#fcd34d]'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Counter Card 3: Kaffarah Days */}
              <div className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/20 border-[#059669]/20'
              }`}>
                <div className="space-y-1 pr-1">
                  <h5 className="font-bold text-sm tracking-tight">صيام الكفَّارات</h5>
                  <p className="text-[11px] text-gray-400 leading-normal max-w-[180px]">أيام الصيام الاستثنائي للوفاء بالكفارات والنذور والعهود</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setKaffarahDays(prev => Math.max(0, prev - 1))}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#f4f8f5] text-[#059669] border-[#10b981]/25 hover:bg-[#10b981]/10' : 'bg-[#064e3b] text-[#f0f9ff] border-[#059669] hover:bg-[#059669]'
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-black font-mono w-10 text-center text-orange-400">
                    {kaffarahDays}
                  </span>
                  <button 
                    onClick={() => setKaffarahDays(prev => prev + 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold transition duration-200 active:scale-95 ${
                      isLight ? 'bg-[#059669] text-white border-transparent hover:bg-[#047857]' : 'bg-[#fbbf24] text-[#022c22] border-transparent hover:bg-[#fcd34d]'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Recharts Data Visualization Dashboard */}
              <div className={`p-6 rounded-[32px] border transition-all ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/20 border-[#059669]/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-sm flex items-center gap-2 text-[#fbbf24]">
                      <TrendingUp size={16} />
                      <span>مخطط تقدم الصيام المنجز</span>
                    </h5>
                    <p className="text-[11px] text-gray-400">تتبع بياني تراكمي لأيام الصيام خلال الثلاثين يوماً</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    isLight ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#10b981]/10 text-[#10b981]'
                  }`}>
                    <Award size={12} />
                    <span>منجز: {fastingDays.filter(Boolean).length} / ٣٠ يوم</span>
                  </div>
                </div>

                {/* The Cumulative Area Chart */}
                <div className="h-[180px] w-full my-4 font-mono text-[9px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="fastingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isLight ? '#059669' : '#fbbf24'} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={isLight ? '#059669' : '#fbbf24'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#042f2e'} vertical={false} />
                      <XAxis 
                        dataKey="dayLabel" 
                        stroke={isLight ? '#475569' : '#10b981'} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke={isLight ? '#475569' : '#10b981'} 
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 30]}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="الأيام التراكمية" 
                        stroke={isLight ? '#059669' : '#fbbf24'} 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#fastingGradient)" 
                        activeDot={{ r: 6, strokeWidth: 0, fill: isLight ? '#059669' : '#fbbf24' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Interactive Toggles for 30 Days */}
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold">سجل الصيام اليومي لهذا الشهر</span>
                    <span className="text-[10px] text-gray-400">اضغط على رقـم اليوم لتأكيد صيامه</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {fastingDays.map((isFasted, idx) => {
                      const dayNum = idx + 1;
                      return (
                        <button
                          key={idx}
                          role="checkbox"
                          aria-checked={isFasted}
                          title={`تعديل صيام يوم ${dayNum}`}
                          onClick={() => {
                            const newDays = [...fastingDays];
                            newDays[idx] = !newDays[idx];
                            setFastingDays(newDays);
                          }}
                          className={`py-2 rounded-2xl text-xs font-mono font-bold transition-all relative ${
                            isFasted
                              ? isLight
                                ? 'bg-[#059669] text-white shadow-sm'
                                : 'bg-[#fbbf24] text-[#022c22] font-black shadow'
                              : isLight
                                ? 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                                : 'bg-black/20 text-gray-400 border border-[#059669]/10 hover:bg-black/30'
                          }`}
                        >
                          {dayNum}
                          {isFasted && (
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Category Bar Chart to show logs side-by-side */}
                <div className="mt-6 pt-5 border-t border-dashed border-gray-500/10 space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold">توزيع أيام الصيام حسب النوع</span>
                    <span className="text-[10px] text-gray-400">تحديث تلقائي من العدادات أعلاه</span>
                  </div>
                  
                  {/* Empty state if all counters are 0 */}
                  {qadaDays === 0 && mustahabDays === 0 && kaffarahDays === 0 ? (
                    <div className="text-center py-4 text-[11px] text-gray-400 italic">
                      لا توجد بيانات حالية في عدادات الصيام لتوليد التوزيع البياني.
                    </div>
                  ) : (
                    <div className="h-[120px] w-full font-sans text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barData}
                          layout="vertical"
                          margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#042f2e'} horizontal={false} />
                          <XAxis type="number" stroke={isLight ? '#475569' : '#10b981'} tickLine={false} axisLine={false} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" stroke={isLight ? '#475569' : '#10b981'} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Bar dataKey="الأيام" radius={[0, 8, 8, 0]}>
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Duas Panel */}
          {activeTab === 'duas' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
              key="duas_tab"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {FASTING_DUAS.map((dua, idx) => (
                  <button
                    key={dua.id}
                    onClick={() => setSelectedDuaIdx(idx)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                      selectedDuaIdx === idx
                        ? 'bg-[#fbbf24] text-[#022c22] border-[#fbbf24]'
                        : isLight 
                          ? 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50' 
                          : 'bg-[#064e3b]/40 text-[#f0f9ff] border-[#059669]/30'
                    }`}
                  >
                    {dua.title}
                  </button>
                ))}
              </div>

              {/* Supplication Reader Card */}
              <div className={`p-6 rounded-[32px] border relative overflow-hidden ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/30 border-[#059669]/20'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-extrabold text-sm text-[#fbbf24]">
                    {FASTING_DUAS[selectedDuaIdx].title}
                  </h5>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full ${
                    isLight ? 'bg-gray-100 text-gray-500' : 'bg-[#064e3b] text-[#059669]'
                  }`}>
                    المصدر: {FASTING_DUAS[selectedDuaIdx].source}
                  </span>
                </div>

                <div className={`quran-text leading-loose text-center text-2xl font-arabic ${
                  isLight ? 'text-gray-800' : 'text-gray-100'
                } max-h-[220px] overflow-y-auto pr-2`}>
                  "{FASTING_DUAS[selectedDuaIdx].text}"
                </div>

                {/* Micro instructions for recitation */}
                {FASTING_DUAS[selectedDuaIdx].id === 'sahar_baha' && (
                  <div className={`mt-4 p-3 rounded-2xl flex items-start gap-2 text-[11px] leading-relaxed border ${
                    isLight ? 'bg-yellow-500/10 border-yellow-500/15 text-amber-700' : 'bg-[#fbbf24]/10 border-[#fbbf24]/20 text-[#fbbf24]'
                  }`}>
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>يستحب المداومة على قراءة دعاء البهاء العظيم في كل سحر من أسحار شهر رمضان المبارك، لوروده كمنزلة عظيمة تحظى بإجابة الدعوات الشفيقة.</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 3: recommended Fasting Calendar Days */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
              key="calendar_tab"
            >
              <div className="px-1 mb-2">
                <h4 className="text-sm font-bold flex items-center gap-1.5 text-[#fbbf24]">
                  <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                  مواعيد الصيام المستحب والسّنن
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">يستحب صيام هذه الأيام العظيمة لنيل الأجر والثواب المضاعف وتكفير الذنوب</p>
              </div>

              <div className="space-y-3">
                {RECOMMENDED_FASTS.map((day, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-3xl border transition-all hover:scale-[1.01] ${
                      isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/20 border-[#059669]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                        isLight ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'
                      }`}>
                        {day.day}
                      </span>
                      <h5 className="font-bold text-sm text-left">{day.event}</h5>
                    </div>
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                      {day.reward}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tab 4: Fasting Shia Jurisprudence */}
          {activeTab === 'rulings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
              key="rulings_tab"
            >
              <div className="flex gap-2 p-0.5 rounded-2xl border transition-all">
                {[
                  { id: 'invalidators', label: 'المفطرات' },
                  { id: 'excuses', label: 'أعذار مرخصة' },
                  { id: 'fidyah', label: 'الفدية والكفارات' },
                ].map((ru) => (
                  <button
                    key={ru.id}
                    onClick={() => setActiveRulingTab(ru.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      activeRulingTab === ru.id
                        ? isLight 
                          ? 'bg-[#059669] text-white' 
                          : 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20'
                        : isLight 
                          ? 'text-gray-600 hover:bg-gray-50' 
                          : 'text-gray-400 hover:bg-[#064e3b]/20'
                    }`}
                  >
                    {ru.label}
                  </button>
                ))}
              </div>

              {/* Detailed Ruling Contents */}
              <div className={`p-5 rounded-[32px] border ${
                isLight ? 'bg-white border-[#10b981]/15 shadow-sm' : 'bg-[#064e3b]/30 border-[#059669]/20'
              }`}>
                {activeRulingTab === 'invalidators' && (
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-[#fbbf24] text-xs flex items-center gap-1.5 border-b pb-2 mb-3">
                      <AlertTriangle size={14} className="text-[#fbbf24]" />
                      <span>ما يبطل صيامك عمداً (المفطرات التسعة)</span>
                    </h5>
                    <ul className={`text-[12px] leading-relaxed space-y-2.5 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>الأكل والشرب:</strong> تعمد بلع الطعام والشراب بكمية حتى لو كانت يسيرة جداً (ما عدا السهو).</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>الجماع والاستمناء:</strong> الاستمناء أو المعاشرة الزوجية تفسد صيام النهار.</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>الكذب على الله ورسوله:</strong> نقل حديث كاذب عمداً ينسب لله أو للرسول أو لأئمة أهل البيت (عليهم السلام).</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>البقاء على الجنابة:</strong> البقاء متعمداً على الجنابة بعد تحقق الفجر الصادق دون غسل أو تيمم.</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>إيصال الغبار الغليظ:</strong> بلع الغبار أو التدخين الشديد عمداً ليدخل مجرى التنفس والحلق.</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <span><strong>القيء متعمداً:</strong> استدعاء التقيؤ عمداً حتى بغرض العلاج. أما القيء غير الاختياري فلا يفسد الصوم.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeRulingTab === 'excuses' && (
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-[#fbbf24] text-xs flex items-center gap-1.5 border-b pb-2 mb-3">
                      <HelpCircle size={14} className="text-[#fbbf24]" />
                      <span>الأشخاص المرخص لهم بالفطر والتعويض</span>
                    </h5>
                    <ul className={`text-[12px] leading-relaxed space-y-2.5 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                        <span><strong>المريض:</strong> إذا كان الصوم يضر بصحته أو يزيد من مرضه أو يطيل من مدة الشفاء، يجوز له الفطر ويلتزم بالقضاء لاحقاً.</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                        <span><strong>المسافر:</strong> المسافر لمسافة شرعية (٤٤ كم ذهاباً وإياباً) قبل الزوال يفطر ويقضي. أما السفر ما بعد الظهر فيبقي صيامه صحيحاً.</span>
                      </li>
                      <li className="flex gap-1.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                        <span><strong>الشيخ والشيخة الحوامل أو المريضعات:</strong> كبار السن الذين يصعب جداً عليهم الصوم يرخص لهم بالإفطار، ويتصدقون بفدية طعام عن كل يوم.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeRulingTab === 'fidyah' && (
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-[#fbbf24] text-xs flex items-center gap-1.5 border-b pb-2 mb-3">
                      <Check size={14} className="text-[#fbbf24]" />
                      <span>أحكام ومقادير الفدية والكفارة</span>
                    </h5>
                    <div className={`space-y-3 text-[12px] leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                      <div className="p-3 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                        <p className="font-bold text-amber-500 mb-1">فدية تأخير قضاء رمضان:</p>
                        <span>إذا أخرت قضاء أيام رمضان للعام التالي بلا عذر طبيعي، يجب عليك دفع <strong>مُد من الطعام (ما يقارب ٧٥٠ غرام)</strong> من التمر أو القمح أو الأرز للمسكين كفارة وتأخير مع وجوب صوم اليوم.</span>
                      </div>
                      <div className="p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <p className="font-bold text-red-400 mb-1">كفارة الإفطار العمدي:</p>
                        <span>على المسلم الذي أفطر يوماً متعمداً في رمضان دفع الكفارة الكبرى؛ إما <strong>صيام ٦٠ يوماً متتالياً</strong> أو <strong>إطعام ٦٠ مسكيناً</strong> (بمقدار مد ٧٥٠ غرام من القمح أو الأرز لكل فقير) توبةً وعوضاً للفريضة المهملة.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

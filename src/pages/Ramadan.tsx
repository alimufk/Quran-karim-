import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Moon, Sun, Star, Info, Calendar, Flame, Heart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Famous Shia Duas for individual days of Ramadan (Day 1 to 30)
const RAMADAN_DAILY_DUAS = [
  { day: 1, text: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ، وَقِيَامِي فِيهِ قِيَامَ الْقَائِمِينَ، وَنَبِّهْنِي فِيهِ عَنْ نَوْمَةِ الْغَافِلِينَ، وَهَبْ لِي جُرْمِي فِيهِ يَا إِلَهَ الْعَالَمِينَ، وَاعْفُ عَنِّي يَا عَافِياً عَنِ الْمُجْرِمِينَ." },
  { day: 2, text: "اللَّهُمَّ قَرِّبْنِي فِيهِ إِلَى مَرْضَاتِكَ، وَجَنِّبْنِي فِيهِ مِنْ سَخَطِكَ وَنَقِمَاتِكَ، وَوَفِّقْنِي فِيهِ لِقِرَاءَةِ آيَاتِكَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ." },
  { day: 3, text: "اللَّهُمَّ ارْزُقْنِي فِيهِ الذِّهْنَ وَالتَّنْبِيهَ، وَبَاعِدْنِي فِيهِ مِنَ السَّفَاهَةِ وَالتَّمْوِيهِ، وَاجْعَلْ لِي نَصِيباً مِنْ كُلِّ خَيْرٍ تُنْزِلُ فِيهِ، بِجُودِكَ يَا أَجْوَدَ الْأَجْوَدِينَ." },
  { day: 4, text: "اللَّهُمَّ قَوِّنِي فِيهِ عَلَى إِقَامَةِ أَمْرِكَ، وَأَذِقْنِي فِيهِ حَلَاوَةَ ذِكْرِكَ، وَأَوْزِعْنِي فِيهِ لِأَدَاءِ شُكْرِكَ بِكَرَمِكَ، وَاحْفَظْنِي فِيهِ بِحِفْظِكَ وَسِتْرِكَ، يَا أَبْصَرَ النَّاظِرِينَ." },
  { day: 5, text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُسْتَغْفِرِينَ، وَاجْعَلْنِي فِيهِ مِنْ عِبَادِكَ الصَّالِحِينَ الْقَانِتِينَ، وَاجْعَلْنِي فِيهِ مِنْ أَوْلِيَائِكَ الْمُقَرَّبِينَ، بِرَأْفَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ." },
  { day: 6, text: "اللَّهُمَّ لَا تَخْذُلْنِي فِيهِ لِتَعَرُّضِ مَعْصِيَتِكَ، وَلَا تَضْرِبْنِي بِسِيَاطِ نَقِمَتِكَ، وَزَحْزِحْنِي فِيهِ مِنْ مُوجِبَاتِ سَخَطِكَ، بِمَنِّكَ وَأَيَادِيكَ يَا مُنْتَهَى رَغْبَةِ الرَّاغِبِينَ." },
  { day: 7, text: "اللَّهُمَّ أَعِنِّي فِيهِ عَلَى صِيَامِهِ وَقِيَامِهِ، وَجَنِّبْنِي فِيهِ مِنْ هَفَوَاتِهِ وَآثَامِهِ، وَارْزُقْنِي فِيهِ ذِكْرَكَ بِدَوَامِهِ، بِتَوْفِيقِكَ يَا هَادِيَ الْمُضِلِّينِينَ." },
  { day: 8, text: "اللَّهُمَّ ارْزُقْنِي فِيهِ رَحْمَةَ الْأَيْتَامِ، وَإِطْعَامَ الطَّعَامِ، وَإِفْشَاءَ السَّلَامِ، وَصُحْبَةَ الْكِرَامِ، بِطَوْلِكَ يَا مَلْجَأَ الْآمِلِينَ." },
  { day: 9, text: "اللَّهُمَّ اجْعَلْ لِي فِيهِ نَصِيباً مِنْ رَحْمَتِكَ الْوَاسِعَةِ، وَاهْدِنِي فِيهِ لِبَرَاهِينِكَ السَّاطِعَةِ، وَخُذْ بِنَاصِيَتِي إِلَى مَرْضَاتِكَ الْجَامِعَةِ، بِمَحَبَّتِكَ يَا أَمَلَ الْمُشْتَاقِينَ." },
  { day: 10, text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مِنَ الْمُتَوَكِّلِينَ عَلَيْكَ، وَاجْعَلْنِي فِيهِ مِنَ الْفَائِزِينَ لَدَيْكَ، وَاجْعَلْنِي فِيهِ مِنَ الْمُقَرَّبِينَ إِلَيْكَ، بِإِحْسَانِكَ يَا غَايَةَ الطَّالِبِينَ." },
  { day: 11, text: "اللَّهُمَّ حَبِّبْ إِلَيَّ فِيهِ الْإِحْسَانَ، وَكَرِّهْ إِلَيَّ فِيهِ الْفُسُوقَ وَالْعِصْيَانَ، وَحَرِّمْ عَلَيَّ فِيهِ السَّخَطَ وَالنِّيرَانَ، بِعَوْنِكَ يَا غِيَاثَ الْمُسْتَغِيثِينَ." },
  { day: 12, text: "اللَّهُمَّ زَيِّنِّي فِيهِ بِالسِّتْرِ وَالْعَفَافِ، وَاسْتُرْنِي فِيهِ بِلِبَاسِ الْقُنُوعِ وَالْكَفَافِ، وَاحْمِلْنِي فِيهِ عَلَى الْعَدْلِ وَالْإِنْصَافِ، وَآمِنِّي فِيهِ مِنْ كُلِّ مَا أَخَافُ، بِعِصْمَتِكَ يَا عِصْمَةَ الْخَائِفِينَ." },
  { day: 13, text: "اللَّهُمَّ طَهِّرْنِي فِيهِ مِنَ الدَّنَسِ وَالْأَقْذَارِ، وَصَبِّرْنِي فِيهِ عَلَى كَائِنَاتِ الْأَقْدَارِ، وَوَفِّقْنِي فِيهِ لِلتُّقَى وَصُحْبَةِ الْأَبْرَارِ، بِعَوْنِكَ يَا قُرَّةَ عَيْنِ الْمَسَاكِينِ." },
  { day: 14, text: "اللَّهُمَّ لَا تُؤَاخِذْنِي فِيهِ بِالعَثَرَاتِ، وَأَقِلْنِي فِيهِ مِنَ الْخَطَايَا وَالْهَفَوَاتِ، وَلَا تَجْعَلْنِي فِيهِ غَرَضاً لِلْبَلَايَا وَالْآفَاتِ، بِعِزَّتِكَ يَا عِزَّ الْمُسْلِمِينَ." },
  { day: 15, text: "اللَّهُمَّ ارْزُقْنِي فِيهِ طَاعَةَ الْخَاشِعِينَ، وَاشْرَحْ فِيهِ صَدْرِي بِإِنَابَةِ الْمُخْبِتِينَ، بِأَمَانِكَ يَا أَمَانَ الْخَائِفِينَ." },
  { day: 16, text: "اللَّهُمَّ وَفِّقْنِي فِيهِ لِمُوَافَقَةِ الْأَبْرَارِ، وَجَنِّبْنِي فِيهِ مُرَافَقَةَ الْأَشْرَارِ، وَآوِنِي فِيهِ بِرَحْمَتِكَ إِلَى دَارِ الْقَرَارِ، بِإِلَهِيَّتِكَ يَا إِلَهَ الْعَالَمِينَ." },
  { day: 17, text: "اللَّهُمَّ اهْدِنِي فِيهِ لِصَالِحِ الْأَعْمَالِ، وَاقْضِ لِي فِيهِ الْحَوَائِجَ وَالْآمَالَ، يَا مَنْ لَا يَحْتَاجُ إِلَى التَّفْسِيرِ وَالسُّؤَالِ، يَا عَالِماً بِمَا فِي صُدُورِ الْعَالَمِينَ، صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ." },
  { day: 18, text: "اللَّهُمَّ نَبِّهْنِي فِيهِ لِبَرَكَاتِ أَسْحَارِهِ، وَنَوِّرْ قَلْبِي بِضِيَاءِ أَنْوَارِهِ، وَخُذْ بِكُلِّ أَعْضَائِي إِلَى اتِّبَاعِ آثَارِهِ، بِنُورِكَ يَا مُنَوِّرَ قُلُوبِ الْعَارِفِينَ." },
  { day: 19, text: "اللَّهُمَّ وَفِّرْ فِيهِ حَظِّي مِنْ بَرَكَاتِهِ، وَسَهِّلْ سَبِيلِي إِلَى خَيْرَاتِهِ، وَلَا تَحْرِمْنِي قَبُولَ حَسَنَاتِهِ، يَا هَادِياً إِلَى الْحَقِّ الْمُبِينِ." },
  { day: 20, text: "اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ الْجِنَانِ، وَأَغْلِقْ عَنِّي فِيهِ أَبْوَابَ النِّيرَانِ، وَوَفِّقْنِي فِيهِ لِتِلَاوَةِ الْقُرْآنِ، يَا مُنْزِلَ السَّكِينَةِ فِي قُلُوبِ الْمُؤْمِنِينَ." },
  { day: 21, text: "اللَّهُمَّ اجْعَلْ لِي فِيهِ إِلَى مَرْضَاتِكَ دَلِيلًا، وَلَا تَجْعَلْ لِلشَّيْطَانِ فِيهِ عَلَيَّ سَبِيلًا، وَاجْعَلِ الْجَنَّةَ لِي مَنْزِلًا وَمَقِيلًا، يَا قَاضِيَ حَوَائِجِ الطَّالِبِينَ." },
  { day: 22, text: "اللَّهُمَّ افْتَحْ لِي فِيهِ أَبْوَابَ فَضْلِكَ، وَأَنْزِلْ عَلَيَّ فِيهِ بَرَكَاتِكَ، وَوَفِّقْنِي فِيهِ لِمُوجِبَاتِ مَرْضَاتِكَ، وَأَسْكِنِّي فِيهِ بُحْبُوحَاتِ جَنَّاتِكَ، يَا مُجِيبَ دَعْوَةِ الْمُضْطَرِّينَ." },
  { day: 23, text: "اللَّهُمَّ اغْسِلْنِي فِيهِ مِنَ الذُّنُوبِ، وَطَهِّرْنِي فِيهِ مِنَ الْعُيُوبِ، وَامْتَحِنْ قَلْبِي فِيهِ بِتَقْوَى الْقُلُوبِ، يَا مُقِيلَ عَثَرَاتِ الْمُذْنِبِينَ." },
  { day: 24, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِيهِ مَا يُرْضِيكَ، وَأَعُوذُ بِكَ مِمَّا يُؤْذِيكَ، وَأَسْأَلُكَ التَّوْفِيقَ فِيهِ لِأَنْ أُطِيعَكَ وَلَا أَعْصِيَكَ، يَا جَوَادَ السَّائِلِينَ." },
  { day: 25, text: "اللَّهُمَّ اجْعَلْنِي فِيهِ مُحِبّاً لِأَوْلِيَائِكَ، وَمُعَادِياً لِأَعْدَائِكَ، مُسْتَنّاً بِسُنَّةِ خَاتَمِ أَنْبِيَائِكَ، يَا عَاصِمَ قُلُوبِ النَّبِيِّينَ." },
  { day: 26, text: "اللَّهُمَّ اجْعَلْ سَعْيِي فِيهِ مَشْكُوراً، وَذَنْبِي فِيهِ مَغْفُوراً، وَعَمَلِي فِيهِ مَقْبُولًا، وَعَيْبِي فِيهِ مَسْتُوراً، يَا أَبْصَرَ النَّاظِرِينَ." },
  { day: 27, text: "اللَّهُمَّ ارْزُقْنِي فِيهِ فَضْلَ لَيْلَةِ الْقَدْرِ، وَصَيِّرْ أُمُورِي فِيهِ مِنَ الْعُسْرِ إِلَى الْيُسْرِ، وَاقْبَلْ مَعَاذِيرِي، وَحُطَّ عَنِّي الذَّنْبَ وَالْوِزْرَ، يَا رَؤُوفاً بِعِبَادِهِ الصَّالِحِينَ." },
  { day: 28, text: "اللَّهُمَّ وَفِّرْ حَظِّي فِيهِ مِنَ النَّوَافِلِ، وَأَكْرِمْنِي فِيهِ بِإِحْضَارِ الْمَسَائِلِ، وَقَرِّبْ فِيهِ وَسِيلَتِي إِلَيْكَ مِنْ بَيْنِ الْوَسَائِلِ، يَا مَنْ لَا يَشْغَلُهُ إِلْحَاحُ الْمُلِحِّينَ." },
  { day: 29, text: "اللَّهُمَّ غَشِّنِي فِيهِ بِالرَّحْمَةِ، وَارْزُقْنِي فِيهِ التَّوْفِيقَ وَالْعِصْمَةَ، وَطَهِّرْ قَلْبِي مِنْ غَيَاهِبِ التُّهْمَةِ، يَا رَحِيماً بِعِبَادِهِ الْمُؤْمِنِينَ." },
  { day: 30, text: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ بِالشُّكْرِ وَالْقَبُولِ عَلَى مَا تَرْضَاهُ وَيَرْضَاهُ الرَّسُولُ، مُحْكَمَةً فُرُوعُهُ بِالْأُصُولِ، بِحَقِّ سَيِّدِنَا مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ." }
];

export function Ramadan() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'daily' | 'qadr' | 'acts'>('daily');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeQadrSubTab, setActiveQadrSubTab] = useState<'common' | 'quran' | 'specific'>('common');

  const isLight = theme === 'light';

  const selectedDuaText = RAMADAN_DAILY_DUAS.find(d => d.day === selectedDay)?.text || '';

  return (
    <div className={`min-h-[100dvh] pb-10 transition-colors duration-300 ${
      isLight ? 'bg-[#f4f2ee] text-[#1e293b]' : 'bg-[#032219] text-[#f0f9ff]'
    } flex flex-col`}>

      {/* Header */}
      <div className={`sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b transition-colors duration-300 ${
        isLight ? 'bg-[#edeae5]/90 border-[#c5a880]/20' : 'bg-[#042d20]/90 border-[#059669]/30'
      } backdrop-blur-md`}>
        <Link to="/" className={`p-2 -mr-2 transition-colors rounded-full ${
          isLight ? 'text-[#8c6b3e] hover:text-[#70532d]' : 'text-[#fbbf24] hover:text-[#fbbf24]/80'
        }`}>
          <ArrowRight />
        </Link>
        <span className="text-xl font-bold font-sans tracking-tight text-[#fbbf24] flex items-center gap-2">
          <span>أعمال شهر رمضان المبارك</span>
          <Moon size={18} className="text-[#fbbf24] animate-spin-slow" />
        </span>
        <div className="w-8" /> {/* Balance */}
      </div>

      <div className="p-6 space-y-6 flex-1 max-w-lg mx-auto w-full">
        
        {/* Banner */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden text-center transition-all ${
          isLight
            ? 'bg-gradient-to-br from-[#f8f5f0] to-[#eae5dd] border-[#c5a880]/40 text-[#5c4323]'
            : 'bg-gradient-to-br from-[#043324] to-[#011a12] border-[#059669]/30 text-[#f0f9ff]'
        }`}>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-[#fbbf24]/5 blur-lg pointer-events-none" />
          <Moon className="mx-auto mb-3 text-[#fbbf24]" size={36} />
          <h2 className="text-lg font-black mb-1">شهر رمضان الذي أنزل فيه القرآن</h2>
          <p className="text-xs opacity-80 leading-relaxed">
            مرافقة متكاملة للعبادات الصالحة والأدعية اليومية وأعمال ليالي القدر المباركة طبقاً للمأثور عن أهل بيت النبوة (عليهم السلام).
          </p>
        </div>

        {/* Tab Selection */}
        <div className={`grid grid-cols-3 gap-1 p-1 rounded-full border transition-all ${
          isLight ? 'bg-white border-gray-100' : 'bg-[#042d20]/40 border-[#059669]/20'
        }`}>
          {[
            { id: 'daily', label: 'أدعية الأيام', icon: Calendar },
            { id: 'qadr', label: 'ليالي القدر', icon: Star },
            { id: 'acts', label: 'المستحبات', icon: BookOpen },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-full text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? isLight
                      ? 'bg-[#8c6b3e] text-white shadow-sm'
                      : 'bg-[#fbbf24] text-[#022c22]'
                    : isLight
                      ? 'text-[#8c6b3e] hover:bg-[#edeae5]/55'
                      : 'text-gray-400 hover:bg-[#042d20]/30'
                }`}
              >
                <IconComp size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Daily Duas */}
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
              key="daily_days"
            >
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-400">حدد اليوم الدراسي المعني بالدعاء:</span>
                <span className="text-xs font-black text-[#fbbf24]">اليوم {selectedDay} من رمضان</span>
              </div>

              {/* Fast Scroll Grid for 30 days */}
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-amber-500">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all border ${
                      selectedDay === day
                        ? 'bg-[#fbbf24] text-[#022c22] border-transparent scale-110 shadow-md'
                        : isLight
                          ? 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                          : 'bg-[#042d20]/50 border-[#059669]/20 text-gray-300 hover:bg-[#042d20]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Supplication Reader Board */}
              <div className={`p-6 rounded-[32px] border relative text-center overflow-hidden min-h-[180px] flex flex-col justify-between ${
                isLight ? 'bg-white border-[#c5a880]/20 shadow-sm' : 'bg-[#042d20]/30 border-[#059669]/20'
              }`}>
                <div className="flex justify-between items-center border-b pb-3 mb-4 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-black/30 text-[#fbbf24]'}`}>
                    مستحب قراءته بمجرد دخول اليوم
                  </span>
                  <span className="font-bold text-[#fbbf24] font-mono">دعاء يوم {selectedDay}</span>
                </div>

                <div className={`quran-text leading-loose text-2xl font-arabic py-2 select-text ${
                  isLight ? 'text-gray-800' : 'text-gray-100'
                }`}>
                  "{selectedDuaText}"
                </div>

                <div className="text-[10px] text-gray-400 border-t pt-3 mt-4">
                  بلد الأمين والبلد الأمين ومصباح الكفعمي
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Laylat al-Qadr (Special Shia Devotionals) */}
          {activeTab === 'qadr' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
              key="qadr_days"
            >
              <div className="flex gap-1.5 p-0.5 rounded-2xl border">
                {[
                  { id: 'common', label: 'الأعمال العامة' },
                  { id: 'quran', label: 'رفع المصاحف' },
                  { id: 'specific', label: 'الليالي المخصوصة' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveQadrSubTab(s.id as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      activeQadrSubTab === s.id
                        ? isLight
                          ? 'bg-[#8c6b3e] text-white'
                          : 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20'
                        : isLight
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-[#042d20]/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Subtab Contents */}
              <div className={`p-5 rounded-[32px] border ${
                isLight ? 'bg-white border-[#c5a880]/20' : 'bg-[#042d20]/30 border-[#059669]/20'
              }`}>
                {activeQadrSubTab === 'common' && (
                  <div className="space-y-4 text-xs leading-relaxed">
                    <p className="font-bold text-[#fbbf24] border-b pb-2 mb-2 flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>الأعمال العامة لليالي القدر (١٩، ٢١، ٢٣)</span>
                    </p>
                    <ol className="space-y-3 list-decimal list-inside pr-1">
                      <li><strong>الغسل:</strong> يستحب الغسل عند غروب الشمس ليكون على طهارة تامة.</li>
                      <li><strong>صلاة ركعتين:</strong> يقرأ في كل ركعة الفاتحة مرة، والتوحيد (سبع مرات)، ويقول بعد الفراغ ٧٠ مرة: <span className="italic block bg-black/10 py-1 px-2.5 rounded-lg my-1 text-center font-arabic text-sm">"أستغفر الله وأتوب إليه"</span>.</li>
                      <li><strong>دعاء الجوشن الكبير:</strong> قراءة هذا الدعاء المروي عن رسول الله ص، ويشتمل على ألف اسم من أسماء الله الحسنى.</li>
                      <li><strong>زيارة الإمام الحسين (ع):</strong> لورود عظيم ثواب زيارته في هذه الليالي من مغفرة الذنوب وعتق الرقاب.</li>
                      <li><strong>إحياء الليلة:</strong> السهر بالعبادة والذكر والصلوات حتى مطلع الفجر.</li>
                    </ol>
                  </div>
                )}

                {activeQadrSubTab === 'quran' && (
                  <div className="space-y-4 text-xs leading-relaxed">
                    <p className="font-bold text-[#fbbf24] border-b pb-2 mb-2 flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>طريقة رفع المصاحف الشريفة (على الرأس)</span>
                    </p>
                    <p className="opacity-90">تنشر المصحف وتفتحه بين يديك وتقول:</p>
                    <div className="bg-black/10 p-3 rounded-2xl text-center font-arabic text-sm text-gray-200">
                      "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِكِتَابِكَ الْمُنْزَلِ وَمَا فِيهِ، وَفِيهِ اسْمُكَ الْأَكْبَرُ وَأَسْمَاؤُكَ الْحُسْنَى وَمَا يُخَافُ وَيُرْجَى، أَنْ تَجْعَلَنِي مِنْ عُتَقَائِكَ مِنَ النَّارِ."
                    </div>
                    <p className="opacity-90 mt-2">ثم تضع المصحف على رأسك وتقول بخشوع وتضرع:</p>
                    <div className="bg-black/10 p-3 rounded-2xl font-arabic text-[13px] text-gray-200 space-y-1 pr-4 border-r-2 border-[#fbbf24]">
                      <p>١. بِكَ يَا اللهُ (١٠ مرات)</p>
                      <p>٢. بِمُحَمَّدٍ (١٠ مرات)</p>
                      <p>٣. بِعَلِيٍّ (١٠ مرات)</p>
                      <p>٤. بِفَاطِمَةَ (١٠ مرات)</p>
                      <p>٥. بِالْحَسَنِ (١٠ مرات)</p>
                      <p>٦. بِالْحُسَيْنِ (١٠ مرات)</p>
                      <p>٧. بِعَلِيِّ بْنِ الْحُسَيْنِ (١٠ مرات)</p>
                      <p>٨. بِمُحَمَّدِ بْنِ عَلِيٍّ (١٠ مرات)</p>
                      <p>٩. بِجَعْفَرِ بْنِ مُحَمَّدٍ (١٠ مرات)</p>
                      <p>١٠. بِمُوسَى بْنِ جَعْفَرٍ (١٠ مرات)</p>
                      <p>١١. بِعَلِيِّ بْنِ مُوسَى (١٠ مرات)</p>
                      <p>١٢. بِمُحَمَّدِ بْنِ عَلِيٍّ (١٠ مرات)</p>
                      <p>١٣. بِعَلِيِّ بْنِ مُحَمَّدٍ (١٠ مرات)</p>
                      <p>١٤. بِالْحَسَنِ بْنِ عَلِيٍّ (١٠ مرات)</p>
                      <p>١٥. بِالْحُجَّةِ (١٠ مرات)</p>
                    </div>
                    <p className="text-[11px] text-amber-500 font-bold">ثم اطلب حاجتك فإنها تقضى بإذن الله وكرامة أوليائه.</p>
                  </div>
                )}

                {activeQadrSubTab === 'specific' && (
                  <div className="space-y-4 text-xs leading-relaxed">
                    <p className="font-bold text-[#fbbf24] border-b pb-2 mb-2 flex items-center gap-1">
                      <Calendar size={14} />
                      <span>الأعمال المخصوصة لكل ليلة</span>
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-black/10 border-r-2 border-cyan-400">
                        <strong className="text-cyan-400 text-xs block mb-1">ليلة ١٩ (ليلة ضربة أمير المؤمنين ع):</strong>
                        <span>الإكثار من الاستغفار وقول: <span className="italic">"اللَّهُمَّ الْعَنْ قَتَلَةَ أَمِيرِ الْمُؤْمِنِينَ"</span> مئة مرة.</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/10 border-r-2 border-red-400">
                        <strong className="text-red-400 text-xs block mb-1">ليلة ٢١ (ليلة استشهاد الإمام علي ع):</strong>
                        <span>تأكيد المداومة على الأدعية والتوبة والإكثار من الصلاة على محمد وآل محمد وعيادة اليتامى والمظلومين.</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/10 border-r-2 border-amber-400">
                        <strong className="text-amber-500 text-xs block mb-1">ليلة ٢٣ (ليلة القدر المرجحة الكبرى):</strong>
                        <span>قراءة سورتي العنكبوت والروم اللتين قال الإمام الصادق ع فيهما: <span className="italic">"من قرأهما في هذه الليلة كان من أهل الجنة"</span>، وقراءة سورة القدر ١٠٠٠ مرة، ودعاء الفرج "اللهم كن لوليك...".</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 3: General Ramadan Acts */}
          {activeTab === 'acts' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
              key="acts_tab"
            >
              <div className="px-1">
                <h4 className="text-sm font-bold text-[#fbbf24]">مستحبات عموم الشهر الفضيل</h4>
                <p className="text-[11px] text-gray-400">ممارسات يومية لنيل فضائل هذا الشهر العظيم</p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-[24px] border ${isLight ? 'bg-white border-gray-100' : 'bg-[#042d20]/20 border-[#059669]/20'}`}>
                  <h5 className="font-bold text-xs text-[#fbbf24] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                    ختم القرآن الكريم
                  </h5>
                  <p className="text-xs leading-relaxed text-gray-300">
                    يستحب قراءة جزء كامل من القرآن يومياً لتحقيق ختمة كاملة في نهاية الشهر، لورود أن قراءة آية فيه تعادل ختمة قرآن كاملة في باقي الشهور.
                  </p>
                </div>

                <div className={`p-4 rounded-[24px] border ${isLight ? 'bg-white border-gray-100' : 'bg-[#042d20]/20 border-[#059669]/20'}`}>
                  <h5 className="font-bold text-xs text-[#fbbf24] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                    دعاء الافتتاح العظيم
                  </h5>
                  <p className="text-xs leading-relaxed text-gray-300">
                    أحد أهم الأدعية التي يحرص شيعة أهل البيت (عليهم السلام) على قراءتها في كل ليلة من ليالي شهر رمضان المبارك، للتقرب إلى الله تعالى والتمهيد لظهور الإمام المهدي (عجل الله فرجه).
                  </p>
                </div>

                <div className={`p-4 rounded-[24px] border ${isLight ? 'bg-white border-gray-100' : 'bg-[#042d20]/20 border-[#059669]/20'}`}>
                  <h5 className="font-bold text-xs text-[#fbbf24] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                    صلاة ألف ركعة
                  </h5>
                  <p className="text-xs leading-relaxed text-gray-300">
                    يستحب صلاة ألف ركعة في ليالي شهر رمضان زيادة على النوافل اليومية المعتادة، موزعة على طيلة الليالي وبشكل خاص في ليالي القدر الثلاثة.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

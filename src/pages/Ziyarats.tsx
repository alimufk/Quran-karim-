import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// 1️⃣ الرابط المباشر والمضمون للسيرفر لكي يشتغل الصوت تلقائياً بدون تحميل
const BASE_AUDIO_URL = "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio";

export const ziyaratsData = {
  ashura: {
    id: "ashura",
    title: "زيارة عاشوراء",
    subtitle: "زيارة الإمام الحسين (ع) في يوم عاشوراء وطوال العام",
    benefits: "توجب غفران الذنوب، وقضاء الحوائج، وسلامة الدارين، ونيل شفاعة سيد الشهداء عليه السلام.",
    audioUrl: `${BASE_AUDIO_URL}/ashura.mp3`,
    arabicText: `اَلسَّلامُ عَلَيْكَ يا أبا عَبْدِاللهِ، اَالسَّلامُ عَلَيْكَ يَا بْنَ رَسُولِ اللهِ، اَالسَّلامُ عَلَيْكَ يَا بْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنِ سَيِّدِ الْوَصِيِّينَ، اَلسَّلامُ عَلَيْكَ يَا بْنَ فاطِمَةَ سَيِّدَةِ نِساءِ الْعالَمِينَ، اَلسَّلامُ عَلَيْكَ يا ثارَ اللهِ وَابْنُ ثارِهِ وَالْوِتْرَ الْمَوْتُورَ...`
  },
  warith: {
    id: "warith",
    title: "زيارة وارث",
    subtitle: "من الزيارات المشهورة للامام الحسين (ع)",
    benefits: "زيارة عظيمة مروية عن الإمام الصادق (ع) تُبين مقام الإمام الحسين كوارث للأنبياء العظام.",
    audioUrl: `${BASE_AUDIO_URL}/warith.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوح نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُوسى كَلِيمِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ عِيسى رُوحِ اللهِ...`
  },
  aminullah: {
    id: "aminullah",
    title: "زيارة أمين الله",
    subtitle: "زيارة أمير المؤمنين (ع) المقبولة والمشهورة",
    benefits: "تعتبر من أعلى الزيارات شأناً واعتباراً، ويُزار بها في جميع الروائع والمشاهد المقرّبة.",
    audioUrl: `${BASE_AUDIO_URL}/aminullah.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا أَمِينَ اللهِ فِي أَرْضِهِ، وَحُجَّتَهُ عَلَى عِبادِهِ، السَّلامُ عَلَيْكَ يا أَمِيرَ الْمُؤْمِنِينَ، أَشْهَدُ أَنَّكَ جاهَدْتَ فِي اللهِ حَقَّ جِهادِهِ، وَعَمِلْتَ بِكِتابِهِ، وَاتَّبَعْتَ سُنَنَ نَبِيِّهِ صَلَّى اللهُ عَلَيْهِ وَآلِهِ...`
  },
  jamia: {
    id: "jamia",
    title: "الزيارة الجامعة الكبيرة",
    subtitle: "أصح وأكمل زيارات الأئمة الأطهار (ع)",
    benefits: "من أعلى الزيارات سنداً وبلاغةً، تشتمل على بيان مقامات أهل البيت الأخلاقية والكونية الشريفة.",
    audioUrl: `${BASE_AUDIO_URL}/jamia.mp3`,
    arabicText: `السَّلامُ عَلَيْكُمْ يا أَهْلَ بَيْتِ النُّبُوَّةِ، وَمَوْضِعَ الرِّسالَةِ، وَمُخْتَلَفَ الْمَلائِكَةِ، وَمَهْبِطَ الْوَحْيِ، وَمَعْدِنَ الرَّحْمَةِ، وَخُزَّانَ الْعِلْمِ، وَمُنْتَهَى الْحِلْمِ، وَأُصُولَ الْكَرَمِ، وَقادَةَ الأُمَمِ...`
  },
  aleyasin: {
    id: "aleyasin",
    title: "زيارة آل ياسين",
    subtitle: "زيارة صاحب العصر والزمان الحجة المهدي (عج)",
    benefits: "مروية عن الناحية المقدسة، وهي الطريق الأسمى للارتباط وتجديد البيعة للإمام الحجة المنتظر.",
    audioUrl: `${BASE_AUDIO_URL}/aleyasin.mp3`,
    arabicText: `سَلامٌ عَلى آلِ ياسينَ، السَّلامُ عَلَيْكَ يا داعِيَ اللهِ وَرَبّانِيَ آياتِهِ، السَّلامُ عَلَيْكَ يا بابَ اللهِ وَدَيَّانَ دِينِهِ، السَّلامُ عَلَيْكَ يا خَلِيفَةَ اللهِ وَناصِرَ حَقِّهِ، السَّلامُ عَلَيْكَ يا حُجَّةَ اللهِ وَدَلِيلَ إِرادَتِهِ...`
  },
  alnahiya: {
    id: "alnahiya",
    title: "زيارة الناحية المقدسة",
    subtitle: "الزيارة المروية عن الإمام الحجة في ندبة جده الحسين",
    benefits: "تعبّر عن عمق الفجيعة والمواساة، وتفصل مصائب كربلاء بلسان المعصوم الحاضر.",
    audioUrl: `${BASE_AUDIO_URL}/alnahiya.mp3`,
    arabicText: `السَّلامُ عَلى آدَمَ صِفْوَةِ اللهِ مِن خَليقَتِهِ، السَّلامُ عَلى شِيثَ وَلِيِّ اللهِ وَخِيَرَتِهِ، السَّلامُ عَلى إِدْرِيسَ القائِمِ للهِ بِحُجَّتِهِ، السَّلامُ عَلى نُوح المُجابِ في دَعْوَتِهِ...`
  },
  arbaeen: {
    id: "arbaeen",
    title: "زيارة الأربعين",
    subtitle: "زيارة يوم العشرين من صفر للإمام الحسين (ع)",
    benefits: "من علامات المؤمن الخمس المروية عن الإمام الحسن العسكري (ع)، وتجديد لميثاق الولاء.",
    audioUrl: `${BASE_AUDIO_URL}/arbaeen.mp3`,
    arabicText: `اَلسَّلامُ عَلى وَلِيِّ اللهِ وَحَبيبِهِ، اَلسَّلامُ عَلى خَليلِ اللهِ وَنَجيبِهِ، اَلسَّلامُ عَلى صَفِيِّ اللهِ وَابْنِ صَفِيِّهِ، اَلسَّلامُ عَلى الْحُسَيْنِ الْمَظْلُومِ الشَّهيدِ، اَلسَّلامُ على أَسيرِ الْكُرُباتِ وَقَتيلِ الْعَبَراتِ...`
  },
  saturday: {
    id: "saturday",
    title: "زيارة النبي محمد (ص)",
    subtitle: "زيارة رسول الله الأكرم في يوم السبت",
    benefits: "تجديد العهد والولاء لرسول الله الأعظم نبي الرحمة وخاتم المرسلين صلوات الله عليه وآله.",
    audioUrl: `${BASE_AUDIO_URL}/saturday.mp3`,
    arabicText: `أَشْهَدُ أَنْ لا إِلـهَ إِلاَّ اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّكَ عَبْدُهُ وَرَسُولُهُ، وَأَنَّكَ مُحَمَّدُ بْنُ عَبْدِ اللهِ، وَأَنَّكَ قَدْ بَلَّغْتَ رِسالاتِ رَبِّكَ، وَنَصَحْتَ لِأُمَتِكَ، وَجاهَدْتَ فِي سَبِيلِ اللهِ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ...`
  },
  sunday: {
    id: "sunday",
    title: "زيارة أمير المؤمنين والزهراء (ع)",
    subtitle: "زيارة يوم الأحد المخصصة للوصي والبتول",
    benefits: "الارتباط بباب علم رسول الله وأم الأئمة النجباء نيل شفاعتهم الخاصة بيوم الأحد.",
    audioUrl: `${BASE_AUDIO_URL}/sunday.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا أَمِيرَ الْمُؤْمِنِينَ، السَّلامُ عَلَيْكِ يا سَيِّدَةَ نِساءِ الْعالَمِينَ، السَّلامُ عَلَيْكُما يا حُجَّتَيِ اللهِ عَلى عِبادِهِ، أَتَيْتُكُما زائِراً عارِفاً بِحَقِّكُما، مُسْتَجِيراً بِكُما عِنْدَ اللهِ...`
  },
  monday: {
    id: "monday",
    title: "زيارة الحسن والحسين (ع)",
    subtitle: "زيارة سيدي شباب أهل الجنة في يوم الإثنين",
    benefits: "تدرّ الخير والبركة وتحصّن قارئها ببركة ريحانتي رسول الله الأكرم عليهما السلام.",
    audioUrl: `${BASE_AUDIO_URL}/monday.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يَا بْنَ رَسُولِ رَبِّ الْعالَمِينَ، السَّلامُ عَلَيْكَ يَا بْنَ أَمِيرِ الْمُؤْمِنِينَ، السَّلامُ عَلَيْكَ يَا بْنَ فاطِمَةَ الزَّهْراءِ، السَّلامُ عَلَيْكُما يا سَيِّدَيْ شَبَابِ أَهْلِ الْجَنَّةِ...`
  },
  tuesday: {
    id: "tuesday",
    title: "زيارة السجاد والباقر والصادق (ع)",
    subtitle: "زيارة أئمة البقيع في يوم الثلاثاء",
    benefits: "تقوية البصيرة الدينية والارتباط بجهابذة العلم النبوي ومؤسسي الصرح الجعفري.",
    audioUrl: `${BASE_AUDIO_URL}/tuesday.mp3`,
    arabicText: `السَّلامُ عَلَيْكُمْ يا خُزَّانَ عِلْمِ اللهِ، السَّلامُ عَلَيْكُمْ يا تراجِمَةَ وَحْيِ اللهِ، السَّلامُ عَلَيْكُمْ يا أَئِمَّةَ الْهُدى، السَّلامُ عَلَيْكُمْ يا أَعْلامَ التُّقى، أَشْهَدُ أَنَّكُمْ حُجَجُ اللهِ عَلى خَلْقِهِ...`
  },
  wednesday: {
    id: "wednesday",
    title: "زيارة الكاظم والرضا والجواد والهادي (ع)",
    subtitle: "زيارة الحجج الأربعة في يوم الأربعاء",
    benefits: "قضاء الحوائج المستعصية، والأمن من غوائل الزمن ببركة باب الحوائج وغريب طوس والعلويين.",
    audioUrl: `${BASE_AUDIO_URL}/wednesday.mp3`,
    arabicText: `السَّلامُ عَلَيْكُمْ يا أَوْلِياءَ اللهِ، السَّلامُ عَلَيْكُمْ يا حُجَجَ اللهِ، السَّلامُ عَلَيْكُمْ يا نُورَ اللهِ فِي ظُلُماتِ الأَرْضِ، السَّلامُ عَلَيْكُمْ صَلَواتُ اللهِ عَلَيْكُمْ وَعَلى أَهْلِ بَيْتِكُمُ الطَّاهِرِينَ...`
  },
  thursday: {
    id: "thursday",
    title: "زيارة الحسن العسكري (ع)",
    subtitle: "زيارة الإمام العسكري في يوم الخميس",
    benefits: "التمهيد والتهيئة النفسية لولاية ابنه الحجة القائم ونيل النورانية القلبية المستمرة.",
    audioUrl: `${BASE_AUDIO_URL}/thursday.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا وَلِيَّ اللهِ، السَّلامُ عَلَيْكَ يا حُجَّةَ اللهِ وَخالِصَتَهُ، السَّلامُ عَلَيْكَ يا إِمامَ الْمُؤْمِنِينَ، وَوارِثَ الْمُرْسَلِينَ، وَحُجَّةَ رَبِّ الْعالَمِينَ...`
  },
  friday: {
    id: "friday",
    title: "زيارة الحجة المهدي (عج)",
    subtitle: "زيارة صاحب الأمر والزمان في يومه المبارك (الجمعة)",
    benefits: "أعظم طقوس الاستغاثة والندبة وتوسيع دائرة الفرج والارتباط بقطب عالم الإمكان.",
    audioUrl: `${BASE_AUDIO_URL}/friday.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا حُجَّةَ اللهِ فِي أَرْضِهِ، السَّلامُ عَلَيْكَ يا عَيْنَ اللهِ فِي خَلْقِهِ، السَّلامُ عَلَيْكَ يا نُورَ اللهِ الَّذِي يَهْتَدِي بِهِ الْمُهْتَدُونَ، وَيُفَرَّجُ بِهِ عَنِ الْمُؤْمِنِينَ...`
  }
};

const generalZiyarats = [
  { id: 'ashura', name: 'زيارة عاشوراء' },
  { id: 'warith', name: 'زيارة وارث' },
  { id: 'aminullah', name: 'زيارة أمين الله' },
  { id: 'jamia', name: 'الزيارة الجامعة الكبيرة' },
  { id: 'aleyasin', name: 'زيارة آل ياسين' },
  { id: 'nahiya', name: 'زيارة الناحية المقدسة' },
  { id: 'arbaeen', name: 'زيارة الأربعين' },
];

const weeklyZiyarats = [
  { id: 'saturday', name: 'يوم السبت', title: 'زيارة النبي محمد (ص)', color: 'from-amber-600 to-amber-900' },
  { id: 'sunday', name: 'يوم الأحد', title: 'زيارة أمير المؤمنين والزهراء (ع)', color: 'from-blue-600 to-blue-900' },
  { id: 'monday', name: 'يوم الإثنين', title: 'زيارة الحسن والحسين (ع)', color: 'from-green-600 to-green-900' },
  { id: 'tuesday', name: 'يوم الثلاثاء', title: 'زيارة السجاد والباقر والصادق (ع)', color: 'from-purple-600 to-purple-900' },
  { id: 'wednesday', name: 'يوم الأربعاء', title: 'زيارة الكاظم والرضا والجواد والهادي (ع)', color: 'from-teal-600 to-teal-900' },
  { id: 'thursday', name: 'يوم الخميس', title: 'زيارة الحسن العسكري (ع)', color: 'from-rose-600 to-rose-900' },
  { id: 'friday', name: 'يوم الجمعة', title: 'زيارة الحجة المهدي (عج)', color: 'from-indigo-600 to-indigo-900' },
];

export function Ziyarats() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'weekly'>('general');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 min-h-screen pb-24 bg-[#022c22] text-[#f0f9ff]"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#064e3b]/40 transition active:scale-95"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight">الزيارات</h1>
        <div className="w-[46px]" />
      </header>

      {/* Tabs */}
      <div className="flex bg-[#064e3b]/50 p-2 rounded-2xl border border-[#059669]/30 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#fbbf24] text-[#022c22] shadow-lg'
              : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <BookOpen size={18} />
          الزيارات العامة
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weekly'
              ? 'bg-[#fbbf24] text-[#022c22] shadow-lg'
              : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <Calendar size={18} />
          أيام الأسبوع
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.div
            key="general"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            {generalZiyarats.map((ziyarat) => (
              <Link
                to={`/ziyarat/${ziyarat.id}`}
                key={ziyarat.id}
                className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-2xl flex items-center justify-between hover:bg-[#059669]/30 transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#fbbf24]/10 rounded-full text-[#fbbf24] group-hover:bg-[#fbbf24] group-hover:text-[#022c22] transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#f0f9ff] text-lg">{ziyarat.name}</h3>
                  </div>
                </div>
                <ChevronLeft className="text-[#059669] group-hover:text-[#fbbf24] transition-colors" />
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3"
          >
            {weeklyZiyarats.map((ziyarat) => (
              <Link
                to={`/ziyarat/${ziyarat.id}`}
                key={ziyarat.id}
                className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-2xl flex items-center justify-between hover:bg-[#059669]/30 transition-all group relative overflow-hidden active:scale-[0.99]"
              >
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${ziyarat.color}`} />
                <div className="flex items-center gap-4 pr-3">
                  <div className="p-3 bg-[#059669]/20 rounded-2xl text-[#fbbf24]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-[#059669] mb-1 font-bold">{ziyarat.name}</p>
                    <h3 className="font-bold text-[#f0f9ff]">{ziyarat.title}</h3>
                  </div>
                </div>
                <ChevronLeft className="text-[#059669] group-hover:text-[#fbbf24] transition-colors" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

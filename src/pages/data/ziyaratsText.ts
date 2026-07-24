import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, Download, CheckCircle2, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// -------------------------------------------------------------
// 1. قاعدة البيانات الخاصة بالنصوص والصوتيات
// -------------------------------------------------------------
export const BASE_AUDIO_URL = "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio";

export const ziyaratsData = {
  ashura: {
    id: "ashura",
    title: "زيارة عاشوراء",
    subtitle: "زيارة الإمام الحسين (ع) في يوم عاشوراء وطوال العام",
    benefits: "توجب غفران الذنوب، وقضاء الحوائج، وسلامة الدارين، ونيل شفاعة سيد الشهداء عليه السلام.",
    audioUrl: `${BASE_AUDIO_URL}/ashura.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يا أَبا عَبْدِ اللهِ، السَّلامُ عَلَيْكَ يابْنَ رَسُولِ الله...`
  },
  warith: {
    id: "warith",
    title: "زيارة وارث",
    subtitle: "من الزيارات المشهورة للامام الحسين (ع)",
    benefits: "زيارة عظيمة مروية عن الإمام الصادق (ع) تُبين مقام الإمام الحسين كوارث للأنبياء العظام.",
    audioUrl: `${BASE_AUDIO_URL}/warith.mp3`,
    arabicText: `السَّلامُ عـَلَيـْكَ يا وارِثَ آدَمَ صـَفـُوةِ اللهِ...`
  },
  aminullah: {
    id: "aminullah",
    title: "زيارة أمين الله",
    subtitle: "زيارة أمير المؤمنين (ع) المقبولة والمشهورة",
    benefits: "تعتبر من أعلى الزيارات شأناً واعتباراً، ويُزار بها في جميع الروائع والمشاهد المقرّبة.",
    audioUrl: `${BASE_AUDIO_URL}/aminullah.mp3`,
    arabicText: `السَّلامُ عَلَيكَ يا أمِينَ اللهِ في أرضِهِ وَحُجَّتَهُ عَلى عِبادِهِ...`
  },
  jamia: {
    id: "jamia",
    title: "الزيارة الجامعة الكبيرة",
    subtitle: "أصح وأكمل زيارات الأئمة الأطهار (ع)",
    benefits: "من أعلى الزيارات سنداً وبلاغةً، تشتمل على بيان مقامات أهل البيت الأخلاقية والكونية الشريفة.",
    audioUrl: `${BASE_AUDIO_URL}/jamia.mp3`,
    arabicText: `السَّلامُ عَلَيكُمْ يا أهلَ بَيتِ النُّبُوَّةِ وَمَوضِعَ الرِّسالَةِ...`
  },
  aleyasin: {
    id: "aleyasin",
    title: "زيارة آل ياسين",
    subtitle: "زيارة صاحب العصر والزمان الحجة المهدي (عج)",
    benefits: "مروية عن الناحية المقدسة، وهي الطريق الأسمى للارتباط وتجديد البيعة للإمام الحجة المنتظر.",
    audioUrl: `${BASE_AUDIO_URL}/aleyasin.mp3`,
    arabicText: `سَلامٌ عَلى آلِ يس، السَّلامُ عَلَيكَ يا داعِيَ اللهِ وَرَبَّانِيَّ آياتِهِ...`
  },
  nahiya: {
    id: "nahiya",
    title: "زيارة الناحية المقدسة",
    subtitle: "الزيارة المروية عن الإمام الحجة في ندبة جده الحسين",
    benefits: "تعبّر عن عمق الفجيعة والمواساة، وتفصل مصائب كربلاء بلسان المعصوم الحاضر.",
    audioUrl: `${BASE_AUDIO_URL}/nahiya.mp3`,
    arabicText: `بسم الله الرحمن الرحيم السَّلامُ عَلى آدمَ صَفْوةِ اللهِ مِن خَليقَتِهِ...`
  },
  arbaeen: {
    id: "arbaeen",
    title: "زيارة الأربعين",
    subtitle: "زيارة يوم العشرين من صفر للإمام الحسين (ع)",
    benefits: "من علامات المؤمن الخمس المروية عن الإمام الحسن العسكري (ع)، وتجديد لميثاق الولاء.",
    audioUrl: `${BASE_AUDIO_URL}/arbaeen.mp3`,
    arabicText: `السَّلامُ عَلى وَلِيِّ اللهِ وَحَبيبِهِ، السَّلامُ عَلى خَليلِ اللهِ وَنَجيبِهِ...`
  },
  saturday: {
    id: "saturday",
    title: "زيارة النبي محمد (ص)",
    subtitle: "زيارة رسول الله الأكرم في يوم السبت",
    benefits: "تجديد العهد والولاء لرسول الله الأعظم نبي الرحمة وخاتم المرسلين صلوات الله عليه وآله.",
    audioUrl: `${BASE_AUDIO_URL}/saturday.mp3`,
    arabicText: `أَشهَدُ أَن لَّا إِلَهَ إِلَّا اللهُ وَحْدَهُ لاشَرِيكَ لَهُ...`
  },
  sunday: {
    id: "sunday",
    title: "زيارة أمير المؤمنين والزهراء (ع)",
    subtitle: "زيارة يوم الأحد المخصصة للوصي والبتول",
    benefits: "الارتباط بباب علم رسول الله وأم الأئمة النجباء نيل شفاعتهم الخاصة بيوم الأحد.",
    audioUrl: `${BASE_AUDIO_URL}/sunday.mp3`,
    arabicText: `اَلسَّلامُ عَلَى الشَّجَرَةِ النَّبَوِيَّةِ ، وَالدَّوْحَةِ الْهَاشِمِيَّةِ...`
  },
  monday: {
    id: "monday",
    title: "زيارة الحسن والحسين (ع)",
    subtitle: "زيارة سيدي شباب أهل الجنة في يوم الإثنين",
    benefits: "تدرّ الخير والبركة وتحصّن قارئها ببركة ريحانتي رسول الله الأكرم عليهما السلام.",
    audioUrl: `${BASE_AUDIO_URL}/monday.mp3`,
    arabicText: `السَّلامُ عَلَيْكَ يَا بْنَ رَسُولِ رَبِّ الْعَالَمِينَ...`
  },
  tuesday: {
    id: "tuesday",
    title: "زيارة السجاد والباقر والصادق (ع)",
    subtitle: "زيارة أئمة البقيع في يوم الثلاثاء",
    benefits: "تقوية البصيرة الدينية والارتباط بجهابذة العلم النبوي ومؤسسي الصرح الجعفري.",
    audioUrl: `${BASE_AUDIO_URL}/tuesday.mp3`,
    arabicText: `اَلسَّلامُ عَلَيْكُمْ يَا خُزَّانَ عِلْمِ اللهِ...`
  },
  wednesday: {
    id: "wednesday",
    title: "زيارة الكاظم والرضا والجواد والهادي (ع)",
    subtitle: "زيارة الحجج الأربعة في يوم الأربعاء",
    benefits: "قضاء الحوائج المستعصية، والأمن من غوائل الزمن ببركة باب الحوائج وغريب طوس والعلويين.",
    audioUrl: `${BASE_AUDIO_URL}/wednesday.mp3`,
    arabicText: `اَلسَّلامُ عَلَيْكُم يَا أوْلِيَاء اللهِ...`
  },
  thursday: {
    id: "thursday",
    title: "زيارة الحسن العسكري (ع)",
    subtitle: "زيارة الإمام العسكري في يوم الخميس",
    benefits: "التمهيد والتهيئة النفسية لولاية ابنه الحجة القائم ونيل النورانية القلبية المستمرة.",
    audioUrl: `${BASE_AUDIO_URL}/thursday.mp3`,
    arabicText: `اَلسَّلامُ عَلَيْكَ يَا وَلِيَّ اللهِ...`
  },
  friday: {
    id: "friday",
    title: "زيارة الحجة المهدي (عج)",
    subtitle: "زيارة صاحب الأمر والزمان في يومه المبارك (الجمعة)",
    benefits: "أعظم طقوس الاستغاثة والندبة وتوسيع دائرة الفرج والارتباط بقطب عالم الإمكان.",
    audioUrl: `${BASE_AUDIO_URL}/friday.mp3`,
    arabicText: `اَلسَّلامُ عَلَيْكَ يَا حُجَّةَ اللهِ فِي أَرْضِهِ...`
  }
};

// -------------------------------------------------------------
// 2. محرك تخزين صوتيات أوفلاين (IndexedDB)
// -------------------------------------------------------------
const DB_NAME = 'ShiaZiyaratsAudioDB';
const STORE_NAME = 'ziyarat_files';

export const openAudioDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveAudioBlob = async (id: string, blob: Blob) => {
  const db = await openAudioDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getAudioBlob = async (id: string): Promise<Blob | null> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// -------------------------------------------------------------
// 3. قوائم العرض
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 4. المكون الرئيسي
// -------------------------------------------------------------
export default function Ziyarats() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'weekly'>('general');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const checkDownloaded = async () => {
      const keys = [...generalZiyarats, ...weeklyZiyarats].map(z => z.id);
      const downloaded: string[] = [];
      for (const id of keys) {
        const saved = await getAudioBlob(id);
        if (saved) downloaded.push(id);
      }
      setDownloadedIds(downloaded);
    };
    checkDownloaded();
  }, []);

  const handleDownloadOffline = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloadedIds.includes(id)) {
      alert(`🎉 "${name}" محفوظة محلياً وتعمل بدون إنترنت!`);
      return;
    }

    const dataObj = (ziyaratsData as any)[id];
    if (!dataObj || !dataObj.audioUrl) return;

    setDownloadingId(id);
    try {
      const response = await fetch(encodeURI(dataObj.audioUrl));
      if (!response.ok) throw new Error("فشل الاتصال بالخادم");
      const blob = await response.blob();
      await saveAudioBlob(id, blob);
      setDownloadedIds(prev => [...prev, id]);
      alert(`✅ تم تحميل صوت "${name}" أوفلاين بنجاح!`);
    } catch (err) {
      console.error("خطأ أثناء التحميل:", err);
      alert("❌ تعذر التحميل، تأكد من الاتصال بالإنترنت أولاً.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 space-y-6 min-h-screen pb-24 bg-[#022c22] text-[#f0f9ff]" 
      dir="rtl"
    >
      {/* Header */}
      <header className="flex justify-between items-center z-10 w-full mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#064e3b]/40 transition active:scale-95"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#fbbf24] tracking-tight text-center">الزيارات المباركة</h1>
          <p className="text-[10px] text-[#059669] text-center flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck size={12} /> يدعم الاستماع والتخزين أوفلاين
          </p>
        </div>
        <div className="w-[46px]" />
      </header>

      {/* Tabs */}
      <div className="flex bg-[#064e3b]/50 p-2 rounded-2xl border border-[#059669]/30 gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('general')} 
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'general' ? 'bg-[#fbbf24] text-[#022c22] shadow-lg' : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <BookOpen size={18} /> الزيارات العامة
        </button>
        <button 
          onClick={() => setActiveTab('weekly')} 
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weekly' ? 'bg-[#fbbf24] text-[#022c22] shadow-lg' : 'text-[#059669] hover:bg-[#059669]/20'
          }`}
        >
          <Calendar size={18} /> زيارات الأيام
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.div 
            key="general"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {generalZiyarats.map((item) => {
              const details = (ziyaratsData as any)[item.id];
              const isDownloaded = downloadedIds.includes(item.id);
              const isDownloading = downloadingId === item.id;

              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/ziyarat/${item.id}`)}
                  className="p-4 bg-[#064e3b]/40 rounded-2xl border border-[#059669]/30 hover:border-[#fbbf24]/50 transition flex justify-between items-center cursor-pointer group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-[#f0f9ff] group-hover:text-[#fbbf24] transition">
                      {details?.title || item.name}
                    </h3>
                    <p className="text-xs text-[#059669] line-clamp-1">{details?.subtitle}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDownloadOffline(e, item.id, item.name)}
                      className={`p-2.5 rounded-xl border transition ${
                        isDownloaded 
                          ? 'bg-[#059669]/20 text-[#059669] border-[#059669]/40' 
                          : 'bg-[#064e3b] text-[#fbbf24] border-[#059669]/30 hover:bg-[#059669]/30'
                      }`}
                      title={isDownloaded ? "مُحمل أوفلاين" : "تحميل للأوفلاين"}
                    >
                      {isDownloading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : isDownloaded ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Download size={18} />
                      )}
                    </button>

                    <div className="p-2 text-[#059669] group-hover:text-[#fbbf24] transition">
                      <ChevronLeft size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="weekly"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-3"
          >
            {weeklyZiyarats.map((item) => {
              const isDownloaded = downloadedIds.includes(item.id);
              const isDownloading = downloadingId === item.id;

              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/ziyarat/${item.id}`)}
                  className={`p-4 rounded-2xl border border-[#059669]/30 bg-gradient-to-r ${item.color} hover:opacity-95 transition flex justify-between items-center cursor-pointer shadow-md`}
                >
                  <div>
                    <span className="text-[10px] font-bold bg-[#022c22]/40 px-2.5 py-1 rounded-full text-[#fbbf24] border border-[#fbbf24]/20">
                      {item.name}
                    </span>
                    <h3 className="font-bold text-base text-[#f0f9ff] mt-2">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDownloadOffline(e, item.id, item.title)}
                      className={`p-2.5 rounded-xl border bg-[#022c22]/60 transition ${
                        isDownloaded 
                          ? 'text-[#059669] border-[#059669]/40' 
                          : 'text-[#fbbf24] border-[#059669]/30 hover:bg-[#022c22]'
                      }`}
                    >
                      {isDownloading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : isDownloaded ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Download size={18} />
                      )}
                    </button>

                    <ChevronLeft size={20} className="text-[#f0f9ff]/70" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

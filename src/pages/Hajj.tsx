import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// تعريف بنية المنسك أو الدرس
interface ManasikItem {
  id: string;
  title: string;
  subtitle?: string;
  imageType: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front';
  audioDuration: number; // بالثواني محاكاة للمشغل
  content: string[];
}

export function HajjPortal() {
  const navigate = useNavigate();
  
  // التحكم في الشاشة الحالية: 'portal' (البوابة الرئيسية) أو 'player' (المشغل) أو 'tawaf' (عداد الطواف)
  const [view, setView] = useState<'portal' | 'player' | 'tawaf'>('portal');
  
  // المنسك المحدد حالياً في المشغل
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35); // نسبة تقدم الصوت الوهمية
  const [tawafCount, setTawafCount] = useState(0); // عداد الأشواط

  // محاكاة حركة مشغل الصوت عند التشغيل
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // البيانات المطابقة تماماً للنصوص الموجودة في صورك
  const manasikList: ManasikItem[] = [
    {
      id: '1',
      title: 'مقدمة عن الحج',
      imageType: 'kaaba-man',
      audioDuration: 180,
      content: [
        "الحج: هو أحد أركان الدين ومن أوكد فرائض المسلمين قال الله تعالى (وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا).",
        "فالحج فريضة الإسلام وركن الإيمان ومن أعظم العبادات والقربات ..",
        "وإن ترك الحج لاسيما ما عرض به تاركه من لزوم كفره إعراضه عنه، بقوله عز وجل [..وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ عَنِ الْعَالَمِينَ]",
        "وعن الإمام الصادق عليه السلام قال: (من مات ولم يحج حجة الإسلام لا يمنعه من ذلك حاجة...)"
      ]
    },
    {
      id: '2',
      title: 'الإحرام : الواجب الأول',
      subtitle: 'أحكام الإحرام',
      imageType: 'kaaba-man',
      audioDuration: 240,
      content: [
        "الإحرام: نيته أن أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى. ويقول:",
        "\"لبيك اللهم لبيك، لبيك لا شريك لك لبيك\"",
        "ويستحب إضافة:",
        "\"إن الحمد والنعمة لك والملك، لا شريك لك\"",
        "ويكون ميقات حج التمتع مكة المكرمة."
      ]
    },
    {
      id: '3',
      title: 'أحكام الإحرام',
      subtitle: 'محرمات الإحرام',
      imageType: 'kaaba-front',
      audioDuration: 300,
      content: [
        "فإذ لبى انعقد الإحرام ووجب عليه ترك مجموعة من الأمور وهي خمسة وعشرون كما يلي:",
        "( ١ ) الصيد البري.",
        "( ٢ ) مجامعة النساء.",
        "( ٣ ) تقبيل النساء.",
        "( ٤ ) لمس النساء.",
        "( ٥ ) النظر إلى المرأة وملاعبتها.",
        "( ٦ ) الاستمناء.",
        "( ٧ ) عقد النكاح."
      ]
    },
    {
      id: '4',
      title: 'مناسك عمرة التمتع',
      imageType: 'kaaba-pray',
      audioDuration: 420,
      content: [
        "والمقصود بالإحرام: هو ارتداء ثوبي الإحرام وهما الرداء والإزار بعد التجرد عما يجب المحرم اجتنابه.",
        "وهو أول عمل في الحج والعمرة ويجب أن يكون مصحوباً بالنية ومن ثم التلبية ويعد من أركان الحج والعمرة ويسمى من يقوم بهذا العمل مُحرِماً."
      ]
    }
  ];

  // دالة لرسم خلفيات وصور توضيحية تشبه الرسوم الكرتونية في الصور المرسلة
  const renderIllustration = (type: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front') => {
    if (type === 'kaaba-pray' || view === 'tawaf') {
      return (
        <div className="w-full h-64 bg-gradient-to-b from-[#5097cf] to-[#deb887] relative rounded-2xl overflow-hidden shadow-inner flex items-end justify-center">
          <div className="absolute top-6 w-24 h-24 bg-yellow-100 rounded-full blur-sm opacity-80" />
          {/* مجسم الكعبة المشرفة */}
          <div className="w-44 h-40 bg-[#1e1b18] border-t-8 border-yellow-600 relative z-10 rounded-t-md shadow-2xl flex flex-col justify-between p-2">
            <div className="w-full h-3 border-y border-yellow-500/50 flex justify-around">
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span>
            </div>
            <div className="w-full h-8 bg-white/20 backdrop-blur-xs rounded-xs border-dashed border border-white/40" />
          </div>
          {/* حجاج من الظهر */}
          <div className="absolute bottom-0 inset-x-0 flex justify-between px-4 z-20">
            <div className="w-12 h-16 bg-white rounded-t-full shadow-md transform translate-y-4"></div>
            <div className="w-16 h-20 bg-white rounded-t-full shadow-lg border-x border-gray-200 flex items-center justify-center">
              <div className="w-6 h-6 bg-[#deb887] rounded-full -translate-y-6"></div>
            </div>
            <div className="w-12 h-16 bg-white rounded-t-full shadow-md transform translate-y-4"></div>
          </div>
        </div>
      );
    }

    // صورة الحاج الواقف بجانب الكعبة
    return (
      <div className="w-full h-64 bg-gradient-to-b from-[#aed5f5] to-[#e6cbb3] relative rounded-2xl overflow-hidden shadow-inner flex items-end justify-around px-4">
        <div className="w-32 h-36 bg-[#24211e] border-t-4 border-yellow-600 rounded-t-xs relative">
          <div className="w-full h-6 bg-white/10 mt-12 border-y border-white/20"></div>
        </div>
        {/* رسمة الحاج محاكاة للصورة */}
        <div className="w-20 h-44 bg-white rounded-t-3xl relative shadow-lg border border-gray-100 flex flex-col items-center">
          <div className="w-8 h-8 bg-[#cc9b7a] rounded-full absolute -top-9 border border-gray-200">
            <div className="w-full h-3 bg-stone-700 rounded-t-full"></div>
          </div>
          <div className="w-5 h-7 bg-emerald-700 rounded-xs mt-4 shadow-xs flex items-center justify-center text-[8px] text-white font-bold">كتاب</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-white flex flex-col justify-between font-sans">
      
      <AnimatePresence mode="wait">
        
        {/* ================= الواجهة الأولى: بوابة الحج والعمرة الرئيسية ================= */}
        {view === 'portal' && (
          <motion.div 
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto"
          >
            {/* الهيدر العلوي الأخضر */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                  <ArrowRight size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-black text-[#ffcc29]">بوابة الحج والعمرة</h1>
                  <p className="text-xs text-emerald-400">دليلك الشامل لأداء المناسك خطوة بخطوة</p>
                </div>
              </div>
            </div>

            {/* بطاقة الآية القرآنية الكريمة */}
            <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-emerald-500/30 p-5 rounded-2xl text-center space-y-3 shadow-md">
              <Compass className="mx-auto text-[#ffcc29]" size={32} />
              <h2 className="text-lg font-bold tracking-wide text-yellow-100">"وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ"</h2>
              <p className="text-xs text-emerald-300">تقبل الله منا ومنكم صالح الأعمال</p>
            </div>

            {/* قسم صفة الحج والمناسك */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#ffcc29] flex items-center gap-1">
                <span>✦</span> صفة الحج والمناسك الدروس:
              </h3>

              {/* قائمة الدروس المأخوذة من صور المشغل */}
              <div className="space-y-2">
                {manasikList.map((item, index) => (
                  <button 
                    key={item.id}
                    onClick={() => { setSelectedItem(index); setView('player'); }}
                    className="w-full p-4 bg-[#064e3b]/60 border border-emerald-800/80 rounded-xl flex items-center justify-between hover:bg-[#064e3b] transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ffcc29]/10 text-[#ffcc29] rounded-lg flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <p className="text-xs text-gray-300 mt-0.5">{item.subtitle || "دليل صوتي ومكتوب"}</p>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-[#ffcc29]" />
                  </button>
                ))}

                {/* خيار عداد الطواف الإضافي الموجود بالصورة الأخيرة */}
                <button 
                  onClick={() => setView('tawaf')}
                  className="w-full p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between hover:bg-amber-500/20 transition-all text-right"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center font-bold text-xs">
                      🔄
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-300">عداد الأشواط والطواف</h4>
                      <p className="text-xs text-amber-200/70 mt-0.5">مساعد ذكي لحساب جولات الطواف السبعة</p>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-amber-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= الواجهة الثانية: مشغل مناسك الحج (الخلفية البيج) ================= */}
        {view === 'player' && (
          <motion.div 
            key="player"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 bg-[#f4ebd0] text-stone-900 flex flex-col justify-between"
          >
            {/* هيدر المنسك العلوي المنسدل */}
            <header className="p-4 flex items-center justify-between border-b border-stone-300/40 bg-[#ebdcb9]">
              <button onClick={() => setView('portal')} className="p-1 text-stone-700">
                <ChevronRight size={24} />
              </button>
              <div className="flex items-center gap-1 cursor-pointer font-bold text-stone-800">
                <span>{manasikList[selectedItem].title}</span>
                <ChevronDown size={16} />
              </div>
              <div className="w-6" /> {/* موازن بصري */}
            </header>

            {/* مساحة عرض الصورة والصوت المتطور */}
            <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto">
              
              {/* الرسوم التوضيحية للكعبة المشرفة */}
              {renderIllustration(manasikList[selectedItem].imageType)}

              {/* مشغل الصوت والمسار المنسدل الذكي (مطابق تماماً لشريط مشغل الصور) */}
              <div className="bg-[#ebdcb9] p-4 rounded-2xl flex items-center gap-4 shadow-xs">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-emerald-800 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <div className="flex-1 relative pt-1">
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-700 rounded-full transition-all duration-300" 
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  {/* الدائرة الخضراء المنزلقة بنهاية المسار */}
                  <div 
                    className="w-4 h-4 bg-emerald-800 rounded-full absolute top-0 -mt-0.5 shadow-sm border-2 border-white transition-all duration-300"
                    style={{ right: `${100 - audioProgress}%` }}
                  />
                </div>
              </div>

              {/* نصوص الأحكام الفقهية المكتوبة بخط عربي منسق */}
              <div className="bg-white/40 p-4 rounded-xl border border-stone-300/30 text-right space-y-3 font-medium leading-relaxed text-stone-800">
                {manasikList[selectedItem].content.map((paragraph, pIdx) => (
                  <p key={pIdx} className={paragraph.startsWith('"') ? "text-emerald-900 font-bold bg-emerald-50/50 p-2 rounded-lg border-r-4 border-emerald-600" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>

            </div>

            {/* أزرار التنقل السفلية بين الواجبات */}
            <footer className="p-4 bg-[#ebdcb9]/60 border-t border-stone-300/40 flex justify-between items-center">
              <button 
                disabled={selectedItem === 0}
                onClick={() => { setSelectedItem(prev => prev - 1); setAudioProgress(0); setIsPlaying(false); }}
                className="px-4 py-2 bg-white/80 rounded-xl text-stone-700 font-bold text-xs disabled:opacity-40 flex items-center gap-1 shadow-xs"
              >
                <ChevronRight size={16} /> السابق
              </button>
              <span className="text-xs font-bold text-stone-600">
                {selectedItem + 1} من {manasikList.length}
              </span>
              <button 
                disabled={selectedItem === manasikList.length - 1}
                onClick={() => { setSelectedItem(prev => prev + 1); setAudioProgress(0); setIsPlaying(false); }}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold text-xs disabled:opacity-40 flex items-center gap-1 shadow-md"
              >
                التالي <ChevronLeft size={16} />
              </button>
            </footer>
          </motion.div>
        )}

        {/* ================= الواجهة الثالثة: شاشة عداد الطواف الذكي ================= */}
        {view === 'tawaf' && (
          <motion.div 
            key="tawaf"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 bg-[#ebdcb9] text-stone-900 flex flex-col justify-between p-4"
          >
            <header className="flex items-center justify-between pb-2">
              <button onClick={() => setView('portal')} className="p-2 bg-stone-200/60 rounded-full text-stone-800">
                <ArrowRight size={20} />
              </button>
              <h3 className="font-black text-stone-800">شاشة عداد الطواف</h3>
              <button onClick={() => setTawafCount(0)} className="p-2 bg-stone-200/60 rounded-full text-stone-800" title="إعادة تعيين">
                <RefreshCw size={16} />
              </button>
            </header>

            {/* رسمة الكعبة الكبيرة المخصصة لشاشة الطواف المطابقة للصورة الأولى */}
            <div className="my-auto space-y-6 text-center flex flex-col items-center">
              {renderIllustration('kaaba-pray')}

              <div className="space-y-1">
                <h2 className="text-3xl font-black text-stone-800">عداد الطواف</h2>
                <p className="text-sm text-stone-600 font-medium px-6">إضغط على الزر عند إكماللك لكل جولة طواف حول الكعبة المشرفة</p>
              </div>

              {/* حلقة عرض الأشواط المكتملة */}
              <div className="w-32 h-32 rounded-full bg-white border-4 border-emerald-700 flex flex-col items-center justify-center shadow-md">
                <span className="text-4xl font-black text-emerald-800">{tawafCount}</span>
                <span className="text-xs font-bold text-stone-500">من ٧ أشواط</span>
              </div>
            </div>

            {/* زر الضغط الرئيسي لإضافة شوط (مطابق للصورة الأولى تماماً) */}
            <button 
              onClick={() => {
                if (tawafCount < 7) {
                  setTawafCount(prev => prev + 1);
                } else {
                  alert("الحمد لله، لقد أتممت الأشواط السبعة الكاملة لطوافك!");
                  setTawafCount(0);
                }
              }}
              className="w-full py-4 bg-[#1e1b18] text-white font-black text-lg rounded-2xl shadow-lg active:scale-[0.99] transition-transform"
            >
              {tawafCount === 0 ? "إبداء الطواف" : tawafCount === 7 ? "إتمام وإعادة تعيين" : `تسجيل الشوط رقم (${tawafCount + 1})`}
            </button>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

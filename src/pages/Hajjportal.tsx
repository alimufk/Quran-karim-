import { useState, useEffect, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, RefreshCw, BookOpen, Layers, Info, AlertCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

interface ManasikItem { 
  id: string; 
  title: string; 
  subtitle?: string; 
  imageType: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front'; 
  audioUrl: string; 
  content: string[]; 
} 

export function HajjPortal() { 
  const navigate = useNavigate(); 
  
  const [view, setView] = useState<'portal' | 'player' | 'tawaf'>('portal'); 
  const [currentSection, setCurrentSection] = useState<'intro' | 'umrah' | 'hajj'>('intro');
  const [selectedItem, setSelectedItem] = useState<number>(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); 
  const [tawafCount, setTawafCount] = useState(0); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // المسارات تشير الآن إلى مجلد public مباشرة دون أي مجلدات فرعية
  const introList: ManasikItem[] = [
    {
      id: 'i1',
      title: 'مقدمة عن الحج وفضله',
      subtitle: 'أهمية وفريضة الحج في الإسلام',
      imageType: 'kaaba-man',
      audioUrl: '/intro-hajj.mp3', // مباشرة من public
      content: [
        "الحج: هو أحد أركان الدين ومن أوكد فرائض المسلمين قال الله تعالى (وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا).",
        "فالحج فريضة الإسلام وركن الإيمان ومن أعظم العبادات والقربات ..",
        "وإن ترك الحج لاسيما ما عرض به تاركه من لزوم كفره إعراضه عنه، بقوله عز وجل [..وَمَن كَفَرَ فَإِنَّ اللَّهَ غَنِيٌّ عَنِ الْعَالَمِينَ]",
        "وعن الإمام الصادق عليه السلام قال: (من مات ولم يحج حجة الإسلام لا يمنعه من ذلك حاجة...)"
      ]
    },
    {
      id: 'i2',
      title: 'مقدمة عن أحكام الإحرام',
      subtitle: 'النية، التلبية، ومحرمات الإحرام',
      imageType: 'kaaba-front',
      audioUrl: '/intro-ihram.mp3', // مباشرة من public
      content: [
        "الإحرام: نيته أن أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى. ويقول: \"لبيك اللهم لبيك، لبيك لا شريك لك لبيك\".",
        "ويستحب إضافة: \"إن الحمد والنعمة لك والملك، لا شريك لك\". ويكون ميقات حج التمتع مكة المكرمة.",
        "فإذا لبى انعقد الإحرام ووجب عليه ترك مجموعة من الأمور وهي خمسة وعشرون كما يلي:",
        "( ١ ) الص الصيد البري. ( ٢ ) مجامعة النساء. ( ٤ ) لمس النساء. ( ٥ ) النظر إلى المرأة وملاعبتها. ( ٦ ) الاستمناء. ( ٧ ) عقد النكاح."
      ]
    }
  ];

  const umrahList: ManasikItem[] = [
    { id: 'u1', title: '1. الإحرام من الميقات', subtitle: 'أولى خطوات عمرة التمتع', imageType: 'kaaba-man', audioUrl: '/umrah-01.mp3', content: ["الإحرام هو نية الدخول في النسك مقروناً بعمل من أعماله كالتلبية أو الإشعار.", "الواجب فيه: النية، ولبس ثوبي الإحرام (للرجال)، والتلبية بصوت مسموع."] },
    { id: 'u2', title: '2. الطواف حول الكعبة', subtitle: 'سبعة أشواط بالبيت العتيق', imageType: 'kaaba-pray', audioUrl: '/umrah-02.mp3', content: ["الطواف هو الدوران حول الكعبة المشرفة سبعة أشواط متتالية بدءاً من الحجر الأسود وانتهاءً به."] },
    { id: 'u3', title: '3. صلاة ركعتي الطواف', subtitle: 'خلف مقام إبراهيم عليه السلام', imageType: 'kaaba-front', audioUrl: '/umrah-03.mp3', content: ["بعد الفراغ من الطواف مباشرة، تجب صلاة ركعتين كصلاة الصبح خلف مقام إبراهيم."] },
    { id: 'u4', title: '4. السعي بين الصفا والمروة', subtitle: 'سبعة أشواط بين الجبلين', imageType: 'kaaba-man', audioUrl: '/umrah-04.mp3', content: ["السعي هو المشي بين جبلي الصفا والمروة سبع مرات، يبدأ الشوط الأول من الصفا وينتهي بالمروة."] },
    { id: 'u5', title: '5. التقصير', subtitle: 'خاتمة أعمال عمرة التمتع', imageType: 'kaaba-front', audioUrl: '/umrah-05.mp3', content: ["الالتقصير هو أخذ شيء من شعر الرأس أو اللحية أو الشارب أو قَصّ ظفر للتخلص من الإحرام."] }
  ];

  const hajjList: ManasikItem[] = [
    { id: 'h1', title: '1. الإحرام للحج من مكة', subtitle: 'يوم التروية (8 ذو الحجة)', imageType: 'kaaba-man', audioUrl: '/hajj-01.mp3', content: ["العمل الأول من أعمال الحج هو الإحرام، وأفضل أوقاته يوم التروية."] },
    { id: 'h2', title: '2. الوقوف في عرفات', subtitle: 'يوم عرفة (9 ذو الحجة)', imageType: 'kaaba-pray', audioUrl: '/hajj-02.mp3', content: ["يجب الحضور والوقوف في أرض عرفات في اليوم التاسع من ذي الحجة."] },
    { id: 'h3', title: '3. الوقوف في المشعر الحرام', subtitle: 'ليلة وفجر (10 ذو الحجة)', imageType: 'kaaba-front', audioUrl: '/hajj-03.mp3', content: ["بعد الغروب من يوم عرفة يتوجه الحاج إلى المزدلفة (المشعر الحرام)."] }
  ];

  const activeList = currentSection === 'intro' ? introList : currentSection === 'umrah' ? umrahList : hajjList;

  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    setHasError(false);
    setIsLoading(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src'); 
      audioRef.current.load();
    }
  }, [selectedItem, currentSection, view]);

  const togglePlay = () => {
    if (!audioRef.current || !activeList[selectedItem]) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);

      try {
        const localUrl = activeList[selectedItem].audioUrl;
        audioRef.current.src = localUrl;
        audioRef.current.load();

        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error("Local playback error:", err);
              setIsLoading(false);
              setIsPlaying(false);
              setHasError(true);
            });
        }
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    }
  };

  const renderIllustration = (type: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front') => {
    const gradient = currentSection === 'intro' ? "from-[#0d9488] to-[#ccfbf1]" : currentSection === 'umrah' ? "from-[#3b82f6] to-[#bfdbfe]" : "from-[#b45309] to-[#fef3c7]"; 
    if (type === 'kaaba-pray' || view === 'tawaf') { 
      return ( 
        <div className={`w-full h-64 bg-gradient-to-b ${gradient} relative rounded-2xl overflow-hidden flex items-end justify-center`}> 
          <div className="w-44 h-40 bg-[#1e1b18] border-t-8 border-yellow-600 relative z-10 rounded-t-md shadow-2xl flex flex-col justify-between p-2"> 
            <div className="w-full h-8 bg-white/20 backdrop-blur-xs rounded-xs border border-white/40" /> 
          </div> 
        </div> 
      ); 
    } 
    return ( 
      <div className={`w-full h-64 bg-gradient-to-b ${gradient} relative rounded-2xl overflow-hidden flex items-end justify-around px-4`}> 
        <div className="w-32 h-36 bg-[#24211e] border-t-4 border-yellow-600 rounded-t-xs relative"></div> 
        <div className="w-20 h-44 bg-white rounded-t-3xl relative shadow-lg flex flex-col items-center"> 
          <div className="w-8 h-8 bg-[#cc9b7a] rounded-full absolute -top-9"></div> 
          <div className="w-5 h-7 bg-emerald-700 rounded-xs mt-4 text-[8px] text-white font-bold flex items-center justify-center">المناسك</div> 
        </div> 
      </div> 
    ); 
  }; 

  return ( 
    <div className="min-h-screen bg-[#022c22] text-white flex flex-col justify-between font-sans text-right" dir="rtl"> 
      <AnimatePresence mode="wait"> 
        {view === 'portal' && ( 
          <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto" > 
            <div className="flex items-center justify-between pt-2"> 
              <div className="flex items-center gap-2"> 
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full"> <ArrowRight size={20} /> </button> 
                <div> 
                  <h1 className="text-xl font-black text-[#ffcc29]">بوابة الحج والعمرة</h1> 
                  <p className="text-xs text-emerald-400">الدليل التفاعلي الصوتي المحلي</p> 
                </div> 
              </div> 
            </div> 

            <div className="grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-xl border border-white/5 text-center">
              <button onClick={() => { setCurrentSection('intro'); setSelectedItem(0); }} className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black ${currentSection === 'intro' ? 'bg-teal-600 text-white' : 'text-gray-400'}`}> <Info size={12} className="inline ml-1" /> المقدمات </button>
              <button onClick={() => { setCurrentSection('umrah'); setSelectedItem(0); }} className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black ${currentSection === 'umrah' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}> <BookOpen size={12} className="inline ml-1" /> عمرة التمتع </button>
              <button onClick={() => { setCurrentSection('hajj'); setSelectedItem(0); }} className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black ${currentSection === 'hajj' ? 'bg-amber-600 text-white' : 'text-gray-400'}`}> <Layers size={12} className="inline ml-1" /> حج التمتع </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto"> 
              {activeList.map((item, index) => ( 
                <button key={item.id} onClick={() => { setSelectedItem(index); setView('player'); }} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-right" > 
                  <div className="flex items-center gap-3"> 
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">{index + 1}</div> 
                    <div> 
                      <h4 className="font-bold text-sm text-white">{item.title}</h4> 
                      <p className="text-xs text-gray-400">{item.subtitle}</p> 
                    </div> 
                  </div> 
                  <ChevronLeft size={16} /> 
                </button> 
              ))} 
              <button onClick={() => setView('tawaf')} className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-right" >
                <div className="flex items-center gap-3">
                  <span>🔄</span>
                  <span className="text-sm font-bold text-emerald-300">مساعد عداد أشواط الطواف</span>
                </div>
                <ChevronLeft size={16} />
              </button>
            </div> 
          </motion.div> 
        )} 

        {view === 'player' && activeList[selectedItem] && ( 
          <motion.div key="player" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="flex-1 bg-[#f4ebd0] text-stone-900 flex flex-col justify-between" > 
            <header className="p-4 flex items-center justify-between border-b border-stone-300/40 bg-[#ebdcb9]"> 
              <button onClick={() => setView('portal')} className="p-1 text-stone-700"> <ChevronRight size={24} /> </button> 
              <span className="font-bold text-stone-800">{activeList[selectedItem].title}</span> 
              <div className="w-6" /> 
            </header> 

            <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto"> 
              {renderIllustration(activeList[selectedItem].imageType)} 

              <div className="bg-[#ebdcb9] p-4 rounded-2xl flex items-center gap-4 shadow-xs"> 
                <button onClick={togglePlay} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-emerald-800" > 
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />} 
                </button> 
                <div className="flex-1 relative pt-1"> 
                  <div className="h-2 bg-white rounded-full overflow-hidden"> 
                    <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${audioProgress}%` }} /> 
                  </div>
                  <p className="text-[10px] mt-1 text-stone-600">
                    {hasError ? (
                      <span className="text-red-600 flex items-center gap-1"><AlertCircle size={12}/> تعذر تشغيل الملف الصوتي، تأكد من وجوده داخل مجلد public مباشرة بنفس الاسم تماماً</span>
                    ) : isLoading ? (
                      "جاري قراءة الملف..."
                    ) : isPlaying ? (
                      "جاري الاستماع للملف الصوتي المحلي..."
                    ) : (
                      "جاهز للتشغيل"
                    )}
                  </p>
                </div> 
              </div> 

              <div className="bg-white/60 p-4 rounded-xl border border-stone-300/30 text-right space-y-3 text-stone-800"> 
                {activeList[selectedItem].content.map((paragraph, pIdx) => ( 
                  <p key={pIdx}>{paragraph}</p> 
                ))} 
              </div> 
            </div> 

            <footer className="p-4 bg-[#ebdcb9]/60 border-t border-stone-300/40 flex justify-between items-center"> 
              <button disabled={selectedItem === 0} onClick={() => setSelectedItem(prev => prev - 1)} className="px-4 py-2 bg-white/80 rounded-xl text-stone-700 font-bold text-xs disabled:opacity-40" > السابق </button> 
              <span className="text-xs font-bold text-stone-600"> {selectedItem + 1} من {activeList.length} </span> 
              <button disabled={selectedItem === activeList.length - 1} onClick={() => setSelectedItem(prev => prev + 1)} className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold text-xs disabled:opacity-40" > التالي </button> 
            </footer> 

            <audio 
              ref={audioRef} 
              onEnded={() => { setIsPlaying(false); setAudioProgress(0); }} 
              onCanPlay={() => { setIsLoading(false); setHasError(false); }} 
              onError={() => { setHasError(true); setIsPlaying(false); }}
              onTimeUpdate={() => {
                if (audioRef.current && audioRef.current.duration) {
                  setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
              }}
            />
          </motion.div> 
        )} 
      </AnimatePresence> 
    </div> 
  ); 
}

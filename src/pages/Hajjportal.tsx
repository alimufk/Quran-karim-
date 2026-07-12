import { useState, useEffect, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, ChevronDown, Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Compass, BookOpen, Layers, Info } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

// 1️⃣ استيراد ملفات الصوت مباشرة (Vite / CRA سيتعامل معها كمسارات ديناميكية آمنة)
// ملاحظة: تأكد من وضع هذه الملفات في مجلد src/assets/audio/ أو تعديل المسارات أدناه حسب مكانها في مشروعك
import introHajjAudio from '../audio/intro-hajj.mp3';
import introIhramAudio from '../audio/intro-ihram.mp3';
import umrah01Audio from '../audio/umrah-01.mp3';
import umrah02Audio from '../audio/umrah-02.mp3';
import umrah03Audio from '../audio/umrah-03.mp3';
import umrah04Audio from '../audio/umrah-04.mp3';
import umrah05Audio from '../audio/umrah-05.mp3';
import hajj01Audio from '../audio/hajj-01.mp3';
import hajj02Audio from '../audio/hajj-02.mp3';
import hajj03Audio from '../audio/hajj-03.mp3';
import hajj04Audio from '../audio/hajj-04.mp3';
import hajj05Audio from '../audio/hajj-05.mp3';
import hajj06Audio from '../audio/hajj-06.mp3';
import hajj07Audio from '../audio/hajj-07.mp3';
import hajj08Audio from '../audio/hajj-08.mp3';
import hajj09Audio from '../audio/hajj-09.mp3';
import hajj10Audio from '../audio/hajj-10.mp3';
import hajj11Audio from '../audio/hajj-11.mp3';
import hajj12Audio from '../audio/hajj-12.mp3';
import hajj13Audio from '../audio/hajj-13.mp3';

interface ManasikItem { 
  id: string; 
  title: string; 
  subtitle?: string; 
  imageType: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front'; 
  audioSource: any; // تغيير النوع ليقبل الملف المستورد مباشرة
  content: string[]; 
} 

export function HajjPortal() { 
  const navigate = useNavigate(); 
  
  const [view, setView] = useState<'portal' | 'player' | 'tawaf'>('portal'); 
  const [currentSection, setCurrentSection] = useState<'intro' | 'umrah' | 'hajj'>('intro');
  const [selectedItem, setSelectedItem] = useState<number>(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [audioProgress, setAudioProgress] = useState(0); 
  const [tawafCount, setTawafCount] = useState(0); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ربط المصفوفات بالملفات المستوردة مباشرة
  const introList: ManasikItem[] = [
    {
      id: 'i1',
      title: 'مقدمة عن الحج وفضله',
      subtitle: 'أهمية وفريضة الحج في الإسلام',
      imageType: 'kaaba-man',
      audioSource: introHajjAudio,
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
      audioSource: introIhramAudio,
      content: [
        "الإحرام: نيته أن أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى. ويقول: \"لبيك اللهم لبيك، لبيك لا شريك لك لبيك\".",
        "ويستحب إضافة: \"إن الحمد والنعمة لك والملك، لا شريك لك\". ويكون ميقات حج التمتع مكة المكرمة.",
        "فإذا لبى انعقد الإحرام ووجب عليه ترك مجموعة من الأمور وهي خمسة وعشرون كما يلي:",
        "( ١ ) الص الصيد البري. ( ٢ ) مجامعة النساء. ( ٣ ) تقبيل النساء. ( ٤ ) لمس النساء. ( ٥ ) النظر إلى المرأة وملاعبتها. ( ٦ ) الاستمناء. ( ٧ ) عقد النكاح."
      ]
    }
  ];

  const umrahList: ManasikItem[] = [
    {
      id: 'u1',
      title: '1. الإحرام من الميقات',
      subtitle: 'أولى خطوات عمرة التمتع',
      imageType: 'kaaba-man',
      audioSource: umrah01Audio,
      content: [
        "الإحرام هو نية الدخول في النسك مقروناً بعمل من أعماله كالتلبية أو الإشعار.",
        "الواجب فيه: النية (أحرم لعمرة التمتع لحج التمتع قربة إلى الله تعالى)، ولبس ثوبي الإحرام (للرجال)، والتلبية بصوت مسموع.",
        "\"لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك لبيك\"."
      ]
    },
    {
      id: 'u2',
      title: '2. الطواف حول الكعبة',
      subtitle: 'سبعة أشواط بالبيت العتيق',
      imageType: 'kaaba-pray',
      audioSource: umrah02Audio,
      content: [
        "الطواف هو الدوران حول الكعبة المشرفة سبعة أشواط متتالية بدءاً من الحجر الأسود وانتهاءً به.",
        "يشترط في الطواف: الطهارة من الحدثين الأكبر والأصغر، وستر العورة، ومراعاة جعل الكعبة على الجانب الأيسر أثناء الحركة."
      ]
    },
    {
      id: 'u3',
      title: '3. صلاة ركعتي الطواف',
      subtitle: 'خلف مقام إبراهيم عليه السلام',
      imageType: 'kaaba-front',
      audioSource: umrah03Audio,
      content: [
        "بعد الفراغ من الطواف مباشرة، تجب صلاة ركعتين كصلاة الصبح.",
        "موقعها: خلف مقام إبراهيم عليه السلام، وفي حال الزحام يجوز الإتيان بها في أي مكان قريب من المقام داخل المسجد الحرام، ويقرأ فيهما بالحمد وسورة بعدها بنية ركعتي طواف العمرة."
      ]
    },
    {
      id: 'u4',
      title: '4. السعي بين الصفا والمروة',
      subtitle: 'سبعة أشواط بين الجبلين',
      imageType: 'kaaba-man',
      audioSource: umrah04Audio,
      content: [
        "السعي هو المشي بين جبلي الصفا والمروة سبع مرات، يبدأ الشوط الأول من الصفا وينتهي بالمروة، والإياب من المروة للصفا شوط ثانٍ.",
        "النية: أسعى بين الصفا والمروة لعمرة التمتع قربة إلى الله تعالى. ولا تشترط فيه الطهارة وإن كانت مستحبة."
      ]
    },
    {
      id: 'u5',
      title: '5. التقصير',
      subtitle: 'خاتمة أعمال عمرة التمتع',
      imageType: 'kaaba-front',
      audioSource: umrah05Audio,
      content: [
        "التقصير هو أخذ شيء من شعر الرأس أو اللحية أو الشارب أو قَصّ ظفر.",
        "بإتمام التقصير يحل للمحرم كل ما حرم عليه بالإحرام، وتنتهي أعمال عمرة التمتع بالكامل ليكون متهيئاً لإحرام الحج."
      ]
    }
  ];

  const hajjList: ManasikItem[] = [
    {
      id: 'h1',
      title: '1. الإحرام للحج من مكة',
      subtitle: 'يوم التروية (8 ذو الحجة)',
      imageType: 'kaaba-man',
      audioSource: hajj01Audio,
      content: [
        "العمل الأول من أعمال الحج هو الإحرام، وأفضل أوقاته يوم التروية (الثامن من ذو الحجة)، ومكانه مكة المكرمة والأفضل في المسجد الحرام.",
        "النية: أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى، ثم يلبس ثيابه ويلبي التلبيات الأربع."
      ]
    },
    { id: 'h2', title: '2. الوقوف في عرفات', subtitle: 'يوم عرفة (9 ذو الحجة)', imageType: 'kaaba-pray', audioSource: hajj02Audio, content: ["يجب الحضور والوقوف في أرض عرفات في اليوم التاسع من ذي الحجة من زوال الشمس إلى غروبها الشرعي."] },
    { id: 'h3', title: '3. الوقوف في المشعر الحرام', subtitle: 'ليلة وفجر (10 ذو الحجة)', imageType: 'kaaba-front', audioSource: hajj03Audio, content: ["بعد الغروب من يوم عرفة يتوجه الحاج إلى المزدلفة (المشعر الحرام) والمبيت فيها ليلته."] },
    { id: 'h4', title: '4. رمي جمرة العقبة الكبرى', subtitle: 'يوم العيد في منى', imageType: 'kaaba-man', audioSource: hajj04Audio, content: ["بعد طلوع الشمس يوم العاشر يتوجه إلى منى، وأول عمل فيها هو رمي جمرة العقبة الكبرى بسبع حصيات."] },
    { id: 'h5', title: '5. الذبح أو الهدي', subtitle: 'تقديم القربان في منى', imageType: 'kaaba-pray', audioSource: hajj05Audio, content: ["الواجب الخامس بعد الرمي هو ذبح الهدي في المسالخ المعينة في منى خلال يوم العيد."] },
    { id: 'h6', title: '6. الحلق أو التقصير', subtitle: 'التحلل الأول من الإحرام', imageType: 'kaaba-front', audioSource: hajj06Audio, content: ["بعد الذبح يجب الحلق أو التقصير بنية القربة لحج التمتع."] },
    { id: 'h7', title: '7. طواف الحج (الإفاضة)', subtitle: 'العودة للمسجد الحرام', imageType: 'kaaba-pray', audioSource: hajj07Audio, content: ["يتوجه الحاج إلى مكة للطواف بالبيت سبعة أشواط متتالية طواف الحج."] },
    { id: 'h8', title: '8. صلاة ركعتي طواف الحج', subtitle: 'ركعتان خلف مقام إبراهيم', imageType: 'kaaba-front', audioSource: hajj08Audio, content: ["صلاة ركعتين متتاليتين خلف مقام إبراهيم عليه السلام كصلاة الصبح تماماً."] },
    { id: 'h9', title: '9. السعي للحج', subtitle: 'بين الصفا والمروة للحج', imageType: 'kaaba-man', audioSource: hajj09Audio, content: ["الخروج للمسعى والسعي سبعة أشواط تبدأ من الصفا وتختم بالمروة."] },
    { id: 'h10', title: '10. طواف النساء', subtitle: 'طواف واجب في الحج', imageType: 'kaaba-pray', audioSource: hajj10Audio, content: ["طواف واجب على الرجال والنساء، وسمي بذلك لأن الإتيان به يحلل ارتباط النساء."] },
    { id: 'h11', title: '11. صلاة ركعتي طواف النساء', subtitle: 'خلف المقام الشريف', imageType: 'kaaba-front', audioSource: hajj11Audio, content: ["بعد الفراغ من طواف النساء يصلي ركعتين خلف المقام مباشرة."] },
    { id: 'h12', title: '12. المبيت في منى', subtitle: 'ليلة 11 و 12 ذو الحجة', imageType: 'kaaba-man', audioSource: hajj12Audio, content: ["يجب على الحاج العودة إلى منى للمبيت بها ليلتي الحادي عشر والثاني عشر."] },
    { id: 'h13', title: '13. رمي الجمرات الثلاث', subtitle: 'خاتمة مناسك الحج', imageType: 'kaaba-front', audioSource: hajj13Audio, content: ["في الأيام الحادي عشر والثاني عشر يجب رمي الجمرات الثلاث بالترتيب."] }
  ];

  const activeList = currentSection === 'intro' ? introList : currentSection === 'umrah' ? umrahList : hajjList;

  useEffect(() => {
    if (!activeList || !activeList[selectedItem]) return;

    // استخدام الملف المستورد مباشرة كمصدر آمن للصوت
    const targetAudio = activeList[selectedItem].audioSource;

    if (isPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      // تغيير المصدر فقط إذا اختلف الملف لضمان عدم توقف الصوت عند إعادة البناء المفاجئة
      if (audioRef.current.src !== targetAudio) {
        audioRef.current.src = targetAudio;
        audioRef.current.load();
      }
      
      const updateProgress = () => {
        if (audioRef.current && audioRef.current.duration) {
          setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      const handleAudioEnd = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleAudioEnd);

      // البدء بالتشغيل الفعلي
      audioRef.current.play().catch((err) => {
        console.error("تعذر تشغيل الصوت المدمج:", err);
        setIsPlaying(false);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        }
      };
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedItem, currentSection, activeList]);

  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [view, currentSection]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
    <div className="min-h-screen bg-[#022c22] text-white flex flex-col justify-between font-sans"> 
      <AnimatePresence mode="wait"> 
        {view === 'portal' && ( 
          <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto" > 
            <div className="flex items-center justify-between pt-2"> 
              <div className="flex items-center gap-2"> 
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full"> <ArrowRight size={20} /> </button> 
                <div> 
                  <h1 className="text-xl font-black text-[#ffcc29]">بوابة الحج والعمرة</h1> 
                  <p className="text-xs text-emerald-400">الدليل التفاعلي الصوتي المباشر</p> 
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
                  <span className="text-sm font-bold text-emerald-300">عداد الأشواط والطواف</span>
                </div>
                <ChevronLeft size={16} />
              </button>
            </div> 
          </motion.div> 
        )} 

        {view === 'player' && activeList[selectedItem] && ( 
          <motion.div key="player" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 bg-[#f4ebd0] text-stone-900 flex flex-col justify-between" > 
            <header className="p-4 flex items-center justify-between border-b border-stone-300/40 bg-[#ebdcb9]"> 
              <button onClick={() => setView('portal')} className="p-1 text-stone-700"> <ChevronRight size={24} /> </button> 
              <span className="font-bold text-stone-800">{activeList[selectedItem].title}</span> 
              <div className="w-6" /> 
            </header> 

            <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto"> 
              {renderIllustration(activeList[selectedItem].imageType)} 

              <div className="bg-[#ebdcb9] p-4 rounded-2xl flex items-center gap-4 shadow-xs"> 
                <button onClick={togglePlay} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-emerald-800" > 
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-0.5" />} 
                </button> 
                <div className="flex-1 relative pt-1"> 
                  <div className="h-2 bg-white rounded-full overflow-hidden"> 
                    <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${audioProgress}%` }} /> 
                  </div> 
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
          </motion.div> 
        )} 

        {view === 'tawaf' && ( 
          <motion.div key="tawaf" className="flex-1 bg-[#ebdcb9] text-stone-900 flex flex-col justify-between p-4" > 
            <header className="flex items-center justify-between pb-2"> 
              <button onClick={() => setView('portal')} className="p-2 bg-stone-200/60 rounded-full"> <ArrowRight size={20} /> </button> 
              <h3 className="font-black text-stone-800">عداد الطواف</h3> 
              <button onClick={() => setTawafCount(0)} className="p-2 bg-stone-200/60 rounded-full"> <RefreshCw size={16} /> </button> 
            </header> 
            <div className="my-auto text-center space-y-4"> 
              <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-emerald-700 flex flex-col items-center justify-center"> 
                <span className="text-4xl font-black text-emerald-800">{tawafCount}</span> 
                <span className="text-xs font-bold text-stone-500">من ٧</span> 
              </div> 
            </div> 
            <button onClick={() => { if (tawafCount < 7) setTawafCount(prev => prev + 1); else setTawafCount(0); }} className="w-full py-4 bg-[#1e1b18] text-white font-black rounded-2xl" > تسجيل الشوط </button> 
          </motion.div> 
        )} 
      </AnimatePresence> 
    </div> 
  ); 
}

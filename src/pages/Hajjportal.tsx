import { useState, useEffect, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, ChevronDown, Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Compass, BookOpen, Layers, Info } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

interface ManasikItem { 
  id: string; 
  title: string; 
  subtitle?: string; 
  imageType: 'kaaba-pray' | 'kaaba-man' | 'kaaba-front'; 
  audioFile: string; 
  content: string[]; 
} 

export function HajjPortal() { 
  const navigate = useNavigate(); 
  
  // التحكم في الشاشات والأقسام
  const [view, setView] = useState<'portal' | 'player' | 'tawaf'>('portal'); 
  const [currentSection, setCurrentSection] = useState<'intro' | 'umrah' | 'hajj'>('intro');
  const [selectedItem, setSelectedItem] = useState<number>(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [audioProgress, setAudioProgress] = useState(0); 
  const [tawafCount, setTawafCount] = useState(0); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1️⃣ قائمة المقدمات
  const introList: ManasikItem[] = [
    {
      id: 'i1',
      title: 'مقدمة عن الحج وفضله',
      subtitle: 'أهمية وفريضة الحج في الإسلام',
      imageType: 'kaaba-man',
      audioFile: 'intro-hajj.mp3',
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
      audioFile: 'intro-ihram.mp3',
      content: [
        "الإحرام: نيته أن أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى. ويقول: \"لبيك اللهم لبيك، لبيك لا شريك لك لبيك\".",
        "ويستحب إضافة: \"إن الحمد والنعمة لك والملك، لا شريك لك\". ويكون ميقات حج التمتع مكة المكرمة.",
        "فإذا لبى انعقد الإحرام ووجب عليه ترك مجموعة من الأمور وهي خمسة وعشرون كما يلي:",
        "( ١ ) الص الصيد البري. ( ٢ ) مجامعة النساء. ( ٣ ) تقبيل النساء. ( ٤ ) لمس النساء. ( ٥ ) النظر إلى المرأة وملاعبتها. ( ٦ ) الاستمناء. ( ٧ ) عقد النكاح."
      ]
    }
  ];

  // 2️⃣ مصفوفة مناسك عمرة التمتع
  const umrahList: ManasikItem[] = [
    {
      id: 'u1',
      title: '1. الإحرام من الميقات',
      subtitle: 'أولى خطوات عمرة التمتع',
      imageType: 'kaaba-man',
      audioFile: 'umrah-01.mp3',
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
      audioFile: 'umrah-02.mp3',
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
      audioFile: 'umrah-03.mp3',
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
      audioFile: 'umrah-04.mp3',
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
      audioFile: 'umrah-05.mp3',
      content: [
        "التقصير هو أخذ شيء من شعر الرأس أو اللحية أو الشارب أو قَصّ ظفر.",
        "بإتمام التقصير يحل للمحرم كل ما حرم عليه بالإحرام، وتنتهي أعمال عمرة التمتع بالكامل ليكون متهيئاً لإحرام الحج."
      ]
    }
  ];

  // 3️⃣ مصفوفة مناسك حج التمتع
  const hajjList: ManasikItem[] = [
    {
      id: 'h1',
      title: '1. الإحرام للحج من مكة',
      subtitle: 'يوم التروية (8 ذو الحجة)',
      imageType: 'kaaba-man',
      audioFile: 'hajj-01.mp3',
      content: [
        "العمل الأول من أعمال الحج هو الإحرام، وأفضل أوقاته يوم التروية (الثامن من ذو الحجة)، ومكانه مكة المكرمة والأفضل في المسجد الحرام.",
        "النية: أحرم لحج التمتع حجة الإسلام لوجوبه قربة إلى الله تعالى، ثم يلبس ثيابه ويلبي التلبيات الأربع."
      ]
    },
    {
      id: 'h2',
      title: '2. الوقوف في عرفات',
      subtitle: 'يوم عرفة (9 ذو الحجة)',
      imageType: 'kaaba-pray',
      audioFile: 'hajj-02.mp3',
      content: [
        "يجب الحضور والوقوف في أرض عرفات في اليوم التاسع من ذي الحجة من زوال الشمس (أذان الظهر) إلى غروبها الشرعي.",
        "النية: أقف بعرفات من الزوال إلى الغروب لحج التمتع قربة إلى الله تعالى، وهو ركن الحج الأكبر."
      ]
    },
    {
      id: 'h3',
      title: '3. الوقوف في المشعر الحرام',
      subtitle: 'ليلة وفجر (10 ذو الحجة)',
      imageType: 'kaaba-front',
      audioFile: 'hajj-03.mp3',
      content: [
        "بعد الغروب من يوم عرفة يتوجه الحاج إلى المزدلفة (المشعر الحرام) والمبيت فيها ليلته، ويجب عليه الوقوف بها بين طلوع الفجر إلى طلوع الشمس من يوم العيد.",
        "النية: أقف بالمشعر الحرام من طلوع الفجر إلى طلوع الشمس لحج التمتع قربة إلى الله تعالى."
      ]
    },
    {
      id: 'h4',
      title: '4. رمي جمرة العقبة الكبرى',
      subtitle: 'يوم العيد في منى',
      imageType: 'kaaba-man',
      audioFile: 'hajj-04.mp3',
      content: [
        "بعد طلوع الشمس يوم العاشر يتوجه إلى منى، وأول عمل فيها هو رمي جمرة العقبة الكبرى بسبع حصيات متعاقبات.",
        "يشترط أن تكون الحصيات بكر طاهرة، وتضرب الجمرة بها واحدة تلو الأخرى بنية القربة الإلهية."
      ]
    },
    {
      id: 'h5',
      title: '5. الذبح أو الهدي',
      subtitle: 'تقديم القربان في منى',
      imageType: 'kaaba-pray',
      audioFile: 'hajj-05.mp3',
      content: [
        "الواجب الخامس بعد الرمي هو ذبح الهدي (شاة، أو بقرة، أو جمل) في المسالخ المعينة في منى خلال يوم العيد.",
        "النية: أذبح هذا الهدي لحج التمتع قربة إلى الله تعالى، ويشترط سلامة الهدي من العيوب."
      ]
    },
    {
      id: 'h6',
      title: '6. الحلق أو التقصير',
      subtitle: 'التحلل الأول من الإحرام',
      imageType: 'kaaba-front',
      audioFile: 'hajj-06.mp3',
      content: [
        "بعد الذبح يجب الحلق (للرجال المبتدئين خصوصاً) أو التقصير بنية القربة لحج التمتع.",
        "بالمجيء بهذا العمل يحل للحاج كل محرمات الإحرام عدا النساء والطيب والغرور (والصيد)."
      ]
    },
    {
      id: 'h7',
      title: '7. طواف الحج (الإفاضة)',
      subtitle: 'العودة للمسجد الحرام لتكملة المناسك',
      imageType: 'kaaba-pray',
      audioFile: 'hajj-07.mp3',
      content: [
        "يتوجه الحاج إلى مكة للطواف بالبيت سبعة أشواط متتالية طواف الحج (الإفاضة).",
        "النية: أطوف بالبيت سبعة أشواط لحج التمتع قربة إلى الله تعالى."
      ]
    },
    {
      id: 'h8',
      title: '8. صلاة ركعتي طواف الحج',
      subtitle: 'ركعتان خلف مقام إبراهيم',
      imageType: 'kaaba-front',
      audioFile: 'hajj-08.mp3',
      content: [
        "صلاة ركعتين متتاليتين خلف مقام إبراهيم عليه السلام كصلاة الصبح تماماً.",
        "النية: أصلي ركعتي طواف الحج قربة إلى الله تعالى."
      ]
    },
    {
      id: 'h9',
      title: '9. السعي للحج',
      subtitle: 'بين الصفا والمروة للحج',
      imageType: 'kaaba-man',
      audioFile: 'hajj-09.mp3',
      content: [
        "الخروج للمسعى والسعي سبعة أشواط تبدأ من الصفا وتختم بالمروة.",
        "النية: أسعى بين الصفا والمروة لحج التمتع قربة إلى الله تعالى، وبإتمامه يحل للمحرم استخدام الطيب والعطور."
      ]
    },
    {
      id: 'h10',
      title: '10. طواف النساء',
      subtitle: 'طواف واجب في الحج',
      imageType: 'kaaba-pray',
      audioFile: 'hajj-10.mp3',
      content: [
        "طواف واجب على الرجال والنساء، وسمي بذلك لأن الإتيان به يحلل ارتباط النساء والصيد الزوجي.",
        "وهو عبارة عن سبعة أشواط حول الكعبة بنية طواف النساء لحج التمتع قربة إلى الله."
      ]
    },
    {
      id: 'h11',
      title: '11. صلاة ركعتي طواف النساء',
      subtitle: 'خلف المقام الشريف',
      imageType: 'kaaba-front',
      audioFile: 'hajj-11.mp3',
      content: [
        "بعد الفراغ من طواف النساء يصلي ركعتين خلف المقام مباشرة.",
        "النية: أصلي ركعتي طواف النساء لحج التمتع قربة إلى الله تعالى، وبعدها يحل كل شيء تماماً."
      ]
    },
    {
      id: 'h12',
      title: '12. المبيت في منى',
      subtitle: 'ليلة 11 و 12 ذو الحجة',
      imageType: 'kaaba-man',
      audioFile: 'hajj-12.mp3',
      content: [
        "يجب على الحاج العودة إلى منى للمبيت بها ليلتي الحادي عشر والثاني عشر من ذي الحجة من الغروب إلى منتصف الليل.",
        "النية: أبيت هذه الليلة in منى لحج التمتع قربة إلى الله تعالى."
      ]
    },
    {
      id: 'h13',
      title: '13. رمي الجمرات الثلاث',
      subtitle: 'خاتمة مناسك الحج',
      imageType: 'kaaba-front',
      audioFile: 'hajj-13.mp3',
      content: [
        "في الأيام الحادي عشر والثاني عشر يجب رمي الجمرات الثلاث (الصغرى، ثم الوسطى، ثم الكبرى العقبة) بالترتيب، كل جمرة بسبع حصيات.",
        "يكون الرمي من طلوع الشمس إلى الغروب بنية القربة، وبعد زوال اليوم الثاني عشر يجوز النفر والخروج من منى وبذلك تكتمل المناسك."
      ]
    }
  ];

  const activeList = currentSection === 'intro' ? introList : currentSection === 'umrah' ? umrahList : hajjList;

  // تأثير إدارة ومراقبة تحديث الصوت وحساب شريط التقدم
  useEffect(() => {
    if (!activeList || !activeList[selectedItem]) return;

    // بناء المسار بطريقة ديناميكية متوافقة مع الأنظمة المختلفة والمجلد العام العام الأساسي للتطبيق
    const baseUrl = window.location.origin;
    const audioUrl = `${baseUrl}/audio/${activeList[selectedItem].audioFile}`;

    if (isPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      // إعدادات تجاوز الأمان والتحميل الصارم للملف الصوتي التفاعلي
      audioRef.current.crossOrigin = "anonymous";
      
      // التغيير الحرج هنا: التأكد من تحديث المسار فقط إذا كان ملفاً جديداً لئلا يسبب تهنيجاً عند النقر المستمر
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
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

      audioRef.current.play().catch((err) => {
        console.error("خطأ تشغيل الصوت. يرجى التأكد من وجود الملف الصوتي داخل المجلد public/audio/ بالاسم الصحيح:", err);
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

  // إيقاف الصوت تلقائياً عند تغيير الواجهة تماماً لحماية كفاءة الذاكرة وعمر البطارية
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
    const gradient = currentSection === 'intro' 
      ? "from-[#0d9488] to-[#ccfbf1]" 
      : currentSection === 'umrah' 
      ? "from-[#3b82f6] to-[#bfdbfe]" 
      : "from-[#b45309] to-[#fef3c7]"; 

    if (type === 'kaaba-pray' || view === 'tawaf') { 
      return ( 
        <div className={`w-full h-64 bg-gradient-to-b ${gradient} relative rounded-2xl overflow-hidden shadow-inner flex items-end justify-center`}> 
          <div className="absolute top-6 w-24 h-24 bg-yellow-100/60 rounded-full blur-xs opacity-80" /> 
          <div className="w-44 h-40 bg-[#1e1b18] border-t-8 border-yellow-600 relative z-10 rounded-t-md shadow-2xl flex flex-col justify-between p-2"> 
            <div className="w-full h-3 border-y border-yellow-500/50 flex justify-around"> 
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span> 
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span> 
              <span className="w-2 h-2 bg-yellow-500 rounded-sm"></span> 
            </div> 
            <div className="w-full h-8 bg-white/20 backdrop-blur-xs rounded-xs border-dashed border border-white/40" /> 
          </div> 
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
    return ( 
      <div className={`w-full h-64 bg-gradient-to-b ${gradient} relative rounded-2xl overflow-hidden shadow-inner flex items-end justify-around px-4`}> 
        <div className="w-32 h-36 bg-[#24211e] border-t-4 border-yellow-600 rounded-t-xs relative"> 
          <div className="w-full h-6 bg-white/10 mt-12 border-y border-white/20"></div> 
        </div> 
        <div className="w-20 h-44 bg-white rounded-t-3xl relative shadow-lg border border-gray-100 flex flex-col items-center"> 
          <div className="w-8 h-8 bg-[#cc9b7a] rounded-full absolute -top-9 border border-gray-200"> 
            <div className="w-full h-3 bg-stone-700 rounded-t-full"></div> 
          </div> 
          <div className="w-5 h-7 bg-emerald-700 rounded-xs mt-4 shadow-xs flex items-center justify-center text-[8px] text-white font-bold">المناسك</div> 
        </div> 
      </div> 
    ); 
  }; 

  return ( 
    <div className="min-h-screen bg-[#022c22] text-white flex flex-col justify-between font-sans"> 
      <AnimatePresence mode="wait"> 
        
        {/* ================= الواجهة الأولى: البوابة المتطورة ================= */}
        {view === 'portal' && ( 
          <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto" > 
            <div className="flex items-center justify-between pt-2"> 
              <div className="flex items-center gap-2"> 
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"> 
                  <ArrowRight size={20} /> 
                </button> 
                <div> 
                  <h1 className="text-xl font-black text-[#ffcc29]">بوابة الحج والعمرة</h1> 
                  <p className="text-xs text-emerald-400">الدليل التفاعلي الصوتي والمكتوب</p> 
                </div> 
              </div> 
            </div> 

            <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-emerald-500/30 p-5 rounded-2xl text-center space-y-2 shadow-md"> 
              <Compass className="mx-auto text-[#ffcc29]" size={32} /> 
              <h2 className="text-lg font-bold tracking-wide text-yellow-100">"وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ"</h2> 
              <p className="text-xs text-emerald-300">تطابق تام بين الشرح الصوتي والمكتوب لراحة ضيوف الرحمن</p> 
            </div> 

            {/* نظام التبديل الثلاثي الأنيق */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-xl border border-white/5 text-center">
              <button 
                onClick={() => { setCurrentSection('intro'); setSelectedItem(0); }}
                className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 ${currentSection === 'intro' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <Info size={12} /> المقدمات التمهيدية
              </button>
              <button 
                onClick={() => { setCurrentSection('umrah'); setSelectedItem(0); }}
                className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 ${currentSection === 'umrah' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <BookOpen size={12} /> عمرة التمتع
              </button>
              <button 
                onClick={() => { setCurrentSection('hajj'); setSelectedItem(0); }}
                className={`py-2.5 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 ${currentSection === 'hajj' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <Layers size={12} /> حج التمتع
              </button>
            </div>

            <div className="space-y-3"> 
              <h3 className="text-sm font-bold text-[#ffcc29] flex items-center gap-1"> 
                <span>✦</span> التبويبات الصوتية المتاحة ({activeList.length}):
              </h3> 
              
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1"> 
                {activeList.map((item, index) => ( 
                  <button key={item.id} onClick={() => { setSelectedItem(index); setView('player'); }} className={`w-full p-4 border rounded-xl flex items-center justify-between transition-all text-right ${currentSection === 'intro' ? 'bg-teal-950/40 border-teal-900/60 hover:bg-teal-900/40' : currentSection === 'umrah' ? 'bg-blue-950/40 border-blue-900/60 hover:bg-blue-900/40' : 'bg-amber-950/40 border-amber-900/60 hover:bg-amber-900/40'}`} > 
                    <div className="flex items-center gap-3"> 
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${currentSection === 'intro' ? 'bg-teal-500/20 text-teal-300' : currentSection === 'umrah' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}> {index + 1} </div> 
                      <div> 
                        <h4 className="font-bold text-sm text-white">{item.title}</h4> 
                        <p className="text-xs text-gray-300 mt-0.5">{item.subtitle}</p> 
                      </div> 
                    </div> 
                    <ChevronLeft size={16} className={currentSection === 'intro' ? "text-teal-400" : currentSection === 'umrah' ? "text-blue-400" : "text-amber-400"} /> 
                  </button> 
                ))} 

                <button onClick={() => setView('tawaf')} className="w-full p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between hover:bg-emerald-500/20 transition-all text-right" > 
                  <div className="flex items-center gap-3"> 
                    <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs"> 🔄 </div> 
                    <div> 
                      <h4 className="font-bold text-sm text-emerald-300">عداد الأشواط والطواف</h4> 
                      <p className="text-xs text-emerald-200/70 mt-0.5">مساعد ذكي لحساب جولات الطواف السبعة</p> 
                    </div> 
                  </div> 
                  <ChevronLeft size={16} className="text-emerald-400" /> 
                </button> 
              </div> 
            </div> 
          </motion.div> 
        )} 

        {/* ================= الواجهة الثانية: مشغل الصوت المحسن ================= */}
        {view === 'player' && activeList[selectedItem] && ( 
          <motion.div key="player" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 bg-[#f4ebd0] text-stone-900 flex flex-col justify-between" > 
            <header className="p-4 flex items-center justify-between border-b border-stone-300/40 bg-[#ebdcb9]"> 
              <button onClick={() => setView('portal')} className="p-1 text-stone-700 hover:text-stone-900"> 
                <ChevronRight size={24} /> 
              </button> 
              <div className="flex items-center gap-1 cursor-pointer font-bold text-stone-800"> 
                <span>{activeList[selectedItem].title}</span> 
                <ChevronDown size={16} /> 
              </div> 
              <div className="w-6" /> 
            </header> 

            <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto"> 
              {renderIllustration(activeList[selectedItem].imageType)} 

              <div className="bg-[#ebdcb9] p-4 rounded-2xl flex items-center gap-4 shadow-xs"> 
                <button onClick={togglePlay} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-emerald-800 active:scale-95 transition-transform" > 
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-0.5" />} 
                </button> 
                <div className="flex-1 relative pt-1"> 
                  <div className="h-2 bg-white rounded-full overflow-hidden"> 
                    <div className="h-full bg-emerald-700 rounded-full transition-all duration-100" style={{ width: `${audioProgress}%` }} /> 
                  </div> 
                  <div className="w-4 h-4 bg-emerald-800 rounded-full absolute top-0 -mt-0.5 shadow-sm border-2 border-white transition-all duration-100" style={{ right: `${100 - audioProgress}%` }} /> 
                </div> 
              </div> 

              <div className="bg-white/50 p-4 rounded-xl border border-stone-300/30 text-right space-y-3 font-medium leading-relaxed text-stone-800"> 
                {activeList[selectedItem].content.map((paragraph, pIdx) => ( 
                  <p key={pIdx} className={paragraph.startsWith('"') || paragraph.startsWith('\"') ? "text-emerald-900 font-bold bg-emerald-50/70 p-3 rounded-lg border-r-4 border-emerald-600" : ""}> 
                    {paragraph} 
                  </p> 
                ))} 
              </div> 
            </div> 

            <footer className="p-4 bg-[#ebdcb9]/60 border-t border-stone-300/40 flex justify-between items-center"> 
              <button disabled={selectedItem === 0} onClick={() => setSelectedItem(prev => prev - 1)} className="px-4 py-2 bg-white/80 rounded-xl text-stone-700 font-bold text-xs disabled:opacity-40 flex items-center gap-1 shadow-xs" > 
                <ChevronRight size={16} /> السابق 
              </button> 
              <span className="text-xs font-bold text-stone-600"> {selectedItem + 1} من {activeList.length} </span> 
              <button disabled={selectedItem === activeList.length - 1} onClick={() => setSelectedItem(prev => prev + 1)} className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold text-xs disabled:opacity-40 flex items-center gap-1 shadow-md" > 
                التالي <ChevronLeft size={16} /> 
              </button> 
            </footer> 
          </motion.div> 
        )} 

        {/* ================= الواجهة الثالثة: عداد الأشواط ================= */}
        {view === 'tawaf' && ( 
          <motion.div key="tawaf" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-[#ebdcb9] text-stone-900 flex flex-col justify-between p-4" > 
            <header className="flex items-center justify-between pb-2"> 
              <button onClick={() => setView('portal')} className="p-2 bg-stone-200/60 rounded-full text-stone-800"> <ArrowRight size={20} /> </button> 
              <h3 className="font-black text-stone-800">شاشة عداد الطواف</h3> 
              <button onClick={() => setTawafCount(0)} className="p-2 bg-stone-200/60 rounded-full text-stone-800" title="إعادة تعيين"> <RefreshCw size={16} /> </button> 
            </header> 

            <div className="my-auto space-y-6 text-center flex flex-col items-center"> 
              {renderIllustration('kaaba-pray')} 
              <div className="space-y-1"> 
                <h2 className="text-3xl font-black text-stone-800">عداد الطواف</h2> 
                <p className="text-sm text-stone-600 font-medium px-6">إضغط على الزر أدناه عند إتمام كل شوط حول الكعبة المشرّفة</p> 
              </div> 
              <div className="w-32 h-32 rounded-full bg-white border-4 border-emerald-700 flex flex-col items-center justify-center shadow-md"> 
                <span className="text-4xl font-black text-emerald-800">{tawafCount}</span> 
                <span className="text-xs font-bold text-stone-500">من ٧ أشواط</span> 
              </div> 
            </div> 

            <button onClick={() => { if (tawafCount < 7) { setTawafCount(prev => prev + 1); } else { alert("الحمد لله، لقد أتممت الأشواط السبعة الكاملة لطوافك!"); setTawafCount(0); } }} className="w-full py-4 bg-[#1e1b18] text-white font-black text-lg rounded-2xl shadow-lg active:scale-[0.99] transition-transform" > 
              {tawafCount === 0 ? "إبداء الطواف" : tawafCount === 7 ? "إتمام وإعادة تعيين" : `تسجيل الشوط رقم (${tawafCount + 1})`} 
            </button> 
          </motion.div> 
        )} 

      </AnimatePresence> 
    </div> 
  ); 
}

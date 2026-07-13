import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Play, Pause, CheckCircle2, XCircle, RefreshCw, Flame, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuestionType = 'surah_info' | 'complete_verse' | 'reciter' | 'true_false' | 'missing_word';
type CategoryType = 'prophets' | 'ahl_bayt' | 'companions' | 'seerah' | 'history' | 'fiqh' | 'duas' | 'ramadan' | 'hajj' | 'ashura';

interface Question {
  id: string;
  category: CategoryType;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  audioUrl?: string;
  hint: string;
  explanation: string;
}

export function ReligiousQuiz() {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<'menu' | 'quiz' | 'result'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('prophets');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('quiz_score') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('quiz_streak') || '3'));
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('quiz_badges') || '["🏅 أول اختبار"]')
  );
  
  const [correctCount, setCorrectCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('quiz_score', score.toString());
    localStorage.setItem('quiz_streak', streak.toString());
    localStorage.setItem('quiz_badges', JSON.stringify(unlockedBadges));
  }, [score, streak, unlockedBadges]);

  const questionsDatabase: Question[] = [
    {
      id: '1',
      category: 'prophets',
      type: 'surah_info',
      question: 'ما هي السورة التي ذكرت فيها قصة أصحاب الكهف كاملة، وهل هي مكية أم مدنية؟',
      options: ['سورة الكهف - مكية', 'سورة الكهف - مدنية', 'سورة مريم - مكية', 'سورة الأنبياء - مدنية'],
      correctAnswer: 0,
      points: 10,
      hint: 'تقرأ مستحبة في يوم الجمعة وتنزلت قبل الهجرة.',
      explanation: 'سورة الكهف هي سورة مكية بالكامل وترتيبها 18 في المصحف الشريف وعدد آياتها 110 آيات.'
    },
    {
      id: '2',
      category: 'seerah',
      type: 'complete_verse',
      question: 'أكمل الآية الكريمة: ﴿ إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ * وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ ______ ﴾',
      options: ['زمراً', 'أفواجاً', 'كثيراً', 'مخلصين'],
      correctAnswer: 1,
      points: 15,
      hint: 'السورة تتحدث عن فتح مكة ودخول قبائل العرب للإسلام جماعات.',
      explanation: 'التكملة الصحيحة هي ﴿أَفْوَاجًا﴾ وهي سورة النصر، وتسمى أيضاً سورة التوديع لأنها نعت النبي ﷺ.'
    },
    {
      id: '3',
      category: 'ramadan',
      type: 'reciter',
      question: 'استمع للمقطع الصوتي العذب التالي، وتعرف على "من القارئ"؟',
      options: ['الشيخ عبد الباسط عبد الصمد', 'الشيخ ميثم التمار', 'الشيخ محمود خليل الحصري', 'الشيخ مشاري العفاسي'],
      correctAnswer: 0,
      points: 20,
      audioUrl: 'https://download.media.islamway.net/quran3/240/001.mp3',
      hint: 'صاحب الحنجرة الذهبية ومن أشهر قراء مصر والعالم الإسلامي.',
      explanation: 'القارئ هو الشيخ عبد الباسط عبد الصمد رحمه الله، والتسجيل من روائع التلاوات المجودة.'
    },
    {
      id: '4',
      category: 'ashura',
      type: 'true_false',
      question: 'صح أم خطأ: استشهد الإمام الحسين عليه السلام في واقعة الطف بكربلاء في اليوم العاشر من شهر محرم الحرام؟',
      options: ['خطأ ❌', 'صح  ✅'],
      correctAnswer: 1,
      points: 10,
      hint: 'يسمى هذا اليوم تاريخياً بيوم عاشوراء.',
      explanation: 'صحيح، استشهد الإمام الحسين بن علي (ع) وأهل بيته وأصحابه يوم الجمعة 10 محرم سنة 61 هجرية.'
    },
    {
      id: '5',
      category: 'fiqh',
      type: 'missing_word',
      question: 'حدد الكلمة الناقصة في النص الفقهي لآية الوضوء: ﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ______ ﴾',
      options: ['الكعبين', 'الأصابع', 'المَرَافِقِ', 'الكتف'],
      correctAnswer: 2,
      points: 15,
      hint: 'الحد الواجب في غسل اليدين يبدأ من أطراف الأصابع وينتهي عند هذا مفصل.',
      explanation: 'الكلمة الناقصة هي ﴿الْمَرَافِقِ﴾. غسل الوجه واليدين إلى المرفقين ركن أساسي في الوضوء عند جميع المسلمين.'
    }
  ];

  const currentQuizList = questionsDatabase;

  const getLevelInfo = (currentScore: number) => {
    if (currentScore >= 60) return { name: 'المستوى 5: سفير القرآن 👑' };
    if (currentScore >= 40) return { name: 'المستوى 4: عالم صغير 🧪' };
    if (currentScore >= 25) return { name: 'المستوى 3: قارئ متميز 🎤' };
    if (currentScore >= 10) return { name: 'المستوى 2: حافظ مبتدئ 📖' };
    return { name: 'المستوى 1: طالب علم 📝' };
  };

  const toggleAudio = (url: string) => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = url;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }, 10000);
    }
  };

  const handleAnswerClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    
    const currentQ = currentQuizList[currentQuestionIdx];
    if (idx === currentQ.correctAnswer) {
      setScore(prev => prev + currentQ.points);
      setCorrectCount(prev => prev + 1);
      
      if (score + currentQ.points >= 50 && !unlockedBadges.includes('🥇 وسام 500 نقطة')) {
        setUnlockedBadges(prev => [...prev, '🥇 وسام 500 نقطة', '👑 بطل القرآن']);
      }
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();

    if (currentQuestionIdx < currentQuizList.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setCurrentView('result');
    }
  };

  const startQuiz = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setCurrentQuestionIdx(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentView('quiz');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans text-right" dir="rtl">
      <header className="bg-[#111827] p-4 border-b border-slate-800 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-md font-black text-amber-500 flex items-center gap-1">🏆 مدرسة المسابقة الكبرى</h1>
            <p className="text-[10px] text-slate-400">{getLevelInfo(score).name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Flame size={14} className="text-orange-500 animate-bounce" />
            <span className="text-xs font-black text-orange-400">{streak} أيام</span>
          </div>
          <div className="bg-amber-500 px-3 py-1 rounded-xl text-slate-950 font-black text-xs">
            {score} ن
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentView === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 rounded-2xl text-slate-950 shadow-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black tracking-wide uppercase bg-slate-950 text-amber-400 px-2 py-0.5 rounded-md">📅 التحدي اليومي</span>
                  <span className="text-[10px] font-bold">نقاط مضاعفة 💥</span>
                </div>
                <h2 className="font-black text-sm mb-2">5 أسئلة يومية سريعة لتثبيت الحفظ ونيل الأوسمة!</h2>
                <button onClick={() => startQuiz('prophets')} className="w-full bg-slate-950 text-white text-xs font-bold py-2 rounded-xl active:scale-95 transition-all">ابدأ تحدي اليوم المتتالي</button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 flex items-center gap-1 px-1">🕌 اختر أحد المسابات الدينية:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['prophets', 'ahl_bayt', 'companions', 'seerah', 'fiqh', 'ramadan', 'hajj', 'ashura'] as CategoryType[]).map((cat) => {
                    const catLabels: Record<CategoryType, string> = {
                      prophets: 'قصص الأنبياء', ahl_bayt: 'أهل البيت (ع)', companions: 'الصحابة الأخيار', seerah: 'السيرة النبوية',
                      history: 'التاريخ الإسلامي', fiqh: 'موسوعة الفقه', duas: 'الأدعية المأثورة', ramadan: 'شهر رمضان', hajj: 'الحج والعمرة', ashura: 'نهضة عاشوراء'
                    };
                    return (
                      <button 
                        key={cat} 
                        onClick={() => startQuiz(cat)}
                        className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-right text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all flex flex-col justify-between h-20 shadow-sm"
                      >
                        <span className="text-base">📖</span>
                        <span>{catLabels[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1"><Award size={14} className="text-purple-400"/> خزانة الأوسمة والجوائز الرقمية</h4>
                <div className="flex flex-wrap gap-1.5">
                  {unlockedBadges.map((badge, bIdx) => (
                    <span key={bIdx} className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-medium text-slate-300 shadow-xs">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'quiz' && currentQuizList[currentQuestionIdx] && (
            <motion.div key="quiz" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex justify-between items-center text-[11px] bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-black">نوع التحدي</span>
                <span className="text-emerald-400 font-bold">+{currentQuizList[currentQuestionIdx].points} نقطة</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shadow-inner">
                <p className="text-xs font-black leading-relaxed text-slate-100">{currentQuizList[currentQuestionIdx].question}</p>
                
                {currentQuizList[currentQuestionIdx].type === 'reciter' && currentQuizList[currentQuestionIdx].audioUrl && (
                  <div className="mt-3 flex justify-center">
                    <button 
                      onClick={() => toggleAudio(currentQuizList[currentQuestionIdx].audioUrl!)}
                      className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                    >
                      {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
                      {isPlaying ? 'إيقاف مؤقت' : 'استمع للمقطع الصوتي 🎧'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {currentQuizList[currentQuestionIdx].options.map((option, idx) => {
                  let btnStyle = "bg-slate-800/60 border-slate-700/80 text-slate-200";
                  if (isAnswered) {
                    if (idx === currentQuizList[currentQuestionIdx].correctAnswer) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                    } else if (idx === selectedAnswer) {
                      btnStyle = "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      btnStyle = "bg-slate-900/40 border-slate-800 text-slate-600";
                    }
                  }
                  return (
                    <button 
                      key={idx} 
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(idx)}
                      className={`w-full p-4 border rounded-xl text-xs text-right transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQuizList[currentQuestionIdx].correctAnswer && <CheckCircle2 size={14} className="text-emerald-400" />}
                      {isAnswered && idx === selectedAnswer && idx !== currentQuizList[currentQuestionIdx].correctAnswer && <XCircle size={14} className="text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <h4 className="text-[11px] font-bold text-amber-500">💡 الشرح العلمي:</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{currentQuizList[currentQuestionIdx].explanation}</p>
                  
                  <button 
                    onClick={handleNext}
                    className="w-full mt-3 py-2.5 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    {currentQuestionIdx === currentQuizList.length - 1 ? 'إنهاء وحصد الجوائز 🌟' : 'السؤال التالي 🧭'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentView === 'result' && (
            <motion.div key="result" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-5">
              <div className="text-5xl animate-bounce">🏆</div>
              <div>
                <h3 className="text-md font-black text-amber-400">تهانينا البالغة!</h3>
                <p className="text-xs text-slate-400 mt-1">لقد تم تحديث رصيد مستواك وأوسمتك بنجاح</p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">إجمالي النقاط</span>
                  <span className="text-sm font-black text-amber-400">{score} ن</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">صحة الإجابات</span>
                  <span className="text-sm font-black text-emerald-400">{correctCount} / {currentQuizList.length}</span>
                </div>
              </div>

              <button 
                onClick={() => { setCurrentView('menu'); setCorrectCount(0); }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <RefreshCw size={12} /> العودة إلى شاشة المستويات
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

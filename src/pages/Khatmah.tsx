import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, CheckCircle2, Trophy, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TOTAL_AYAHS = 6236;

export function Khatmah() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState<number>(30);
  
  const [plan, setPlan] = useState<{
    startDate: string;
    targetDays: number;
    completedDays: number;
    lastCompletedDate: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_khatmah');
      if (saved) {
        setPlan(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  const savePlan = (newPlan: any) => {
    setPlan(newPlan);
    localStorage.setItem('quran_khatmah', JSON.stringify(newPlan));
  };

  const startNewKhatmah = () => {
    const newPlan = {
      startDate: new Date().toISOString(),
      targetDays: duration,
      completedDays: 0,
      lastCompletedDate: ''
    };
    savePlan(newPlan);
  };

  const markTodayCompleted = () => {
    if (!plan) return;
    const newPlan = {
      ...plan,
      completedDays: plan.completedDays + 1,
      lastCompletedDate: new Date().toISOString()
    };
    savePlan(newPlan);
  };

  const cancelPlan = () => {
    if(window.confirm("هل أنت متأكد من إلغاء خطة الختمة الحالية؟")) {
       setPlan(null);
       localStorage.removeItem('quran_khatmah');
    }
  };

  const isTodayCompleted = () => {
     if (!plan || !plan.lastCompletedDate) return false;
     const lastDate = new Date(plan.lastCompletedDate);
     const today = new Date();
     return lastDate.toDateString() === today.toDateString();
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#022c22]">
      <header className="sticky top-0 bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#fbbf24] hover:bg-[#059669]/20 p-2 rounded-xl transition-colors">
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#f0f9ff]">مخطط الختمة</h1>
        </div>
        {plan && (
           <button onClick={cancelPlan} className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full font-bold">
             إلغاء الخطة
           </button>
        )}
      </header>
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {!plan ? (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#064e3b]/40 border border-[#059669]/30 p-6 rounded-3xl text-center space-y-6">
             <div className="w-20 h-20 bg-[#fbbf24]/10 rounded-full flex items-center justify-center mx-auto text-[#fbbf24] mb-4">
               <Calendar size={40} />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-[#f0f9ff] mb-2">ابدأ ختمة جديدة</h2>
               <p className="text-sm text-[#059669] leading-relaxed">
                 حدد المدة التي تريد أن تختم فيها القرآن الكريم وسنقوم بتقسيم الورد اليومي لك.
               </p>
             </div>
             
             <div className="bg-[#022c22] p-4 rounded-2xl border border-[#059669]/20">
               <label className="block text-[#fbbf24] text-sm font-bold mb-3">المدة بالأيام</label>
               <input 
                 type="number" 
                 value={duration} 
                 onChange={e => setDuration(Number(e.target.value))}
                 className="w-full text-center bg-[#064e3b] text-2xl font-bold text-[#f0f9ff] border border-[#059669] p-3 rounded-xl focus:outline-none focus:border-[#fbbf24]"
                 min="1"
                 max="365"
               />
               <p className="text-[#059669] text-xs mt-3">المعدل اليومي: {Math.ceil(TOTAL_AYAHS / duration)} آية تقريباً</p>
             </div>
             
             <button onClick={startNewKhatmah} className="w-full bg-[#fbbf24] text-[#022c22] font-bold py-4 rounded-xl shadow-lg hover:bg-[#fcd34d] transition-colors">
               بدء الختمة
             </button>
           </motion.div>
        ) : (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
             {/* Progress Card */}
             <div className="bg-gradient-to-br from-[#064e3b] to-[#042f2e] border border-[#059669]/40 p-6 rounded-[32px] relative overflow-hidden shadow-2xl">
               <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#fbbf24] opacity-5 blur-[80px]" />
               
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-[#fbbf24] text-sm font-bold uppercase tracking-wider mb-1">نسبة الإنجاز</p>
                   <h2 className="text-3xl font-black text-[#f0f9ff]">{Math.round((plan.completedDays / plan.targetDays) * 100)}%</h2>
                 </div>
                 <div className="bg-[#fbbf24]/10 p-3 rounded-full text-[#fbbf24]">
                    <Trophy size={28} />
                 </div>
               </div>
               
               <div className="w-full bg-[#022c22] rounded-full h-3 mb-4 overflow-hidden">
                 <div className="bg-[#fbbf24] h-3 rounded-full transition-all duration-1000" style={{ width: `${(plan.completedDays / plan.targetDays) * 100}%` }}></div>
               </div>
               
               <div className="flex justify-between text-xs text-[#059669] font-bold">
                 <span>اليوم {plan.completedDays}</span>
                 <span>الهدف {plan.targetDays} أيام</span>
               </div>
             </div>

             {/* Today's Target */}
             <div className="bg-[#064e3b]/40 border border-[#059669]/30 p-6 rounded-[32px]">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[#fbbf24] font-bold text-lg">الورد اليومي</h3>
                 {isTodayCompleted() && (
                    <span className="bg-[#059669] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      مكتمل
                    </span>
                 )}
               </div>
               
               <div className="text-center py-6">
                 <p className="text-[#059669] text-sm mb-2">عليك قراءة حوالي</p>
                 <span className="text-4xl font-black text-[#f0f9ff] bg-[#022c22] px-6 py-4 rounded-3xl inline-block border border-[#059669]/30">
                    {Math.ceil(TOTAL_AYAHS / plan.targetDays)}
                 </span>
                 <p className="text-[#059669] text-sm mt-3">آية في اليوم</p>
               </div>
             </div>
             
             {plan.completedDays >= plan.targetDays ? (
                <div className="bg-green-500/20 border border-green-500/40 p-6 rounded-[32px] text-center">
                   <Trophy size={48} className="text-green-400 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-green-300 mb-2">مبارك!</h3>
                   <p className="text-green-200/80 text-sm">لقد أتممت ختم القرآن الكريم.</p>
                   <button onClick={() => setPlan(null)} className="mt-4 bg-green-500 text-white font-bold px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
                     ختمة جديدة
                   </button>
                </div>
             ) : (
                <button 
                  onClick={markTodayCompleted} 
                  disabled={isTodayCompleted()}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
                    isTodayCompleted() 
                      ? 'bg-[#059669]/30 text-[#059669] cursor-not-allowed opacity-50' 
                      : 'bg-[#fbbf24] text-[#022c22] hover:bg-[#fcd34d] hover:scale-[1.02]'
                  }`}
                >
                  <CheckCircle2 size={24} />
                  {isTodayCompleted() ? "تم إنجاز ورد اليوم" : "تأكيد قراءة اليوم"}
                </button>
             )}

             {!isTodayCompleted() && plan.completedDays < plan.targetDays && (
               <div className="flex items-start gap-2 mt-4 text-[#059669] text-xs">
                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
                 <p>تذكير: حاول الالتزام بالورد اليومي المخصص لضمان ختم القرآن في الوقت المحدد.</p>
               </div>
             )}
           </motion.div>
        )}
      </div>
    </div>
  );
}

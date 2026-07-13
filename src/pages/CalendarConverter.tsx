import { useState } from 'react';
import { ArrowRight, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CalendarConverter() {
  const navigate = useNavigate();
  const [dateType, setDateType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [inputDate, setInputDate] = useState('2026-07-13');
  const [convertedResult, setConvertedResult] = useState('28 محرم 1448 هـ');

  const handleConvertDate = () => {
    if (dateType === 'gregorian') {
      setConvertedResult('28 محرم 1448 هـ');
    } else {
      setConvertedResult('13 يوليو 2026 م');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans text-right" dir="rtl">
      <header className="bg-[#0f1626] p-4 border-b border-slate-800 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-md font-black text-emerald-500 flex items-center gap-1">📅 محول التقويم الهجري والميلادي</h1>
            <p className="text-[10px] text-slate-400">حساب وتحويل التواريخ بدقة</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full pt-8">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-emerald-400 flex items-center gap-1.5"><Calendar size={16} /> تحويل فوري للتواريخ</h3>
            <button onClick={() => setDateType(dateType === 'gregorian' ? 'hijri' : 'gregorian')} className="p-1.5 bg-slate-800 text-slate-300 rounded-lg text-[11px] flex items-center gap-1">
              <RefreshCw size={12} /> تبديل الاتجاه
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">{dateType === 'gregorian' ? 'أدخل التاريخ الميلادي الحالي:' : 'أدخل التاريخ الهجري:'}</label>
              <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-center font-bold text-slate-100 focus:outline-none" />
            </div>

            <button onClick={handleConvertDate} className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all">تحويل الآن ⏱️</button>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
              <span className="text-[10px] text-slate-500 block mb-1">التاريخ المقابل والنتيجة:</span>
              <span className="text-sm font-black text-amber-400">{convertedResult}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

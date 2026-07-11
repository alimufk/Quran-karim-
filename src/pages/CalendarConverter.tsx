import { useState } from 'react';

export default function CalendarConverter() {
  // إدارة التبديل بين الواجهات داخلياً لتفادي مشاكل الـ Routing
  const [view, setView] = useState<'main' | 'converter'>('main');
  const [selectedDate, setSelectedDate] = useState('2026-07-11');

  // مصفوفة أيام التقويم الهجري
  const hijriDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCurrent: i + 1 === 24, // اليوم الحالي المميز باللون الأحمر
    isFriday: (i + 1) % 7 === 3 // محاكاة لأيام الجمعة
  }));

  // تحويل الأرقام إلى الهندية/العربية
  const toArabicNum = (num: number) => num.toLocaleString('ar-EG');

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white flex flex-col font-sans select-none" style={{ direction: 'rtl' }}>
      
      {/* === 1. الواجهة الرئيسية (التقويم الداكن الفخم) === */}
      {view === 'main' ? (
        <div className="flex flex-col flex-1 pb-6">
          {/* صورة الهيدر الخلفية */}
          <div 
            className="relative h-48 bg-cover bg-center flex flex-col justify-end p-5 border-b border-zinc-800"
            style={{ backgroundImage: `linear-gradient(to top, #121212, rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600')` }}
          >
            <h1 className="text-2xl font-bold">٢٤ محرم ١٤٤٨ هـ</h1>
            <p className="text-xs text-zinc-400 mt-1">الجمعة، ١٠ تموز ٢٠٢٦</p>
          </div>

          {/* أيام الأسبوع */}
          <div className="grid grid-cols-7 text-center pt-4 text-xs font-bold text-zinc-600">
            <div>ح</div><div>ن</div><div>ث</div><div>ر</div><div>خ</div><div>ج</div><div>س</div>
          </div>

          {/* شبكة أيام الشهر */}
          <div className="p-4 grid grid-cols-7 gap-y-4 text-center text-sm font-medium">
            {hijriDays.map((item) => (
              <div key={item.day} className="flex items-center justify-center h-10">
                {item.isCurrent ? (
                  <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                    {toArabicNum(item.day)}
                  </div>
                ) : (
                  <span className={item.isFriday ? 'text-blue-400' : 'text-zinc-400'}>
                    {toArabicNum(item.day)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* الأزرار والأدوات */}
          <div className="p-4 space-y-3">
            <p className="text-xs font-bold text-zinc-500">الأدوات</p>
            <button 
              onClick={() => setView('converter')}
              className="w-full p-4 bg-[#1e1e1e] border border-zinc-800 rounded-xl flex items-center justify-between hover:bg-zinc-800 transition-colors"
            >
              <div className="text-right">
                <h4 className="font-bold text-sm text-zinc-100">تحويل التاريخ الميلادي</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">تحويل من ميلادي إلى هجري</p>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-amber-500 font-bold">
                📅
              </div>
            </button>
          </div>

          {/* كارت الحدث القادم */}
          <div className="p-4 mt-auto mx-4 bg-[#1e1e1e] border border-zinc-800 rounded-xl space-y-3 text-right">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-bold">٢٥ محرم</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded font-bold">الحدث القادم</span>
            </div>
            <h2 className="text-xs font-bold leading-relaxed text-zinc-200">
              شهادة الإمام علي بن الحسين السجاد (عليهما السلام) في المدينة المنورة سنة ٩٥هـ
            </h2>
            <button className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-lg active:scale-95 transition-transform">
              🔔 إضافة تذكير
            </button>
          </div>
        </div>
      ) : (
        
        /* === 2. واجهة محول التقويم (الثيم الأخضر) === */
        <div className="flex flex-col flex-1 bg-[#022c22] p-5">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setView('main')} 
              className="w-10 h-10 rounded-full bg-[#064e3b] flex items-center justify-center text-[#ffcc29] font-bold"
            >
              ⬅️
            </button>
            <div className="text-right">
              <h1 className="text-xl font-black text-[#ffcc29]">محول التقويم الإسلامي</h1>
              <p className="text-xs text-emerald-400">تحويل التاريخ الميلادي بسهولة</p>
            </div>
          </div>

          <div className="bg-[#064e3b] p-5 rounded-xl border border-emerald-800 space-y-3 text-right">
            <label className="block text-xs font-bold text-emerald-300">اختر التاريخ الميلادي</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3.5 bg-[#022c22] border border-emerald-900 rounded-lg text-white focus:outline-none focus:border-[#ffcc29]"
            />
          </div>

          <button 
            onClick={() => alert('تم التحويل!')}
            className="mt-auto w-full py-3.5 bg-[#ffcc29] text-emerald-950 font-black text-sm rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            🔄 تحويل الآن
          </button>
        </div>
      )}

    </div>
  );
}

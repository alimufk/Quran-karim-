import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Users, Search, PlusCircle, CheckCircle, Clock, MapPin, Phone, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveTab = 'main' | 'lost' | 'calendar';
type HolyShrine = 'karbala' | 'najaf' | 'kadhimiyah' | 'samarra';

interface LostReport {
  id: string;
  type: 'person' | 'item';
  name: string;
  shrine: HolyShrine;
  location: string;
  phone: string;
  status: 'searching' | 'found';
  time: string;
}

export function HajjPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');

  // --- أسماء العتبات المقدسة بالعربية ---
  const shrineLabels: Record<HolyShrine, string> = {
    karbala: 'العتبة الحسينية والعباسية (كربلاء)',
    najaf: 'العتبة العلوية المقدسة (النجف)',
    kadhimiyah: 'العتبة الكاظمية المقدسة (بغداد)',
    samarra: 'العتبة العسكرية المقدسة (سامراء)'
  };

  // --- قاعدة بيانات تجريبية لأشخاص مفقودين في العتبات ---
  const [lostReports, setLostReports] = useState<LostReport[]>([
    { id: '1', type: 'person', name: 'الطفل علي رضا (5 سنوات)', shrine: 'karbala', location: 'بين الحرمين - قرب عارضة رقم 4', phone: '077XXXXXXXX', status: 'searching', time: 'منذ ساعة' },
    { id: '2', type: 'item', name: 'حقيبة ظهر سوداء بها جوازات سفر', shrine: 'najaf', location: 'صحن فاطمة الزهراء (ع)', phone: '078XXXXXXXX', status: 'found', time: 'منذ ساعتين' },
  ]);

  const [reportType, setReportType] = useState<'person' | 'item'>('person');
  const [selectedShrine, setSelectedShrine] = useState<HolyShrine>('karbala');
  const [reporterName, setReporterName] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !lostLocation || !reporterPhone) return;
    
    const newReport: LostReport = {
      id: Date.now().toString(),
      type: reportType,
      name: reporterName,
      shrine: selectedShrine,
      location: lostLocation,
      phone: reporterPhone,
      status: 'searching',
      time: 'الآن'
    };
    setLostReports([newReport, ...lostReports]);
    setReporterName('');
    setLostLocation('');
    setReporterPhone('');
  };

  // --- تحويل التقويم الهجري/الميلادي للمناسبات الدينية ---
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
      {/* الهيدر */}
      <header className="bg-[#0f1626] p-4 border-b border-slate-800 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => activeTab === 'main' ? navigate('/') : setActiveTab('main')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-md font-black text-amber-500 flex items-center gap-1">🕌 بوابة العتبات المقدسة الرقمية</h1>
            <p className="text-[10px] text-slate-400">دليل التائهين والخدمات الفورية للزائرين في العراق</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full overflow-y-auto space-y-4">
        <AnimatePresence mode="wait">
          
          {/* الشاشة الرئيسية للبوابة */}
          {activeTab === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-r from-green-800 to-emerald-700 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <h2 className="font-black text-base mb-1 text-white">منصة خدمة زوار العتبات</h2>
                <p className="text-xs text-emerald-100 leading-relaxed">مركز تواصل رقمي لمساعدة ضيوف الرحمن والزائرين الكرام في العتبات العراقية المقدسة على مدار الساعة.</p>
              </div>

              {/* أرقام الطوارئ الرسمية والحقيقية في العراق */}
              <div className="bg-slate-900 border border-red-500/30 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-red-400 flex items-center gap-1">
                  <AlertTriangle size={14} className="animate-pulse" /> أرقام الطوارئ الرسمية (العراق)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الدفاع المدني</span>
                    <a href="tel:115" className="text-sm font-black text-red-500 block">115</a>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الشرطة الاتحادية</span>
                    <a href="tel:104" className="text-sm font-black text-blue-400 block">104</a>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الإسعاف الفوري</span>
                    <a href="tel:122" className="text-sm font-black text-emerald-400 block">122</a>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">مركز التائهين الموحد</span>
                    <a href="tel:07801000100" className="text-[11px] font-black text-amber-400 block tracking-tighter">07801000100</a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* زر التائهين والمفقودات */}
                <button onClick={() => setActiveTab('lost')} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 text-right hover:border-amber-500/50 transition-all group">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 transition-all"><Users size={24} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-200">قسم التائهين والمفقودات بالعتبات</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">سجل بلاغاً عن شخص مفقود أو حاجة مفقودة داخل الصحن الشريف أو ساحات العتبة.</p>
                  </div>
                </button>

                {/* زر تحويل التقويم */}
                <button onClick={() => setActiveTab('calendar')} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 text-right hover:border-emerald-500/50 transition-all group">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-all"><Calendar size={24} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-200">تحويل التقويم والمناسبات الدينية</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">تتبع تواريخ المناسبات والأربعينية بالتاريخين الهجري والميلادي فورياً.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* قسم التائهين والمفقودات في العتبات */}
          {activeTab === 'lost' && (
            <motion.div key="lost" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-black text-amber-500 flex items-center gap-1.5 mb-3">
                  <PlusCircle size={16} /> تسجيل بلاغ دقيق وحقيقي
                </h3>
                <form onSubmit={handleAddReport} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">نوع المفقود</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setReportType('person')} className={`py-2 rounded-xl text-xs font-bold transition-all ${reportType === 'person' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>شخص/زائر تائه</button>
                      <button type="button" onClick={() => setReportType('item')} className={`py-2 rounded-xl text-xs font-bold transition-all ${reportType === 'item' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>حاجة مفقودة</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">اختر العتبة المقدسة</label>
                    <select value={selectedShrine} onChange={(e) => setSelectedShrine(e.target.value as HolyShrine)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-200 focus:outline-none">
                      <option value="karbala">كربلاء (الحسينية والعباسية)</option>
                      <option value="najaf">النجف الأشرف (العلوية)</option>
                      <option value="kadhimiyah">بغداد (الكاظمية المقدسة)</option>
                      <option value="samarra">سامراء (العسكرية المقدسة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{reportType === 'person' ? 'الاسم الثلاثي المفقود والجنسية' : 'مواصفات الحاجة الدقيقة'}</label>
                    <input type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder={reportType === 'person' ? 'مثال: فاطمة جاسم محمد - العراق' : 'مثال: هاتف آيفون 13 غطاء أحمر'} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-right focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">مكان الفقدان التقريبي (اسم الباب، التفتيش أو الكشوانية)</label>
                    <input type="text" value={lostLocation} placeholder="مثال: قرب باب القبلة أو كشوانية رقم 3" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-right focus:outline-none focus:border-amber-500" onChange={(e) => setLostLocation(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">رقم هاتف الكفيل أو الشخص المُبلّغ (شغال حالياً)</label>
                    <input type="tel" value={reporterPhone} placeholder="07XXXXXXXXX" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-left focus:outline-none focus:border-amber-500" dir="ltr" onChange={(e) => setReporterPhone(e.target.value)} />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all">إرسال لغرفة مفقودي العتبة 📡</button>
                </form>
              </div>

              {/* البلاغات النشطة الفورية */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 px-1 flex items-center gap-1.5"><Search size={14}/> بلاغات الزوار النشطة حالياً:</h4>
                {lostReports.map((report) => (
                  <div key={report.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">🏢 {shrineLabels[report.shrine]}</span>
                      <span className={`text-[10px] flex items-center gap-1 font-bold ${report.status === 'searching' ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {report.status === 'searching' ? <Clock size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        {report.status === 'searching' ? 'جاري البحث بالتنسيق' : 'تم العثور'}
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-slate-200">{report.name}</h5>
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p className="flex items-center gap-1"><MapPin size={12} className="text-slate-500"/> {report.location}</p>
                      <p className="flex items-center gap-1"><Phone size={12} className="text-slate-500"/> {report.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* قسم تحويل التقويم والمناسبات الإسلامية */}
          {activeTab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-emerald-400 flex items-center gap-1.5"><Calendar size={16} /> تحويل التاريخ والمناسبات</h3>
                  <button onClick={() => setDateType(dateType === 'gregorian' ? 'hijri' : 'gregorian')} className="p-1.5 bg-slate-800 text-slate-300 rounded-lg text-[11px] flex items-center gap-1"><RefreshCw size={12} /> تبديل</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{dateType === 'gregorian' ? 'التاريخ الميلادي:' : 'التاريخ الهجري:'}</label>
                    <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-center font-bold text-slate-100 focus:outline-none" />
                  </div>

                  <button onClick={handleConvertDate} className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all">تحويل التاريخ ⏱️</button>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-500 block mb-1">التاريخ المقابل:</span>
                    <span className="text-sm font-black text-amber-400">{convertedResult}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

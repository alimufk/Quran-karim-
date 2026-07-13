import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, PlusCircle, CheckCircle, Clock, MapPin, Phone, ShieldAlert, Heart, Globe, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. تصميم قاعدة البيانات (Database Schema Types) ---
type ReportType = 'lost_person' | 'found_person'; // تائه أو تم العثور عليه
type HolyShrine = 'karbala_route' | 'najaf' | 'kadhimiyah' | 'samarra';

interface LostPersonReport {
  id: string;
  report_type: ReportType;
  full_name: string;
  age: number;
  gender: 'male' | 'female';
  nationality: string;
  health_status: string;
  image_url?: string;
  // حقول المكان والزمان
  shrine_or_route: HolyShrine;
  pillar_number?: string; // رقم العمود على طريق المشاية
  gps_coordinates?: string;
  // حقول التواصل
  reporter_name: string;
  reporter_phone: string;
  reporter_relation: 'relative' | 'mowakeb_owner' | 'volunteer';
  status: 'searching' | 'matched' | 'resolved';
  created_at: string;
}

export function LostAndFound() {
  const navigate = useNavigate();
  
  // ولاية البلاغات (تتصل بقاعدة البيانات لاحقاً)
  const [reports, setReports] = useState<LostPersonReport[]>([
    {
      id: '1',
      report_type: 'lost_person',
      full_name: 'محمد جاسم الفتلاوي',
      age: 65,
      gender: 'male',
      nationality: 'عراقي',
      health_status: 'يعاني من نسيان مؤقت وضغط الدم',
      shrine_or_route: 'karbala_route',
      pillar_number: 'عمود 450',
      reporter_name: 'أحمد جاسم (الابن)',
      reporter_phone: '07701234567',
      reporter_relation: 'relative',
      status: 'searching',
      created_at: new Date().toISOString()
    }
  ]);

  // نموذج المدخلات لقاعدة البيانات
  const [formData, setFormData] = useState({
    report_type: 'lost_person' as ReportType,
    full_name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    nationality: 'عراقي',
    health_status: 'سليم',
    shrine_or_route: 'karbala_route' as HolyShrine,
    pillar_number: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_relation: 'relative' as 'relative' | 'mowakeb_owner' | 'volunteer'
  });

  // ميزة عرض الـ WebView للمواقع الرسمية داخل التطبيق
  const [activeWebView, setActiveWebView] = useState<string | null>(null);

  // --- 2. ميزة المطابقة التلقائية الذكية (Auto-Matching) ---
  const checkAutoMatching = (newReport: LostPersonReport) => {
    const match = reports.find(existing => {
      // شروط المطابقة: عكس نوع البلاغ + تقارب العمر (+-5 سنوات) + نفس الجنس + تقارب الموقع/العمود
      const isOppositeType = existing.report_type !== newReport.report_type;
      const isSameGender = existing.gender === newReport.gender;
      const isSimilarAge = Math.abs(existing.age - newReport.age) <= 5;
      const isSameArea = existing.shrine_or_route === newReport.shrine_or_route;
      
      return isOppositeType && isSameGender && isSimilarAge && isSameArea;
    });

    if (match) {
      alert(`🚨 نظام المطابقة الذكي: تم العثور على تطابق محتمل فوراً!\n\n البلاغ الحالي: ${newReport.full_name}\n البلاغ المطابق: ${match.full_name}\n\nيرجى التواصل الفوري بين الأطراف: ${newReport.reporter_phone} 🔄 ${match.reporter_phone}`);
      // تحويل حالة البلاغين في قاعدة البيانات إلى متطابق
      match.status = 'matched';
      newReport.status = 'matched';
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.reporter_phone || !formData.reporter_name) {
      alert('يرجى ملء الحقول الأساسية لضمان دقة المطابقة');
      return;
    }

    const newReport: LostPersonReport = {
      id: Date.now().toString(),
      report_type: formData.report_type,
      full_name: formData.full_name,
      age: Number(formData.age) || 0,
      gender: formData.gender,
      nationality: formData.nationality,
      health_status: formData.health_status,
      shrine_or_route: formData.shrine_or_route,
      pillar_number: formData.pillar_number,
      reporter_name: formData.reporter_name,
      reporter_phone: formData.reporter_phone,
      reporter_relation: formData.reporter_relation,
      status: 'searching',
      created_at: new Date().toISOString()
    };

    // تشغيل محرك المطابقة قبل الحفظ
    checkAutoMatching(newReport);

    setReports([newReport, ...reports]);
    // إعادة تهيئة النموذج
    setFormData({
      ...formData,
      full_name: '',
      age: '',
      pillar_number: '',
      reporter_name: '',
      reporter_phone: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans text-right" dir="rtl">
      {/* الهيدر */}
      <header className="bg-[#0f1626] p-4 border-b border-slate-800 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-md font-black text-amber-500 flex items-center gap-1">🕋 مركز إرشاد التائهين الذكي</h1>
            <p className="text-[10px] text-slate-400">نظام المطابقة الفورية والربط مع العتبات المقدسة</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4 overflow-y-auto">
        
        {/* --- 3. ربط أزرار الاتصال والتحويل المباشر (Deep Links) --- */}
        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-black text-amber-400 flex items-center gap-1">
            <PhoneCall size={14} /> الاتصال السريع والروابط الرسمية العتبات
          </h4>
          
          {/* زر الاتصال السريع بالرقم الموحد للتائهين 174 */}
          <a href="tel:174" className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
            📞 الاتصال بالرقم الساخن الموحد للتائهين (174)
          </a>

          {/* واجهات العرض الداخلية WebView للعتبات */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button 
              onClick={() => setActiveWebView('https://alkafeel.net/lost/')} 
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 hover:border-emerald-500 transition-all flex items-center justify-center gap-1"
            >
              <Globe size={12} className="text-emerald-400"/> مفقودات العتبة العباسية
            </button>
            <button 
              onClick={() => setActiveWebView('https://imamali.net/?id=3161')} 
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 hover:border-blue-500 transition-all flex items-center justify-center gap-1"
            >
              <Globe size={12} className="text-blue-400"/> إرشاد العتبة العلوية
            </button>
          </div>
        </div>

        {/* إطار عرض الـ WebView داخل التطبيق إذا تم تفعيله */}
        {activeWebView && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-2 animate-fadeIn">
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded-t-xl border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">الموقع الرسمي للعتبة (عرض داخل التطبيق)</span>
              <button onClick={() => setActiveWebView(null)} className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">إغلاق ✕</button>
            </div>
            <iframe src={activeWebView} className="w-full flex-1 bg-white rounded-b-xl border-none shadow-2xl" title="Shrine Service"/>
          </div>
        )}

        {/* --- 1. واجهة إدخال جداول بيانات التائه الذكية --- */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mb-3">
            <PlusCircle size={16} /> تسجيل بلاغ ذكي جديد (Supabase/PG)
          </h3>
          <form onSubmit={handleSubmitReport} className="space-y-3">
            
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">نوع البلاغ لغرض المطابقة</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setFormData({...formData, report_type: 'lost_person'})} className={`py-2 rounded-xl text-xs font-bold transition-all ${formData.report_type === 'lost_person' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>شخص مفقود / تائه</button>
                <button type="button" onClick={() => setFormData({...formData, report_type: 'found_person'})} className={`py-2 rounded-xl text-xs font-bold transition-all ${formData.report_type === 'found_person' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>تم العثور على شخص</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الاسم الثلاثي للتائه</label>
                <input type="text" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="مثال: علي حسن علوان" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">العمر التقريبي</label>
                <input type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="العمر" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الجنس</label>
                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none">
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الجنسية</label>
                <input type="text" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">الحالة الصحية (أمراض مزمنة، صعوبة نطق، إلخ)</label>
              <input type="text" value={formData.health_status} onChange={(e) => setFormData({...formData, health_status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none" />
            </div>

            <hr className="border-slate-800 my-2" />

            {/* حقول المكان والزمان */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الموقع/المحور الحالي</label>
                <select value={formData.shrine_or_route} onChange={(e) => setFormData({...formData, shrine_or_route: e.target.value as HolyShrine})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none">
                  <option value="karbala_route">طريق يا حسين (المشاية)</option>
                  <option value="najaf">النجف (المدينة القديمة)</option>
                  <option value="kadhimiyah">الكاظمية المقدسة</option>
                  <option value="samarra">سامراء المقدسة</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رقم العمود القريب (إن وجد)</label>
                <input type="text" value={formData.pillar_number} onChange={(e) => setFormData({...formData, pillar_number: e.target.value})} placeholder="مثال: عمود 820" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none" />
              </div>
            </div>

            <hr className="border-slate-800 my-2" />

            {/* حقول التواصل */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="text-[11px] text-slate-400 block mb-1">صلة المُبلّغ</label>
                <select value={formData.reporter_relation} onChange={(e) => setFormData({...formData, reporter_relation: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none">
                  <option value="relative">قريب</option>
                  <option value="mowakeb_owner">صاحب موكب</option>
                  <option value="volunteer">متطوع</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-[11px] text-slate-400 block mb-1">اسم المُبلّغ</label>
                <input type="text" required value={formData.reporter_name} onChange={(e) => setFormData({...formData, reporter_name: e.target.value})} placeholder="الاسم" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-right focus:outline-none" />
              </div>
              <div className="col-span-1">
                <label className="text-[11px] text-slate-400 block mb-1">رقم هاتف التواصل</label>
                <input type="tel" required value={formData.reporter_phone} onChange={(e) => setFormData({...formData, reporter_phone: e.target.value})} placeholder="07xxxxxxxxx" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-left focus:outline-none" dir="ltr" />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all">
              تفعيل الفحص والمطابقة والحفظ 💾
            </button>
          </form>
        </div>

        {/* عرض قاعدة البيانات الحالية للبلاغات */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 px-1 flex items-center gap-1.5">📊 البلاغات النشطة بقاعدة البيانات:</h4>
          {reports.map((report) => (
            <div key={report.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${report.status === 'matched' ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${report.report_type === 'lost_person' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {report.report_type === 'lost_person' ? '👤 تائه مفقود' : '🟢 تم العثور عليه'}
                </span>
                <span className={`text-[10px] flex items-center gap-1 font-bold ${report.status === 'searching' ? 'text-blue-400' : 'text-amber-400'}`}>
                  {report.status === 'searching' ? <Clock size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
                  {report.status === 'searching' ? 'جاري الفحص البرمجي' : '🔥 تم التطابق التلقائي'}
                </span>
              </div>
              
              <h5 className="text-xs font-black text-slate-200">{report.full_name} ({report.age} سنة) - {report.nationality}</h5>
              
              <p className="text-[11px] text-slate-400 flex items-center gap-1"><Heart size={11} className="text-red-400"/> {report.health_status}</p>

              <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg grid grid-cols-2 gap-1 mt-1">
                <p><MapPin size={11} className="inline ml-1 text-slate-500"/>{report.shrine_or_route === 'karbala_route' ? 'طريق المشاية' : 'داخل المدينة'} {report.pillar_number}</p>
                <p><Phone size={11} className="inline ml-1 text-slate-500"/>{report.reporter_phone} ({report.reporter_name})</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

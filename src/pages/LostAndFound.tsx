import { useState, useRef, useEffect } from 'react';

// تعريف أنواع البيانات لتسهيل محاكاة قاعدة البيانات والبحث
interface Report {
  id: string;
  type: 'lost' | 'found';
  name: string;
  age: string;
  nationality: string;
  clothes: string;
  phone: string;
  image: string | null;
  location?: { lat: number; lng: number };
  date: string;
}

export function LostAndFound() {
  // الحالات الـ States
  const [activeTab, setActiveTab] = useState<'sos' | 'lost' | 'found' | 'map' | 'reports'>('sos');
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  
  // حقول الاستمارة
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [clothes, setClothes] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  // البحث الذكي ومحاكاة البيانات
  const [searchQuery, setSearchQuery] = useState('');
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [sosStatus, setSosStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // مراكز إرشاد التائهين الرسمية القريبة (النجف - كربلاء كمثال جيوغرافي)
  const officialCenters = [
    { id: 1, name: "مركز الإرشاد المركزي - عمود 200", lat: 32.5512, lng: 44.3312, distance: "1.2 كم" },
    { id: 2, name: "مركز العتبة العلوية المقدسة - قرب الحرم", lat: 31.9961, lng: 44.3142, distance: "3.5 كم" },
    { id: 3, name: "مركز إرشاد العتبة الحسينية - باب القبلة", lat: 32.6164, lng: 44.0324, distance: "0.4 كم" },
  ];

  // جلب موقع المستخدم الجغرافي عبر الـ GPS عند فتح الخريطة أو الـ SOS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("يرجى تفعيل الـ GPS لتحديد المراكز بدقة")
      );
    }
  }, []);

  // 1. تفعيل زر الاستغاثة السريع SOS وارسال الاحداثيات
  const handleSOS = () => {
    setSosStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          
          // محاكاة إرسال إلى Webhook غرف العمليات 174 أو Firebase
          console.log(`SOS Sent to Webhook! Location: ${lat}, ${lng}`);
          
          setSosStatus('success');
          alert(`🚨 تم إرسال نداء استغاثة عاجل بموقعك الحالي (خط العرض: ${lat.toFixed(4)}، خط الطول: ${lng.toFixed(4)}) إلى غرفة العمليات المركزية 174 وتنبيه المستخدمين عبر الـ Geofencing!`);
        },
        () => {
          setSosStatus('error');
          alert('❌ فشل التقاط موقعك الجغرافي. يرجى تفعيل الـ GPS في الجوال وصلاحية الموقع.');
        }
      );
    } else {
      setSosStatus('error');
    }
  };

  // التعامل مع ملف الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 2 & 3. إرسال بلاغ (عاصر أو مفقود) محاكاة مع الـ Webhook
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      name,
      age,
      nationality,
      clothes,
      phone,
      image,
      location: userCoords || undefined,
      date: new Date().toLocaleDateString('ar-EG')
    };

    // حفظ البلاغ محلياً لمحاكاة قاعدة البيانات والبحث
    const updatedReports = [newReport, ...allReports];
    setAllReports(updatedReports);

    // محاكاة إرسال إشعار فوري لجميع الهواتف القريبة Firebase Cloud Messaging
    alert(`📢 تم رفع البلاغ بنجاح! وجاري إرسال إشعار عاجل (FCM Push Notification) للمستخدمين في منطقتك الجغرافية الحالية.`);
    
    // تصفير الحقول
    setName(''); setAge(''); setNationality(''); setClothes(''); setPhone(''); setImage(null);
    setActiveTab('reports'); // الانتقال التلقائي للوحة البحث
  };

  // 4. البحث الذكي (محاكاة Algolia / Elasticsearch فائق السرعة)
  const filteredReports = allReports.filter(report => 
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.nationality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#022c22] text-white p-4 pb-28 font-sans" style={{ direction: 'rtl' }}>
      
      {/* الهيدر الرئيسي للمنظومة */}
      <div className="text-center mb-5 pt-2">
        <h1 className="text-2xl font-black text-[#ffcc29]">غرفة عمليات إرشاد التائهين</h1>
        <p className="text-xs text-emerald-300">المنظومة الرقمية الموحدة المرتبطة برقم الطوارئ المركزية 174</p>
      </div>

      {/* شريط التنقل بين اللوحات الذكية */}
      <div className="flex gap-1 overflow-x-auto pb-3 mb-4 border-b border-emerald-800 scrollbar-none">
        <button onClick={() => setActiveTab('sos')} className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap ${activeTab === 'sos' ? 'bg-red-600 text-white' : 'bg-[#064e3b]'}`}>🚨 استغاثة SOS</button>
        <button onClick={() => { setActiveTab('lost'); setReportType('lost'); }} className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap ${activeTab === 'lost' ? 'bg-[#ffcc29] text-emerald-950' : 'bg-[#064e3b]'}`}>🔍 الإبلاغ عن مفقود</button>
        <button onClick={() => { setActiveTab('found'); setReportType('found'); }} className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap ${activeTab === 'found' ? 'bg-emerald-600 text-white' : 'bg-[#064e3b]'}`}>🤝 الإبلاغ عن عاثر</button>
        <button onClick={() => setActiveTab('map')} className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-[#064e3b]'}`}>🗺️ المراكز والخرائط</button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap ${activeTab === 'reports' ? 'bg-purple-600 text-white' : 'bg-[#064e3b]'}`}>📊 قاعدة البيانات والبحث</button>
      </div>

      {/* 1. واجهة زر الاستغاثة السريع SOS */}
      {activeTab === 'sos' && (
        <div className="space-y-6 text-center py-4 animate-fadeIn">
          <div className="bg-[#064e3b] p-4 rounded-2xl border border-emerald-800">
            <p className="text-sm text-emerald-100 font-medium leading-relaxed">
              عند الضغط على الزر أدناه، سيقوم التطبيق بـ سحب إحداثيات الـ GPS الحالية وتوجيهها فوراً لغرفة السيطرة الأمنية لتحديد موقعك وإرسال أقرب مفرزة جوالة إليك.
            </p>
          </div>

          <div className="flex justify-center my-8">
            <button
              onClick={handleSOS}
              disabled={sosStatus === 'loading'}
              className={`w-44 h-44 rounded-full border-8 border-red-900/50 text-white font-black text-2xl flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 ${
                sosStatus === 'loading' ? 'bg-amber-600 animate-pulse' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <span>SOS</span>
              <span className="text-[10px] font-bold mt-1">استغاثة عاجلة</span>
            </button>
          </div>

          {/* أرقام وهواتف الطوارئ والتضمين المباشر */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 space-y-3 text-right">
            <h3 className="text-xs font-black text-[#ffcc29] mb-2 border-b border-white/10 pb-2">📞 أرقام الاتصال السريع بضغط زر واحدة:</h3>
            <div className="grid grid-cols-1 gap-2">
              <a href="tel:174" className="w-full p-3 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg flex justify-between items-center font-bold text-sm">
                <span>📟 الرقم الموحد الرسمي لجميع العتبات</span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">174</span>
              </a>
              <a href="tel:07602405900" className="w-full p-3 bg-[#064e3b] border border-emerald-800 text-emerald-300 rounded-lg flex justify-between items-center font-bold text-sm">
                <span>🏢 أرقام اللجنة المركزية العليا</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-xs">07602405900</span>
              </a>
              <a href="tel:115" className="w-full p-3 bg-blue-600/20 border border-blue-600/40 text-blue-400 rounded-lg flex justify-between items-center font-bold text-sm">
                <span>🚒 الدفاع المدني العراقي</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">115</span>
              </a>
              <a href="tel:122" className="w-full p-3 bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 rounded-lg flex justify-between items-center font-bold text-sm">
                <span>🚑 الإسعاف الفوري العراقي</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-xs">122</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2 & 3. لوحة الإبلاغ (مفقود / عاثر) */}
      {(activeTab === 'lost' || activeTab === 'found') && (
        <form onSubmit={handleSubmitReport} className="space-y-4 animate-fadeIn">
          <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800">
            <label className="block text-xs font-bold text-emerald-300 text-right mb-2">تحميل صورة حديثة (التقاط كاميرا أو استوديو)</label>
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            {image ? (
              <div className="relative h-40 rounded-lg overflow-hidden"><img src={image} className="w-full h-full object-cover" /><button type="button" onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-600 p-1 px-2 rounded text-xs">حذف</button></div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-28 border-2 border-dashed border-emerald-600 rounded-lg flex flex-col items-center justify-center bg-[#022c22] text-xs">📸 اضغط لالتقاط أو اختيار الصورة</button>
            )}
          </div>

          <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 space-y-3 text-right">
            <div><label className="text-xs font-bold text-emerald-300">اسم الشخص بالكامل</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-sm mt-1 focus:outline-none focus:border-[#ffcc29]" placeholder="اكتب الاسم هنا..." required /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs font-bold text-emerald-300">العمر</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-sm mt-1 focus:outline-none focus:border-[#ffcc29]" placeholder="مثال: 7" required /></div>
              <div><label className="text-xs font-bold text-emerald-300">الجنسية</label><input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-sm mt-1 focus:outline-none focus:border-[#ffcc29]" placeholder="عراقي، إيراني..." required /></div>
            </div>
            <div><label className="text-xs font-bold text-emerald-300">مواصفات الملابس المرتداة</label><input type="text" value={clothes} onChange={(e) => setClothes(e.target.value)} className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-sm mt-1 focus:outline-none focus:border-[#ffcc29]" placeholder="مثال: دشداشة بيضاء، قميص أسود..." required /></div>
            <div><label className="text-xs font-bold text-emerald-300">رقم هاتف ذويه للتواصل الفوري</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-sm mt-1 text-left focus:outline-none focus:border-[#ffcc29]" style={{ direction: 'ltr' }} placeholder="+964..." required /></div>
          </div>

          <button type="submit" className={`w-full py-4 font-black text-sm rounded-xl shadow-lg transition-all ${activeTab === 'lost' ? 'bg-[#ffcc29] text-emerald-950' : 'bg-emerald-600 text-white'}`}>
            📢 {activeTab === 'lost' ? 'إرسال بلاغ عن مفقود الآن' : 'إرسال بلاغ عن شخص عاثر عليه'}
          </button>
        </form>
      )}

      {/* 4. الخريطة التفاعلية والمراكز القريبة عبر الـ GPS */}
      {activeTab === 'map' && (
        <div className="space-y-4 animate-fadeIn text-right">
          <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 text-center">
            <h3 className="text-xs font-bold text-[#ffcc29] mb-2">🗺️ مخرجات نظام Google Maps API الجغرافي</h3>
            <div className="w-full h-40 bg-zinc-900 rounded-lg flex items-center justify-center text-xs text-zinc-500 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')]" />
              <span className="relative z-10 font-bold text-emerald-400">📍 تم تفعيل الـ GPS ومطابقة أقرب نقاط فحص ثابتة</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 px-1">المراكز الرسمية القريبة من موقعك الحالي:</label>
            {officialCenters.map(center => (
              <div key={center.id} className="p-3 bg-[#064e3b] border border-emerald-800 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">{center.name}</h4>
                  <span className="text-[10px] text-zinc-400">مرتبط ومجهز باتصال الطوارئ الموحد</span>
                </div>
                <span className="text-xs font-black text-[#ffcc29] bg-[#022c22] px-2 py-1 rounded border border-emerald-900">{center.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. لوحة البحث الذكي وعرض قاعدة البيانات (Algolia / Elasticsearch) */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fadeIn text-right">
          <div className="bg-[#064e3b] p-3 rounded-xl border border-emerald-800">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 ابحث فوراً عن اسم المفقود أو الجنسية (البحث الذكي)..."
              className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-xs placeholder-zinc-500 text-right text-white focus:outline-none focus:border-[#ffcc29]"
            />
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center p-8 text-xs text-zinc-500">قاعدة البيانات فارغة حالياً، أو لم يتم العثور على نتائج مطابقة لاسم البحث.</div>
            ) : (
              filteredReports.map(report => (
                <div key={report.id} className="p-4 bg-[#064e3b] border border-emerald-800 rounded-xl space-y-3">
                  <div className="flex gap-3 items-center">
                    {report.image && <img src={report.image} className="w-14 h-14 object-cover rounded-lg border border-emerald-900" />}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">{report.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${report.type === 'lost' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                          {report.type === 'lost' ? 'مفقود' : 'عاثر عليه'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">العمر: {report.age} عام | الجنسية: {report.nationality}</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-100 bg-[#022c22] p-2 rounded border border-emerald-900/50">
                    👚 <strong>الملابس:</strong> {report.clothes}
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-zinc-500">التاريخ: {report.date}</span>
                    <a href={`tel:${report.phone}`} className="text-xs font-black text-emerald-950 bg-[#ffcc29] px-3 py-1.5 rounded-lg">📞 اتصال لذويه</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

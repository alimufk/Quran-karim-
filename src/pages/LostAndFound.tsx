import { useState, useRef } from 'react';

export function LostAndFound() {
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة التعامل مع التقاط أو اختيار الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !description) {
      alert('الرجاء ملء جميع الحقول المطلوبة!');
      return;
    }
    alert('تم تسجيل البلاغ بنجاح وجاري المراجعة!');
    // هنا يمكنك تفريغ الحقول بعد الإرسال
    setName('');
    setPhone('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-white p-5 pb-24 font-sans" style={{ direction: 'rtl' }}>
      {/* الهيدر العلوي */}
      <div className="text-center mb-6 pt-4">
        <h1 className="text-2xl font-black text-[#ffcc29]">إرشاد التائهين والمفقودات</h1>
        <p className="text-xs text-emerald-300 mt-1">ساعد في إيصال المفقودات لأصحابها في المشاعر المقدسة</p>
      </div>

      {/* أزرار تحديد نوع البلاغ */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setReportType('lost')}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            reportType === 'lost' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-[#064e3b] text-zinc-300 border border-emerald-800'
          }`}
        >
          🔍 تائه / مفقود
        </button>
        <button
          type="button"
          onClick={() => setReportType('found')}
          className={`py-3 rounded-xl font-bold text-sm transition-all ${
            reportType === 'found' 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'bg-[#064e3b] text-zinc-300 border border-emerald-800'
          }`}
        >
          🤝 عثرت على شيء
        </button>
      </div>

      {/* الاستمارة الرئيسية */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* قسم رفع والتقاط الصور الفعلي */}
        <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 text-center">
          <label className="block text-xs font-bold text-emerald-300 text-right mb-2">صورة المفقود / الشيء المعثور عليه</label>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" // تتيح فتح الكاميرا مباشرة على الجوال
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
          />

          {image ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-emerald-700">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImage(null)} 
                className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1 px-2 rounded font-bold"
              >
                حذف ❌
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerImageUpload}
              className="w-full h-32 border-2 border-dashed border-emerald-600 rounded-lg flex flex-col items-center justify-center bg-[#022c22] hover:bg-emerald-950/50 transition-colors"
            >
              <span className="text-3xl mb-2">📸</span>
              <span className="text-xs text-zinc-300 font-medium">اضغط لالتقاط صورة أو اختيارها من الاستوديو</span>
            </button>
          )}
        </div>

        {/* حقل الاسم */}
        <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 space-y-1 text-right">
          <label className="block text-xs font-bold text-emerald-300">الاسم الثلاثي المكتوب في الهوية (إن وجد)</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب الاسم هنا..."
            className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#ffcc29]"
            required
          />
        </div>

        {/* حقل رقم الهاتف */}
        <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 space-y-1 text-right">
          <label className="block text-xs font-bold text-emerald-300">رقم الهاتف للتواصل (مع رمز الدولة)</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+964 0000 000 000"
            className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#ffcc29] text-left"
            style={{ direction: 'ltr' }}
            required
          />
        </div>

        {/* حقل تفاصيل ومكان المفقود */}
        <div className="bg-[#064e3b] p-4 rounded-xl border border-emerald-800 space-y-1 text-right">
          <label className="block text-xs font-bold text-emerald-300">مواصفات المفقود، آخر مكان شوهد فيه أو التوضيحات</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اكتب كامل التفاصيل لمساعدتنا..."
            className="w-full p-3 bg-[#022c22] border border-emerald-900 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#ffcc29] resize-none"
            required
          />
        </div>

        {/* زر الإرسال الأصفر الفخم والمعدل كاملاً لتغيير الثيم */}
        <button 
          type="submit" 
          className="w-full py-4 bg-[#ffcc29] text-emerald-950 font-black text-sm rounded-xl shadow-lg shadow-black/30 hover:bg-yellow-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          📢 إرسال البلاغ الآن
        </button>
      </form>
    </div>
  );
}

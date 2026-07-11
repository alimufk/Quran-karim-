import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, X, Camera, Image as ImageIcon, ShieldAlert, HeartPulse, Phone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LostAndFound() {
  const navigate = useNavigate();
  
  // التحكم في رقم الخطوة الحالية
  // 0: الشاشة الترحيبية الصفراء
  // 1: شاشة إدخال المعلومات والتنبيه
  // 2: شاشة التقاط صورة لوجه الشخص
  // 3: شاشة تأكيد التواصل عند إيجاد المفقود
  const [step, setStep] = useState(0);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // التعامل مع إرفاق صورة وهمية للمعاينة
  const handleSelectImageMethod = () => {
    setSelectedImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
    setShowImageOptions(false);
    setStep(3); // الانتقال للخطوة الأخيرة بعد إرفاق الصورة
  };

  const contacts = [
    { name: "الدفاع المدني الإسعاف", phone: "911", icon: <ShieldAlert size={18} /> },
    { name: "الهلال الأحمر السعودي", phone: "997", icon: <HeartPulse size={18} /> },
    { name: "أمن الطرق / الطوارئ", phone: "911", icon: <Phone size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col justify-between text-[#1e293b] relative select-none">
      
      {/* الخطوة 0: الشاشة الترحيبية الكاملة باللون الأصفر (مطابقة تماماً للصورة الأولى) */}
      {step === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#ffcc29] p-6 flex flex-col justify-between items-center text-center overflow-y-auto"
        >
          <div className="w-full flex justify-start">
            <button onClick={() => navigate(-1)} className="p-2 text-[#000]/70 hover:text-black">
              <ArrowRight size={24} />
            </button>
          </div>

          <div className="space-y-6 my-auto max-w-sm w-full">
            {/* أيقونة العدسة المكبرة التوضيحية */}
            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-16 h-16 text-[#064e3b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">إرشاد التائهين</h1>
              <p className="text-[#064e3b]/80 font-bold text-sm">العتبة العباسية المقدسة</p>
            </div>

            <div className="w-full border-t border-[#064e3b]/10 my-4" />

            {/* النصوص الإرشادية الثلاثة */}
            <div className="space-y-6 text-right px-2">
              <div className="flex gap-3 items-start">
                <p className="text-sm font-medium text-[#064e3b] leading-relaxed flex-1">
                  تقدم العتبة العباسية المقدسة خدمة إرشاد التائهين من خلال مجموعة نقاط تنتشر على طول طريق الزيارة المباركة.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <p className="text-sm font-medium text-[#064e3b] leading-relaxed flex-1">
                  استخدم هذه النافذة لتزويدنا بمعلومات أطفالك وذويك لكي نتمكن من التعرف عليهم وإبلاغك بحال فقدهم أثناء أدائك للزيارة.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <p className="text-sm font-bold text-red-700 leading-relaxed flex-1">
                  إتصل بالرقم المجاني ١٧٤ الخاص بخدمة إرشاد التائهين للتبليغ عن مفقود او اذا كان لديك اي استفسار عن الخدمة.
                </p>
              </div>
            </div>
          </div>

          {/* زر بدء الاستخدام السفلي الأبيض */}
          <button 
            onClick={() => setStep(1)}
            className="w-full max-w-sm py-4 bg-white text-[#064e3b] font-black text-lg rounded-2xl shadow-md active:scale-[0.99] transition-transform mb-4"
          >
            بدء الاستخدام
          </button>
        </motion.div>
      )}

      {/* شريط علوي موحد للخطوات اللاحقة باللون الأصفر (مطابق للصورة 2، 3، 4) */}
      {step > 0 && (
        <header className="bg-[#ffcc29] p-4 flex items-center justify-between shadow-sm z-10">
          <button className="p-1 text-[#064e3b]/80 hover:text-black">
            <Info size={22} />
          </button>
          <h2 className="font-black text-lg text-[#064e3b]">إرشاد التائهين</h2>
          <button onClick={() => setStep(0)} className="p-1 text-[#064e3b]/80 hover:text-black">
            <X size={22} />
          </button>
        </header>
      )}

      {/* محتوى الخطوات المتتالية */}
      <div className="flex-1 p-6 flex flex-col justify-between items-center text-center max-w-md mx-auto w-full">
        
        {/* الخطوة 1: شاشة إدخال المعلومات والتنبيه */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-auto space-y-8 w-full">
            <p className="text-lg font-bold text-[#064e3b] px-4 leading-relaxed">
              ادخل المعلومات المطلوبة التي تخصه والتي سوف نستخدمها للتواصل معك بحال فقد لاسامح الله
            </p>
            {/* رمز الوجه الدائري باللون الأصفر الرفيع */}
            <div className="w-48 h-48 rounded-full border-4 border-gray-300 flex items-center justify-center mx-auto">
              <div className="w-36 h-36 rounded-full border-4 border-[#ffcc29] flex items-center justify-center">
                <span className="text-5xl">🙂</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* الخطوة 2: التقاط صورة لوجه الشخص */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-auto space-y-8 w-full">
            <p className="text-lg font-bold text-[#064e3b] px-4 leading-relaxed">
              التقط صورة لوجه الشخص أو حدد صورته من معرض الصور
            </p>
            {/* رمز مسح الوجه الدائري والأقواس التحديدية */}
            <div className="w-48 h-48 rounded-full border-4 border-gray-300 flex items-center justify-center mx-auto relative">
              <div className="absolute inset-4 border-2 border-dashed border-[#ffcc29] rounded-full animate-spin duration-1000" />
              <span className="text-6xl z-10">👤</span>
            </div>
          </motion.div>
        )}

        {/* الخطوة 3: شاشة إشعار التواصل والخطوة الأخيرة */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-auto space-y-6 w-full">
            <p className="text-lg font-bold text-[#064e3b] px-4 leading-relaxed">
              عند إيجاد الشخص المفقود سيتم التواصل معك من خلال المعلومات التي تم تزويدنا بها مسبقاً
            </p>
            <div className="w-48 h-48 rounded-full border-4 border-gray-300 flex items-center justify-center mx-auto overflow-hidden bg-emerald-50">
              {selectedImage ? (
                <img src={selectedImage} alt="مرفق" className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">✨</span>
              )}
            </div>

            {/* عرض أرقام الطوارئ السريعة المحدثة بالأسفل كمرجع إضافي متناسق */}
            <div className="w-full text-right space-y-2 mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-[#059669] mb-2 flex items-center gap-1">
                <HelpCircle size={14} /> أرقام طوارئ بديلة:
              </h4>
              {contacts.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-semibold">
                  <span className="text-gray-600 flex items-center gap-2">{c.icon} {c.name}</span>
                  <span className="text-[#064e3b] font-bold">{c.phone}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* الأزرار التفاعلية السفلية لكل خطوة (مطابقة للتصميم الأصلي) */}
        {step > 0 && (
          <div className="w-full mt-auto mb-2">
            {step === 1 && (
              <button 
                onClick={() => setStep(2)} 
                className="w-full py-4 bg-[#ffcc29] text-[#064e3b] font-black text-lg rounded-2xl shadow-sm active:scale-[0.99] transition-transform"
              >
                التالي
              </button>
            )}

            {step === 2 && (
              <button 
                onClick={() => setShowImageOptions(true)} 
                className="w-full py-4 bg-[#ffcc29] text-[#064e3b] font-black text-lg rounded-2xl shadow-sm active:scale-[0.99] transition-transform"
              >
                التقط الصورة
              </button>
            )}

            {step === 3 && (
              <button 
                onClick={() => {
                  alert("تم حفظ البيانات بنجاح وسيتواصل مركز إرشاد التائهين معكم فوراً.");
                  setStep(0);
                }} 
                className="w-full py-4 bg-[#064e3b] text-white font-black text-lg rounded-2xl shadow-sm active:scale-[0.99] transition-transform"
              >
                إرسال وإتمام الطلب
              </button>
            )}
          </div>
        )}
      </div>

      {/* قائمة الخيارات المنبثقة لإرفاق الصورة (مطابقة للصورة قبل الأخيرة) */}
      <AnimatePresence>
        {showImageOptions && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              className="w-full max-w-md bg-white rounded-t-[32px] p-6 space-y-4 text-right"
            >
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => setShowImageOptions(false)} className="p-1 text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
                <h3 className="font-bold text-gray-700 text-sm">طريقة إرفاق الصورة</h3>
              </div>

              <button 
                onClick={handleSelectImageMethod}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center justify-between text-gray-700 transition-colors"
              >
                <Camera size={20} className="text-gray-400" />
                <span className="font-bold text-sm">بإستخدام الكاميرة</span>
              </button>

              <button 
                onClick={handleSelectImageMethod}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center justify-between text-gray-700 transition-colors"
              >
                <ImageIcon size={20} className="text-gray-400" />
                <span className="font-bold text-sm">من معرض الصور</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

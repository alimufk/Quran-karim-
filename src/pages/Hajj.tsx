import { motion } from 'framer-motion';
import { ArrowRight, Globe, Compass, BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hajj() {
  const navigate = useNavigate();
  
  const steps = [
    { title: "الإحرام", desc: "نية الدخول في النسك من الميقات مع لبس ملابس الإحرام." },
    { title: "طواف القدوم", desc: "الطواف حول الكعبة المشرفة 7 أشواط وتحية البيت العتيق." },
    { title: "السعي", desc: "السعي بين الصفا والمروة 7 أشواط سبعة أشواط كاملة." },
    { title: "يوم التروية (8 ذو الحجة)", desc: "الذهاب إلى منى والمبيت فيها وصلاة الصلوات قصرًا بلا جمع." },
    { title: "الوقوف بعرفة (9 ذو الحجة)", desc: "ركن الحج الأعظم، التواجد في عرفة والدعاء والذكر حتى غروب الشمس." },
    { title: "المزدلفة", desc: "المبيت في مزدلفة بعد الإفاضة من عرفة وجمع الحصى لرمي الجمرات." },
    { title: "رمي الجمرات وطواف الإفاضة", desc: "رمي جمرة العقبة الكبرى يوم العيد، ثم النحر، الحلق، وطواف الإفاضة." }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <header className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 active:scale-95 transition-all">
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#fbbf24]">بوابة الحج والعمرة</h1>
          <p className="text-[#059669] text-xs">دليلك الشامل لأداء المناسك خطوة بخطوة</p>
        </div>
      </header>

      <div className="bg-gradient-to-br from-[#064e3b] to-[#042f2e] p-5 rounded-2xl border border-[#059669]/40 text-center relative overflow-hidden">
        <Globe className="w-12 h-12 text-[#fbbf24] mx-auto mb-2 opacity-80" />
        <h2 className="text-[#f0f9ff] font-bold text-lg">"وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ"</h2>
        <p className="text-emerald-100/70 text-xs mt-1">تقبل الله منا ومنكم صالح الأعمال</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-[#fbbf24] text-lg flex items-center gap-2">
          <Compass size={20} /> صفة الحج والمناسك:
        </h3>
        {steps.map((step, idx) => (
          <div key={idx} className="bg-[#064e3b]/30 border border-[#059669]/20 p-4 rounded-xl flex gap-3 items-start">
            <div className="w-7 h-7 bg-[#fbbf24]/10 rounded-full flex items-center justify-center text-[#fbbf24] font-bold text-sm shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div>
              <h4 className="font-bold text-[#f0f9ff] text-base">{step.title}</h4>
              <p className="text-emerald-100/70 text-xs mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

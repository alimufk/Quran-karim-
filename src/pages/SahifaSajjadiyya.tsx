import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, Share2, ZoomIn, ZoomOut, Palette, Check, Bookmark, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// نموذج مبسط لأدعية الصحيفة السجادية (يمكنك إضافة بقية الأدعية هنا)
const sajjadSupplications = [
  {
    id: 1,
    title: "الدعاء الأول: في التحميد لله عز وجل",
    text: `الْحَمْدُ لِلَّهِ الْأَوَّلِ بِلَا أَوَّلٍ كَانَ قَبْلَهُ، وَالْآخِرِ بِلَا آخِرٍ يَكُونُ بَعْدَهُ. الَّذِي قَصُرَتْ عَنْ رُؤْيَتِهِ أَبْصَارُ النَّاظِرِينَ، وَعَجَزَتْ عَنْ نَعْتِهِ أَوْهَامُ الْوَاصِفِينَ. ابْتَدَعَ بِقُدْرَتِهِ الْخَلْقَ ابْتِدَاعاً، وَاخْتَرَعَهُمْ عَلَى مَشِيَّتِهِ اخْتِرَاعاً. ثُمَّ سَلَكَ بِهِمْ طَرِيقَ إِرَادَتِهِ، وَبَعَثَهُمْ فِي مَحَبَّتِهِ... وَهَذَا كِتَابُكَ يَا إِلَهِي أَنْزَلْتَهُ عَلَى عَبْدِكَ وَخَلِيفَتِكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ...`
  },
  {
    id: 2,
    title: "الدعاء الثاني: في الصلاة على محمد وآله",
    text: `وَالسَّلَامُ عَلَى مُحَمَّدٍ وَآلِهِ الطَّيِّبِينَ الطَّاهِرِينَ... اللَّهُمَّ وَصَلِّ عَلَى مُحَمَّدٍ وَآلِهِ، كَمَا هَدَيْتَنَا بِهِ. وَصَلِّ عَلَى مُحَمَّدٍ وَآلِهِ، كَمَا اسْتَنْقَذْتَنَا بِهِ. وَصَلِّ عَلَى مُحَمَّدٍ وَآلِهِ، صَلَاةً تَشْفَعُ لَنَا يَوْمَ الْقِيَامَةِ وَيَوْمَ الْفَاقَةِ إِلَيْكَ...`
  },
  {
    id: 3,
    title: "الدعاء الثالث: في الصلاة على حملة العرش",
    text: `اللَّهُمَّ وَحَمَلَةُ عَرْشِكَ الَّذِينَ لَا يَفْتُرُونَ عَنْ تَسْبِيحِكَ، وَلَا يَسَامُونَ مِنْ تَقْدِيسِكَ، وَلَا يَسْتَحْسِرُونَ مِنْ عِبَادَتِكَ، وَلَا يُؤْثِرُونَ تَقْصِيرَ الْجِدِّ فِي أَمْرِك...`
  }
];

export function LostAndFound() {
  const navigate = useNavigate();

  // حالات التحكم بالنص والثيمات
  const [selectedSupplication, setSelectedSupplication] = useState(sajjadSupplications[0]);
  const [fontSize, setFontSize] = useState(18); // حجم الخط الافتراضي
  const [copied, setCopied] = useState(false);

  // أنظمة الثيمات للقسم (داكن، فاتح، برونزي)
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'emerald'>('dark');

  const themes = {
    dark: {
      bg: 'bg-[#0a0f1d]',
      card: 'bg-[#111827]',
      text: 'text-slate-100',
      accent: 'text-amber-400',
      border: 'border-slate-800',
      btnBg: 'bg-slate-800 hover:bg-slate-700 text-slate-200'
    },
    sepia: {
      bg: 'bg-[#fbf7ee]',
      card: 'bg-[#f4ebd0]',
      text: 'text-[#433422]',
      accent: 'text-[#8b5a2b]',
      border: 'border-[#e4d5b7]',
      btnBg: 'bg-[#e4d5b7] hover:bg-[#d4c4a3] text-[#433422]'
    },
    emerald: {
      bg: 'bg-[#061a14]',
      card: 'bg-[#0b2920]',
      text: 'text-emerald-50',
      accent: 'text-emerald-400',
      border: 'border-emerald-900/50',
      btnBg: 'bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200'
    }
  };

  const currentTheme = themes[theme];

  // وظيفة النسخ
  const handleCopy = () => {
    navigator.clipboard.writeText(`${selectedSupplication.title}\n\n${selectedSupplication.text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // وظيفة المشاركة
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedSupplication.title,
        text: `${selectedSupplication.title}\n\n${selectedSupplication.text}`,
      }).catch(console.error);
    } else {
      handleCopy();
      alert('تم نسخ النص لمشاركته!');
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} flex flex-col font-sans text-right transition-colors duration-300`} dir="rtl">
      {/* الهيدر */}
      <header className={`p-4 border-b ${currentTheme.border} flex items-center justify-between shadow-xl sticky top-0 z-50 backdrop-blur-md bg-opacity-90`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className={`p-2 rounded-full transition-all ${currentTheme.btnBg}`}
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className={`text-md font-black ${currentTheme.accent} flex items-center gap-1`}>
              📖 الصحيفة السجادية المباركة
            </h1>
            <p className="text-[10px] opacity-70">النسخة الكاملة مع خيارات التحكم بالقراءة</p>
          </div>
        </div>

        {/* زر تغيير الثيم */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setTheme('dark')} title="ثيم داكن" className={`w-6 h-6 rounded-full bg-[#111827] border ${theme === 'dark' ? 'border-amber-400 scale-110' : 'border-transparent'}`} />
          <button onClick={() => setTheme('sepia')} title="ثيم ورقي" className={`w-6 h-6 rounded-full bg-[#f4ebd0] border ${theme === 'sepia' ? 'border-[#8b5a2b] scale-110' : 'border-transparent'}`} />
          <button onClick={() => setTheme('emerald')} title="ثيم إسلامي أخضر" className={`w-6 h-6 rounded-full bg-[#0b2920] border ${theme === 'emerald' ? 'border-emerald-400 scale-110' : 'border-transparent'}`} />
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4 overflow-y-auto pb-24">
        
        {/* قائمة اختيار الدعاء */}
        <div className={`p-3 rounded-2xl border ${currentTheme.card} ${currentTheme.border} space-y-2 shadow-sm`}>
          <label className="text-xs font-bold opacity-80 block flex items-center gap-1">
            <BookOpen size={14} className={currentTheme.accent} /> اختر الدعاء أو المناجاة:
          </label>
          <select 
            value={selectedSupplication.id}
            onChange={(e) => {
              const found = sajjadSupplications.find(s => s.id === Number(e.target.value));
              if (found) setSelectedSupplication(found);
            }}
            className={`w-full p-2.5 rounded-xl text-xs font-bold outline-none border ${currentTheme.border} bg-black/20`}
          >
            {sajjadSupplications.map((item) => (
              <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {/* شريط الأدوات (تكبير، تصغير، نسخ، مشاركة) */}
        <div className={`flex items-center justify-between p-2.5 rounded-2xl border ${currentTheme.card} ${currentTheme.border}`}>
          <div className="flex items-center gap-1.5">
            {/* تكبير الخط */}
            <button 
              onClick={() => setFontSize(prev => Math.min(prev + 2, 28))} 
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${currentTheme.btnBg}`}
              title="تكبير الخط"
            >
              <ZoomIn size={16} /> تكبير
            </button>
            {/* تصغير الخط */}
            <button 
              onClick={() => setFontSize(prev => Math.max(prev - 2, 14))} 
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${currentTheme.btnBg}`}
              title="تصغير الخط"
            >
              <ZoomOut size5={16} /> تصغير
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* زر النسخ */}
            <button 
              onClick={handleCopy} 
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${copied ? 'bg-emerald-500 text-slate-950 font-black' : currentTheme.btnBg}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
            {/* زر المشاركة */}
            <button 
              onClick={handleShare} 
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${currentTheme.btnBg}`}
              title="مشاركة النص"
            >
              <Share2 size={16} /> مشاركة
            </button>
          </div>
        </div>

        {/* صندوق عرض نص الدعاء */}
        <div className={`p-5 rounded-3xl border ${currentTheme.card} ${currentTheme.border} shadow-xl relative`}>
          <h2 className={`text-base font-black mb-4 pb-3 border-b ${currentTheme.border} ${currentTheme.accent}`}>
            {selectedSupplication.title}
          </h2>
          
          <div 
            className="leading-loose text-justify font-serif select-text transition-all"
            style={{ fontSize: `${fontSize}px` }}
          >
            {selectedSupplication.text}
          </div>
        </div>

      </main>
    </div>
  );
}

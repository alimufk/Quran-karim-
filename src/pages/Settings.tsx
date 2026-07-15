import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Bell, 
  Volume2, 
  Clock, 
  MapPin, 
  Calendar, 
  Globe, 
  Moon, 
  User, 
  Share2, 
  Star, 
  Info 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // حالات تفاعلية واقعية لتغيير القيم مباشرة في الصفحة
  const [hijriAdjustment, setHijriAdjustment] = useState('تصحيح تلقائي');
  const [language, setLanguage] = useState('العربية');
  const [appThemeText, setAppThemeText] = useState('الوضع المظلم');

  // دالة لمشاركة التطبيق
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق القرآن الكريم',
        text: 'تحميل تطبيق القرآن الكريم - تطبيق إسلامي شامل ومتميز',
        url: window.location.origin
      }).catch(console.error);
    } else {
      alert('تم نسخ رابط مشاركة التطبيق!');
    }
  };

  return (
    <div className={`p-4 min-h-[100dvh] pb-10 transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f4f8f5]' : 'bg-[#121214]'
    }`} dir="rtl">

      {/* شريط العنوان العلوي */}
      <header className={`flex items-center gap-3 p-3 mb-4 rounded-2xl ${
        theme === 'light' ? 'bg-white shadow-sm' : 'bg-[#1a1a1e]'
      }`}>
        <button 
          onClick={() => navigate(-1)} 
          className={`p-2 rounded-xl transition-all active:scale-95 ${
            theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-[#26262b] text-[#fbbf24]'
          }`}
        >
          <ArrowRight size={18} />
        </button>
        <h1 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
          الإعدادات
        </h1>
      </header>

      <div className="space-y-5 max-w-md mx-auto">

        {/* القسم الأول: الإشعارات والأذان */}
        <div className={`rounded-3xl p-2 space-y-1 ${
          theme === 'light' ? 'bg-white shadow-sm border border-slate-100' : 'bg-[#1a1a1e]'
        }`}>
          {/* الإشعارات */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-400" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>الإشعارات</span>
            </div>
          </div>

          {/* الأذان */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-slate-400" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>الاذان</span>
            </div>
          </div>

          {/* أوقات الصلاة */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-slate-400" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>أوقات الصلاة</span>
            </div>
          </div>

          {/* الموقع */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-slate-400" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>الموقع</span>
            </div>
            <span className="text-xs font-semibold text-[#059669]">العراق، بغداد</span>
          </div>
        </div>


        {/* القسم الثاني: الإعدادات العامة */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 px-4 mb-2">الإعدادات العامة</h2>
          
          <div className={`rounded-3xl p-2 space-y-1 ${
            theme === 'light' ? 'bg-white shadow-sm border border-slate-100' : 'bg-[#1a1a1e]'
          }`}>
            {/* تصحيح التاريخ الهجري */}
            <div 
              onClick={() => setHijriAdjustment(prev => prev === 'تصحيح تلقائي' ? 'يدوي (0+)' : 'تصحيح تلقائي')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>تصحيح التاريخ الهجري</span>
              </div>
              <span className="text-xs font-semibold text-[#059669]">{hijriAdjustment}</span>
            </div>

            {/* لغة التطبيق */}
            <div 
              onClick={() => setLanguage(prev => prev === 'العربية' ? 'English' : 'العربية')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>لغة التطبيق</span>
              </div>
              <span className="text-xs font-semibold text-[#059669]">{language}</span>
            </div>

            {/* مظهر التطبيق */}
            <div 
              onClick={() => {
                toggleTheme();
                setAppThemeText(theme === 'light' ? 'الوضع المظلم' : 'الوضع المضيء');
              }}
              className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>مظهر التطبيق</span>
              </div>
              <span className="text-xs font-semibold text-[#059669]">{appThemeText}</span>
            </div>

            {/* حسابي */}
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <User size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>حسابي</span>
              </div>
            </div>
          </div>
        </div>


        {/* القسم الثالث: ادعم تطبيق Al Quran */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 px-4 mb-2">ادعم تطبيق Al Quran</h2>
          
          <div className={`rounded-3xl p-2 space-y-1 ${
            theme === 'light' ? 'bg-white shadow-sm border border-slate-100' : 'bg-[#1a1a1e]'
          }`}>
            {/* مشاركة التطبيق */}
            <div 
              onClick={handleShare}
              className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Share2 size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>مشاركة التطبيق</span>
              </div>
            </div>

            {/* تقييم التطبيق */}
            <div 
              onClick={() => alert('سيتم تحويلك إلى متجر التطبيقات للتقييم ⭐')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>تقييم التطبيق</span>
              </div>
            </div>

            {/* عن التطبيق */}
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-500/5 rounded-2xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-slate-400" />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>عن التطبيق</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

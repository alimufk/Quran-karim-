import { motion, AnimatePresence } from 'framer-motion'; 
import { Settings, Bell, BookOpen, Clock, HeartPulse, Bookmark, ListTodo, Star, Sun, Moon, Image, Calendar, MapPin, Sparkles, ArrowUpCircle, X } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react'; 
import { useTheme } from '../context/ThemeContext'; 

// 1. رقم إصدار التطبيق الحالي المثبت عند المستخدم 
const CURRENT_APP_VERSION = "1.0.0"; 

const getHijriDate = () => { 
  const date = new Date(); 
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric', }).format(date); 
}; 

const getGregorianDate = () => { 
  const date = new Date(); 
  return new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', }).format(date); 
}; 

const dailyHadiths = [ 
  { text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", source: "صحيح البخاري" }, 
  { text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", source: "صحيح البخاري" }, 
  { text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", source: "صحيح البخاري" }, 
  { text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ", source: "متفق عليه" }, 
  { text: "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا", source: "صحيح مسلم" }, 
  { text: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", source: "متفق عليه" }, 
  { text: "مَنْ لَا يَرْحَمُ لَا يُرْحَمُ", source: "متفق عليه" }, 
  { text: "رِضَى الرَّبِّ فِي رِضَى الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ", source: "سنن الترمذي" }, 
  { text: "الْبِرُّ حُسْنُ الْخُلُقِ", source: "صحيح مسلم" }, 
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", source: "متفق عليه" } 
]; 

const getDailyHadith = () => { 
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24); 
  return dailyHadiths[dayOfYear % dailyHadiths.length]; 
}; 

export function Home() { 
  const navigate = useNavigate(); 
  const { theme, toggleTheme } = useTheme(); 
  const dailyHadith = getDailyHadith(); 
  const [lastRead, setLastRead] = useState<{surahId: number, surahName: string, ayahNumber: number} | null>(null); 
  
  // حقول خاصة بنظام التحديث التلقائي 
  const [showUpdateModal, setShowUpdateModal] = useState(false); 
  const [updateInfo, setUpdateInfo] = useState<{ url: string; force: boolean; version: string }>({ url: 'https://github.com/alimufk/Quran-karim-/releases', force: false, version: '1.0.0' }); 

  useEffect(() => { 
    try { 
      const saved = localStorage.getItem('quran_last_read'); 
      if (saved) { 
        setLastRead(JSON.parse(saved)); 
      } 
    } catch(e) {} 

    // دالة الفحص الذكي للتحديث من مستودع GitHub الخاص بك 
    const checkForUpdates = async () => { 
      try { 
        const response = await fetch('https://raw.githubusercontent.com/alimufk/Quran-karim-/main/version.json'); 
        if (!response.ok) return; 
        const data = await response.json(); 
        
        // مقارنة الإصدار الحالي مع الرقم الموجود على السيرفر 
        if (data.latestVersion && data.latestVersion !== CURRENT_APP_VERSION) { 
          setUpdateInfo({ 
            url: data.updateUrl || 'https://github.com/alimufk/Quran-karim-/releases', 
            force: data.forceUpdate || false, 
            version: data.latestVersion 
          }); 
          setShowUpdateModal(true); 
        } 
      } catch (error) { 
        console.error("خطأ أثناء فحص التحديثات اليومية:", error); 
      } 
    }; 
    checkForUpdates(); 
  }, []); 

  return ( 
    <> 
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6" > 
        {/* Header */} 
        <header className="flex justify-between items-center mb-6 z-10"> 
          <div> 
            <h1 className="text-3xl font-bold text-[#fbbf24] tracking-tight">القرآن الكريم</h1> 
            <p className="text-[#059669] text-sm mt-1">تطبيق إسلامي شامل</p> 
          </div> 
          <div className="flex gap-3 items-center"> 
            <Link to="/notifications" className="p-2.5 bg-[#064e3b] hover:bg-[#059669]/30 text-[#fbbf24] rounded-full border border-[#059669]/30 transition-all flex items-center justify-center shadow-md active:scale-95 duration-200 relative group" title="تنبيهات الأذكار اليومية" id="home-notifications-bell" > 
              <Bell size={18} /> 
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#064e3b] animate-pulse" /> 
            </Link> 
            <button onClick={toggleTheme} className="p-2.5 bg-[#064e3b] hover:bg-[#059669]/30 text-[#fbbf24] rounded-full border border-[#059669]/30 transition-all flex items-center justify-center shadow-md active:scale-95 duration-200" title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'} > 
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
            </button> 
            <Link to="/prayer" className="bg-[#064e3b] px-4 py-2 rounded-full border border-[#059669]/30 flex items-center gap-2 cursor-pointer"> 
              <span className="text-xs text-[#059669]">الموقع</span> 
              <Settings className="w-4 h-4 text-[#fbbf24]" /> 
            </Link> 
          </div> 
        </header> 

        {/* Date Component */} 
        <div className="bg-gradient-to-r from-[#064e3b] to-[#042f2e] p-6 rounded-[28px] border border-[#059669]/40 relative overflow-hidden shadow-xl flex items-center justify-between mb-4"> 
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fbbf24]/10 rounded-full blur-[25px]" /> 
          <div className="relative z-10 flex items-center gap-4"> 
            <div className="w-14 h-14 bg-[#fbbf24]/10 rounded-2xl flex items-center justify-center text-[#fbbf24]"> 
              <Calendar size={28} /> 
            </div> 
            <div className="flex flex-col"> 
              <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider mb-1">تاريخ اليوم</span> 
              <h2 className="text-lg font-bold text-[#f0f9ff] leading-tight">{getHijriDate()}</h2> 
              <h3 className="text-sm font-medium text-[#059669] mt-0.5">{getGregorianDate()}</h3> 
            </div> 
          </div> 
        </div> 

        {/* Hero Card */} 
        <Link to="/prayer" className="block mt-4 bg-gradient-to-br from-[#064e3b] to-[#042f2e] p-8 rounded-[32px] border border-[#059669]/40 relative overflow-hidden shadow-2xl transition hover:scale-[1.02] flex items-center justify-between"> 
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#fbbf24] opacity-5 blur-[80px]" /> 
          <div className="relative z-10 flex items-center gap-4"> 
            <div className="bg-[#fbbf24]/10 p-4 rounded-2xl text-[#fbbf24]"> 
              <Clock size={32} /> 
            </div> 
            <div className="space-y-1"> 
              <p className="text-[#059669] text-sm font-bold">أوقات الصلاة</p> 
              <h3 className="text-xl font-bold text-[#f0f9ff]">عرض المواقيت والأذان</h3> </div> 
          </div> 
          <div className="relative z-10"> 
            <p className="text-2xl font-black text-[#fbbf24] mr-4">←</p> 
          </div> 
        </Link> 

        {/* Continue Reading */} 
        {lastRead && ( 
          <div className="mt-4 p-5 bg-[#059669]/20 border border-[#059669]/40 rounded-3xl relative overflow-hidden flex items-center justify-between"> 
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#fbbf24]/10 rounded-full blur-[20px]" /> 
            <div className="z-10 flex gap-4 items-center"> 
              <div className="w-12 h-12 bg-[#064e3b] rounded-full flex items-center justify-center border border-[#059669]/40 text-[#fbbf24]"> 
                <Bookmark size={24} fill="currentColor" /> 
              </div> 
              <div> 
                <p className="text-sm text-[#059669] font-bold mb-1">متابعة القراءة</p> 
                <p className="text-lg text-[#f0f9ff] font-bold">سورة {lastRead.surahName}</p> 
                <p className="text-xs text-[#059669]">الآية {lastRead.ayahNumber}</p> 
              </div> 
            </div> 
            <button onClick={() => navigate(`/quran/${lastRead.surahId}?ayah=${lastRead.ayahNumber}`)} className="z-10 bg-[#fbbf24] text-[#022c22] px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-[#fcd34d] transition-colors" > إكمال </button> 
          </div> 
        )} 

        {/* AI Assistant Banner */} 
        <Link to="/ai-assistant" className="block mt-4 bg-gradient-to-r from-[#064e3b] to-[#022c22] p-6 rounded-[28px] border border-[#059669]/40 relative overflow-hidden shadow-xl hover:scale-[1.01] transition-all group"> 
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#fbbf24]/10 rounded-full blur-[25px]" /> 
          <div className="relative z-10 flex items-center justify-between"> 
            <div className="flex items-center gap-4"> 
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#fbbf24] group-hover:rotate-12 transition-transform"> 
                <Sparkles size={26} className="animate-pulse" /> 
              </div> 
              <div className="text-right"> 
                <p className="text-[#fbbf24] text-xs font-bold uppercase tracking-wide mb-0.5 flex items-center gap-1 justify-start"> 
                  <span>جديد</span> 
                  <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full" /> 
                </p> 
                <h3 className="text-lg font-black text-[#f0f9ff]">مساعد الذكاء الاصطناعي</h3> 
                <p className="text-emerald-100/70 text-xs mt-0.5 font-medium">اطرح أي سؤال حول معالم الكوفة، تفسير الآيات والأدعية</p> 
              </div> 
            </div> 
            <span className="text-[#fbbf24] text-xl font-bold">←</span> 
          </div> 
        </Link> 

        {/* Quick Actions */} 
        <div className="grid grid-cols-2 gap-4 mt-6"> 
          
          {/* تم مسح زر الفنادق بنجاح من هنا */}

          {/* 🌟 زر دليل الأربعين الجديد والمطور مدمج هنا بدقة واحترافية 🌟 */} 
          <button onClick={() => navigate('/guide')} className="col-span-2 bg-gradient-to-r from-[#d97706]/10 to-[#b45309]/20 border border-[#d97706]/40 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#d97706]/20 transition-all group relative overflow-hidden shadow-md text-right"> 
            <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-[#d97706]/5 rounded-full blur-xl" /> 
            <div className="flex items-center gap-4 relative z-10"> 
              <div className="p-3 bg-[#d97706]/25 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <MapPin size={28} /> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-bold text-lg text-[#fbbf24]">دليل الأربعين والزائرين</span> 
                <span className="text-xs text-emerald-100/70">المرافق والمواكب والخدمات في كربلاء، النجف وبابل</span> 
              </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold text-lg">←</span> 
          </button> 

          <Link to="/quran" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <BookOpen size={28} /> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">قراءة القرآن</span> 
          </Link> 

          <Link to="/khatmah" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <ListTodo size={28} /> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">مخطط الختمة</span> 
          </Link> 

          <Link to="/favorites" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <Star size={28} /> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">المحفوظات</span> 
          </Link> 

          <Link to="/reciters" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] transition-transform"> 
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">الاستماع</span> 
          </Link> 

          <Link to="/azkar" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <HeartPulse size={28} /> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">الأذكار</span> 
          </Link> 

          <Link to="/qibla" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">اتجاه القبلة</span> 
          </Link> 

          <Link to="/rakat-counter" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /> 
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /> 
                <path d="M12 2v2" /> 
                <path d="M12 20v2" /> 
                <path d="m4.93 4.93 1.41 1.41" /> 
                <path d="m17.66 17.66 1.41 1.41" /> 
                <path d="M2 12h2" /> 
                <path d="M20 12h2" /> 
                <path d="m6.34 17.66-1.41 1.41" /> 
                <path d="m19.07 4.93-1.41 1.41" /> 
              </svg> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">عداد الركع</span> 
          </Link> 

          <Link to="/tasbeeh" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                <circle cx="12" cy="12" r="10"></circle> 
                <circle cx="12" cy="12" r="3"></circle> 
              </svg> 
            </div><span className="font-medium text-sm text-[#f0f9ff]">المسبحة</span> 
          </Link> 

          <Link to="/names-of-allah" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:bg-[#064e3b]/60 transition-all duration-300"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform duration-300"> 
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /> 
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /> 
              </svg> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">أسماء الله</span> 
          </Link> 

          <Link to="/ramadan" className="bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
              <Moon size={28} /> 
            </div> 
            <span className="font-medium text-sm text-[#f0f9ff]">قسم رمضان</span> 
          </Link> 

          {/* 2. قسم صائمون الأصلي */} 
          <Link to="/saimoon" className="col-span-2 bg-[#fbbf24]/10 border border-[#fbbf24]/30 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#fbbf24]/20 transition-all group relative overflow-hidden shadow-md"> 
            <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-[#fbbf24]/5 rounded-full blur-xl" /> 
            <div className="flex items-center gap-4 relative z-10"> 
              <div className="p-3 bg-[#fbbf24]/25 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <Calendar size={28} /> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-bold text-lg text-[#fbbf24]">قسم صائمون</span> 
                <span className="text-xs text-[#059669]">أوقات الصيام، عدادات القضاء، الأدعية، والأحكام</span> </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold text-lg">←</span> 
          </Link> 

          {/* 3. قسم المساجد القريبة */} 
          <Link to="/mosques" className="col-span-2 bg-[#10b981]/10 border border-[#10b981]/30 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#10b981]/20 transition-all group relative overflow-hidden shadow-md"> 
            <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-[#10b981]/5 rounded-full blur-xl" /> 
            <div className="flex items-center gap-4 relative z-10"> 
              <div className="p-3 bg-[#10b981]/25 rounded-2xl text-[#10b981] group-hover:scale-110 transition-transform"> 
                <MapPin size={28} /> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-bold text-lg text-[#10b981]">المساجد القريبة</span> 
                <span className="text-xs text-[#34d399]">ابحث عن أقرب المساجد جغرافياً، والمسافات والاتجاهات الحقيقية</span> </div> 
            </div> 
            <span className="text-[#10b981] font-bold text-lg">←</span> 
          </Link> 

          <Link to="/radios" className="col-span-2 bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="flex items-center gap-4"> 
              <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-medium text-lg text-[#f0f9ff]">إذاعات القرآن الكريم</span> 
                <span className="text-xs text-[#059669]">بث مباشر لجميع القراء</span> </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold">→</span> 
          </Link> 

          <Link to="/shia-duas" className="col-span-2 bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="flex items-center gap-4"> 
              <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-medium text-lg text-[#f0f9ff]">أدعية صوتية استماع</span> 
                <span className="text-xs text-[#059669]">كميل، الندبة، العهد، والمزيد</span> </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold">→</span> 
          </Link> 

          <Link to="/ziyarats" className="col-span-2 bg-[#064e3b]/40 border border-[#059669]/20 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#059669]/30 transition-all group"> 
            <div className="flex items-center gap-4"> 
              <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <BookOpen size={28} /> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-medium text-lg text-[#f0f9ff]">الزيارات</span> 
                <span className="text-xs text-[#059669]">الزيارات العامة وزيارات الأيام</span> </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold">→</span> 
          </Link> 

          <Link to="/wallpapers" className="col-span-2 bg-[#059669]/20 border border-[#059669]/40 p-5 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#059669]/30 transition-all group relative overflow-hidden"> 
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#fbbf24]/5 rounded-full blur-[10px]" /> 
            <div className="flex items-center gap-4 relative z-10"> 
              <div className="p-3 bg-[#fbbf24]/10 rounded-2xl text-[#fbbf24] group-hover:scale-110 transition-transform"> 
                <Image size={28} /> 
              </div> 
              <div className="flex flex-col"> 
                <span className="font-medium text-lg text-[#f0f9ff]">خلفيات الهاتف بدقة عالية</span> 
                <span className="text-xs text-[#fbbf24]">المراقد المقدسة، المناسبات الإسلامية والمخطوطات</span> </div> 
            </div> 
            <span className="text-[#fbbf24] font-bold text-lg relative z-10">←</span> 
          </Link> 
        </div> 

        {/* Daily Ayah */} 
        <div className="mt-6 p-6 bg-[#064e3b]/40 border border-[#059669]/20 rounded-[32px]"> 
          <div className="flex items-center gap-2 mb-4"> 
            <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full"></span> 
            <h4 className="text-xs font-semibold text-[#fbbf24] uppercase tracking-widest">آية اليوم</h4> 
          </div> 
          <p className="quran-text text-2xl text-center text-[#f0f9ff] leading-relaxed italic"> "إِنَّ مَعَ الْعُسْرِ يُسْرًا" </p> 
          <p className="text-center text-xs text-[#059669] mt-3">[ سورة الشرح : 6 ]</p> 
        </div> 

        {/* Daily Hadith */} 
        <div className="mt-6 p-6 bg-gradient-to-br from-[#064e3b]/60 to-[#042f2e]/80 border border-[#059669]/30 rounded-[32px] shadow-lg"> 
          <div className="flex items-center gap-2 mb-4"> 
            <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full"></span> 
            <h4 className="text-xs font-semibold text-[#fbbf24] uppercase tracking-widest">حديث اليوم</h4> 
          </div> 
          <p className="font-arabic text-xl text-center text-[#f0f9ff] leading-relaxed italic px-2"> "{dailyHadith.text}" </p> 
          <p className="text-center text-xs text-[#059669] mt-4 font-medium">[ {dailyHadith.source} ]</p> 
        </div> 

        {/* Programmer Credit */} 
        <div className="mt-8 mb-4 text-center"> 
          <p className="text-sm text-[#059669]"> تطوير المبرمج <span className="font-bold text-[#fbbf24]">علاوي النعيمي</span> </p> 
        </div> 
      </motion.div> 

      {/* 🌟 نافذة التحديث المنبثقة الذكية والمتناسقة مع هوية التطبيق الخضراء والذهبية */} 
      <AnimatePresence> 
        {showUpdateModal && ( 
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"> 
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-md overflow-hidden bg-gradient-to-b from-[#064e3b] to-[#022c22] border border-[#fbbf24]/40 rounded-[32px] p-6 shadow-2xl relative text-center" > 
              {/* زر الإغلاق: يظهر فقط إذا لم يكن التحديث إجبارياً */} 
              {!updateInfo.force && ( 
                <button onClick={() => setShowUpdateModal(false)} className="absolute top-4 left-4 p-2 text-[#fbbf24]/70 hover:text-[#fbbf24] bg-white/5 rounded-full transition-colors" > 
                  <X size={18} /> 
                </button> 
              )} 
              {/* الأيقونة العلوية المتحركة */} 
              <div className="w-20 h-20 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-full flex items-center justify-center text-[#fbbf24] mx-auto mb-5 shadow-lg"> 
                <ArrowUpCircle size={44} className="animate-bounce mt-1" /> 
              </div> 
              <h3 className="text-2xl font-black text-[#fbbf24] mb-2">يتوفر تحديث جديد!</h3> 
              <p className="text-emerald-100/80 text-sm leading-relaxed max-w-xs mx-auto mb-4"> قام المبرمج <span className="font-bold text-[#fbbf24]">علاوي النعيمي</span> بإطلاق إصدار جديد ومحسن يحتوي على إضافات وميزات جديدة. </p> 
              {/* رقم الإصدار الجديد */} 
              <div className="inline-block bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 rounded-full px-4 py-1 text-xs font-bold mb-6 tracking-wide"> الإصدار الجديد: v{updateInfo.version} </div> 
              {/* الأزرار السفليّة */} 
              <div className="space-y-3"> 
                <a href={updateInfo.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#fbbf24] text-[#022c22] font-black py-4 rounded-2xl shadow-xl hover:bg-[#fcd34d] active:scale-[0.98] transition-all text-base tracking-wide" > تحديث الآن </a> 
                {!updateInfo.force && ( 
                  <button onClick={() => setShowUpdateModal(false)} className="block w-full text-center bg-white/5 text-[#fbbf24] border border-[#fbbf24]/20 font-bold py-3.5 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all text-sm" > تذكيري لاحقاً </button> 
                )} 
              </div> 
            </motion.div> 
          </div> 
        )} 
      </AnimatePresence> 
    </> 
  ); 
}

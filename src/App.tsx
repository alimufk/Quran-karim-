import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav } from './pages/data/components/BottomNav';
import { Home } from './pages/Home';
import { Quran } from './pages/Quran';
import { Surah } from './pages/Surah';
import { Azkar } from './pages/Azkar';
import { Qibla } from './pages/Qibla';
import { Reciters } from './pages/Reciters';
import { Listen } from './pages/Listen';
import { PrayerTimes } from './pages/PrayerTimes';
import { ShiaDuas } from './pages/ShiaDuas';
import { Tasbeeh } from './pages/Tasbeeh';
import { NamesOfAllah } from './pages/NamesOfAllah';
import { Radios } from './pages/Radios';
import { About } from './pages/About';
import { AiAssistant } from './pages/AiAssistant';
import { Favorites } from './pages/Favorites';
import { Khatmah } from './pages/Khatmah';
import { RakatCounter } from './pages/RakatCounter';
import { Ziyarats } from './pages/Ziyarats';
import { ZiyaratDetail } from './pages/ZiyaratDetail';
import { AzkarDetail } from './pages/AzkarDetail';
import { Wallpapers } from './pages/Wallpapers';
import { Saimoon } from './pages/Saimoon';
import { Ramadan } from './pages/Ramadan';
import { Mosques } from './pages/Mosques';
import { Hotels } from './pages/Hotels';
import { HotelDetail } from './pages/HotelDetail';
import { NotificationsSettings } from './pages/NotificationsSettings';
import { usePrayerTimes, PrayerTimesProvider } from './hooks/usePrayerTimes';
import { useNotifications } from './hooks/useNotifications';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import GuideDashboard from './pages/GuideDashboard';


function AppContent() {
  const { audioRef, resolvedUrl } = usePrayerTimes();
  const { theme } = useTheme();

  // Run the background notification scheduler
  useNotifications();

  return (
    <div className={`flex flex-col h-[100dvh] max-w-md mx-auto shadow-xl overflow-hidden relative transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f4f8f5] text-[#1e293b] light-mode' : 'bg-[#022c22] text-[#f0f9ff]'
    }`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/quran/:surahId" element={<Surah />} />
          <Route path="/reciters" element={<Reciters />} />
          <Route path="/listen/:reciterId" element={<Listen />} />
          <Route path="/azkar" element={<Azkar />} />
          <Route path="/shia-duas" element={<ShiaDuas />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
          <Route path="/names-of-allah" element={<NamesOfAllah />} />
          <Route path="/radios" element={<Radios />} />
          <Route path="/prayer" element={<PrayerTimes />} />
          <Route path="/rakat-counter" element={<RakatCounter />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/khatmah" element={<Khatmah />} />
          <Route path="/ziyarats" element={<Ziyarats />} />
          <Route path="/ziyarat/:id" element={<ZiyaratDetail />} />
          <Route path="/azkar/:id" element={<AzkarDetail />} />
          <Route path="/wallpapers" element={<Wallpapers />} />
          <Route path="/saimoon" element={<Saimoon />} />
          <Route path="/ramadan" element={<Ramadan />} />
          <Route path="/mosques" element={<Mosques />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/notifications" element={<NotificationsSettings />} />
          
          {/* تم رفع سطر صفحة الدليل هنا لتظهر وتعمل بشكل سليم تماماً */}
          <Route path="/guide" element={<GuideDashboard />} />
          
          {/* سطر النجمة يبقى دائماً الأخير ليعيد توجيه الصفحات الخاطئة فقط */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
      {/* Hidden Adhan audio element */}
      <audio 
         ref={audioRef} 
         src={resolvedUrl || null}
         preload="auto"
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PrayerTimesProvider>
        <Router>
          <AppContent />
        </Router>
      </PrayerTimesProvider>
    </ThemeProvider>
  );
}

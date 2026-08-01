import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "./pages/data/components/BottomNav";

import { Home } from "./pages/Home";
import { Quran } from "./pages/Quran";
import { Surah } from "./pages/Surah";
import Istikhara from "./pages/Istikhara";
import Azkar from "./pages/Azkar";
import { Qibla } from "./pages/Qibla";
import { Reciters } from "./pages/Reciters";
import { Listen } from "./pages/Listen";
import { PrayerTimes } from "./pages/PrayerTimes";
import { ShiaDuas } from "./pages/ShiaDuas";
import { Tasbeeh } from "./pages/Tasbeeh";
import { NamesOfAllah } from "./pages/NamesOfAllah";
import { Radios } from "./pages/Radios";
import { About } from "./pages/About";
import { Favorites } from "./pages/Favorites";
import { Khatmah } from "./pages/Khatmah";
import { RakatCounter } from "./pages/RakatCounter";
import { Ziyarats } from "./pages/Ziyarats";
import { ZiyaratDetail } from "./pages/ZiyaratDetail";
import { AzkarDetail } from "./pages/AzkarDetail";
import { Wallpapers } from "./pages/Wallpapers";
import { Saimoon } from "./pages/Saimoon";
import { Ramadan } from "./pages/Ramadan";
import { Mosques } from "./pages/Mosques";
import { NotificationsSettings } from "./pages/NotificationsSettings";
import GuideDashboard from "./pages/GuideDashboard";
import { CalendarConverter } from "./pages/CalendarConverter";
import { SahifaSajjadiyya } from "./pages/SahifaSajjadiyya";
import { Settings } from "./pages/Settings";

import { usePrayerTimes, PrayerTimesProvider } from "./hooks/usePrayerTimes";
import { useNotifications } from "./hooks/useNotifications";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppContent() {
  const { audioRef, resolvedUrl } = usePrayerTimes();
  const { theme } = useTheme();

  useNotifications();

  return (
    <div className={`flex flex-col h-[100dvh] max-w-md mx-auto relative ${
      theme === "light" ? "bg-[#f4f8f5] text-[#0e293b]" : "bg-[#0f1d18] text-[#e2f1e8]"
    }`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/quran/:surahId" element={<Surah />} />
          <Route path="/istikhara" element={<Istikhara />} />
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
          <Route path="/ziyarats" element={<Ziyarats />} />
          <Route path="/ziyarats/:id" element={<ZiyaratDetail />} />
          <Route path="/azkar/:category" element={<AzkarDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/khatmah" element={<Khatmah />} />
          <Route path="/wallpapers" element={<Wallpapers />} />
          <Route path="/saimoon" element={<Saimoon />} />
          <Route path="/ramadan" element={<Ramadan />} />
          <Route path="/mosques" element={<Mosques />} />
          <Route path="/notifications-settings" element={<NotificationsSettings />} />
          <Route path="/guide" element={<GuideDashboard />} />
          <Route path="/calendar" element={<CalendarConverter />} />
          <Route path="/sahifa" element={<SahifaSajjadiyya />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <PrayerTimesProvider>
          <AppContent />
        </PrayerTimesProvider>
      </ThemeProvider>
    </Router>
  );
}

import React from 'react';
import { PrayerTimesProvider } from './hooks/usePrayerTimes';
import { ThemeProvider } from './context/ThemeContext';
// ملاحظة: قم بتعديل المكونات الرئيسية للتطبيق أدناه إن كانت تستخدم أسماء مختلفة
import AppRoutes from './routes'; 

export default function App() {
  return (
    <ThemeProvider>
      <PrayerTimesProvider>
        {/* المكون الرئيسي للتطبيق */}
        <AppRoutes /> 
      </PrayerTimesProvider>
    </ThemeProvider>
  );
}

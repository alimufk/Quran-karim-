import React, { createContext, useContext, useState, useEffect } from 'react';

// اللغات المدعومة بالتطبيق
export type Language = 'ar' | 'en' | 'fa';

// قاموس الترجمة الكامل لصفحة الإعدادات والواجهات الرئيسية
export const translations = {
  ar: {
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    azan: 'الأذان والأصوات',
    prayerTimes: 'أوقات الصلاة',
    location: 'الموقع',
    hijriCorrection: 'تصحيح التاريخ الهجري',
    appLanguage: 'لغة التطبيق',
    appTheme: 'مظهر التطبيق',
    myAccount: 'حسابي',
    shareApp: 'مشاركة التطبيق',
    rateApp: 'تقييم التطبيق',
    aboutApp: 'عن التطبيق',
    close: 'إغلاق',
    save: 'حفظ',
    dailyDua: 'التنبيه لأدعية الأيام',
    generalDua: 'التنبيه للأدعية العامة',
    quranAyah: 'آية من القرآن الكريم',
    fixedPrayer: 'إشعار أوقات الصلاة الثابت',
    imsakTime: 'تنبيه وقت الإمساك',
    soundAlarm: 'نوع صوت منبه الأذان',
    dst: 'التوقيت الصيفي',
    calculationMethod: 'حساب أوقات الصلاة',
    midnightMethod: 'حساب منتصف الليل',
    searchCity: 'إبحث عن المدينة هنا...',
    autoLocation: 'حدد الموقع تلقائياً',
    version: 'الإصدار الحالي',
    rights: 'جميع الحقوق محفوظة'
  },
  en: {
    settings: 'Settings',
    notifications: 'Notifications',
    azan: 'Azan & Sounds',
    prayerTimes: 'Prayer Times',
    location: 'Location',
    hijriCorrection: 'Hijri Correction',
    appLanguage: 'App Language',
    appTheme: 'Theme',
    myAccount: 'My Account',
    shareApp: 'Share App',
    rateApp: 'Rate App',
    aboutApp: 'About App',
    close: 'Close',
    save: 'Save',
    dailyDua: 'Daily Supplications Alert',
    generalDua: 'General Duas Alert',
    quranAyah: 'Daily Quran Verse',
    fixedPrayer: 'Fixed Prayer Notifications',
    imsakTime: 'Imsak Time Alert',
    soundAlarm: 'Azan Alarm Sound Type',
    dst: 'Daylight Saving Time',
    calculationMethod: 'Calculation Method',
    midnightMethod: 'Midnight Calculation',
    searchCity: 'Search city here...',
    autoLocation: 'Determine Location Automatically',
    version: 'Current Version',
    rights: 'All rights reserved'
  },
  fa: {
    settings: 'تنظیمات',
    notifications: 'اعلان‌ها',
    azan: 'اذان و صداها',
    prayerTimes: 'اوقات شرعی',
    location: 'موقعیت مکانی',
    hijriCorrection: 'تصحیح تقویم هجری',
    appLanguage: 'زبان برنامه',
    appTheme: 'ظاهر برنامه',
    myAccount: 'حساب من',
    shareApp: 'اشتراک‌گذاری برنامه',
    rateApp: 'امتیاز به برنامه',
    aboutApp: 'درباره برنامه',
    close: 'بستن',
    save: 'ذخیره',
    dailyDua: 'اعلان ادعیه روزانه',
    generalDua: 'اعلان ادعیه عمومی',
    quranAyah: 'آیه‌ای از قرآن کریم',
    fixedPrayer: 'اعلان ثابت اوقات نماز',
    imsakTime: 'اعلان زمان امساک',
    soundAlarm: 'نوع صدای زنگ اذان',
    dst: 'ساعت تابستانی',
    calculationMethod: 'روش محاسبه اوقات',
    midnightMethod: 'محاسبه نیمه شب',
    searchCity: 'جستجوی شهر...',
    autoLocation: 'تعیین خودکار موقعیت',
    version: 'نسخه فعلی',
    rights: 'تمامی حقوق محفوظ است'
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ar']) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('set_lang_code');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('set_lang_code', lang);
    setLanguageState(lang);
  };

  // التحكم باتجاه الصفحة وتغييرها فوراً في المتصفح أو التطبيق (RTL أو LTR)
  useEffect(() => {
    if (language === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = language === 'fa' ? 'fa' : 'ar';
    }
  }, [language]);

  const t = (key: keyof typeof translations['ar']) => {
    return translations[language][key] || translations['ar'][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}

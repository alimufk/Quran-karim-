import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// جميع ترجمات التطبيق في مكان واحد لتتغير كلياً
const translations: Record<Language, Record<string, string>> = {
  ar: {
    settings: "الإعدادات",
    notifications: "الإشعارات",
    azan: "الأذان والتنبيهات",
    prayerTimes: "أوقات الصلاة",
    location: "الموقع الجغرافي",
    hijriCorrection: "التاريخ الهجري",
    appLanguage: "لغة التطبيق",
    appTheme: "مظهر التطبيق",
    myAccount: "حسابي الشخصي",
    shareApp: "مشاركة التطبيق",
    rateApp: "تقييم التطبيق",
    aboutApp: "حول التطبيق",
    close: "إغلاق",
    dailyDua: "دعاء اليوم",
    generalDua: "الأدعية العامة",
    quranAyah: "الآية اليومية",
    fixedPrayer: "تعقيبات الصلوات",
    imsakTime: "تنبيه وقت الإمساك",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    loginBtn: "دخول الحساب",
    signupBtn: "إنشاء حساب جديد",
    searchCity: "ابحث عن مدينتك...",
    autoLocation: "تحديد تلقائي للموقع",
    aboutText: "تطبيق إسلامي شامل ومميز يحتوي على القرآن الكريم، أوقات الصلاة، الأدعية والزيارات الشريفة ليكون رفيقك الإيماني.",
    version: "الإصدار",
    rights: "جميع الحقوق محفوظة لعام 2026 ©",
    copied: "تم نسخ رابط التطبيق بنجاح!",
    themeDark: "الوضع المظلم",
    themeLight: "الوضع المضيء",
    auto: "تلقائي"
  },
  en: {
    settings: "Settings",
    notifications: "Notifications",
    azan: "Azan & Alerts",
    prayerTimes: "Prayer Times",
    location: "Location Settings",
    hijriCorrection: "Hijri Date",
    appLanguage: "App Language",
    appTheme: "App Theme",
    myAccount: "My Account",
    shareApp: "Share App",
    rateApp: "Rate App",
    aboutApp: "About App",
    close: "Close",
    dailyDua: "Daily Dua",
    generalDua: "General Duas",
    quranAyah: "Daily Ayah",
    fixedPrayer: "Prayer Comments",
    imsakTime: "Imsak Time Alert",
    login: "Log In",
    signup: "Sign Up",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginBtn: "Log In to Account",
    signupBtn: "Create New Account",
    searchCity: "Search for city...",
    autoLocation: "Auto-detect Location",
    aboutText: "A comprehensive Islamic application containing the Holy Quran, prayer times, supplications, and noble visits.",
    version: "Version",
    rights: "All rights reserved © 2026",
    copied: "App link copied successfully!",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    auto: "Automatic"
  },
  fa: {
    settings: "تنظیمات",
    notifications: "اعلان‌ها",
    azan: "اذان و هشدارها",
    prayerTimes: "اوقات شرعی",
    location: "موقعیت مکانی",
    hijriCorrection: "تاریخ هجری",
    appLanguage: "زبان برنامه",
    appTheme: "پوسته برنامه",
    myAccount: "حساب کاربری من",
    shareApp: "اشتراک‌گذاری برنامه",
    rateApp: "امتیاز به برنامه",
    aboutApp: "درباره برنامه",
    close: "بستن",
    dailyDua: "دعای روزانه",
    generalDua: "دعاهای عمومی",
    quranAyah: "آیه روزانه",
    fixedPrayer: "تعقیبات نماز",
    imsakTime: "هشدار وقت امساک",
    login: "ورود به حساب",
    signup: "ایجاد حساب کاربری",
    email: "پست الکترونیکی (ایمیل)",
    password: "رمز عبور",
    confirmPassword: "تایید رمز عبور",
    loginBtn: "ورود به حساب کاربری",
    signupBtn: "ایجاد حساب کاربری جدید",
    searchCity: "جستجوی شهر...",
    autoLocation: "تعیین خودکار موقعیت",
    aboutText: "یک اپلیکیشن جامع اسلامی شامل قرآن کریم، اوقات شرعی، ادعیه و زیارات شریف برای همراهی ایمانی شما.",
    version: "نسخه",
    rights: "تمامی حقوق محفوظ است ۲۰۲۶ ©",
    copied: "لینک برنامه با موفقیت کپی شد!",
    themeDark: "حالت تاریک",
    themeLight: "حالت روشن",
    auto: "خودکار"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('app_lang', lang);
  };

  // تغيير اتجاه التطبيق بالكامل تلقائياً عند تغيير اللغة
  useEffect(() => {
    const dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useAppLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useAppLanguage must be used within a LanguageProvider');
  return context;
};

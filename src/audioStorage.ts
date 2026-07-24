import { set, get } from 'idb-keyval';

// 1. تابع لتحميل الصوت وحفظه أوفلاين
export const downloadAndSaveAudio = async (audioId: string, remoteUrl: string) => {
  try {
    const response = await fetch(remoteUrl);
    const blob = await response.blob(); // تحويل الصوت لبيانات باينري
    await set(`audio_${audioId}`, blob); // حفظه محلياً في ذاكرة الهاتف
    console.log("تم حفظ الملف الصوتي أوفلاين بنجاح! 🎉");
    return true;
  } catch (error) {
    console.error("فشل تحميل الملف الصوتي:", error);
    return false;
  }
};

// 2. تابع لتشغيل الصوت (يفحص أولاً هل هو محفوظ أوفلاين؟)
export const getAudioSrc = async (audioId: string, remoteUrl: string): Promise<string> => {
  try {
    // البحث في ذاكرة الهاتف أولاً
    const localBlob = await get<Blob>(`audio_${audioId}`);
    
    if (localBlob) {
      // إذا كان الملف محملاً مسبقاً، ننشئ رابطاً محلياً لا يطلب إنترنت إطلاقاً
      console.log("جارِ التشغيل من ذاكرة الهاتف (Offline)...");
      return URL.createObjectURL(localBlob);
    }
  } catch (error) {
    console.log("الملف غير موجود محلياً، سيتم التشغيل عبر الإنترنت.");
  }

  // إذا لم يكن محملاً، يرجع رابط الإنترنت العادي
  return remoteUrl;
};

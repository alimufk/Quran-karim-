export function getAudioUrl(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  
  // إذا كان الرابط من جوجل درايف، نقوم بتجهيزه وتمريره عبر وسيط لتخطي حظر الـ CORS برمجياً
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    // استخراج الـ ID الخاص بملف الصوت من الرابط
    const idMatch = cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) || cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    
    if (idMatch && idMatch[1]) {
      const fileId = idMatch[1];
      // إنشاء رابط تحميل مباشر وسريع من خوادم محتوى جوجل
      const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
      
      // السر هنا: تغليف الرابط بوسيط مجاني (CORS Proxy) ليسمح المتصفح والتطبيق بتشغيله وتحميله فوراً
      return `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;
    }
  }
  
  return cleanUrl;
}

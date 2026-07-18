import React from 'react';
import './ShareButton.css'; // سنقوم بإنشاء ملف التنسيق في الخطوة التالية

const ShareButton = () => {
  const handleShare = async () => {
    // البيانات التي ستظهر في قائمة المشاركة بالهاتف
    const shareData = {
      title: 'تطبيق القرآن الكريم',
      text: 'الدال على الخير كفاعله، أنصحكم بتحميل تطبيق القرآن الكريم الفاخر بدون إعلانات.',
      url: 'https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE_NAME', // ضع رابط تطبيقك هنا
    };

    // التحقق من أن المتصفح/الهاتف يدعم خاصية المشاركة الذكية
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('تم فتح قائمة المشاركة بنجاح');
      } catch (error) {
        console.log('المستخدم قام بإلغاء المشاركة أو حدث خطأ:', error);
      }
    } else {
      // حل احتياطي للهواتف القديمة أو لمتصفح الكمبيوتر
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('تم نسخ رابط التطبيق بنجاح! يمكنك الآن مشاركته يدوياً.');
      } catch (err) {
        alert('عذراً، لم نتمكن من نسخ الرابط تلقائياً.');
      }
    }
  };

  return (
    <button className="share-btn-emerald" onClick={handleShare}>
      {/* أيقونة المشاركة (SVG) */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      مشاركة التطبيق
    </button>
  );
};

export default ShareButton;

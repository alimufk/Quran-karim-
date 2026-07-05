export async function cacheAudio(
  url: string, 
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!('caches' in window)) {
    throw new Error('متصفحك لا يدعم ميزة التخزين المؤقت للاستماع بدون إنترنت.');
  }

  const cache = await caches.open(CACHE_NAME);
  
  // Clean URL key just in case it has trailing spaces
  const cleanUrl = url.trim();
  const proxyUrl = getAudioUrl(cleanUrl);

  // 1. التعديل الأول: السماح بإعادة التوجيه التلقائي (Redirect) لتخطي خوادم جوجل
  const response = await fetch(proxyUrl, {
    mode: 'cors',
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error(`تعذر الاتصال بملف الصوت: ${response.statusText}`);
  }
  
  // 2. التعديل الثاني: التأكد أن جوجل لم يرسل صفحة ويب (HTML) بدلاً من ملف الصوت
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html') || contentType.includes('text/plain')) {
    throw new Error('فشل التحميل: جوجل درايف يمنع التنزيل المباشر أو يطلب فحص أمان، لم يتم استلام ملف صوتي.');
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  
  if (total === 0 || !response.body) {
    // Fallback if no content-length or body stream
    const blob = await response.blob();
    
    // فحص حجم الملف: إذا كان أقل من 50 كيلوبايت فهو صفحة خطأ وليس دعاء!
    if (blob.size < 50000) {
      throw new Error('فشل التحميل: الملف المستلم صغير جداً (صفحة حظر من جوجل درايف).');
    }

    await cache.put(cleanUrl, new Response(blob, {
      headers: { 'Content-Type': contentType || 'audio/mpeg' }
    }));
    return URL.createObjectURL(blob);
  }
  
  const reader = response.body.getReader();
  let loaded = 0;
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      if (onProgress && total > 0) {
        onProgress(Math.min(99, Math.round((loaded / total) * 100)));
      }
    }
  }
  
  const blob = new Blob(chunks, { type: contentType || 'audio/mpeg' });
  
  // 3. التعديل الثالث والحاسم: فحص الحجم النهائي قبل حفظ الملف في ذاكرة الهاتف
  if (blob.size < 50000) {
    throw new Error('فشل التحميل: جوجل درايف أرسل ملفاً غير صالح (حجمه صغير جداً).');
  }

  await cache.put(cleanUrl, new Response(blob, {
    headers: { 'Content-Type': 'audio/mpeg' }
  }));
  
  if (onProgress) {
    onProgress(100);
  }
  
  return URL.createObjectURL(blob);
}

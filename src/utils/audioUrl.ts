export function getAudioUrl(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  
  // تحويل رابط جوجل درايف إلى رابط تحميل مباشر بدون وسطاء خارجية
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    const idMatch = cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) || cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${idMatch[1]}&confirm=t`;
    }
  }
  
  return cleanUrl;
}

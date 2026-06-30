import { getAudioUrl } from './audioUrl';
const CACHE_NAME = 'shia-app-audio-cache';

export async function isAudioCached(url: string): Promise<boolean> {
  try {
    if (!('caches' in window)) return false;
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
  } catch (e) {
    console.error('Error checking audio cache:', e);
    return false;
  }
}

export async function getCachedAudioUrl(url: string): Promise<string | null> {
  try {
    if (!('caches' in window)) return null;
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Error getting cached audio url:', e);
    return null;
  }
}

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

  // Fetch directly
  const response = await fetch(proxyUrl, {
    mode: 'cors'
  });

  if (!response.ok) {
    throw new Error(`تعذر الاتصال بملف الصوت: ${response.statusText}`);
  }
  
  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  
  if (total === 0 || !response.body) {
    // Fallback if no content-length or body stream
    const blob = await response.blob();
    await cache.put(cleanUrl, new Response(blob, {
      headers: { 'Content-Type': response.headers.get('content-type') || 'audio/mpeg' }
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
  
  const blob = new Blob(chunks, { type: response.headers.get('content-type') || 'audio/mpeg' });
  await cache.put(cleanUrl, new Response(blob, {
    headers: { 'Content-Type': 'audio/mpeg' }
  }));
  
  if (onProgress) {
    onProgress(100);
  }
  
  return URL.createObjectURL(blob);
}

export async function deleteCachedAudio(url: string): Promise<boolean> {
  try {
    if (!('caches' in window)) return false;
    const cache = await caches.open(CACHE_NAME);
    return await cache.delete(url.trim());
  } catch (e) {
    console.error('Error deleting cached audio:', e);
    return false;
  }
}

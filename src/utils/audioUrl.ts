import { Capacitor } from '@capacitor/core';

export function getAudioUrl(url: string): string {
  if (Capacitor.isNativePlatform()) {
    return url;
  }
  // Add a cache buster parameter to ensure old service worker caches are bypassed completely
  return `/api/proxy?url=${encodeURIComponent(url)}&_cb=${Date.now()}`;
}

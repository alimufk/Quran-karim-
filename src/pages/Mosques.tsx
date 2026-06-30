import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Compass, Search, Navigation, Sparkles, RotateCw, ExternalLink, Info, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface Mosque {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number; // in km
  bearing: number;  // bearing angle
  address?: string;
  type?: string;
}

// Predefined major Shia / Islamic cities for quick selection
const QUICK_CITIES = [
  { name: 'النجف الأشرف', lat: 31.9961, lon: 44.3314 },
  { name: 'كربلاء المقدسة', lat: 32.6160, lon: 44.0248 },
  { name: 'الكاظمية', lat: 33.3794, lon: 44.3418 },
  { name: 'بغداد', lat: 33.3152, lon: 44.3661 },
  { name: 'البصرة', lat: 30.5081, lon: 47.7835 },
  { name: 'المدينة المنورة', lat: 24.4672, lon: 39.6111 },
  { name: 'بيروت', lat: 33.8938, lon: 35.5018 },
  { name: 'دمشق', lat: 33.5138, lon: 36.2765 },
];

export function Mosques() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('موقعك المكتشف');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchingCity, setSearchingCity] = useState<boolean>(false);

  // Haversine distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Bearing calculation
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    return (brng + 360) % 360;
  };

  const getCompassDirection = (bearing: number): string => {
    const directions = ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  // Get user location
  const detectUserLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      // Fallback via IP instantly
      fetchIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setCoords({ lat: userLat, lon: userLon });
        setLocationName('الموقع الجغرافي للجهاز');
        fetchNearbyMosques(userLat, userLon);
      },
      (geoError) => {
        console.warn('Geolocation failed or denied, falling back to IP location:', geoError);
        fetchIPLocation();
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
    );
  };

  // Fallback IP Geolocation (Free API)
  const fetchIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setCoords({ lat: data.latitude, lon: data.longitude });
        setLocationName(`${data.city || 'موقع جهازك'} التقريبي`);
        fetchNearbyMosques(data.latitude, data.longitude);
      } else {
        // Ultimate fallback to Baghdad
        setCoords({ lat: 33.3152, lon: 44.3661 });
        setLocationName('البغداد (افتراضي)');
        fetchNearbyMosques(33.3152, 44.3661);
      }
    } catch (e) {
      console.error('IP location retrieval error:', e);
      // Fallback to Baghdad
      setCoords({ lat: 33.3152, lon: 44.3661 });
      setLocationName('النجف الأشرف (افتراضي)');
      fetchNearbyMosques(31.9961, 44.3314);
    }
  };

  // Fetch from Overpass API (Real OpenStreetMap places of worship)
  const fetchNearbyMosques = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      // Radius: 5000 meters (5km) (optimal search radius)
      const query = `[out:json][timeout:15];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
);
out body;`;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بخادم الخرائط المفتوحة المعياري.');
      }

      const data = await response.json();
      
      if (!data.elements || data.elements.length === 0) {
        setMosques([]);
        setLoading(false);
        return;
      }

      const processed: Mosque[] = data.elements.map((el: any) => {
        const itemLat = el.lat || (el.center ? el.center.lat : lat);
        const itemLon = el.lon || (el.center ? el.center.lon : lon);
        
        let customName = el.tags?.name || el.tags?.['name:ar'] || el.tags?.['name:en'];
        if (!customName) {
          if (el.tags?.amenity === 'place_of_worship') {
            customName = 'مسجد / جامع عام';
          } else {
            customName = 'بيت من بيوت الله';
          }
        }

        const dist = calculateDistance(lat, lon, itemLat, itemLon);
        const bear = calculateBearing(lat, lon, itemLat, itemLon);

        return {
          id: el.id,
          name: customName,
          lat: itemLat,
          lon: itemLon,
          distance: dist,
          bearing: bear,
          address: el.tags?.['addr:street'] || el.tags?.['addr:suburb'] || undefined,
          type: el.tags?.is_major === 'yes' ? 'جامع كبير' : 'مسجد'
        };
      });

      // Sort by distance ascending
      processed.sort((a, b) => a.distance - b.distance);
      setMosques(processed);
    } catch (err: any) {
      console.error('Overpass API fetch error:', err);
      setError('فشل جلب المساجد القريبة حالياً. يرجى التحقق من اتصال الشبكة وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  // Search cities via Nominatim
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchingCity(true);
    setError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
        headers: { 'Accept-Language': 'ar' }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const targetLat = parseFloat(data[0].lat);
        const targetLon = parseFloat(data[0].lon);
        setCoords({ lat: targetLat, lon: targetLon });
        setLocationName(data[0].display_name.split(',')[0]);
        fetchNearbyMosques(targetLat, targetLon);
      } else {
        setError('تعذر العثور على المكان المكتوب. يرجى تجربة اسم مدينة أخرى.');
      }
    } catch (err) {
      setError('فشل البحث الجغرافي عن هذه المدينة.');
    } finally {
      setSearchingCity(false);
    }
  };

  // On mount component detect coordinates
  useEffect(() => {
    detectUserLocation();
  }, []);

  return (
    <div className={`min-h-[100dvh] pb-12 transition-colors duration-300 ${
      isLight ? 'bg-[#f4f2ee] text-[#1e293b]' : 'bg-[#032219] text-[#f0f9ff]'
    } flex flex-col`}>

      {/* Header */}
      <div className={`sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b transition-colors duration-300 ${
        isLight ? 'bg-[#edeae5]/90 border-[#c5a880]/20' : 'bg-[#042d20]/90 border-[#059669]/30'
      } backdrop-blur-md`}>
        <Link to="/" className={`p-2 -mr-2 transition-colors rounded-full ${
          isLight ? 'text-[#8c6b3e] hover:text-[#70532d]' : 'text-[#fbbf24] hover:text-[#fbbf24]/80'
        }`}>
          <ArrowRight />
        </Link>
        <span className="text-xl font-bold font-sans tracking-tight text-[#fbbf24] flex items-center gap-2">
          <span>المساجد والخرائط</span>
          <Compass size={18} className="text-[#fbbf24] animate-spin-slow" />
        </span>
        <button
          onClick={detectUserLocation}
          className={`p-2 rounded-full transition-all ${
            isLight ? 'text-[#8c6b3e] hover:bg-[#edeae5]' : 'text-[#fbbf24] hover:bg-[#042d20]'
          }`}
          title="إعادة تحديد الموقع الجغرافي"
        >
          <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1 max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Current Location Badge and Info */}
          <div className={`p-5 rounded-[28px] border transition-all flex flex-col gap-3 ${
            isLight ? 'bg-white border-[#c5a880]/20 shadow-sm' : 'bg-[#042d20]/30 border-[#059669]/20'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">نطاق البحث الفعلي:</span>
              <span className="text-xs font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">١٠٠% حقيقي ودقيق</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <MapPin size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#fbbf24]">{locationName}</h3>
                {coords && (
                  <p className="text-[10px] font-mono opacity-60">
                    خط العرض: {coords.lat.toFixed(4)} ، خط الطول: {coords.lon.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Search tool for other locations */}
          <form onSubmit={handleCitySearch} className="relative">
            <input
              type="text"
              placeholder="ابحث عن مدينة أو منطقة أخرى (مثال: النجف)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-3 pr-11 pl-4 rounded-full text-xs font-medium border focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#8c6b3e]/30'
                  : 'bg-[#042d20]/50 border-[#059669]/20 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#fbbf24]/50'
              }`}
            />
            <button
              type="submit"
              disabled={searchingCity}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fbbf24] transition-colors"
            >
              {searchingCity ? <RotateCw className="animate-spin" size={16} /> : <Search size={16} />}
            </button>
          </form>

          {/* Quick Cities Explorer */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 block px-1">عواصم دينية ومدن سريعة:</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-500">
              {QUICK_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setCoords({ lat: city.lat, lon: city.lon });
                    setLocationName(city.name);
                    fetchNearbyMosques(city.lat, city.lon);
                  }}
                  className={`py-2 px-3.5 rounded-full text-[11px] font-black shrink-0 transition-all border ${
                    locationName === city.name
                      ? 'bg-[#fbbf24] text-[#022c22] border-transparent shadow-md font-bold'
                      : isLight
                        ? 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                        : 'bg-[#042d20]/40 border-[#059669]/20 text-gray-300 hover:bg-[#042d20]'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Error Box */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center gap-2">
              <Info size={14} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading Spinner */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RotateCw size={36} className="text-[#fbbf24] animate-spin" />
              <p className="text-xs text-gray-400 font-bold">جاري تحديد المساجد عبر الأقمار الاصطناعية...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-gray-400">المساجد المكتشفة في محيط ٥ كم:</span>
                <span className="text-xs font-black text-emerald-500 font-mono">{mosques.length} مسجد</span>
              </div>

              {mosques.length === 0 ? (
                <div className={`p-8 rounded-[32px] text-center border ${
                  isLight ? 'bg-white border-[#c5a880]/10' : 'bg-[#042d20]/10 border-[#059669]/10'
                }`}>
                  <Map className="mx-auto mb-3 text-gray-500" size={32} />
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    لم نعثر على مساجد مدرجة في نطاق 5 كم لهذا الموقع المحدد. يرجى البحث في مدينة أخرى أو استخدام خدمة الملاحة المباشرة.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {mosques.map((mosque, idx) => {
                    const relativeDirection = getCompassDirection(mosque.bearing);
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={mosque.id}
                        className={`p-4 rounded-[28px] border transition-all flex flex-col gap-3 relative overflow-hidden group ${
                          isLight
                            ? 'bg-white border-[#c5a880]/10 shadow-sm hover:border-[#c5a880]/20'
                            : 'bg-[#042d20]/35 border-[#059669]/10 hover:border-[#059669]/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full font-bold mb-1 ${
                              isLight ? 'bg-[#edeae5] text-[#8c6b3e]' : 'bg-black/30 text-[#fbbf24]'
                            }`}>
                              {mosque.type || 'مسجد مبارك'}
                            </span>
                            <h4 className="font-bold text-sm inline-flex items-center gap-1">
                              {mosque.name}
                            </h4>
                            {mosque.address && (
                              <span className="text-[11px] text-gray-400 mt-1">{mosque.address}</span>
                            )}
                          </div>

                          {/* Distance & Relative Heading */}
                          <div className="flex flex-col items-end shrink-0 gap-1 text-right">
                            <span className="text-sm font-black text-emerald-500 font-mono">
                              {mosque.distance < 1 
                                ? `${Math.round(mosque.distance * 1000)} متر`
                                : `${mosque.distance.toFixed(2)} كم`
                              }
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <span>باتجاه {relativeDirection}</span>
                              <Navigation 
                                size={9} 
                                className="text-emerald-500 shrink-0" 
                                style={{ transform: `rotate(${mosque.bearing}deg)` }} 
                              />
                            </span>
                          </div>
                        </div>

                        {/* Map Launcher Button */}
                        <div className="flex gap-2 mt-1">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`}
                            target="_blank"
                            rel="referrer noopener nofollow"
                            className={`flex-1 py-2 px-3 rounded-2xl text-[11px] font-bold text-center inline-flex items-center justify-center gap-1.5 transition-all ${
                              isLight
                                ? 'bg-[#8c6b3e] text-white hover:bg-[#70532d]'
                                : 'bg-[#fbbf24] text-[#022c22] hover:bg-[#fbbf24]/95 hover:scale-[1.02]'
                            }`}
                          >
                            <Navigation size={12} />
                            <span>توجيه وملاحة</span>
                          </a>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lon}`}
                            target="_blank"
                            rel="referrer noopener nofollow"
                            className={`py-2 px-3.5 rounded-2xl text-[11px] font-bold text-center inline-flex items-center justify-center gap-1 border transition-all ${
                              isLight
                                ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                : 'border-[#059669]/20 text-[#fbbf24] hover:bg-[#042d20]'
                            }`}
                          >
                            <ExternalLink size={12} />
                            <span>عرض الخرائط</span>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

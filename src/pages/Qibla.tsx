import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass as CompassIcon, RefreshCw, ArrowRight, Camera, ChevronDown } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { Link } from 'react-router-dom';

const TARGETS = [
  { id: 'qibla', name: 'القبلة (مكة المكرمة)', lat: 21.422487, lon: 39.826206 },
  { id: 'najaf', name: 'النجف الأشرف (الإمام علي)', lat: 31.9959, lon: 44.3148 },
  { id: 'karbala', name: 'كربلاء المقدسة (الإمام الحسين)', lat: 32.6164, lon: 44.0324 },
  { id: 'mashhad', name: 'مشهد المقدسة (الإمام الرضا)', lat: 36.2878, lon: 59.6155 },
  { id: 'kadhimayn', name: 'الكاظمية المقدسة', lat: 33.3804, lon: 44.3384 },
  { id: 'samarra', name: 'سامراء المقدسة', lat: 34.1983, lon: 43.8741 },
];

export function Qibla() {
  const { timings } = usePrayerTimes();
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [targetParams, setTargetParams] = useState(TARGETS[0]);
  const [targetAngle, setTargetAngle] = useState<number | null>(null);
  const [locationStr, setLocationStr] = useState('جاري التحديد...');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isARMode, setIsARMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  // Calculate target angle from user's lat, lon to target lat, lon
  const getTargetAngle = (userLatNum: number, userLonNum: number, targetLatNum: number, targetLonNum: number) => {
    const targetLatRad = targetLatNum * (Math.PI / 180);
    const targetLonRad = targetLonNum * (Math.PI / 180);
    const userLatRad = userLatNum * (Math.PI / 180);
    const userLonRad = userLonNum * (Math.PI / 180);

    const deltaLon = targetLonRad - userLonRad;

    const y = Math.sin(deltaLon) * Math.cos(targetLatRad);
    const x = Math.cos(userLatRad) * Math.sin(targetLatRad) - Math.sin(userLatRad) * Math.cos(targetLatRad) * Math.cos(deltaLon);
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    return (angle + 360) % 360;
  };

  useEffect(() => {
    if (userLocation) {
       setTargetAngle(getTargetAngle(userLocation.lat, userLocation.lon, targetParams.lat, targetParams.lon));
    }
  }, [targetParams, userLocation]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({lat, lon});
          
          try {
             const geocode = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
             const data = await geocode.json();
             setLocationStr(data.address?.city || data.address?.town || data.address?.country || 'موقعك الحالي');
          } catch(e) {
             setLocationStr('موقعك الحالي');
          }
        },
        (error) => {
          setErrorMsg('يرجى تفعيل الموقع لمعرفة الاتجاه بدقة');
          setLocationStr('--');
        }
      );
    }

    // Try to get device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      let heading = null;
      if ('webkitCompassHeading' in event) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // This is a naive translation from alpha. True compass needs absolute orientation which Chrome Android provides via `absolute` property in some cases,
        // but typically alpha gives relative. However, if absolute: true is available, it works.
        heading = 360 - event.alpha; 
      }
      
      if (heading !== null) {
        setDeviceHeading(heading);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation as any);
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
       window.removeEventListener('deviceorientationabsolute', handleOrientation as any);
       window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          // Re-trigger location to refresh
          window.location.reload();
        } else {
          setErrorMsg('تم رفض صلاحية البوصلة');
        }
      } catch(e) {
        console.error(e);
      }
    } else {
      alert("جهازك لا يدعم بوصلة متقدمة أو لا يطلب إذن.");
    }
  };

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsARMode(true);
    } catch (err) {
      setErrorMsg('تعذر الوصول للكاميرا للواقع المعزز');
    }
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsARMode(false);
  };

  // The rotation to point the needle to target relative to screen
  const needleRotation = targetAngle !== null ? targetAngle - deviceHeading : 45;
  const isFacingTarget = targetAngle !== null && Math.abs((((targetAngle - deviceHeading + 180) % 360) - 180)) < 10; // Within 10 degrees

  const prayerNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  return (
    <div className={`p-6 min-h-[100dvh] pb-24 flex flex-col items-center relative overflow-hidden ${isARMode ? 'bg-black text-white' : 'bg-[#022c22]'}`}>
      {/* AR Camera Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 ${isARMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      
      {isARMode && <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />}

      {/* Header */}
      <div className={`w-full flex items-center justify-between mb-6 pb-4 border-b z-10 transition-colors ${isARMode ? 'border-white/20' : 'border-[#059669]/30'}`}>
        <div className="flex items-center gap-3">
          <Link to="/" onClick={stopAR} className={`p-2 -mr-2 transition-colors rounded-full ${isARMode ? 'text-white hover:text-[#fbbf24]' : 'text-[#059669] hover:text-[#fbbf24]'}`}>
            <ArrowRight size={24} />
          </Link>
          <h1 className={`text-2xl font-bold font-sans tracking-tight ${isARMode ? 'text-white' : 'text-[#fbbf24]'}`}>القبلة والمراقد</h1>
        </div>
        <button className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-md transition-colors ${isARMode ? 'bg-black/50 text-white backdrop-blur-sm' : 'bg-[#064e3b] border border-[#059669]/30 text-[#f0f9ff]'}`}>
          <MapPin size={16} className={isARMode ? 'text-current' : 'text-[#fbbf24]'} />
          <span className="truncate max-w-[100px]">{locationStr}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="w-full bg-red-500/80 backdrop-blur-md text-white p-3 rounded-xl text-center text-sm mb-4 z-10 font-bold shadow-lg">
          {errorMsg}
        </div>
      )}

      {/* Target Selector */}
      <div className="relative z-20 w-full max-w-sm mb-6">
         <button 
           onClick={() => setIsMenuOpen(!isMenuOpen)}
           className={`w-full flex items-center justify-between p-4 rounded-2xl shadow-lg transition-colors font-bold ${isARMode ? 'bg-black/60 backdrop-blur-md border border-white/20 text-white' : 'bg-[#064e3b] border border-[#059669]/40 text-[#f0f9ff]'}`}
         >
            <span>{targetParams.name}</span>
            <ChevronDown size={20} className={isMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
         </button>

         <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl overflow-hidden z-30 ${isARMode ? 'bg-black/80 backdrop-blur-lg border border-white/20' : 'bg-[#064e3b] border border-[#059669]/50'}`}
              >
                {TARGETS.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => { setTargetParams(t); setIsMenuOpen(false); }}
                    className={`w-full text-right p-4 font-bold transition-colors ${t.id === targetParams.id ? (isARMode ? 'bg-white/20 text-white' : 'bg-[#059669]/40 text-[#fbbf24]') : (isARMode ? 'text-white/80 hover:bg-white/10' : 'text-[#f0f9ff] hover:bg-[#059669]/20')} border-b last:border-b-0 ${isARMode ? 'border-white/10' : 'border-[#059669]/20'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Compass / AR View */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative z-10">
        {!isARMode && (
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        )}
        
        {isARMode ? (
          /* AR HUD */
          <div className="flex-1 w-full flex flex-col items-center justify-center">
             <motion.div 
               className={`w-64 h-64 border-4 rounded-full flex flex-col items-center justify-center transition-colors ${isFacingTarget ? 'border-[#10b981] bg-[#10b981]/20' : 'border-white/50'}`}
               animate={{ rotate: isFacingTarget ? 0 : needleRotation }}
               transition={{ type: "spring", stiffness: 50, damping: 20 }}
             >
                {isFacingTarget ? (
                  <div className="flex flex-col items-center text-[#10b981] drop-shadow-lg">
                     <MapPin size={64} fill="currentColor" />
                     <span className="font-bold mt-2 text-xl">{targetParams.name}</span>
                  </div>
                ) : (
                  <ArrowRight size={80} className="text-white drop-shadow-lg -rotate-90" />
                )}
             </motion.div>
             <p className="mt-8 text-2xl font-black text-white font-mono drop-shadow-xl" dir="ltr">{targetAngle ? Math.round(targetAngle) : '--'}°</p>
             <button 
                onClick={stopAR}
                className="mt-6 bg-red-600/80 backdrop-blur text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-red-500 transition-colors"
             >
               إغلاق الواقع المعزز
             </button>
          </div>
        ) : (
          /* Standard Compass */
          <>
            <div className="relative w-80 h-80 rounded-full border-[8px] border-[#064e3b] flex items-center justify-center shadow-2xl shadow-black/60 bg-[#022c22] mb-6">
              <div className="absolute inset-4 rounded-full border border-dashed border-[#059669]/40" />
              <div className="absolute inset-8 rounded-full border border-[#059669]/20" />
              
              <div className="absolute top-4 text-[#059669] font-bold text-lg">ش</div>
              <div className="absolute bottom-4 text-[#059669] font-bold text-lg">ج</div>
              <div className="absolute right-4 text-[#059669] font-bold text-lg">ش</div>
              <div className="absolute left-4 text-[#059669] font-bold text-lg">غ</div>

              <motion.div
                className="w-full h-full flex items-center justify-center relative"
                style={{ rotate: needleRotation }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              >
                <div className="w-2 h-36 bg-gradient-to-t from-transparent via-[#059669] to-[#fbbf24] rounded-full absolute top-10 drop-shadow-md" />
                <div className={`w-8 h-8 rounded-full shadow-lg z-10 border-[4px] border-[#022c22] flex items-center justify-center ${isFacingTarget ? 'bg-[#10b981]' : 'bg-[#fbbf24]'}`}>
                  {isFacingTarget && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
                </div>
                <CompassIcon className={`absolute top-4 bg-[#022c22] rounded-full transition-colors ${isFacingTarget ? 'text-[#10b981]' : 'text-[#fbbf24]'}`} size={40} />
              </motion.div>
            </div>

            <div className="flex gap-3 mb-6">
              {typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window.DeviceOrientationEvent as any).requestPermission === 'function' && (
                <button 
                  onClick={requestOrientationPermission}
                  className="flex items-center justify-center p-3 bg-[#059669] hover:bg-[#064e3b] text-[#f0f9ff] rounded-xl font-bold transition-all shadow-md"
                >
                  <RefreshCw size={24} />
                </button>
              )}
              
              <button 
                onClick={startAR}
                className="flex flex-1 items-center justify-center gap-2 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#022c22] rounded-xl font-bold transition-all shadow-md"
              >
                <Camera size={20} />
                الواقع المعزز (AR)
              </button>
            </div>

            {targetAngle !== null && (
              <div className="text-center relative z-10 bg-[#064e3b]/80 border border-[#059669]/40 backdrop-blur-md px-8 py-4 rounded-3xl">
                <p className="text-4xl font-black text-[#fbbf24] font-mono tracking-wider" dir="ltr">{Math.round(targetAngle)}°</p>
                <p className="text-[#f0f9ff] mt-1 font-medium text-sm">اتجاه {targetParams.name}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Prayer Times Listing - Hide in AR mode */}
      {!isARMode && (
        <div className="w-full bg-gradient-to-b from-[#064e3b]/60 to-[#022c22]/60 rounded-[32px] border border-[#059669]/30 shadow-xl p-6 mt-8 z-10 relative">
          <h3 className="font-bold text-[#fbbf24] border-b border-[#059669]/30 pb-4 mb-4 flex items-center gap-2">
            مواقيت الصلاة
          </h3>
          
          {!timings ? (
            <div className="text-center py-4 text-[#059669]">جاري التحميل...</div>
          ) : (
            <div className="space-y-3">
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                 <div key={prayer} className="flex justify-between items-center text-sm p-3 rounded-2xl hover:bg-[#059669]/20 transition-all border border-transparent hover:border-[#059669]/20">
                  <span className="text-[#f0f9ff] font-medium">{prayerNames[prayer]}</span>
                  <span className="font-bold text-[#fbbf24] font-mono text-lg" dir="ltr">
                    {timings[prayer]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


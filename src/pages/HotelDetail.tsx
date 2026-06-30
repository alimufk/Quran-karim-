import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Star, Phone, Globe, Navigation, 
  Heart, Share2, Info, CheckCircle2 
} from 'lucide-react';
import { hotelsData, Hotel } from './data/hotelsData';

export function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundHotel = hotelsData.find(h => h.id === id);
    if (foundHotel) {
      setHotel(foundHotel);
    }
  }, [id]);

  const handleOpenMap = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        alert('يرجى السماح بالنوافذ المنبثقة لفتح خرائط Google');
      }
    } catch (error) {
      console.error('Failed to open map:', error);
      alert('حدث خطأ أثناء محاولة فتح الخريطة.');
    }
  };

  if (!hotel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 bg-gray-50 dark:bg-[#022c22] min-h-screen"
    >
      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < hotel.stars ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-400"} 
                />
              ))}
            </div>
            <span className="bg-[#059669] px-2 py-0.5 rounded text-xs font-bold">{hotel.rating}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{hotel.name}</h1>
          <p className="flex items-center gap-1.5 text-white/80 text-sm">
            <MapPin size={14} />
            {hotel.country}، {hotel.city} - يبعد {hotel.distance}م عن {hotel.shrine}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#064e3b]/40 border border-[#059669]/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs mb-1">السعر التقريبي</span>
            <span className="text-xl font-bold text-[#059669] dark:text-[#fbbf24]">${hotel.price} <span className="text-sm font-normal text-gray-500">/ ليلة</span></span>
          </div>
          <div className="bg-white dark:bg-[#064e3b]/40 border border-[#059669]/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs mb-1">المسافة للمرقد</span>
            <span className="text-xl font-bold text-[#059669] dark:text-[#fbbf24]">{hotel.distance} <span className="text-sm font-normal text-gray-500">متر</span></span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={(e) => handleOpenMap(e, `https://www.google.com/maps/dir/?api=1&destination=${hotel.lat},${hotel.lng}`)}
            className="bg-[#059669] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-[#047857] transition-colors shadow-lg shadow-[#059669]/20"
          >
            <Navigation size={20} />
            بدء الملاحة
          </button>
          <a 
            href={`tel:${hotel.phone}`}
            className="bg-[#fbbf24] text-[#064e3b] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-[#f5b000] transition-colors shadow-lg shadow-[#fbbf24]/20"
          >
            <Phone size={20} />
            اتصال
          </a>
        </div>

        {/* Details List */}
        <div className="bg-white dark:bg-[#064e3b]/40 border border-[#059669]/10 rounded-3xl p-6 space-y-5">
          <h3 className="font-bold text-[#064e3b] dark:text-[#fbbf24] border-b border-[#059669]/10 pb-3 flex items-center gap-2">
            <Info size={18} />
            معلومات الفندق
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">الموقع</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{hotel.country}، {hotel.city}</p>
                <button onClick={(e) => handleOpenMap(e, `https://www.google.com/maps/search/?api=1&query=${hotel.lat},${hotel.lng}`)} className="text-xs text-[#059669] hover:underline mt-1 inline-block bg-transparent border-none p-0 cursor-pointer">عرض في خرائط Google</button>
              </div>
            </div>

            {hotel.phone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">رقم الهاتف</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200" dir="ltr">{hotel.phone}</p>
                </div>
              </div>
            )}

            {hotel.website && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">الموقع الإلكتروني</p>
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#059669] hover:underline block" dir="ltr">
                    {hotel.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features / Note */}
        <div className="bg-[#064e3b]/5 dark:bg-[#064e3b]/20 border border-[#059669]/20 rounded-3xl p-5">
           <div className="flex gap-3">
             <div className="mt-1 text-[#059669]">
               <CheckCircle2 size={20} />
             </div>
             <div>
               <p className="text-sm font-medium text-[#064e3b] dark:text-[#f0f9ff] mb-1">يتم تحديث البيانات بشكل دوري</p>
               <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                 الأسعار والمسافات المعروضة هي تقريبية وقد تتغير حسب الموسم ووقت الحجز. نوصي بالتواصل مع الفندق مباشرة للتأكد من التوافر والأسعار.
               </p>
             </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}

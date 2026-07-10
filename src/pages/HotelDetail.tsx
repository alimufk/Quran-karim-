export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  rating: number;
  reviews: number;
  distance: number; // رقم صافي بالأمتار لكي تعمل فلترة وتصفية الكود بدقة (مثال: 150 يعني 150 متر)
  shrine: string;
  price: number;
  imageUrl: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string;
  bookingUrl?: string; // رابط حجز احتياطي ذكي في حال لم تتوفر أرقام الاتصال
}

export const hotelsData: Hotel[] = [
  // كربلاء المقدسة
  {
    id: "karbala-baron",
    name: "فندق البارون كربلاء",
    city: "كربلاء المقدسة",
    country: "العراق",
    stars: 5,
    rating: 4.8,
    reviews: 1240,
    distance: 900,
    shrine: "مرقد الإمام الحسين (ع)",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    lat: 32.6264,
    lng: 44.0421,
    phone: "+9647800000000",
    whatsapp: "9647800000000",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=The+Baron+Hotel+Karbala"
  },
  {
    id: "karbala-rayhaan",
    name: "فندق ريحان روتانا كربلاء",
    city: "كربلاء المقدسة",
    country: "العراق",
    stars: 5,
    rating: 4.7,
    reviews: 850,
    distance: 350,
    shrine: "مرقد أبا الفضل العباس (ع)",
    price: 140,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500",
    lat: 32.6198,
    lng: 44.0385,
    phone: "+9647700000000",
    whatsapp: "9647700000000",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Kerbala+Rayhaan+by+Rotana"
  },
  // النجف الأشرف
  {
    id: "najaf-qasr-aldur",
    name: "فندق قصر الدر النجف",
    city: "النجف الأشرف",
    country: "العراق",
    stars: 5,
    rating: 4.6,
    reviews: 620,
    distance: 150,
    shrine: "المرقد العلوي المطهر",
    price: 95,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
    lat: 31.9958,
    lng: 44.3135,
    phone: "+9647500000000",
    whatsapp: "9647500000000",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Qasr+Al+Dur+Hotel+Najaf"
  },
  {
    id: "najaf-grand-alkaleej",
    name: "فندق خليج النجف الدولي",
    city: "النجف الأشرف",
    country: "العراق",
    stars: 4,
    rating: 4.4,
    reviews: 310,
    distance: 400,
    shrine: "المرقد العلوي المطهر",
    price: 70,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
    lat: 31.9932,
    lng: 44.3150,
    phone: "", // نتركه فارغاً لمحاكاة الحجز بالوسائل البديلة الذكية
    whatsapp: "",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Najaf+Hotels"
  },
  // الكاظمية المقدسة
  {
    id: "kazimiya-bourj",
    name: "فندق برج الكاظمية الكرام",
    city: "الكاظمية المقدسة",
    country: "العراق",
    stars: 4,
    rating: 4.5,
    reviews: 415,
    distance: 200,
    shrine: "المرقد الكاظمي الجوادين (ع)",
    price: 80,
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500",
    lat: 33.3798,
    lng: 44.3412,
    phone: "+9647900000000",
    whatsapp: "9647900000000",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Kadhimiya+Baghdad+Hotels"
  },
  // سامراء المقدسة
  {
    id: "samarra-palace",
    name: "فندق قصر سامراء السياحي",
    city: "سامراء المقدسة",
    country: "العراق",
    stars: 3,
    rating: 4.2,
    reviews: 180,
    distance: 450,
    shrine: "مرقد الإمامين العسكريين (ع)",
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500",
    lat: 34.1985,
    lng: 43.8742,
    phone: "",
    whatsapp: "",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=فنادق+قرب+مرقد+العسكريين+سامراء"
  }
];
// أضف هذه الاستيرادات في أعلى ملف HotelDetail.tsx إذا لم تكن موجودة
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, MessageSquare, ExternalLink, MapPin, Star } from 'lucide-react';

// أضف هذه الدالة في نهاية ملف src/pages/HotelDetail.tsx بعد مصفوفة hotelsData
export function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // البحث عن الفندق المحدد بواسطة الـ id
  const hotel = hotelsData.find(h => h.id === id);

  if (!hotel) {
    return (
      <div className="p-6 text-center space-y-4" dir="rtl">
        <p className="text-red-500 font-bold">عذراً، لم يتم العثور على الفندق المطلوب.</p>
        <button onClick={() => navigate('/hotels')} className="text-[#059669] underline">العودة لقائمة الفنادق</button>
      </div>
    );
  }

  // دالة الحجز الذكي والوسائل البديلة
  const handleBooking = () => {
    if (hotel.whatsapp) {
      window.open(`https://wa.me/${hotel.whatsapp}`, '_blank');
    } else if (hotel.phone) {
      window.open(`tel:${hotel.phone}`, '_self');
    } else if (hotel.bookingUrl) {
      window.open(hotel.bookingUrl, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.city)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#022c22] text-right pb-12" dir="rtl">
      {/* الهيدر */}
      <header className="flex items-center gap-4 p-4 bg-white dark:bg-[#064e3b] shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-white">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#064e3b] dark:text-[#fbbf24] truncate">{hotel.name}</h1>
      </header>

      {/* صورة الفندق */}
      <div className="w-full h-64 md:h-96 relative">
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-xl text-sm backdrop-blur-sm">
          {hotel.city}
        </div>
      </div>

      {/* تفاصيل الفندق */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-[#064e3b]/30 border border-gray-100 dark:border-[#059669]/20 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#064e3b] dark:text-white mb-2">{hotel.name}</h2>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < hotel.stars ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-300 dark:text-gray-600"} />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <MapPin size={16} className="text-[#059669]" />
                {hotel.city} - بالقرب من {hotel.shrine}
              </p>
            </div>
            <div className="text-left">
              <span className="text-xs text-gray-500 block">السعر التقريبي</span>
              <span className="text-2xl font-black text-[#059669] dark:text-[#fbbf24]">${hotel.price}</span>
              <span className="text-xs text-gray-500 block">/ ليلة</span>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">المسافة إلى العتبة:</span>
            <span className="font-bold text-[#064e3b] dark:text-[#fbbf24]">
              {hotel.distance >= 1000 ? `${(hotel.distance / 1000).toFixed(1)} كم` : `${hotel.distance} متر فقط`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">تقييم النزلاء:</span>
            <span className="font-bold bg-[#059669] text-white px-2 py-0.5 rounded-lg text-xs">
              {hotel.rating} ({hotel.reviews} تقييم)
            </span>
          </div>
        </div>

        {/* أزرار إجراء الحجز الذكي بأي وسيلة متوفرة */}
        <div className="space-y-3">
          <button 
            onClick={handleBooking}
            className="w-full bg-[#059669] hover:bg-[#047857] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            {hotel.whatsapp ? (
              <>
                <MessageSquare size={20} />
                تواصل عبر الواتساب للحجز المباشر
              </>
            ) : hotel.phone ? (
              <>
                <Phone size={20} />
                اتصل بالفندق الآن للحجز
              </>
            ) : (
              <>
                <ExternalLink size={20} />
                الانتقال لوسيلة الحجز الإلكترونية المتاحة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


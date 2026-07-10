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

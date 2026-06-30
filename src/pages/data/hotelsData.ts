export interface Hotel {
  id: string;
  name: string;
  country: string;
  city: string;
  shrine: string;
  distance: number; // in meters
  price: number; // approximate price per night in USD
  rating: number; // 1 to 5
  stars: number; // 1 to 5
  reviews: number;
  imageUrl: string;
  phone?: string;
  website?: string;
  mapUrl: string;
  lat: number;
  lng: number;
}

export const hotelsData: Hotel[] = [
  // Iraq - Karbala
  {
    id: "kar-1",
    name: "فندق البارون",
    country: "العراق",
    city: "كربلاء",
    shrine: "مرقد الإمام الحسين (ع)",
    distance: 800,
    price: 120,
    rating: 4.8,
    stars: 5,
    reviews: 1250,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    phone: "+964 780 000 0000",
    website: "https://example.com",
    mapUrl: "https://goo.gl/maps/example1",
    lat: 32.6160,
    lng: 44.0249
  },
  {
    id: "kar-2",
    name: "فندق ريحانة كربلاء",
    country: "العراق",
    city: "كربلاء",
    shrine: "مرقد أبي الفضل العباس (ع)",
    distance: 300,
    price: 150,
    rating: 4.6,
    stars: 5,
    reviews: 840,
    imageUrl: "https://images.unsplash.com/photo-1542314831-c6a4d14d8379?w=800&q=80",
    phone: "+964 770 000 0000",
    mapUrl: "https://goo.gl/maps/example2",
    lat: 32.6160,
    lng: 44.0249
  },
  {
    id: "kar-3",
    name: "فندق در قصر الكاظمية",
    country: "العراق",
    city: "كربلاء",
    shrine: "مرقد الإمام الحسين (ع)",
    distance: 100,
    price: 85,
    rating: 4.2,
    stars: 4,
    reviews: 420,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c0d13c85?w=800&q=80",
    phone: "+964 790 000 0000",
    mapUrl: "https://goo.gl/maps/example3",
    lat: 32.6160,
    lng: 44.0249
  },
  {
    id: "kar-4",
    name: "فندق السفير",
    country: "العراق",
    city: "كربلاء",
    shrine: "مرقد أبي الفضل العباس (ع)",
    distance: 500,
    price: 60,
    rating: 3.9,
    stars: 3,
    reviews: 215,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 32.6160,
    lng: 44.0249
  },

  // Iraq - Najaf
  {
    id: "naj-1",
    name: "فندق قصر الدر",
    country: "العراق",
    city: "النجف",
    shrine: "مرقد الإمام علي (ع)",
    distance: 150,
    price: 110,
    rating: 4.7,
    stars: 5,
    reviews: 930,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    phone: "+964 780 111 2222",
    website: "https://example.com",
    mapUrl: "https://goo.gl/maps/example",
    lat: 31.9958,
    lng: 44.3148
  },
  {
    id: "naj-2",
    name: "فندق زمزم",
    country: "العراق",
    city: "النجف",
    shrine: "مرقد الإمام علي (ع)",
    distance: 400,
    price: 55,
    rating: 4.0,
    stars: 3,
    reviews: 180,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 31.9958,
    lng: 44.3148
  },

  // Iraq - Baghdad (Kadhimiya)
  {
    id: "kad-1",
    name: "فندق ضيوف الكاظمية",
    country: "العراق",
    city: "بغداد (الكاظمية)",
    shrine: "مرقد الإمامين الكاظمين (ع)",
    distance: 200,
    price: 75,
    rating: 4.3,
    stars: 4,
    reviews: 340,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 33.3802,
    lng: 44.3385
  },

  // Iraq - Samarra
  {
    id: "sam-1",
    name: "فندق العسكريين",
    country: "العراق",
    city: "سامراء",
    shrine: "مرقد الإمامين العسكريين (ع)",
    distance: 300,
    price: 45,
    rating: 3.8,
    stars: 3,
    reviews: 110,
    imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 34.1989,
    lng: 43.8732
  },

  // Iran - Mashhad
  {
    id: "ir-mash-1",
    name: "فندق قصر طلايي",
    country: "إيران",
    city: "مشهد",
    shrine: "مرقد الإمام الرضا (ع)",
    distance: 1200,
    price: 130,
    rating: 4.9,
    stars: 5,
    reviews: 3200,
    imageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
    phone: "+98 51 3803 8000",
    website: "https://ghasr-talaee.com",
    mapUrl: "https://goo.gl/maps/example",
    lat: 36.2878,
    lng: 59.6157
  },
  {
    id: "ir-mash-2",
    name: "فندق مدينة الرضا",
    country: "إيران",
    city: "مشهد",
    shrine: "مرقد الإمام الرضا (ع)",
    distance: 400,
    price: 180,
    rating: 4.8,
    stars: 5,
    reviews: 2100,
    imageUrl: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 36.2878,
    lng: 59.6157
  },

  // Iran - Qom
  {
    id: "ir-qom-1",
    name: "فندق الموفنبيك",
    country: "إيران",
    city: "قم",
    shrine: "مرقد السيدة فاطمة المعصومة (ع)",
    distance: 600,
    price: 90,
    rating: 4.5,
    stars: 4,
    reviews: 850,
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 34.6416,
    lng: 50.8746
  },

  // Iran - Shiraz
  {
    id: "ir-sh-1",
    name: "فندق زندية",
    country: "إيران",
    city: "شيراز",
    shrine: "مرقد أحمد بن موسى (شاه جراغ)",
    distance: 1500,
    price: 100,
    rating: 4.7,
    stars: 5,
    reviews: 1400,
    imageUrl: "https://images.unsplash.com/photo-1618773928120-2e15dc9c6d42?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 29.6103,
    lng: 52.5311
  },

  // Saudi Arabia - Mecca
  {
    id: "sa-mec-1",
    name: "فندق برج الساعة الملكي (فيرمونت)",
    country: "السعودية",
    city: "مكة المكرمة",
    shrine: "المسجد الحرام",
    distance: 100,
    price: 350,
    rating: 4.8,
    stars: 5,
    reviews: 15400,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    phone: "+966 12 571 7777",
    website: "https://fairmont.com",
    mapUrl: "https://goo.gl/maps/example",
    lat: 21.4198,
    lng: 39.8262
  },
  {
    id: "sa-mec-2",
    name: "سويس أوتيل المقام",
    country: "السعودية",
    city: "مكة المكرمة",
    shrine: "المسجد الحرام",
    distance: 200,
    price: 250,
    rating: 4.6,
    stars: 5,
    reviews: 8200,
    imageUrl: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 21.4198,
    lng: 39.8262
  },

  // Saudi Arabia - Medina
  {
    id: "sa-med-1",
    name: "فندق أوبروي المدينة",
    country: "السعودية",
    city: "المدينة المنورة",
    shrine: "المسجد النبوي",
    distance: 50,
    price: 300,
    rating: 4.9,
    stars: 5,
    reviews: 12000,
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    phone: "+966 14 828 2222",
    mapUrl: "https://goo.gl/maps/example",
    lat: 24.4672,
    lng: 39.6111
  },

  // Syria - Damascus
  {
    id: "sy-dam-1",
    name: "فندق الشام",
    country: "سوريا",
    city: "دمشق",
    shrine: "مرقد السيدة زينب (ع)",
    distance: 10000,
    price: 80,
    rating: 4.2,
    stars: 4,
    reviews: 650,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c0d13c85?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 33.5138,
    lng: 36.2765
  },
  {
    id: "sy-dam-2",
    name: "فندق بيت الوالي",
    country: "سوريا",
    city: "دمشق",
    shrine: "مرقد السيدة رقية (ع)",
    distance: 500,
    price: 110,
    rating: 4.7,
    stars: 5,
    reviews: 420,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    mapUrl: "https://goo.gl/maps/example",
    lat: 33.5138,
    lng: 36.2765
  }
];


export interface GuideItem {
  id: string;
  name: string;
  distance: number; // المسافة بالكيلومتر
  locationDescription: string;
  category: 'selected' | 'hussainiyat' | 'shrines' | 'mawakeb' | 'medical' | 'waypoints';
  lat: number;
  lng: number;
}

export const visitorGuideData: GuideItem[] = [
  // --- 1. الأماكن المختارة (selected) ---
  {
    id: "sel-1",
    name: "مرقد السيد احمد بن هاشم",
    distance: 113.7,
    locationDescription: "كربلاء_الرحالية",
    category: "selected",
    lat: 32.4222,
    lng: 43.6111
  },
  {
    id: "sel-2",
    name: "الفلكة المركزية",
    distance: 87.1,
    locationDescription: "كربلاء المقدسة - مركز المدينة",
    category: "selected",
    lat: 32.6161,
    lng: 44.0322
  },
  {
    id: "sel-3",
    name: "سيطرة الكفيل",
    distance: 85.7,
    locationDescription: "كربلاء المقدسة - باب بغداد",
    category: "selected",
    lat: 32.6310,
    lng: 44.0410
  },
  {
    id: "sel-4",
    name: "شارع محمد الامين",
    distance: 87.1,
    locationDescription: "كربلاء المقدسة - مركز المدينة",
    category: "selected",
    lat: 32.6145,
    lng: 44.0290
  },

  // --- 2. الحسينيات (hussainiyat) ---
  {
    id: "hus-1",
    name: "أصحاب الكساء - البصرة",
    distance: 86.8,
    locationDescription: "شارع المدرسي حسينية عبد الله الرضيع",
    category: "hussainiyat",
    lat: 32.6201,
    lng: 44.0355
  },
  {
    id: "hus-2",
    name: "انصار الحسين - ذي قار",
    distance: 87.1,
    locationDescription: "كراج الموحد حسينية اهالي النصر",
    category: "hussainiyat",
    lat: 32.6080,
    lng: 44.0150
  },
  {
    id: "hus-3",
    name: "قمر بني هاشم - ذي قار",
    distance: 87.2,
    locationDescription: "كراج الموحد حسينية اهالي النصر",
    category: "hussainiyat",
    lat: 32.6082,
    lng: 44.0155
  },

  // --- 3. المزارات (shrines) ---
  {
    id: "shrine-1",
    name: "مقام الامام المهدي (عج)",
    distance: 85.7,
    locationDescription: "كربلاء_بداية شارع السدرة",
    category: "shrines",
    lat: 32.6225,
    lng: 44.0360
  },
  {
    id: "shrine-2",
    name: "مقام علي الاكبر (ع)",
    distance: 86.1,
    locationDescription: "كربلاء منتصف شارع السدرة",
    category: "shrines",
    lat: 32.6195,
    lng: 44.0362
  },
  {
    id: "shrine-3",
    name: "مرقد الامام الحسين عليه السلام",
    distance: 86.4,
    locationDescription: "مركز المدينة",
    category: "shrines",
    lat: 32.6164,
    lng: 44.0324
  },
  {
    id: "shrine-4",
    name: "مقام الامام جعفر الصادق (ع)",
    distance: 85.4,
    locationDescription: "خلف مقام الامام المهدي",
    category: "shrines",
    lat: 32.6240,
    lng: 44.0350
  },

  // --- 4. المواكب الخدمية (mawakeb) ---
  {
    id: "mok-1",
    name: "شهداء الطف",
    distance: 86.1,
    locationDescription: "العلقمي_الفرع الايسر",
    category: "mawakeb",
    lat: 32.6180,
    lng: 44.0410
  },
  {
    id: "mok-2",
    name: "انصار الزهراء",
    distance: 86.4,
    locationDescription: "فرع شير فضة",
    category: "mawakeb",
    lat: 32.6150,
    lng: 44.0380
  },
  {
    id: "mok-3",
    name: "انصار الامام الحسين (ع)",
    distance: 86.2,
    locationDescription: "الكف الايسر",
    category: "mawakeb",
    lat: 32.6155,
    lng: 44.0390
  },

  // --- 5. المرافق الصحية والخدمية (medical) ---
  {
    id: "med-1",
    name: "كعبة الرزايا_بصرة",
    distance: 107.7,
    locationDescription: "طريق النجف عمود 889",
    category: "medical",
    lat: 32.2210,
    lng: 44.1520
  },
  {
    id: "med-2",
    name: "مستشفى الامام زين العابدين",
    distance: 85.3,
    locationDescription: "كربلاء المقدسة - شارع الشيخ أحمد الوائلي",
    category: "medical",
    lat: 32.6022,
    lng: 44.0401
  },
  {
    id: "med-3",
    name: "مستشفى الكفيل التخصّصي",
    distance: 88.8,
    locationDescription: "كربلاء المقدسة - الطريق الحولي",
    category: "medical",
    lat: 32.5850,
    lng: 44.0210
  },

  // --- 6. نقاط دالة (waypoints) ---
  {
    id: "wp-1",
    name: "كراج كربلاء الموحد",
    distance: 87.1,
    locationDescription: "كربلاء المقدسة - شارع ميثم التمار(ع)",
    category: "waypoints",
    lat: 32.6190,
    lng: 44.0470
  },
  {
    id: "wp-2",
    name: "الدخانية",
    distance: 88.0,
    locationDescription: "كربلاء المقدسة - حي الموظفين",
    category: "waypoints",
    lat: 32.6010,
    lng: 44.0190
  },
  {
    id: "wp-3",
    name: "بريد كربلاء",
    distance: 88.8,
    locationDescription: "كربلاء المقدسة - شارع العباس",
    category: "waypoints",
    lat: 32.6110,
    lng: 44.0350
  },
  {
    id: "wp-4",
    name: "قنطرة السلام",
    distance: 86.7,
    locationDescription: "كربلاء المقدسة - شارع طويريج",
    category: "waypoints",
    lat: 32.6250,
    lng: 44.0750
  }
];

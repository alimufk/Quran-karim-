import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Home, 
  Building2, 
  HeartPulse, 
  Navigation, 
  Milestone, 
  Tent, 
  Hotel,
  ChevronLeft
} from 'lucide-react';

// قاعدة بيانات ضخمة وموسعة جداً مبنية على المواقع الحقيقية لخدمة الزائرين
const GUIDE_DATA = {
  selected: [
    { name: "مرقد السيد احمد بن هاشم", distance: "113.7 كم", location: "كربلاء_الرحالية", type: "shrine" },
    { name: "الفلكة المركزية", distance: "87.1 كم", location: "كربلاء المقدسة - مركز المدينة", type: "pin" },
    { name: "سيطرة الكفيل", distance: "85.7 كم", location: "كربلاء المقدسة - باب بغداد", type: "pin" },
    { name: "كراج كربلاء الموحد", distance: "87.1 كم", location: "كربلاء المقدسة - شارع ميثم التمار(ع)", type: "pin" },
    { name: "بريد كربلاء", distance: "88.8 كم", location: "كربلاء المقدسة - شارع العباس", type: "pin" },
    { name: "شارع محمد الامين", distance: "87.1 كم", location: "كربلاء المقدسة - مركز المدينة", type: "pin" },
    { name: "مقام صاحب الزمان (عج)", distance: "85.5 كم", location: "نهاية شارع السدرة - المحور الشمالي", type: "shrine" },
    { name: "مكتبة العتبة العباسية المقدسة", distance: "86.3 كم", location: "داخل صحن أبي الفضل العباس (ع)", type: "pin" }
  ],
  hosseiniyas: [
    { name: "أصحاب الكساء - البصرة", distance: "86.8 كم", location: "شارع المدرسي حسينية عبد الله الرضيع", type: "hosseiniya" },
    { name: "انصار الحسين - ذي قار", distance: "87.1 كم", location: "كراج الموحد حسينية اهالي النصر", type: "hosseiniya" },
    { name: "قمر بني هاشم - ذي قار", distance: "87.2 كم", location: "كراج الموحد حسينية اهالي النصر", type: "hosseiniya" },
    { name: "الزهراء ع - ذي قار", distance: "87.2 كم", location: "حسينية اهالي النصر قرب كراج الموحد", type: "hosseiniya" },
    { name: "حسينية تيسير الميامين", distance: "88.1 كم", location: "طريق النجف - حي القادسية", type: "hosseiniya" },
    { name: "حسينية قصر الحوراء (ع)", distance: "86.9 كم", location: "كربلاء - شارع المحافظة القديم", type: "hosseiniya" },
    { name: "حسينية أهالي المشخاب", distance: "91.3 كم", location: "طريق يا حسين - عمود 450", type: "hosseiniya" },
    { name: "حسينية غريب طوس", distance: "86.5 كم", location: "كربلاء المقدسة - منطقة باب الخان", type: "hosseiniya" },
    { name: "حسينية أهالي كركوك", distance: "87.0 كم", location: "كربلاء - شارع أحمد الوائلي", type: "hosseiniya" }
  ],
  shrines: [
    { name: "مقام الامام المهدي(عج)", distance: "85.7 كم", location: "كربلاء_بداية شارع السدرة", type: "shrine" },
    { name: "مقام علي الاكبر (ع)", distance: "86.1 كم", location: "كربلاء منتصف شارع السدرة", type: "shrine" },
    { name: "مرقد الامام الحسين عليه السلام", distance: "86.4 كم", location: "مركز المدينة - الروضة الحسينية المقدسة", type: "shrine" },
    { name: "مرقد أبي الفضل العباس عليه السلام", distance: "86.2 كم", location: "مركز المدينة - الروضة العباسية المقدسة", type: "shrine" },
    { name: "مقام الامام جعفر الصادق(ع)", distance: "85.4 كم", location: "خلف مقام الامام المهدي", type: "shrine" },
    { name: "مقام علي الاصغر(ع)", distance: "86.2 كم", location: "كربلاء منتصف شارع السدرة", type: "shrine" },
    { name: "مقام كف العباس الايسر", distance: "86.2 كم", location: "قرب مرقد الامام العباس - باب بغداد", type: "shrine" },
    { name: "مقام كف العباس الايمن", distance: "86.3 كم", location: "محلة باب السلالمة - قرب سوق العلاوي", type: "shrine" },
    { name: "مرقد ابن الحمزة", distance: "87.5 كم", location: "كربلاء المقدسة - منطقة الغاضرية", type: "shrine" },
    { name: "مرقد الحر بن يزيد الرياحي", distance: "93.0 كم", location: "قضاء الحر - غرب كربلاء بـ 7 كم", type: "shrine" },
    { name: "مرقد عون بن عبد الله", distance: "97.2 كم", location: "طريق كربلاء - بغداد (شمالاً)", type: "shrine" }
  ],
  mowakeb: [
    { name: "موكب شهداء الطف", distance: "86.1 كم", location: "العلقمي_الفرع الايسر", type: "mowkeb" },
    { name: "موكب انصار الزهراء", distance: "86.4 كم", location: "فرع شير فضة", type: "mowkeb" },
    { name: "موكب انصار الامام الحسين(ع)", distance: "86.2 كم", location: "الكف الايسر", type: "mowkeb" },
    { name: "موكب السادة الحسينيين البوذحك", distance: "86.4 كم", location: "شارع الامام علي (ع)", type: "mowkeb" },
    { name: "موكب احباب الحسين", distance: "86.4 كم", location: "فرع شير فضة", type: "mowkeb" },
    { name: "موكب انصار الحجة", distance: "86.2 كم", location: "باب الطاق_قرب فندق كميل", type: "mowkeb" },
    { name: "موكب عابس الشاكري", distance: "89.5 كم", location: "طريق النجف - عمود 1100", type: "mowkeb" },
    { name: "موكب بنى عامر", distance: "86.4 كم", location: "منطقة بين الحرمين الشريفين", type: "mowkeb" },
    { name: "موكب أهالي كربلاء المركزي", distance: "86.5 كم", location: "شارع القبلة - قرب العتبة الحسينية", type: "mowkeb" },
    { name: "موكب دموع العقيلة", distance: "87.2 كم", location: "شارع العباس - مقابل الكراج الداخلي", type: "mowkeb" },
    { name: "موكب شباب القاسم (ع)", distance: "86.8 كم", location: "محلة باب الطاق - السوق القديم", type: "mowkeb" }
  ],
  hotels: [
    { name: "انصار الزهراء_بصرة (استضافة)", distance: "94.5 كم", location: "طريق يا حسين نجف عزاء فقط", type: "hotel" },
    { name: "الامام السجاد_بصرة (استضافة)", distance: "88.5 كم", location: "سيد جودة قرب المنتزه", type: "hotel" },
    { name: "خدام الحسين_بصرة (استضافة)", distance: "85.9 كم", location: "شارع ميثم التمار قرب كراج الحسين", type: "hotel" },
    { name: "فندق راية الحجة_نجف", distance: "97.6 كم", location: "طريق النجف خان النخيلة", type: "hotel" },
    { name: "فندق ائمة البقيع_بغداد", distance: "83.3 كم", location: "حي العباس عمود 11", type: "hotel" },
    { name: "فندق شريفة بنت الحسن_بغداد", distance: "85.2 كم", location: "كربلاء تقاطع شرطة طوارئ كربلاء", type: "hotel" },
    { name: "فندق بارون كربلاء", distance: "89.1 كم", location: "شارع الحسينية - المدينة السياحية", type: "hotel" },
    { name: "فندق كريستال كربلاء", distance: "86.7 كم", location: "شارع السدرة - قرب مقام المهدي", type: "hotel" },
    { name: "فندق برج السفير", distance: "86.5 كم", location: "شارع المحيط - خلف العتبة العباسية", type: "hotel" },
    { name: "فندق الهنون", distance: "86.9 كم", location: "شارع باب قبلة الامام الحسين (ع)", type: "hotel" },
    { name: "فندق الخفاجي الاقتصادي", distance: "87.3 كم", location: "منطقة الميدان - السوق القديم", type: "hotel" }
  ],
  medical: [
    { name: "مفرزة كعبة الرزايا_بصرة الطبية", distance: "107.7 كم", location: "طريق النجف عمود 889", type: "medical" },
    { name: "مفرزة شباب الامام الحسن المجتبى - بابل", distance: "86.8 كم", location: "طريق الهندية قنطرة السلام", type: "medical" },
    { name: "مفرزة عبد الله بن زيد الطبية - بابل", distance: "86.7 كم", location: "طريق الهندية قنطرة السلام", type: "medical" },
    { name: "مستشفى الامام زين العابدين (ع)", distance: "85.3 كم", location: "كربلاء المقدسة - شارع الشيخ احمد الوائلي", type: "medical" },
    { name: "مستشفى الكفيل التخصصي", distance: "88.8 كم", location: "كربلاء المقدسة - الطريق الحولي", type: "medical" },
    { name: "مستشفى الولادة والاطفال تعليمي", distance: "87.6 كم", location: "كربلاء المقدسة - حي المعلمين", type: "medical" },
    { name: "مستشفى الحسين التعليمي العام", distance: "88.2 كم", location: "كربلاء - حي الحسين العام", type: "medical" },
    { name: "مفرزة العتبة العباسية الطبية (رقم 1)", distance: "86.3 كم", location: "صحن العقيلة زينب (ع)", type: "medical" },
    { name: "مستشفى سفير الامام الحسين (ع)", distance: "86.4 كم", location: "جوار الصحن الحسين الشريف - باب الكرامة", type: "medical" },
    { name: "مركز الهلال الاحمر العراقي للإسعاف", distance: "86.9 كم", location: "ساحة ما بين الحرمين", type: "medical" }
  ],
  landmarks: [
    { name: "كراج كربلاء الموحد (التحتاني)", distance: "87.1 كم", location: "كربلاء المقدسة - شارع ميثم التمار(ع)", type: "pin" },
    { name: "الدخانيه", distance: "88.0 كم", location: "كربلاء المقدسة - حي الموظفين", type: "pin" },
    { name: "بريد كربلاء المركزي", distance: "88.8 كم", location: "كربلاء المقدسة - شارع العباس", type: "pin" },
    { name: "قنطرة السلام التاريخية", distance: "86.7 كم", location: "كربلاء المقدسة - شارع طويريج", type: "pin" },
    { name: "سوق البصرة القديم", distance: "90.2 كم", location: "كربلاء المقدسة - الجاهز", type: "pin" },
    { name: "فلكة التربية الرئيسية", distance: "87.5 كم", location: "كربلاء المقدسة - مركز المدينة", type: "pin" },
    { name: "سيطرة الابراهيمية", distance: "94.1 كم", location: "طريق كربلاء - بابل", type: "pin" },
    { name: "ساحة قمر بني هاشم", distance: "86.6 كم", location: "تقاطع باب بغداد - مدخل المدينة القديمة", type: "pin" },
    { name: "مجسر الضريبة", distance: "87.9 كم", location: "شارع المحافظة - تقاطع السير الموحد", type: "pin" },
    { name: "نفق العباس (ع)", distance: "86.4 كم", location: "أسفل ساحة الهندية - شارع العباس", type: "pin" }
  ]
};

type SectionKey = keyof typeof GUIDE_DATA;

export default function GuideDashboard() {
  const [activeTab, setActiveTab] = useState<SectionKey>('selected');
  const [searchQuery, setSearchQuery] = useState('');

  const tabsConfig = [
    { id: 'selected', label: 'الأماكن المختارة', icon: Compass },
    { id: 'hosseiniyas', label: 'الحسينيات', icon: Home },
    { id: 'shrines', label: 'المزارات', icon: Building2 },
    { id: 'mowakeb', label: 'المواكب الخدمية', icon: Tent },
    { id: 'hotels', label: 'الفنادق والأبنية', icon: Hotel },
    { id: 'medical', label: 'المرافق الصحية والخدمية', icon: HeartPulse },
    { id: 'landmarks', label: 'النقاط الدالة والتقاطعات', icon: Milestone },
  ];

  const filteredItems = useMemo(() => {
    const items = GUIDE_DATA[activeTab] || [];
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const handleNavigation = (name: string, location: string) => {
    const fullQuery = encodeURIComponent(`${name} ${location} كربلاء العراق`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${fullQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0e140f] text-[#f0f5f1] font-sans antialiased selection:bg-emerald-600 selection:text-white" dir="rtl">
      {/* الهيدر العلوي بنظام أخضر داكن إسلامي */}
      <header className="sticky top-0 z-50 bg-[#142016]/95 backdrop-blur border-b border-[#1f3323] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1f3323] rounded-full transition">
            <BookmarkIcon className="w-5 h-5 text-emerald-400" />
          </button>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-l from-white to-emerald-300 bg-clip-text text-transparent">
            دليل زائر الاربعين
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              placeholder="بحث سريع في هذا القسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a2d1f] text-sm text-white placeholder-emerald-700 border border-[#253f2b] rounded-full pl-4 pr-9 py-2 w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>
      </header>

      {/* شريط الأقسام السبعة التفاعلي بلون أخضر زمردي متناسق */}
      <nav className="sticky top-[53px] z-40 bg-[#111c13] border-b border-[#1b2b1e] overflow-x-auto scrollbar-none flex gap-2 px-4 py-3">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as SectionKey);
                setSearchQuery(''); 
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold scale-105' 
                  : 'bg-[#18261b] text-emerald-300/70 hover:bg-[#1f3324] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* قائمة عناصر القسم المختار المنظمة التفاعلية */}
      <main className="p-4 max-w-3xl mx-auto space-y-3 pb-24">
        <div className="text-xs text-emerald-500 font-medium px-1 mb-2">
          يحتوي هذا القسم على <span className="font-bold text-white bg-emerald-800 px-2 py-0.5 rounded-full">{filteredItems.length}</span> من المواقع الموثقة
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => handleNavigation(item.name, item.location)}
              className="bg-[#132217] border border-[#1d3222] hover:border-emerald-500/50 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-[#182b1d] group"
            >
              <div className="flex items-center gap-4">
                {/* الأيقونة الدائرية الخضراء كما طلبت لتطابق هوية تطبيقك */}
                <div className="bg-emerald-600 text-white rounded-full p-3 shadow-md shadow-emerald-950/50 group-hover:bg-emerald-500 transition-colors">
                  <MapPin className="w-5 h-5 text-white" />
                </div>

                {/* تفاصيل الاسم والموقع والمسافة */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-emerald-300/70">
                    <span className="flex items-center gap-1 font-semibold">
                      🚶 يبعد عنك: <span className="text-emerald-400 font-bold">{item.distance}</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {item.location}
                  </span>
                </div>
              </div>

              {/* سهم الانتقال للملاحة */}
              <div className="p-2 bg-[#1b2f20] rounded-lg group-hover:bg-emerald-600/20 transition-colors">
                <ChevronLeft className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-emerald-600/60">
            <p className="text-sm">لم يتم العثور على أي مواقع تطابق بحثك في هذا القسم حالياً.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function BookmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}


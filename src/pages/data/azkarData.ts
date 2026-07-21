export interface ZikrItem {
  id: number;
  title: string;
  text: string;
  audioUrl?: string; // أضفنا هذا الحقل الجديد للمقطع الصوتي
}

export interface ZikrSection {
  title: string;
  subtitle: string;
  items: ZikrItem[];
}

export const monajatList: ZikrItem[] = [
  { 
    id: 1, 
    title: "المناجاة الأولى: مناجاة التائبين", 
    text: "إِلَهِي أَلْبَسَتْنِي الْخَطَايَا ثَوْبَ مَذَلَّتِي...",
    audioUrl: "https://d.top4top.io/m_385457vx30.mp3" // مثال لملف الصوت
  },
  { 
    id: 2, 
    title: "المناجاة الثانية: مناجاة الشاكين", 
    text: "إِلَهِي إِلَيْكَ أَشْكُو نَفْساً بِالسُّوءِ أَمَّارَةً...",
    audioUrl: "https://a.top4top.io/m_3854m3zl90.mp3"
  },
  { id: 3, title: "المناجاة الثالثة: مناجاة الخائفين", text: "إِلَهِي أَتَرَاكَ...", audioUrl: "https://i.top4top.io/m_3854wpbkn0.mp3" },
  { id: 4, title: "المناجاة الرابعة: مناجاة الراجين", text: "يَا مَنْ إِذَا سَأَلَهُ...", audioUrl: "https://e.top4top.io/m_3854pmo4q0.mp3" },
  { id: 5, title: "المناجاة الخامسة: مناجاة الراغبين", text: "إِلَهِي إِنْ كَانَ قَلَّ زَادِي...", audioUrl: "https://i.top4top.io/m_3854w37540.mp3" },
  { id: 6, title: "المناجاة السادسة: مناجاة الشاكرين", text: "إِلَهِي أَذْهَلَنِي...", audioUrl: "https://d.top4top.io/m_3854ntzuh0.mp3" },
  { id: 7, title: "المناجاة السابعة: مناجاة المطيعين", text: "اللَّهُمَّ أَلْهِمْنَا طَاعَتَكَ...", audioUrl: "https://k.top4top.io/m_3854soc0z0.mp3" },
  { id: 8, title: "المناجاة الثامنة: مناجاة المريدين", text: "سُبْحَانَكَ مَا أَضْيَقَ...", audioUrl: "https://d.top4top.io/m_3854o6xq60.mp3" },
  { id: 9, title: "المناجاة التاسعة: مناجاة المحبين", text: "إِلَهِي مَنْ ذَا الَّذِي ذَاقَ...", audioUrl: "https://k.top4top.io/m_3854hchmy0.mp3" },
  { id: 10, title: "المناجاة العاشرة: مناجاة المتوسلين", text: "إِلَهِي لَيْسَ لِي وَسِيلَةٌ...", audioUrl: "https://e.top4top.io/m_3854gu5xp0.mp3" },
  { id: 11, title: "المناجاة الحادية عشرة: مناجاة Mفتقرين", text: "إِلَهِي كَسْرِي لا يَجْبُرُهُ...", audioUrl: "https://i.top4top.io/m_3854b02my0.mp3" },
  { id: 12, title: "المناجاة الثانية عشرة: مناجاة العارفين", text: "إِلَهِي فَاجْعَلْنَا...", audioUrl: "https://d.top4top.io/m_3854eqqtp0.mp3" },
  { id: 13, title: "المناجاة الثالثة عشرة: مناجاة الذاكرين", text: "إِلَهِي لَوْلا الْوَاجِبُ...", audioUrl: "https://h.top4top.io/m_3854u8ogx0.mp3" },
  { id: 14, title: "المناجاة الرابعة عشرة: مناجاة المعتصمين", text: "اللَّهُمَّ يَا مَلاذَ اللائِذِينَ...", audioUrl: "https://l.top4top.io/m_38543it0z0.mp3" },
  { id: 15, title: "المناجاة الخامسة عشرة: مناجاة الزاهدين", text: "إِلَهِي أَسْكَنْتَنَا دَاراً...", audioUrl: "https://b.top4top.io/m_3854x53qi0.mp3" }
];

export const tasbehatList: ZikrItem[] = [
  { id: 1, title: "تسبيح السيدة فاطمة الزهراء (ع)", text: "اللهُ أَكْبَر...", audioUrl: "/audio/tasbeeh_zahra.mp3" },
  { id: 2, title: "تسبيح يوم السبت", text: "سُبْحَانَ اللهِ رَبِّ الْعَالَمِينَ...", audioUrl: "/audio/tasbeeh_sat.mp3" },
  { id: 3, title: "تسبيح يوم الأحد", text: "سُبْحَانَ مَنْ مَلأَ الأَرْضَ...", audioUrl: "/audio/tasbeeh_sun.mp3" },
  { id: 4, title: "تسبيح يوم الاثنين", text: "سُبْحَانَ الْحَنَّانِ الْمَنَّانِ...", audioUrl: "/audio/tasbeeh_mon.mp3" },
  { id: 5, title: "تسبيح يوم الثلاثاء", text: "سُبْحَانَ مَنْ لا يَزُولُ...", audioUrl: "/audio/tasbeeh_tue.mp3" },
  { id: 6, title: "تسبيح يوم الأربعاء", text: "سُبْحَانَ الْقَادِرِ الْمُقْتَدِرِ...", audioUrl: "/audio/tasbeeh_wed.mp3" },
  { id: 7, title: "تسبيح يوم الخميس والجمعة", text: "سُبْحَانَ ذِي الطَّوْلِ...", audioUrl: "/audio/tasbeeh_thu_fri.mp3" }
];

export const taqebatList: ZikrItem[] = [
  { id: 1, title: "تعقيب صلاة الفجر", text: "أَصْبَحْتُ فِي أَمَانِ اللهِ...", audioUrl: "https://g.top4top.io/m_3854zueod0.mp3" },
  { id: 2, title: "تعقيب صلاة الظهر", text: "لا إِلَهَ إِلا اللهُ الْعَظِيمُ...", audioUrl: "https://j.top4top.io/m_3854n43jd0.mp3" },
  { id: 3, title: "تعقيب صلاة العصر", text: "أَسْتَغْفِرُ اللهَ الَّذِي...", audioUrl: "https://c.top4top.io/m_3854kj2160.mp3" },
  { id: 4, title: "تعقيب صلاة المغرب", text: "إِنَّ اللهَ وَمَلائِكَتَهُ...", audioUrl: "https://a.top4top.io/m_3854mjb5n0.mp3" },
  { id: 5, title: "تعقيب صلاة العشاء", text: "اللَّهُمَّ إِنَّهُ لَيْسَ لِي عِلْمٌ...", audioUrl: "https://e.top4top.io/m_3854pq7lf0.mp3" }
];

export const weekDuas: ZikrItem[] = [
  { id: 1, title: "دعاء يوم السبت", text: "بِسْمِ اللهِ كَلِمَةِ...", audioUrl: "/audio/dua_sat.mp3" },
  { id: 2, title: "دعاء يوم الأحد", text: "بِسْمِ اللهِ الَّذِي لا أَرْجُو...", audioUrl: "/audio/dua_sun.mp3" },
  { id: 3, title: "دعاء يوم الاثنين", text: "الْحَمْدُ للهِ الَّذِي لَمْ يُشْهِدْ...", audioUrl: "/audio/dua_mon.mp3" },
  { id: 4, title: "دعاء يوم الثلاثاء", text: "الْحَمْدُ للهِ وَالْحَمْدُ حَقُّهُ...", audioUrl: "/audio/dua_tue.mp3" },
  { id: 5, title: "دعاء يوم الأربعاء", text: "الْحَمْدُ للهِ الَّذِي جَعَلَ...", audioUrl: "/audio/dua_wed.mp3" },
  { id: 6, title: "دعاء يوم الخميس", text: "الْحَمْدُ للهِ الَّذِي أَذْهَبَ...", audioUrl: "/audio/dua_thu.mp3" },
  { id: 7, title: "دعاء يوم الجمعة", text: "الْحَمْدُ للهِ الأوَّلِ...", audioUrl: "/audio/dua_fri.mp3" }
];

export const generalDuas: ZikrItem[] = [
  { id: 1, title: "1. دعاء الفرج الشريف", text: "اللَّهُمَّ كُنْ لِوَلِيِّكَ...", audioUrl: "/audio/dua_faraj.mp3" },
  { id: 2, title: "2. دعاء النور المبارك", text: "بِسْمِ اللهِ النُّورِ...", audioUrl: "/audio/dua_noor.mp3" },
  { id: 3, title: "3. دعاء الحفظ والأمان", text: "بِسْمِ اللهِ عَلَى نَفْسِي...", audioUrl: "/audio/dua_hifz.mp3" },
  { id: 4, title: "4. دعاء طلب الرزق الوفير", text: "اللَّهُمَّ ارْزُقْنِي مِنْ فَضْلِكَ...", audioUrl: "/audio/dua_rizq.mp3" },
  { id: 5, title: "5. دعاء الغريق المشهور", text: "يَا اللهُ يَا رَحْمَنُ...", audioUrl: "/audio/dua_ghareeq.mp3" }
];

export const HujajPrayers: ZikrItem[] = [
  { id: 1, title: "1. الصلاة على النبي محمد (ص)", text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ...", audioUrl: "/audio/pr_prophet.mp3" },
  { id: 2, title: "2. الصلاة على أمير المؤمنين علي (ع)", text: "اللَّهُمَّ صَلِّ عَلَى أَمِيرِ...", audioUrl: "/audio/pr_ali.mp3" },
  { id: 3, title: "3. الصلاة على فاطمة الزهراء (ع)", text: "اللَّهُمَّ صَلِّ عَلَى الصِّدِّيقَةِ...", audioUrl: "/audio/pr_zahra.mp3" },
  { id: 4, title: "4. الصلاة على الإمامين الحسن والحسين (ع)", text: "اللَّهُمَّ صَلِّ عَلَى الْحَسَنِ...", audioUrl: "/audio/pr_hasan_hussain.mp3" },
  { id: 5, title: "5. الصلاة على بقية الأئمة الأطهار والحجة القائم (عج)", text: "اللَّهُمَّ صَلِّ عَلَى عِتْرَةِ...", audioUrl: "/audio/pr_mahdi.mp3" }
];

export const azkarData: Record<string, ZikrSection> = {
  monajat: { title: "15 من المناجاة", subtitle: "المناجاة الخمس عشرة المروية عن الإمام زين العابدين (ع)", items: monajatList },
  tasbehat: { title: "7 تسبيحات", subtitle: "التسبيحات اليومية المستحبة وتسبيح الزهراء (ع)", items: tasbehatList },
  taqebat: { title: "تعقيبات الصلاة", subtitle: "التعقيبات الخاصة بالصلوات الخمس المكتوبة", items: taqebatList },
  weekDuas: { title: "أدعية الأيام", subtitle: "الأدعية المخصصة لكل يوم من أيام الأسبوع", items: weekDuas },
  generalDuas: { title: "أدعية عامة", subtitle: "أدعية مباركة ومأثورة لقضاء الحوائج والأمان والرزق", items: generalDuas },
  hujaj: { title: "الصلاة على الحجج", subtitle: "الصلوات المأثورة على النبي والأئمة الأطهار (ع)", items: HujajPrayers }
};

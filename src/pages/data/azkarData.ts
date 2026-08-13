export interface ZikrItem { 
  id: number; 
  title: string; 
  text: string; 
  audioUrl?: string; 
}

export interface ZikrSection { 
  title: string; 
  subtitle: string; 
  icon?: string; // تم إضافة حقل الأيقونة هنا
  items: ZikrItem[]; 
}

export const monajatList: ZikrItem[] = [
  { id: 1, title: "المناجاة الأولى: مناجاة التائبين", text: `إِلَهِي أَلْبَسَتْنِي الْخَطَايَا ثَوْبَ مَذَلَّتِي...`, audioUrl: "https://h.top4top.io/m_3857sll460.mp3" },
  { id: 2, title: "المناجاة الثانية: مناجاة الشاكين", text: `إِلَهِي إِلَيْكَ أَشْكُو نَفْساً بِالسُّوءِ أَمَّارَةً...`, audioUrl: "https://a.top4top.io/m_3854m3zl90.mp3" },
  { id: 3, title: "المناجاة الثالثة: مناجاة الخائفين", text: `إِلَهِي أَتَرَاكَ بَعْدَ الإِيمَانِ بِكَ تُعَذِّبُنِي...`, audioUrl: "https://i.top4top.io/m_3854wpbkn0.mp3" },
  { id: 4, title: "المناجاة الرابعة: مناجاة الراجين", text: `يَا مَنْ إِذَا سَأَلَهُ عَبْدٌ أَعْطَاهُ...`, audioUrl: "https://e.top4top.io/m_3854pmo4q0.mp3" },
  { id: 5, title: "المناجاة الخامسة: مناجاة الراغبين", text: `إِلَهِي إِنْ كَانَ قَلَّ زَادِي فِي الْمَسِيرِ إِلَيْكَ...`, audioUrl: "https://i.top4top.io/m_3854w37540.mp3" },
  { id: 6, title: "المناجاة السادسة: مناجاة الشاكرين", text: `إِلَهِي أَذْهَلَنِي عَنْ إِقَامَةِ شُكْرِكَ تَتَابُعُ طَوْلِكَ...`, audioUrl: "https://d.top4top.io/m_3854ntzuh0.mp3" },
  { id: 7, title: "المناجاة السابعة: مناجاة المطيعين", text: `اللَّهُمَّ أَلْهِمْنَا طَاعَتَكَ، وَجَنِّبْنَا مَعْصِيَتَكَ...`, audioUrl: "https://k.top4top.io/m_3854soc0z0.mp3" },
  { id: 8, title: "المناجاة الثامنة: مناجاة المريدين", text: `سُبْحَانَكَ مَا أَضْيَقَ الطُّرُقَ عَلَى مَنْ لَمْ تَكُنْ دَلِيلَهُ...`, audioUrl: "https://d.top4top.io/m_3854o6xq60.mp3" },
  { id: 9, title: "المناجاة التاسعة: مناجاة المحبين", text: `إِلَهِي مَنْ ذَا الَّذِي ذَاقَ حَلاوَةَ مَحَبَّتِكَ...`, audioUrl: "https://k.top4top.io/m_3854hchmy0.mp3" },
  { id: 10, title: "المناجاة العاشرة: مناجاة المتوسلين", text: `إِلَهِي لَيْسَ لِي وَسِيلَةٌ إِلَيْكَ إِلا عَوَاطِفُ رَأْفَتِكَ...`, audioUrl: "https://e.top4top.io/m_3854gu5xp0.mp3" },
  { id: 11, title: "المناجاة الحادية عشرة: مناجاة المفتقرين", text: `إِلَهِي كَسْرِي لا يَجْبُرُهُ إِلا لُطْفُكَ وَإِحْسَانُكَ...`, audioUrl: "https://i.top4top.io/m_3854b02my0.mp3" },
  { id: 12, title: "المناجاة الثانية عشرة: مناجاة العارفين", text: `إِلَهِي قَصُرَتِ الأَلْسُنُ عَنْ ظُهُورِ ثَنَائِكَ...`, audioUrl: "https://d.top4top.io/m_3854eqqtp0.mp3" },
  { id: 13, title: "المناجاة الثالثة عشرة: مناجاة الذاكرين", text: `إِلَهِي لَوْلا الْوَاجِبُ مِنْ قَبُولِ أَمْرِكَ لَنَزَّهْتُكَ...`, audioUrl: "https://h.top4top.io/m_3854u8ogx0.mp3" },
  { id: 14, title: "المناجاة الرابعة عشرة: مناجاة المعتصمين", text: `اللَّهُمَّ يَا مَلاذَ اللاَئِذِينَ، وَيَا مَفْزَعَ الْعَائِذِينَ...`, audioUrl: "https://l.top4top.io/m_38543it0z0.mp3" },
  { id: 15, title: "المناجاة الخامسة عشرة: مناجاة الزاهدين", text: `إِلَهِي أَسْكَنْتَنَا دَاراً حَفَرَتْ لَنَا حُفَرَ مَكْرِهَا...`, audioUrl: "https://b.top4top.io/m_3854x53qi0.mp3" }
];

export const tasbehatList: ZikrItem[] = [
  { id: 1, title: "تسبيح السيدة فاطمة الزهراء (ع)", text: `اللهُ أَكْبَر (34 مرة)، الْحَمْدُ للهِ (33 مرة)، سُبْحَانَ اللهِ (33 مرة).`, audioUrl: "https://b.top4top.io/m_3854bizek0.mp3" },
  { id: 2, title: "تسبيح يوم السبت", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://k.top4top.io/m_3854lt2fx0.mp3" },
  { id: 3, title: "تسبيح يوم الأحد", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://f.top4top.io/m_3854psqzo0.mp3" },
  { id: 4, title: "تسبيح يوم الاثنين", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://b.top4top.io/m_3854werfm0.mp3" },
  { id: 5, title: "تسبيح يوم الثلاثاء", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://i.top4top.io/m_3854fn59o0.mp3" },
  { id: 6, title: "تسبيح يوم الأربعاء", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://d.top4top.io/m_38547oj520.mp3" },
  { id: 7, title: "تسبيح يوم الخميس ", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://i.top4top.io/m_38545v0ij0.mp3" },
  { id: 8, title: "تسبيح يوم الجمعة", text: `بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://e.top4top.io/m_3854jxy7f0.mp3" }
];

export const taqebatList: ZikrItem[] = [
  { id: 1, title: "تعقيب صلاة الصبح", text: `بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://d.top4top.io/m_38547pw7e0.mp3" },
  { id: 2, title: "تعقيب صلاة الظهر", text: `بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://b.top4top.io/m_3854idc090.mp3" },
  { id: 3, title: "تعقيب صلاة العصر", text: `بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://c.top4top.io/m_3854kj2160.mp3" },
  { id: 4, title: "تعقيب صلاة المغرب", text: `بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://a.top4top.io/m_3854mjb5n0.mp3" },
  { id: 5, title: "تعقيب صلاة العشاء", text: `بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ...`, audioUrl: "https://e.top4top.io/m_3854pq7lf0.mp3" }
];

export const weekDuas: ZikrItem[] = [
  { id: 1, title: "كتاب السقيفة", text: `علي مع الخلفاء...`, audioUrl: "https://b.top4top.io/m_3854mgkhn0.mp3" },
  { id: 2, title: "كتاب السقيفة", text: `تأثير دخول المهاجرين في اجتماع الانصار ...`, audioUrl: "https://g.top4top.io/m_3854jkr5a0.mp3" },
  { id: 3, title: "كتاب السقيفة", text: `الدوافع لاجتماع السقيفة...`, audioUrl: "https://e.top4top.io/m_38547eovk0.mp3" },
  { id: 4, title: "كتاب السقيفة", text: `تدبير النبي لمنع الخلاف ...`, audioUrl: "https://g.top4top.io/m_3854v2azl0.mp3" },
  { id: 5, title: "كتاب السقيفة", text: `موقف النبي اتجاه امر الخلافة...`, audioUrl: "https://a.top4top.io/m_3854denou0.mp3" },
  { id: 6, title: "كتاب السقيفة", text: `تأثير العقيدة على المؤلف واضطراب التاريخ...`, audioUrl: "https://g.top4top.io/m_3854agzml0.mp3" },
  { id: 7, title: "كتاب السقيفة", text: `الْحَمْدُ للهِ الأَوَّلِ قَبْلَ الإِنْشَاءِ وَالإِحْيَاءِ...`, audioUrl: "/audio/dua_fri.mp3" }
];

export const generalDuas: ZikrItem[] = [
  { id: 1, title: "1. خطب نهج البلاغة", text: `يذكر فيها ابتداء من خلق السموات والارض وخلق ادم...`, audioUrl: "https://h.top4top.io/m_3855ewx130.mp3" },
  { id: 2, title: "2. خطب نهج البلاغة", text: `لما قبض رسول الله (ع) وخاطبه العباس وابو سفيان...`, audioUrl: "https://j.top4top.io/m_38557j4iy0.mp3" },
  { id: 3, title: "3. خطب نهج البلاغة", text: `لابنه محمد ابن الحنفية لما اعطاه الراية يوم الجمل...`, audioUrl: "https://d.top4top.io/m_3855s52d70.mp3" },
  { id: 4, title: "4. خطب نهج البلاغة", text: `في يوم صفين امر الناس بالصلح...`, audioUrl: "https://i.top4top.io/m_3855vrjxt0.mp3" },
  { id: 5, title: "5. خطب نهج البلاغة", text: `في صفت خلق ادم...`, audioUrl: "https://l.top4top.io/m_3855gqbto0.mp3" },
  { id: 6, title: "6. خطب نهج البلاغة", text: `في صفت خلق الدنيا...`, audioUrl: "https://c.top4top.io/m_3855tlzr70.mp3" },
  { id: 7, title: "7. خطب نهج البلاغة", text: `في صفات اخ في الله...`, audioUrl: "https://h.top4top.io/m_3855qb88j0.mp3" },
  { id: 8, title: "8. خطب نهج البلاغة", text: `في ذمة اختلاف الذين يدعون العلم...`, audioUrl: "https://e.top4top.io/m_38553ui649.mp3" },
  { id: 9, title: "9. خطب نهج البلاغة", text: `في الاستعداد للموت وفي المبادرة الى صالح الاعمال...`, audioUrl: "https://g.top4top.io/m_38552zvy40.mp3" },
  { id: 10, title: "10. خطب نهج البلاغة", text: `كتاب له علية السلام الى االى عثمان ابن حنيف...`, audioUrl: "https://c.top4top.io/m_38553c5pb0.mp3" },
  { id: 11, title: "11. خطب نهج البلاغة", text: `عهد له (ع) الى محمد ابن ابي بكر حين قلده مصر...`, audioUrl: "https://l.top4top.io/m_3855sf0v70.mp3" },
  { id: 12, title: "12. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام يبين فيها فضله وعلمه...`, audioUrl: "https://i.top4top.io/m_385500e3g0.mp3" },
  { id: 13, title: "13. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام في المعروفة في الوسيلة...`, audioUrl: "https://l.top4top.io/m_38552s69b0.mp3" },
  { id: 14, title: "14. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام في ذم ابليس على استكباره...`, audioUrl: "https://a.top4top.io/m_3855mn32z0.mp3" },
  { id: 15, title: "15. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام في قدرة الله...`, audioUrl: "https://f.top4top.io/m_3855lomk50.mp3" },
  { id: 16, title: "16. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام في اول جمعة على بيعته...`, audioUrl: "https://a.top4top.io/m_3855tj3ar0.mp3" },
  { id: 17, title: "17. خطب نهج البلاغة", text: `خطبة الامام علي علية السلام في التوحيد...`, audioUrl: "https://e.top4top.io/m_3855bsdl00.mp3" },
  { id: 18, title: "18. خطب نهج البلاغة", text: `اللالئ المنثورة من كلام امير المؤمنين علية السلام...`, audioUrl: "https://i.top4top.io/m_3855gai9d0.mp3" },
  { id: 19, title: "19. خطب نهج البلاغة", text: `الاربمعائة الوصية الجزء الثاني...`, audioUrl: "https://c.top4top.io/m_3855xrbh00.mp3" },
  { id: 20, title: "20. خطب نهج البلاغة", text: `الاربمعائة الوصية الجزء الاول...`, audioUrl: "https://e.top4top.io/m_3855t130b0.mp3" }
];

export const HujajPrayers: ZikrItem[] = [
  { id: 1, title: "1. الصلاة على النبي محمد (ص)", text: `اَللّـهُمَّ صَلِّ عَلَى مُحَمَّدٍ كَمَا حَمَلَ وَحْيَكَ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alsalatu_eilaa_alnabiu.mp3" },
  { id: 2, title: "2. الصلاة على أمير المؤمنين علي (ع)", text: `اَللّهُمَّ صَلِّ عَلَى أَمِيرِ المُؤْمِنِينَ عَلِيِّ بْنِ أَبِي طَالِبٍ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alimamali.mp3" },
  { id: 3, title: "3. الصلاة على فاطمة الزهراء (ع)", text: `اَللّهُمَّ صَلِّ عَلَى الصِّدِّيقَةِ فاطِمَةَ الزَّكِيَّةِ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/fitami.mp3" },
  { id: 4, title: "4. الصلاة على الإمامين الحسن والحسين (ع)", text: `اَللّهُمَّ صَلِّ عَلَى الحَسَنِ وَالحُسَيْنِ عَبْدَيْكَ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alhssinalhsein.mp3" },
  { id: 5, title: "5. الصلاة على الامام علي ابن الحسين السجاد (ع)", text: `اَللّهُمَّ صَلِّ عَلى عَلِيِّ بْنِ الحُسَيْنِ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/aliasijat.mp3" },
  { id: 6, title: "6. الصلاة على الامام محمد ابن علي الباقر(ع)", text: `اَللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ بْنِ عَلِيٍّ باقِرِ العِلْمِ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mahmood.mp3" },
  { id: 7, title: "7. الصلاة على الامام جعفر ابن محمد الصادق(ع)", text: `اَللّهُمَّ صَلِّ عَلَى جَعْفَرِ بْنِ مُحَمَّدٍ الصَّادِقِ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/jafaralsadiq.mp3" },
  { id: 8, title: "8. الصلاة على الامام موسى ابن جعفر الكاظم(ع)", text: `اَللّهُمَّ صَلِّ عَلَى الأَمِينِ المُؤْتَمَنِ مُوسى بْنِ جَعْفَرٍ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mosialkism.mp3" },
  { id: 9, title: "9. الصلاة على الامام علي ابن موسى الرضا(ع)", text: `اَللّهُمَّ صَلِّ عَلَى عَلِيِّ بْنِ مُوسى الَّذِي ارْتَضَيْتَهُ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alialrdi.mp3" },
  { id: 10, title: "10. الصلاة على الامام محمد ابن علي الجواد(ع)", text: `اَللّهُمَّ صَلِّ عَلَى مُحَمَّدِ بْنِ عَلِيِّ بْنِ مُوسى...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/aljwid.mp3" },
  { id: 11, title: "11. الصلاة على الامام علي ابن محمد الهادي(ع)", text: `اَللّهُمَّ صَلِّ عَلَى عَلِيِّ بْنِ مُحَمَّدٍ وَصِيِّ الأَوْصِياء...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alhidie.mp3" },
  { id: 12, title: "12. الصلاة على الامام الحسن ابن علي العسكري(ع)", text: `َاللّهُمَّ صَلِّ عَلَى الحَسَنِ بْنِ عَلِيِّ بْنِ مُحَمَّدٍ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hassin.mp3" },
  { id: 13, title: "13. الصلاة على الامام الحجة(ع)", text: `اَللّهُمَّ صَلِّ عَلَى وَلِيِّكَ وَابْنِ أَوْلِيائِكَ...`, audioUrl: "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alhijia.mp3" }
];

export const adeiatAlianbia: ZikrItem[] = [
  { id: 1, title: "1. دعاء الخضر (ع)", text: "دعاء النبي الخضر عليه السلام", audioUrl: "https://b.top4top.io/m_385579iup0.mp3" },
  { id: 2, title: "2. دعاء النبي ادم (ع)", text: "دعاء آدم عليه السلام", audioUrl: "https://d.top4top.io/m_3855vuefr0.mp3" },
  { id: 3, title: "3. دعاء النبي إبراهيم (ع)", text: "دعاء إبراهيم عليه السلام", audioUrl: "https://i.top4top.io/m_3855chsfk0.mp3" },
  { id: 4, title: "4. دعاء النبي ادريس (ع)", text: "دعاء إدريس عليه السلام", audioUrl: "https://h.top4top.io/m_3855ximv59.mp3" },
  { id: 5, title: "5. دعاء النبي ايوب (ع)", text: "دعاء أيوب عليه السلام", audioUrl: "https://i.top4top.io/m_3855jw5i69.mp3" },
  { id: 6, title: "6. دعاء النبي داود (ع)", text: "دعاء داود عليه السلام", audioUrl: "https://b.top4top.io/m_3855ee11j0.mp3" },
  { id: 7, title: "7. دعاء النبي عيسى (ع)", text: "دعاء عيسى عليه السلام", audioUrl: "https://g.top4top.io/m_3855bd9hi0.mp3" },
  { id: 8, title: "8. دعاء النبي محمد 1 (ص)", text: "دعاء النبي محمد عليه الصلاة والسلام", audioUrl: "https://a.top4top.io/m_3855hxf8b0.mp3" },
  { id: 9, title: "9. دعاء النبي محمد 2 (ص)", text: "دعاء النبي محمد عليه الصلاة والسلام", audioUrl: "https://i.top4top.io/m_3855gcc830.mp3" },
  { id: 10, title: "10. دعاء النبي موسى (ع)", text: "دعاء موسى عليه السلام", audioUrl: "https://c.top4top.io/m_38551ygbs0.mp3" },
  { id: 11, title: "11. دعاء النبي نوح (ع)", text: "دعاء نوح عليه السلام", audioUrl: "https://j.top4top.io/m_38550ozr70.mp3" },
  { id: 12, title: "12. دعاء النبي يعقوب (ع)", text: "دعاء يعقوب عليه السلام", audioUrl: "https://a.top4top.io/m_3855tii2u0.mp3" },
  { id: 13, title: "13. دعاء النبي يوسف (ع)", text: "دعاء يوسف عليه السلام", audioUrl: "https://j.top4top.io/m_3855fpety9.mp3" },
  { id: 14, title: "14. دعاء النبي يونس (ع)", text: "دعاء يونس عليه السلام", audioUrl: "https://g.top4top.io/m_3855rqsps0.mp3" },
  { id: 15, title: "15. دعاء النبي يوشع بن نون (ع)", text: "دعاء يوشع بن نون عليه السلام", audioUrl: "https://c.top4top.io/m_3855qs6qr0.mp3" }
];

export const occasionsList: ZikrItem[] = [
  { 
    id: 1, 
    title: "أعمال شهر رمضان المبارك", 
    text: "من الأعمال العامة في هذا الشهر الشريف: قراءة القرآن الكريم، صلاة الألف ركعة، أدعية السحر والدعاء عند الإفطار، واستغفار الله تعالى بكثرة والإكثار من الصدقات.",
    audioUrl: "" 
  },
  { 
    id: 2, 
    title: "أعمال ليلة القدر المباركة", 
    text: "من أعمال ليلة القدر (19، 21، 23 رمضان): الغسل، صلاة ركعتين تقرأ في كل ركعة بعد الحمد التوحيد 7 مرات، فتح المصحف الشريف والتوسل بآل البيت (ع)، زيارة الإمام الحسين (ع)، وإحياء الليلة بالدعاء والاستغفار وصلاة مائة ركعة.",
    audioUrl: "" 
  },
  { 
    id: 3, 
    title: "أعمال يوم الجمعة", 
    text: "الغسل، قراءة سورة الجمعة والكهف، الإكثار من الصلاة على محمد وآل محمد، زيارة صاحب الزمان (عج) بدعاء الندبة، والإكثار من الاستغفار ودعاء السمات بعد العصر.",
    audioUrl: "" 
  },
  { 
    id: 4, 
    title: "أعمال شهر شعبان المعظم", 
    text: "الصوم، الاستغفار كل يوم 70 مرة بـ (أَسْتَغْفِرُ اللهَ وَأَسْأَلُهُ التَّوْبَةَ)، التصدق، قراءة صلوات الشجانية (الصلوات الشعبانية) عند الزوال، وقراءة المناجاة الشعبانية.",
    audioUrl: "" 
  },
  { 
    id: 5, 
    title: "أعمال عيد الغدير الأغر (18 ذو الحجة)", 
    text: "الصيام، الغسل، زيارة أمير المؤمنين علي (ع)، قراءة دعاء الندبة، صلاة ركعتين قبل الزوال بنصف ساعة، والمؤاخاة بين المؤمنين والتهنئة بـ (الْحَمْدُ لِلَّهِ الَّذِي جَعَلَنَا مِنَ الْمُتَمَسِّكِينَ بِوِلاَيَةِ أَمِيرِ الْمُؤْمِنِينَ).",
    audioUrl: "" 
  },
  { 
    id: 6, 
    title: "أعمال يوم عرفة (9 ذو الحجة)", 
    text: "الغسل، زيارة الإمام الحسين (ع)، صلاة ركعتين تحت السماء والاعتراف بالذنوب لله، قراءة دعاء الإمام الحسين (ع) يوم عرفة ودعاء أم داود، والاجتهاد في الدعاء والتوسل.",
    audioUrl: "" 
  },
  { 
    id: 7, 
    title: "أعمال شهر رجب الأصب", 
    text: "الصيام، الاستغفار بـ (أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ)، قراءة الأدعية المأثورة للشهر مثل (يا مَنْ يَمْلِكُ حَوائِجَ السَّائِلِينَ)، وزيارة مشاهد الأئمة (ع).",
    audioUrl: "" 
  }
];

// أُضيفت الأيقونات الخاصة بكل قسم هنا (بما في ذلك أيقونة "Calendar" لتبويب المناسبات)
export const azkarData: Record<string, ZikrSection> = {
  monajat: { title: "15 من المناجاة", subtitle: "المناجاة الخمس عشرة المروية عن الإمام زين العابدين (ع)", icon: "Heart", items: monajatList },
  tasbehat: { title: "7 تسبيحات", subtitle: "التسبيحات اليومية المستحبة وتسبيح الزهراء (ع)", icon: "Disc", items: tasbehatList },
  taqebat: { title: "تعقيبات الصلاة", subtitle: "التعقيبات الخاصة بالصلوات الخمس المكتوبة", icon: "Clock", items: taqebatList },
  weekDuas: { title: "كتاب السقيفة", subtitle: "الخطب المخصصة لكتاب السقيفة", icon: "BookOpen", items: weekDuas },
  generalDuas: { title: "خطب نهج البلاغة 20", subtitle: "أدعية مباركة ومأثورة لقضاء الحوائج والأمان والرزق", icon: "BookText", items: generalDuas },
  hujaj: { title: "الصلاة على الحجج", subtitle: "الصلوات المأثورة على النبي والأئمة الأطهار (ع)", icon: "Sparkles", items: HujajPrayers },
  adeiat: { title: "أدعية الأنبياء (ع)", subtitle: "الأدعية المأثورة للأنبياء الكرام (ع)", icon: "HandsHorizontal", items: adeiatAlianbia },
  occasions: { title: "الأعمال والمناسبات", subtitle: "أعمال ومستحبات الشهور والأيام والمناسبات الإسلامية", icon: "Calendar", items: occasionsList }
};

// ----------------------------------------------------------------------
// أدوات نظام التخزين للأوفلاين
// ----------------------------------------------------------------------
const DB_NAME = 'ShiaZikrAudioDB';
const STORE_NAME = 'audio_files';

const openAudioDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveAudioOffline = async (itemUniqueKey: string, audioUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(encodeURI(audioUrl));
    if (!response.ok) return false;
    const blob = await response.blob();

    const db = await openAudioDB();
    return new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, itemUniqueKey);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.error("خطأ حفظ الملف الأوفلاين:", err);
    return false;
  }
};

export const getAudioOfflineBlob = async (itemUniqueKey: string): Promise<Blob | null> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(itemUniqueKey);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

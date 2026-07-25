import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Pause, Download, Volume2, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';

// -------------------------------------------------------------
// 1. محرك IndexedDB للتخزين أوفلاين
// -------------------------------------------------------------
const DB_NAME = 'ZiyaratsAudioDB_Full';
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

const saveAudioOffline = async (id: string, blob: Blob) => {
  const db = await openAudioDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const getOfflineAudio = async (id: string): Promise<Blob | null> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// -------------------------------------------------------------
// 2. قاعدة البيانات الشاملة بالنصوص الكاملة
// -------------------------------------------------------------
const BASE_AUDIO_URL = "https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio";

const ZIYARAT_DATA: Record<string, { id: string; title: string; benefits: string; audioUrl: string; text: string }> = {
  "warith": {
    id: "warith",
    title: "زيارة وارث",
    benefits: "زيارة عظيمة مروية عن الإمام الصادق (ع) تُبين مقام الإمام الحسين كوارث للأنبياء العظام.",
    audioUrl: `${BASE_AUDIO_URL}/warith.mp3`,
    text: `السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُوسَى كَلِيمِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ عِيسَى رُوحِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُحَمَّدٍ حَبِيبِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ أَمِيرِ الْمُؤْمِنِينَ عَلَيْهِ السَّلامُ، السَّلامُ عَلَيْكَ يابْنَ مُحَمَّدٍ الْمُصْطَفى، السَّلامُ عَلَيْكَ يابْنَ عَلِيٍّ الْمُرْتَضى، السَّلامُ عَلَيْكَ يابْنَ فاطِمَةَ الزَّهْراءِ، السَّلامُ عَلَيْكَ يابْنَ خَدِيجَةَ الْكُبْرى. أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلاةَ، وَآتَيْتَ الزَّكاةَ، وَأَمَرْتَ بِالْمَعْرُوفِ، وَنَهَيْتَ عَنِ الْمُنْكَرِ، وَأَطَعْتَ اللهَ وَرَسُولَهُ حَتّى أَتاكَ الْيَقِينُ. فَلَعَنَ اللهُ أُمَّةً قَتَلَتْكَ، وَلَعَنَ اللهُ أُمَّةً ظَلَمَتْكَ، وَلَعَنَ اللهُ أُمَّةً سَمِعَتْ بِذلِكَ فَرَضِيَتْ بِهِ. يا مَوْلايَ يا أَبا عَبْدِ اللهِ، أَشْهَدُ أَنَّكَ كُنْتَ نُوراً فِي الأَصْلابِ الشَّامِخَةِ، وَالأَرْحامِ الطَّاهِرَةِ، لَمْ تُنَجِّسْكَ الْجاهِلِيَّةُ بِأَنْجاسِها، وَلَمْ تُلْبِسْكَ مِنْ مُدْلَهِمَّاتِ ثِيابِها، وَأَشْهَدُ أَنَّكَ مِنْ دَعائِمِ الدِّينِ، وَأَرْكانِ الْمُؤْمِنِينَ، وَأَشْهَدُ أَنَّكَ الإِمامُ الْبَرُّ التَّقِيُّ الرَّضِيُّ الزَّكِيُّ الْهادِي الْمَهْدِيُّ. وَأَشْهَدُ أَنَّ الأَئِمَّةَ مِنْ وُلْدِكَ كَلِمَةُ التَّقْوى، وَأَعْلامُ الْهُدى، وَالْعُرْوَةُ الْوُثْقى، وَالْحُجَّةُ عَلى أَهْلِ الدُّنْيا. وَأُشْهِدُ اللهَ وَمَلائِكَتَهُ وَأَنْبِياءَهُ وَرُسُلَهُ أَنِّي بِكُمْ مُؤْمِنٌ، وَبِإِيابِكُمْ مُوقِنٌ، بِشَرائِعِ دِينِي وَخَواتِيمِ عَمَلِي، وَقَلْبِي لِقَلْبِكُمْ سِلْمٌ، وَأَمْرِي لأَمْرِكُمْ مُتَّبِعٌ. صَلَواتُ اللهِ عَلَيْكُمْ، وَعَلى أَرْواحِكُمْ، وَعَلى أَجْسادِكُمْ، وَعَلى أَجْسَامِكُمْ، وَعَلى شاهِدِكُمْ، وَعَلى غائِبِكُمْ، وَعَلى ظاهِرِكُمْ، وَعَلى باطِنِكُمْ.`
  },
  "arbaeen": {
    id: "arbaeen",
    title: "زيارة الأربعين",
    benefits: "من علامات المؤمن الخمس المروية عن الإمام الحسن العسكري (ع)، وتجديد لميثاق الولاء.",
    audioUrl: `${BASE_AUDIO_URL}/arbaeen.mp3`,
    text: `السَّلامُ عَلَى وَلِيِّ اللهِ وَحَبِيبِهِ، السَّلامُ عَلَى خَلِيلِ اللهِ وَنَجِيبِهِ، السَّلامُ عَلَى صَفِيِّ اللهِ وَابْنِ صَفِيِّهِ، السَّلامُ عَلَى الحُسَيْنِ المَظْلُومِ الشَّهِيدِ، السَّلامُ عَلَى أَسِيرِ الكُرُبَاتِ وَقَتِيلِ العَبَرَاتِ. اللَّهُمَّ إِنِّي أَشْهَدُ أَنَّهُ وَلِيُّكَ وَابْنُ وَلِيِّكَ وَصَفِيُّكَ وَابْنُ صَفِيِّكَ الفَائِزُ بِكَرَامَتِكَ، أَكْرَمْتَهُ بِالشَّهَادَةِ وَحَبَوْتَهُ بِالسَّعَادَةِ، وَاجْتَبَيْتَهُ بِطِيبِ الوِلادَةِ، وَجَعَلْتَهُ سَيِّداً مِنَ السَّادَةِ وَقَائِداً مِنَ القَادَةِ، وَذَائِداً مِنَ الذَّادَةِ وَأَعْطَيْتَهُ مَوَارِيثَ الأَنْبِيَاءِ، وَجَعَلْتَهُ حُجَّةً عَلَى خَلْقِكَ مِنَ الأَوْصِيَاءِ، فَأَعْذَرَ فِي الدُّعَاءِ وَمَنَحَ النُّصْحَ، وَبَذَلَ مُهْجَتَهُ فِيكَ لِيَسْتَنْقِذَ عِبَادَكَ مِنَ الجَهَالَةِ وَحَيْرَةِ الضَّلالَةِ. وَقَدْ تَوَازَرَ عَلَيْهِ مَنْ غَرَّتْهُ الدُّنْيَا وَبَاعَ حَظَّهُ بِالأَرْذَلِ الأَدْنَى، وَشَرَى آخِرَتَهُ بِالثَّمَنِ الأَوْكَسِ وَتَغَطْرَسَ وَتَرَدَّى فِي هَوَاهُ، وَأَسْخَطَكَ وَأَسْخَطَ نَبِيَّكَ وَأَطَاعَ مِنْ عِبَادِكَ أَهْلَ الشِّقَاقِ وَالنِّفَاقِ وَحَمَلَةَ الأَوْزَارِ المُسْتَوْجِبِينَ النَّارَ، فَجَاهَدَهُمْ فِيكَ صَابِراً مُحْتَسِباً حَتَّى سُفِكَ فِي طَاعَتِكَ دَمُهُ وَاسْتُبِيحَ حَرِيمُهُ.`
  },
  "ashura": {
    id: "ashura",
    title: "زيارة عاشوراء",
    benefits: "توجب غفران الذنوب، وقضاء الحوائج، وسلامة الدارين، ونيل شفاعة سيد الشهداء (ع).",
    audioUrl: `${BASE_AUDIO_URL}/ashura.mp3`,
    text: `السَّلامُ عَلَيْكَ يا أَبا عَبْدِ اللهِ، السَّلامُ عَلَيْكَ يابْنَ رَسُولِ اللهِ، السَّلامُ عَلَيْكَ يا خِيَرَةَ اللهِ وَابْنَ خِيَرَتِهِ، السَّلامُ عَلَيْكَ يابْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنَ سَيِّدِ الْوَصِيِّينَ، السَّلامُ عَلَيْكَ يابْنَ فاطِمَةَ سَيِّدَةِ نِساءِ الْعالَمِينَ. السَّلامُ عَلَيْكَ يا ثارَ اللهِ وَابْنَ ثارِهِ وَالْوِتْرَ الْمَوْتُورَ، السَّلامُ عَلَيْكَ وَعَلَى الأَرْواحِ الَّتي حَلَّتْ بِفِنائِكَ، عَلَيْكُمْ مِنّي جَمِيعاً سَلامُ اللهِ أَبَداً ما بَقِيتُ وَبَقِيَ اللَّيْلُ وَالنَّهارُ. يا أَبا عَبْدِ اللهِ، لَقَدْ عَظُمَتِ الرَّزِيَّةُ وَجَلَّتْ وَعَظُمَتِ الْمُصِيبَةُ بِكَ عَلَيْنا وَعَلى جَمِيعِ أَهْلِ الإِسْلامِ، وَجَلَّتْ وَعَظُمَتِ مُصِيبَتُكَ فِي السَّماواتِ عَلى جَمِيعِ أَهْلِ السَّماواتِ.`
  },
  "aminullah": {
    id: "aminullah",
    title: "زيارة أمين الله",
    benefits: "تعتبر من أعلى الزيارات شأناً واعتباراً، ويُزار بها أمير المؤمنين وسائر الأئمة.",
    audioUrl: `${BASE_AUDIO_URL}/aminullah.mp3`,
    text: `السَّلامُ عَلَيكَ يا أمِينَ اللهِ في أرضِهِ وَحُجَّتَهُ عَلى عِبادِهِ، السَّلامُ عَلَيكَ يا أمِيرَ المُؤْمِنِينَ. أشهَدُ أنَّكَ جاهَدتَ في اللهِ حَقَّ جِهادِهِ، وَعَمِلتَ بِكِتابِهِ، وَاتَّبَعتَ سُنَنَ نَبِيِّهِ صَلَّى اللهُ عَلَيهِ وَآلِهِ، حَتّى دَعاكَ اللهُ إلى جِوارِهِ، فَقَبَضَكَ إلَيهِ بِاخْتِيارِهِ، وَأَلزَمَ أعداءَكَ الحُجَّةَ مَعَ ما لَكَ مِنَ الحُجَجِ البالِغَةِ عَلى جَمِيعِ خَلقِهِ. اللّهُمَّ فَاجعَل نَفسي مُطمَئِنَّةً بِقَدَرِكَ، راضِيَةً بِقَضائِكَ، مُولَعَةً بِذِكرِكَ وَدُعائِكَ، مُحِبَّةً لِصَفوَةِ أَوْلِيائِكَ، مَحبُوبَةً في أرضِكَ وَسَمائِكَ، صابِرَةً عَلى نُزُولِ بَلائِكَ، شاكِرَةً لِفَواضِلِ نَعمائِكَ، ذاكِرَةً لِسَوابِغِ آنائِكَ.`
  },
  "jamia": {
    id: "jamia",
    title: "الزيارة الجامعة الكبيرة",
    benefits: "من أعلى الزيارات سنداً وبلاغةً، تشتمل على بيان مقامات أهل البيت الأخلاقية والكونية.",
    audioUrl: `${BASE_AUDIO_URL}/jamia.mp3`,
    text: `السَّلامُ عَلَيْكُمْ يا أَهْلَ بَيْتِ النُّبُوَّةِ، وَمَوْضِعَ الرِّسالَةِ، وَمُخْتَلَفَ المَلائِكَةِ، وَمَبْطِطَ الوَحْيِ، وَمَعْدِنَ الرَّحْمَةِ، وَخُزَّانَ العِلْمِ، وَمُنْتَهَى الحِلْمِ، وَأُصُولَ الكَرَمِ، وَقادَةَ الأُمَمِ، وَأَوْلِياءَ النِّعَمِ، وَعَناصِرَ الأَبْرارِ، وَدَعائِمَ الأَخْيارِ، وَسياسَةَ العِبادِ، وَأَرْكانَ البِلادِ، وَأَبْوابَ الإِيمانِ، وَأُمَناءَ الرَّحْمنِ، وَسُلالَةَ النَّبِيِّينَ، وَصَفْوَةَ المُرْسَلِينَ، وَعِتْرَةَ خِيَرَةِ رَبِّ العالَمِينَ وَرَحْمَةُ اللهِ وَبَرَكاتُهُ.`
  },
  "aleyasin": {
    id: "aleyasin",
    title: "زيارة آل ياسين",
    benefits: "مروية عن الناحية المقدسة، وهي الطريق الأسمى للارتباط والتوسل بالإمام الحجة (عج).",
    audioUrl: `${BASE_AUDIO_URL}/aleyasin.mp3`,
    text: `سَلامٌ عَلى آلِ يس، السَّلامُ عَلَيْكَ يا داعِيَ اللهِ وَرَبَّانِيَّ آياتِهِ، السَّلامُ عَلَيْكَ يا بابَ اللهِ وَدَيَّانَ دِينِهِ، السَّلامُ عَلَيْكَ يا خَلِيفَةَ اللهِ وَناصِرَ حَقِّهِ، السَّلامُ عَلَيْكَ يا حُجَّةَ اللهِ وَدَلِيلَ إِرادَتِهِ، السَّلامُ عَلَيْكَ يا تالِيَ كِتابِ اللهِ وَتَرْجُمانَهُ. السَّلامُ عَلَيْكَ فِي آناءِ لَيْلِكَ وَأَطْرافِ نَهارِكَ، السَّلامُ عَلَيْكَ يا بَقِيَّةَ اللهِ فِي أَرْضِهِ.`
  },
  "nahiya": {
    id: "nahiya",
    title: "زيارة الناحية المقدسة",
    benefits: "تعبّر عن عمق الفجيعة والمواساة، وتفصل مصائب كربلاء بلسان المعصوم الحاضر.",
    audioUrl: `${BASE_AUDIO_URL}/nahiya.mp3`,
    text: `السَّلامُ عَلى آدَمَ صَفْوةِ اللهِ مِن خَليقَتِهِ، السَّلامُ عَلى شِيثٍ وَلِيِّ اللهِ وَخِيَرَتِهِ، السَّلامُ عَلى إِدْريسَ القائِمِ بِحُجَّتِهِ، السَّلامُ عَلى نُوحٍ المُجابِ في دَعْوَتِهِ، السَّلامُ عَلى هُودٍ المَمْدُودِ بِمَعُونَتِهِ، السَّلامُ عَلى صالِحٍ الَّذي تَوَّجَهُ اللهُ بِكَرامَتِهِ، السَّلامُ عَلى إِبْراهيمَ الَّذي خَلَّلَهُ اللهُ بِخُلَّتِهِ، السَّلامُ عَلى إِسْماعيلَ الَّذي فَداهُ اللهُ بِذِبْحٍ عَظيمٍ.`
  },
  "saturday": {
    id: "saturday",
    title: "زيارة النبي محمد (ص) - يوم السبت",
    benefits: "تجديد العهد والولاء لرسول الله الأعظم نبي الرحمة وخاتم المرسلين صلوات الله عليه وآله.",
    audioUrl: `${BASE_AUDIO_URL}/saturday.mp3`,
    text: `أَشْهَدُ أَنْ لا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّكَ رَسُولُهُ، وَأَنَّكَ مُحَمَّدُ بْنُ عَبْدِ اللهِ، وَأَشْهَدُ أَنَّكَ قَدْ بَلَّغْتَ رِسالاتِ رَبِّكَ وَنَصَحْتَ لأُمَّتِكَ، وَجَاهَدْتَ فِي سَبِيلِ اللهِ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ، وَأَدَّيْتَ الَّذِي عَلَيْكَ مِنَ الْحَقِّ، وَأَنَّكَ قَدْ رَؤُفْتَ بِالْمُؤْمِنِينَ، وَغَلَظْتَ عَلَى الْكَافِرِينَ، وَعَبَدْتَ اللهَ مُخْلِصاً حَتَّى أَتَاكَ الْيَقِينُ.`
  },
  "sunday": {
    id: "sunday",
    title: "زيارة أمير المؤمنين والزهراء (ع) - يوم الأحد",
    benefits: "الارتباط بباب علم رسول الله وأم الأئمة النجباء ونيل شفاعتهم الخاصة بيوم الأحد.",
    audioUrl: `${BASE_AUDIO_URL}/sunday.mp3`,
    text: `السَّلامُ عَلَى الشَّجَرَةِ النَّبَوِيَّةِ، وَالدَّوْحَةِ الْهَاشِمِيَّةِ، الْمُضِيئَةِ الْمُثْمِرَةِ بِالنُّبُوَّةِ، الْمُؤْنِقَةِ بِالإِمَامَةِ، وَعَلَى ضَجِيعَيْكَ آدَمَ وَنوُحٍ عَلَيْهِمَا السَّلامُ. السَّلامُ عَلَيْكَ وَعَلَى أَهْلِ بَيْتِكَ الطَّاهِرِينَ، السَّلامُ عَلَيْكَ وَعَلَى المَلائِكَةِ المُحْدِقِينَ بِكَ وَالحَافِّينَ بِقَبْرِكَ. يا مَوْلايَ يا أَمِيرَ المُمُؤْمِنِينَ، هَذَا يَوْمُ الأَحَدِ وَهُوَ يَوْمُكَ وَبِاسْمِكَ.`
  },
  "monday": {
    id: "monday",
    title: "زيارة الحسن والحسين (ع) - يوم الإثنين",
    benefits: "تدرّ الخير والبركة وتحصّن قارئها ببركة ريحانتي رسول الله الأكرم عليهما السلام.",
    audioUrl: `${BASE_AUDIO_URL}/monday.mp3`,
    text: `السَّلامُ عَلَيْكَ يَا بْنَ رَسُولِ رَبِّ الْعالَمِينَ، السَّلامُ عَلَيْكَ يَا بْنَ أمِيرِ الْمُؤْمِنِينَ، السَّلامُ عَلَيْكَ يَا بْنَ فَاطِمَةَ الزَّهْرَاءِ سَيِّدَةِ نِساءِ الْعَالَمِينَ. أِشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلاةَ وَآتَيْتَ الزَّكَاةَ، وَأَمَرْتَ بِالْمَعْرُوفِ، وَنَهَيْتَ عَنِ الْمُنْكَرِ، وَعَبَدْتَ اللهَ مُخْلِصاً حَتَّى أَتَاكَ الْيَقِينُ، فَجَزاكَ اللهُ عَنِ الإِسْلامِ وَأَهْلِهِ أَفْضَلَ الْجَزَاءِ.`
  },
  "tuesday": {
    id: "tuesday",
    title: "زيارة أئمة البقيع (ع) - يوم الثلاثاء",
    benefits: "تقوية البصيرة الدينية والارتباط بجهابذة العلم النبوي: السجاد والباقر والصادق (ع).",
    audioUrl: `${BASE_AUDIO_URL}/tuesday.mp3`,
    text: `السَّلامُ عَلَيْكُمْ يَا خُزَّانَ عِلْمِ اللهِ، السَّلامُ عَلَيْكُمْ يَا تَرَاجِمَةَ وَحْيِ اللهِ، السَّلامُ عَلَيْكُمْ يَا أَئِمَّةَ الْهُدَى، وَأَعْلامَ التُّقَى، وَوَرِثَةَ أَنْبِيَاءِ اللهِ. أَشْهَدُ أَنَّكُمُ الأَئِمَّةُ الرَّاشِدُونَ، الْمَهْدِيُّونَ الظَّاهِرُونَ، الصَّابِرُونَ الْمُحْتَسِبُونَ، المَعْصُومُونَ المَطَهَّرُونَ.`
  },
  "wednesday": {
    id: "wednesday",
    title: "زيارة الحجج الأربعة (ع) - يوم الأربعاء",
    benefits: "زيارة الإمام الكاظم والرضا والجواد والهادي (ع) لقضاء الحوائج والبركة.",
    audioUrl: `${BASE_AUDIO_URL}/wednesday.mp3`,
    text: `السَّلامُ عَلَيْكُمْ يَا أَوْلِيَاءَ اللهِ، السَّلامُ عَلَيْكُمْ يَا حُجَجَ اللهِ، السَّلامُ عَلَيْكُمْ يَا نُورَ اللهِ فِي ظُلُمَاتِ الأَرْضِ، السَّلامُ عَلَيْكُمْ صَلَوَاتُ اللهِ عَلَيْكُمْ وَعَلَى آلِ بَيْتِكُمُ الطَّيِّبِينَ الطَّاهِرِينَ، بِأَبِي أَنْتُمْ وَأُمِّي لَقَدْ عَبَدْتُمُ اللهَ مُخْلِصِينَ، وَجَاهَدْتُمْ فِي اللهِ حَقَّ جِهَادِهِ حَتَّى أَتَاكُمُ الْيَقِينُ.`
  },
  "thursday": {
    id: "thursday",
    title: "زيارة الحسن العسكري (ع) - يوم الخميس",
    benefits: "التمهيد والتهيئة النفسية لولاية ابنه الحجة القائم ونيل النورانية القلبية المستمرة.",
    audioUrl: `${BASE_AUDIO_URL}/thursday.mp3`,
    text: `السَّلامُ عَلَيْكَ يَا وَلِيَّ اللهِ، السَّلامُ عَلَيْكَ يَا حُجَّةَ اللهِ وَخَالِصَتَهُ، السَّلامُ عَلَيْكَ يَا إِمَامَ الْمُؤْمِنِينَ، وَوَارِثَ الْمُرْسَلِينَ، وَحُجَّةَ رَبِّ الْعَالَمِينَ. صَلَّى اللهُ عَلَيْكَ وَعَلَى آلِ بَيْتِكَ الطَّيِّبِينَ الطَّاهِرِينَ، يَا مَوْلايَ يَا أَبَا مُحَمَّدٍ الحَسَنَ بْنَ عَلِيٍّ، أَنَا مَوْلىً لَكَ وَلآلِ بَيْتِكَ.`
  },
  "friday": {
    id: "friday",
    title: "زيارة صاحب الزمان (عج) - يوم الجمعة",
    benefits: "أعظم طقوس الندبة والارتباط بقطب عالم الإمكان الإمام المهدي المنتظر.",
    audioUrl: `${BASE_AUDIO_URL}/friday.mp3`,
    text: `السَّلامُ عَلَيْكَ يَا حُجَّةَ اللهِ فِي أَرْضِهِ، السَّلامُ عَلَيْكَ يَا عَيْنَ اللهِ فِي خَلْقِهِ، السَّلامُ عَلَيْكَ يَا نُورَ اللهِ الَّذِي يَهْتَدِي بِهِ الْمُهْتَدُونَ، وَيُفَرَّجُ بِهِ عَنِ الْمُؤْمِنِينَ. السَّلامُ عَلَيْكَ يَا سَفِينَةَ النَّجَاةِ، السَّلامُ عَلَيْكَ يَا عَيْنَ الْحَيَاةِ، السَّلامُ عَلَيْكَ صَلَّى اللهُ عَلَيْكَ وَعَلَى آلِ بَيْتِكَ الطَّيِّبِينَ الطَّاهِرِينَ.`
  }
};

// -------------------------------------------------------------
// 3. المكون الرئيسي لعرض التفاصيل
// -------------------------------------------------------------
export default function ZiyaratDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentKey = (id && ZIYARAT_DATA[id]) ? id : "warith";
  const currentItem = ZIYARAT_DATA[currentKey];

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // دالة تقسيم محكمة تجمع بين الجمل حتى يمتلئ المربع بالكامل (حوالي 250 حرف لكل صفحة)
  const splitTextIntoPages = (fullText: string, targetCharsPerPage = 250) => {
    // التقسيم المبدئي بناءً على الفواصل والظروف
    const sentences = fullText.split(/(?<=[،؛.\n])/);
    const resultPages: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > targetCharsPerPage) {
        if (currentChunk.trim().length > 0) {
          resultPages.push(currentChunk.trim());
        }
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk.trim().length > 0) {
      resultPages.push(currentChunk.trim());
    }

    return resultPages;
  };

  useEffect(() => {
    if (currentItem) {
      const pageList = splitTextIntoPages(currentItem.text, 250);
      setPages(pageList);
      setCurrentPage(0);

      checkOfflineStatus();
    }
  }, [id, currentItem]);

  const checkOfflineStatus = async () => {
    const localBlob = await getOfflineAudio(currentItem.id);
    if (localBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(localBlob);
      setIsDownloaded(true);
    } else if (audioRef.current) {
      audioRef.current.src = currentItem.audioUrl;
      setIsDownloaded(false);
    }
  };

  const handleDownloadOffline = async () => {
    if (isDownloaded) {
      alert("✅ الصوت محفوظ أوفلاين وتعمل هذه الشاشة بدون إنترنت!");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(encodeURI(currentItem.audioUrl));
      if (!response.ok) throw new Error("تعذر جلب الملف");
      const blob = await response.blob();
      await saveAudioOffline(currentItem.id, blob);
      
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(blob);
      }
      setIsDownloaded(true);
      alert("🎉 تم حفظ الصوت بنجاح لاستخدامه أوفلاين!");
    } catch {
      alert("❌ تعذر التحميل. تأكد من الاتصال بالإنترنت أولاً.");
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        alert("تعذر تشغيل الصوت. أعد التحميل أو تحقق من الاتصال.");
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-[#f0f9ff] flex flex-col justify-between p-4 pb-20 select-none" dir="rtl">
      
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} preload="metadata" />

      {/* 1. الهيدر وفضل الزيارة */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 hover:bg-[#047857] transition"
          >
            <ArrowRight size={20} />
          </button>
          <h2 className="text-xl font-bold text-[#fbbf24]">{currentItem.title}</h2>
          <div className="w-8"></div>
        </div>

        {currentItem.benefits && (
          <div className="p-3 bg-[#064e3b]/40 border border-[#059669]/30 rounded-2xl text-center text-xs text-[#34d399] leading-relaxed mb-4">
            {currentItem.benefits}
          </div>
        )}
      </div>

      {/* 2. شاشة عرض النص الرئيسية (ممتلئة بالكامل الآن) */}
      <div className="flex-1 flex items-center justify-center my-2 min-h-[320px] bg-[#03382c] border border-[#059669]/30 rounded-3xl p-6 shadow-inner relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="text-center text-lg sm:text-xl font-serif leading-loose text-[#f0f9ff] tracking-wide"
          >
            {pages[currentPage] || "جاري تحميل النص..."}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. شريط التحكم والتنقل */}
      <div className="flex items-center justify-between bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl p-2 mb-4">
        <button
          onClick={() => currentPage < pages.length - 1 && setCurrentPage(p => p + 1)}
          disabled={currentPage === pages.length - 1}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
            currentPage === pages.length - 1 ? 'opacity-30 text-gray-400 cursor-not-allowed' : 'text-[#fbbf24] bg-[#022c22]/60 hover:bg-[#022c22]'
          }`}
        >
          ‹ التالي
        </button>

        <div className="px-4 py-1.5 bg-[#022c22] border border-[#059669]/40 rounded-xl text-xs font-bold text-[#fbbf24]">
          {pages.length > 0 ? `${currentPage + 1} / ${pages.length}` : '0 / 0'}
        </div>

        <button
          onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
          disabled={currentPage === 0}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
            currentPage === 0 ? 'opacity-30 text-gray-400 cursor-not-allowed' : 'text-[#fbbf24] bg-[#022c22]/60 hover:bg-[#022c22]'
          }`}
        >
          السابق ›
        </button>
      </div>

      {/* 4. مشغل الصوت */}
      <div className="bg-[#064e3b]/80 border border-[#059669]/40 rounded-3xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePlayAudio}
            className="w-12 h-12 bg-[#fbbf24] text-[#022c22] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            {isPlaying ? <Pause size={24} fill="#022c22" /> : <Play size={24} fill="#022c22" className="mr-0.5" />}
          </button>
          
          <button onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0; }} className="p-2 text-[#059669] hover:text-[#fbbf24] transition">
            <RotateCcw size={18} />
          </button>

          <button 
            onClick={handleDownloadOffline} 
            className={`p-2 transition ${isDownloaded ? 'text-[#34d399]' : 'text-[#059669] hover:text-[#fbbf24]'}`}
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : isDownloaded ? <CheckCircle2 size={18} /> : <Download size={18} />}
          </button>
        </div>

        <div className="text-left">
          <h4 className="font-bold text-sm text-[#f0f9ff]">{currentItem.title}</h4>
          <p className="text-[10px] text-[#059669]">
            {isPlaying ? "جاري التشغيل..." : isDownloaded ? "جاهز أوفلاين" : "متوقف"}
          </p>
        </div>

        <div className="p-2 bg-[#022c22]/50 border border-[#059669]/30 rounded-xl text-[#059669]">
          <Volume2 size={18} />
        </div>
      </div>

    </div>
  );
}

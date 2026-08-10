import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, Pause, Search, Headphones, BookOpen, Volume2, 
  ShieldCheck, Download, AlertCircle, CheckCircle2, Loader2, 
  FileText, SkipForward, SkipBack, X, Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// -------------------------------------------------------------
// محرك تخزين صوتيات أوفلاين بسيط باستخدام IndexedDB المدمج في المتصفح
// -------------------------------------------------------------
const DB_NAME = 'ShiaDuasAudioDB';
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

const saveAudioBlob = async (id: string, blob: Blob) => {
  const db = await openAudioDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

const getAudioBlob = async (id: string): Promise<Blob | null> => {
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

// 1. قائمة الأدعية الصوتية
const duasList = [
  { id: 'kumail', name: 'دعاء كميل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_kumayl_farahmand_fani.mp3' },
  { id: 'nudbah', name: 'دعاء الندبة', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-nudbah-farahmand.MP3' },
  { id: 'tawassul', name: 'دعاء التوسل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_tawassul_farahmand.mp3' },
  { id: 'ahad', name: 'دعاء العهد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_ahad_farahmand.mp3' },
  { id: 'sabah', name: 'دعاء الصباح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_sabah_farahmand.mp3' },
  { id: 'Faraj', name: 'دعاء الفرج', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa_Faraj_Farahmand Azad.mp3' },
  { id: 'Iftitah', name: 'دعاء الافتتاح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Duaa-Iftitah-Mohsen-Farahmand Azad.MP3' },
  { id: 'jawshan', name: 'دعاء الجوشن الكبير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_Jawshan Al-Kabir-Fadhil Al-Maliki.mp3' },
  { id: 'mashlool', name: 'دعاء المشلول', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_mashlool_farahmand.mp3' },
  { id: 'Mujir', name: 'دعاء المجير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa-Mujir-Mahdi Sahwan.mp3' },
  { id: 'jbirilu', name: 'دعاء جبريل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_jbirilu_wlidalmazidi.mp3' },
  { id: 'alsuhir', name: 'دعاء السحر', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alsuhir_eamir_alkazmi.mp3' },
  { id: 'alssmat', name: 'دعاء السمات', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alssmat_abadhr.mp3' },
  { id: 'alsalha', name: 'دعاء الصلح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alsalha_mihsin_farhimand.mp3' },
  { id: 'alrahbat', name: 'دعاء الرهبة', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alrahbat_wlid.mp3' },
  { id: 'alqadh', name: 'دعاء القدح', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alqadh_abadhir.mp3' },
  { id: 'alnuwr', name: 'دعاء النور', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alnuwr_abadhir.mp3' },
  { id: 'almieraji', name: 'دعاء المعراج', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_almieraji_abadhir.mp3' },
  { id: 'almahbus', name: 'دعاء المحبوس', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_almahbus_jawad.mp3' },
  { id: 'aleashrat', name: 'دعاء العشرات', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aleashrat_abadhir.mp3' },
  { id: 'aleafiat', name: 'دعاء العافية', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aleafiat_ansaryan.mp3' },
  { id: 'aleadilatu', name: 'دعاء العديلة', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aleadilatu_wlid.mp3' },
  { id: 'alaghibati', name: 'دعاء زمن الغيبة', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alaghibati_abadhir.mp3' },
  { id: 'ahilalthughur', name: 'دعاء اهل الثغور', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_ahilalthughur_basm.mp3' },
  { id: 'alhazin', name: 'دعاء الحزين', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhazin_abadhar.mp3' },
  { id: 'alhujati', name: 'دعاء االحجة عجل الله فرجه', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'alhujbi', name: 'دعاء الحجب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'aljushinalsaghir', name: 'دعاء الجوشن الصغير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aljushinalsaghir_mitham.mp3' },
  { id: 'alaman', name: 'دعاء الامان', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alaman_eamir_alkazmi.mp3' },
  { id: 'alamamzinaleabdin', name: 'دعاء الإمام زين العابدين(ع)', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alamamzinaleabdin_wlid.mp3' },
  { id: 'aliietiqad', name: 'دعاء الاعتقاد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliietiqad_abadhir' },
  { id: 'aliahtijab', name: 'دعاء الاحتجاب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliahtijab_basimi.mp3' },
  { id: 'aliimam_alkazim', name: '(ع)دعاء الامام الكاظم', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliimam_alkazim(e)wlid.mp3' },
  { id: 'alkasai', name: 'دعاء حديث الكساء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alkasai_eamiralkazmi.mp3' },
  { id: 'alhayeuzmialbalai', name: 'دعاء الهي عظم البلاء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhayeuzmialbalai_mustafaa.mp3' },
  { id: 'alhialuilli', name: 'دعاء الهي الويل لي للامام السجاد علية السلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhialuilli_abadhar.mp3' }
];

// 2. قائمة اللطميات الرسمية
const latmiyatList = [
  { id: 'latmia-1', name: 'قصيدة درب احبابي - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/darib_ahbabi.mp3' },
  { id: 'latmia-2', name: 'قصيدة يسجلني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/yusajiluni.mp3' },
  { id: 'latmia-3', name: 'قصيدة خطت حرب - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/khutat_harb.mp3' },
  { id: 'latmia-4', name: 'قصيدة تزوروني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/tazuruni.mp3' },
  { id: 'latmia-5', name: 'قصيدة يمضموني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/m1.mp3' },
  { id: 'latmia-6', name: 'قصيدة شد الثامة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shidalthaama.mp3' },
  { id: 'latmia-7', name: 'قصيدة بلله ياشمر - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/blahaesmar.mp3' },
  { id: 'latmia-8', name: 'قصيدة يمة اطمنج علية - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/m2.mp3' },
  { id: 'latmia-9', name: 'قصيدة درب العشك - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/darabaleishk.mp3' },
  { id: 'latmia-10', name: 'قصيدة الله ياحامي الشريعة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/allah_yahami.mp3' },
  { id: 'latmia-11', name: 'قصيدة هاي المنزلة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Al-Mazlou.mp3' },
  { id: 'latmia-12', name: 'قصيدة أنشأ الله - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/an-allah.mp3' },
  { id: 'latmia-13', name: 'قصيدة هاذا الغريب منين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hadha_algharib.mp3' },
  { id: 'latmia-14', name: 'قصيدة هضموني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hadmuniun.mp3' },
  { id: 'latmia-15', name: 'قصيدة انت الرزق - ملا جليل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/anta_alrizq.mp3' },
  { id: 'latmia-16', name: 'قصيدة ماحسبت هالكثر - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/biasm_mahsabat-halkuthr.mp3' },
  { id: 'latmia-17', name: 'قصيدة طفلة وشفت بالنوم - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/ya_tiflat_taniny.mp3' },
  { id: 'latmia-18', name: 'قصيدة شيعت علي منصورة - سيد سلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shieat_eali_mansura.mp3' },
  { id: 'latmia-19', name: 'قصيدة ابا عبد الله - سيد سلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Abu_Abdallah.mp3' },
  { id: 'latmia-20', name: 'قصيدة اخاف امن اعوفك - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhaf_aman_aeufuk.mp3' },
  { id: 'latmia-21', name: 'قصيدة الهي رد رغيب - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/alhi_radun_gharib.mp3' },
  { id: 'latmia-22', name: 'قصيدة اوتار التكبير - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/awtar_altakbir.mp3' },
  { id: 'latmia-23', name: 'قصيدة بارض الطفوف - سيد سلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/barid_altufuf.mp3' },
  { id: 'latmia-24', name: 'قصيدة حيهم صاح حيهم - حسين المرياني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hihim_sah.mp3' },
  { id: 'latmia-25', name: 'قصيدة هوى الديرة - حسين المرياني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hawaa_aldiyra.mp3' },
  { id: 'latmia-26', name: 'قصيدة لا ترد ماضل اثر - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/latard.mp3' },
  { id: 'latmia-27', name: 'قصيدة لا ترحلي - عباس عجيد العامري', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/latarhaly.mp3' },
  { id: 'latmia-28', name: 'قصيدة ما يحاجيها - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mayhajiha.mp3' },
  { id: 'latmia-29', name: 'قصيدة اخاف امن اعوفك - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhaf_aman_aeufuk.mp3' },
  { id: 'latmia-30', name: 'قصيدة االبدوية - حسين المرياني ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/albadawia.mp3' },
  { id: 'latmia-31', name: 'قصيدة سيناء الغيرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sayna_alghayra.mp3' },
  { id: 'latmia-32', name: 'قصيدة زلزل - حيدر بوحمد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/zalzal_haydr_buhamd.mp3' },
  { id: 'latmia-33', name: 'قصيدة ودعت الحسين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/wadaeti_alhsin_basim_alkarbilayiy.mp3' },
  { id: 'latmia-34', name: 'قصيدة شخبار اهلنة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shakhbari_ahlanah_mihamadi_aljanami.mp3' },
  { id: 'latmia-35', name: 'قصيدة سادة العشرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sadatu_aleashra_mihamadi_aljanami.mp3' },
  { id: 'latmia-36', name: 'قصيدة قتلني فلان وفلان - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/qutilini_flan_wflan-Haidar Al-Bayati.mp3' },
  { id: 'latmia-37', name: 'قصيدة نذرت الحب - باسم الكربلائي ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nadharti_alhub_basim_alkarbilayiy.mp3' },
  { id: 'latmia-38', name: 'قصيدة من اربع جهاتي - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mun_arbaea_jahati_mihamadi_aljanami.mp3' },
  { id: 'latmia-39', name: 'قصيدة ملكة صغيرة - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/malikati_saghira-Haidar Al-Bayati.mp3' },
  { id: 'latmia-40', name: 'قصيدة اخرج الينا - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhruji_alina_mihamadi_aljanami.mp3' },
  { id: 'latmia-41', name: 'قصيدة حضرة السند - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/3hadratu_alsand_ali_alsaaeidi.mp3' },
  { id: 'latmia-42', name: 'قصيدة اجيبوني - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/2ajybwny_ali_alsaaeidi.mp3' },
  { id: 'latmia-43', name: 'قصيدة راية عباس - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1rayat_abbas_ali_alsaaeidi.mp3' },
  { id: 'latmia-44', name: 'قصيدة انكسار - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1Inkisar-Haidar Al-Bayati.mp3' },
  { id: 'latmia-45', name: ' قصيدة رجعلي رقية - مرتضى حرب ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/rpaiea.mp3'},
  { id: 'latmia-46', name: ' قصيدة ظعن الشمس - مرتضى حرب ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/dahinalsmis3.mp3'},
  { id: 'latmia-47', name: ' قصيدة نايحه - محمد باقر الخاقاني ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nahiea.mp3'},
  { id: 'latmia-48', name: ' قصيدة خرابة - باسم الكربلائي ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/baseim1985.mp3'}
];

// 3. قائمة الأدعية المقروءة (المكتوبة)
const writtenDuasList = [
  {
    id: 'w-faraj',
    title: 'دعاء الفرج (إلهي عظم البلاء)',
    content: `إِلَهِي عَظُمَ الْبَلاءُ ، وَبَرِحَ الْخَفَاءُ ، وَانْكَشَفَ الْغِطَاءُ ، وَانْقَطَعَ الرَّجَاءُ ، وَضَاقَتِ الأَرْضُ ، وَمُنِعَتِ السَّمَاءُ ، وَأَنْتَ الْمُسْتَعَانُ ، وَإِلَيْكَ الْمُشْتَكَى ، وَعَلَيْكَ الْمُعَوَّلُ فِي الشِّدَّةِ وَالرَّخَاءِ .

اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ ، أُولِي الأَمْرِ الَّذِينَ فَرَضْتَ عَلَيْنَا طَاعَتَهُمْ ، وَعَرَّفْتَنَا بِذَلِكَ مَنْزِلَتَهُمْ ، فَفَرِّجْ عَنَّا بِحَقِّهِمْ فَرَجاً عَاجِلاً قَرِيباً كَلَمْحِ الْبَصَرِ أَوْ هُوَ أَقْرَبُ .

يَا مُحَمَّدُ يَا عَلِيُّ ، يَا عَلِيُّ يَا مُحَمَّدُ ، اكْفِيَانِي فَإِنَّكُمَا كَافِيَانِ ، وَانْصُرَانِي فَإِنَّكُمَا نَاصِرَانِ .

يَا مَوْلانَا يَا صَاحِبَ الزَّمَانِ ، الْغَوْثَ الْغَوْثَ الْغَوْثَ ، أَدْرِكْنِي أَدْرِكْنِي أَدْرِكْنِي ، السَّاعَةَ السَّاعَةَ السَّاعَةَ ، الْعَجَلَ الْعَجَلَ الْعَجَلَ ، يَا أَرْحَمَ الرَّاحِمِينَ ، بِحَقِّ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ .`
  },
  {
    id: 'w-ahad',
    title: 'دعاء العهد',
    content: `اللَّهُمَّ رَبَّ النُّورِ الْعَظِيمِ ، وَرَبَّ الْكُرْسِيِّ الرَّفِيعِ ، وَرَبَّ الْبَحْرِ الْمَسْجُورِ ، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالزَّبُورِ ، وَرَبَّ الظِّلِّ وَالْحَرُورِ ، وَمُنْزِلَ الْقُرْآنِ الْعَظِيمِ ، وَرَبَّ الْمَلائِكَةِ الْمُقَرَّبِينَ وَالأَنْبِيَاءِ وَالْمُرْسَلِينَ .

اللَّهُمَّ إِنِّي أَسْأَلُكَ بِوَجْهِكَ الْكَرِيمِ ، وَبِنُورِ وَجْهِكَ الْمُنِيرِ وَمُلْكِكَ الْقَدِيمِ ، يَا حَيُّ يَا قَيُّومُ ، أَسْأَلُكَ بِاسْمِكَ الَّذِي أَشْرَقَتْ بِهِ السَّمَاوَاتُ وَالأَرَضُونَ ، وَبِاسْمِكَ الَّذِي يَصْلَحُ بِهِ الأَوَّلُونَ وَالآخِرُونَ ، يَا حَيّاً قَبْلَ كُلِّ حَيٍّ ، وَيَا حَيّاً بَعْدَ كُلِّ حَيٍّ ، وَيَا حَيّاً حِينَ لا حَيَّ ، يَا مُحْيِيَ الْمَوْتَى وَمُمِيتَ الأَحْيَاءِ ، يَا حَيُّ لا إِلَهَ إِلا أَنْتَ .

اللَّهُمَّ بَلِّغْ مَوْلانَا الإِمَامَ الْهَادِيَ الْمَهْدِيَّ الْقَائِمَ بِأَمْرِكَ ، صَلَوَاتُ اللَّهِ عَلَيْهِ وَعَلَى آبَائِهِ الطَّاهِرِينَ ، عَنْ جَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ فِي مَشَارِقِ الأَرْضِ وَمَغَارِبِهَا ، سَهْلِهَا وَجَبَلِهَا ، وَبَرِّهَا وَبَحْرِهَا ، وَعَنِّي وَعَنْ وَالِدَيَّ مِنَ الصَّلَوَاتِ زِنَةَ عَرْشِ اللَّهِ ، وَمِدَادَ كَلِمَاتِهِ ، وَمَا أَحْصَاهُ عِلْمُهُ ، وَأَحَاطَ بِهِ كِتَابُهُ .

اللَّهُمَّ إِنِّي أُجَدِّدُ لَهُ فِي صَبِيحَةِ يَوْمِي هَذَا وَمَا عِشْتُ مِنْ أَيَّامِي عَهْداً وَعَقْداً وَبَيْعَةً لَهُ فِي عُنُقِي ، لا أَحُولُ عَنْهَا وَلا أَزُولُ أَبَداً .`
  },
  {
    id: 'w-kumail',
    title: 'دعاء كميل بن زياد (مقتطفات مباركة)',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ ، وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ ، وَخَضَعَ لَهَا كُلُّ شَيْءٍ ، وَذَلَّ لَهَا كُلُّ شَيْءٍ ، وَبِجَبَرُوتِكَ الَّتِي غَلَبْتَ بِهَا كُلَّ شَيْءٍ ، وَبِعِزَّتِكَ الَّتِي لا يَقُومُ لَهَا شَيْءٌ ، وَبِعَظَمَتِكَ الَّتِي مَلأَتْ كُلَّ شَيْءٍ ، وَبِسُلْطَانِكَ الَّذِي عَلا كُلَّ شَيْءٍ ، وَبِوَجْهِكَ الْبَاقِي بَعْدَ فَنَاءِ كُلِّ شَيْءٍ .

اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَهْتِكُ الْعِصَمَ ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ النِّقَمَ ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُغَيِّرُ النِّعَمَ ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَحْبِسُ الدُّعَاءَ ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ الْبَلاءَ .

يَا سَيِّدِي فَأَسْأَلُكَ بِعِزَّتِكَ أَنْ لا يَحْجُبَ عَنْكَ دُعَائِي سُوءُ عَمَلِي وَفِعَالِي ، وَلا تَفْضَحْنِي بِخَفِيِّ مَا اطَّلَعْتَ عَلَيْهِ مِنْ سِرِّي ... يَا رَبِّ ارْحَمْ ضَعْفَ بَدَنِي ، وَرِقَّةَ جِلْدِي ، وَدِقَّةَ عَظْمِي ، يَا مَنْ بَدَأَ خَلْقِي وَذِكْرِي وَتَرْبِيَتِي وَبِرِّي وَتَغْذِيَتِي ، هَبْنِي لابْتِدَاءِ كَرَمِكَ وَسَالِفِ بِرِّكَ بِي .`
  },
  {
    id: 'w-tawassul',
    title: 'دعاء التوسل',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ ، يَا أَبَا الْقَاسِمِ يَا رَسُولَ اللَّهِ يَا إِمَامَ الرَّحْمَةِ ، يَا سَيِّدَنَا وَمَوْلانَا إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا ، يَا وَجِيهاً عِنْدَ اللَّهِ اشْفَعْ لَنَا عِنْدَ اللَّهِ .

يَا أَبَا الْحَسَنِ يَا أَمِيرَ الْمُؤْمِنِينَ يَا عَلِيَّ بْنَ أَبِي طَالِبٍ ، يَا حُجَّةَ اللَّهِ عَلَى خَلْقِهِ يَا سَيِّدَنَا وَمَوْلانَا إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا ، يَا وَجِيهاً عِنْدَ اللَّهِ اشْفَعْ لَنَا عِنْدَ اللَّهِ .

يَا فَاطِمَةَ الزَّهْرَاءِ يَا بِنْتَ مُحَمَّدٍ ، يَا قُرَّةَ عَيْنِ الرَّسُولِ ، يَا سَيِّدَتَنَا وَمَوْلاتَنَا إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكِ إِلَى اللَّهِ ، وَقَدَّمْنَاكِ بَيْنَ يَدَيْ حَاجَاتِنَا ، يَا وَجِيهَةً عِنْدَ اللَّهِ اشْفَعِي لَنَا عِنْدَ اللَّهِ .`
  },
  {
    id: 'w-sabah',
    title: 'دعاء الصباح لأمير المؤمنين (ع)',
    content: `اللَّهُمَّ يَا مَنْ دَلَعَ لِسَانَ الصَّبَاحِ بِنُطْقِ تَبَلُّجِهِ ، وَسَرَّحَ قِطَعَ اللَّيْلِ الْمُظْلِمِ بِغَيَاهِبِ تَلَجْلُجِهِ ، وَأَتْقَنَ صُنْعَ الْفَلَكِ الدَّوَّارِ فِي مَقَادِيرِ تَبَرُّجِهِ ، وَشَعْشَعَ ضِيَاءَ الشَّمْسِ بِبَزُوغِ تَأَهُّجِهِ .

يَا مَنْ دَلَّ عَلَى ذَاتِهِ بِذَاتِهِ ، وَتَنَزَّهَ عَنْ مُجَانَسَةِ مَخْلُوقَاتِهِ ، وَجَلَّ عَنْ مُلاءَمَةِ كَيْفِيَّاتِهِ ، يَا مَنْ قَرُبَ مِنْ خَطَرَاتِ الظُّنُونِ ، وَبَعُدَ عَنْ لَحَظَاتِ الْعُيُونِ ، وَعَلِمَ بِمَا كَانَ قَبْلَ أَنْ يَكُونَ .

يَا مَنْ أَرْجَسَنِي فِي أَكْنَافِ أَمْنِهِ وَأَمَانِهِ ، وَأَنَهَضَنِي إِلَى مَا يُحْيِينِي مِنْ لُطْفِهِ وَإِحْسَانِهِ ، صَلِّ اللَّهُمَّ عَلَى الدَّلِيلِ إِلَيْكَ فِي اللَّيْلِ الأَلْيَلِ ، وَالْمُتَمَسِّكِ بِحَبْلِكَ الأَطْوَلِ ، وَالنَّاصِعِ الْحَسَبِ فِي ذِرْوَةِ الْكاهِلِ الأَشْهَلِ .`
  }
];

export function ShiaDuas() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'duas' | 'latmiyat'>('duas');
  const [duasSubTab, setDuasSubTab] = useState<'audio' | 'written'>('audio');
  
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOfflineTrack, setIsOfflineTrack] = useState(false);

  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // حالة عرض الدعاء المقروء
  const [selectedWrittenDua, setSelectedWrittenDua] = useState<any | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredDuas = duasList.filter(d => d.name.includes(search));
  const filteredLatmiyat = latmiyatList.filter(l => l.name.includes(search));
  const filteredWrittenDuas = writtenDuasList.filter(w => w.title.includes(search));

  useEffect(() => {
    const checkDownloadedFiles = async () => {
      const allTracks = [...duasList, ...latmiyatList];
      const downloaded: string[] = [];
      for (const track of allTracks) {
        const savedBlob = await getAudioBlob(track.id);
        if (savedBlob) {
          downloaded.push(track.id);
        }
      }
      setDownloadedIds(downloaded);
    };
    checkDownloadedFiles();
  }, []);

  useEffect(() => {
    let objectUrlToRevoke: string | null = null;

    const prepareAndPlay = async () => {
      if (audioRef.current && currentTrack) {
        if (isPlaying) {
          setIsLoading(true);
          setHasError(false);

          try {
            const localBlob = await getAudioBlob(currentTrack.id);

            if (localBlob) {
              const localUrl = URL.createObjectURL(localBlob);
              objectUrlToRevoke = localUrl;
              audioRef.current.src = localUrl;
              setIsOfflineTrack(true);
            } else {
              audioRef.current.crossOrigin = "anonymous";
              audioRef.current.src = encodeURI(currentTrack.url);
              setIsOfflineTrack(false);
            }

            audioRef.current.load();
            await audioRef.current.play();
            setIsLoading(false);
          } catch (err) {
            console.error("خطأ في التشغيل:", err);
            setIsPlaying(false);
            setIsLoading(false);
            setHasError(true);
          }
        } else {
          audioRef.current.pause();
        }
      }
    };

    prepareAndPlay();

    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [isPlaying, currentTrack]);

  // -------------------------------------------------------------------
  // 🔄 تشغيل المقطع التالي تلقائياً عند انتهاء اللطمية أو الدعاء الحالي
  // -------------------------------------------------------------------
  const handleAudioEnded = () => {
    if (!currentTrack) return;

    // حدد القائمة التي يتم التشغيل منها حالياً
    const currentList = activeTab === 'latmiyat' ? filteredLatmiyat : filteredDuas;
    const currentIndex = currentList.findIndex(t => t.id === currentTrack.id);

    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      // هناك مقطع تالي -> شغل المقطع الذي يليه فوراً
      const nextTrack = currentList[currentIndex + 1];
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    } else {
      // انتهت القائمة
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    if (!currentTrack) return;
    const currentList = activeTab === 'latmiyat' ? filteredLatmiyat : filteredDuas;
    const currentIndex = currentList.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < currentList.length - 1) {
      setCurrentTrack(currentList[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const playPrevTrack = () => {
    if (!currentTrack) return;
    const currentList = activeTab === 'latmiyat' ? filteredLatmiyat : filteredDuas;
    const currentIndex = currentList.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(currentList[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const handleTrackSelect = (track: any) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setHasError(false);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleDownloadOffline = async (e: React.MouseEvent, track: any) => {
    e.stopPropagation();

    if (downloadedIds.includes(track.id)) {
      alert(`🎉 "${track.name}" محفّظ محلياً ومتاح للاستماع بدون إنترنت!`);
      return;
    }

    setDownloadingId(track.id);

    try {
      const response = await fetch(encodeURI(track.url));
      if (!response.ok) throw new Error("فشل الاتصال بالخادم");
      
      const blob = await response.blob();
      await saveAudioBlob(track.id, blob);

      setDownloadedIds(prev => [...prev, track.id]);
      alert(`✅ تم تحميل "${track.name}" بنجاح! يمكنك الاستماع له الآن أوفلاين بدون إنترنت.`);
    } catch (err) {
      console.error("خطأ أثناء التحميل:", err);
      alert("❌ تعذر التحميل أوفلاين، تحقق من الاتصال بالإنترنت وأعد المحاولة.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#022c22] relative font-['Cairo'] text-right" dir="rtl">
      {/* Header */}
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => navigate(-1)} className="p-2 text-[#fbbf24]">
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">المكتبة الصوتية والأدعية</h1>
          <p className="text-xs text-[#fbbf24] flex items-center gap-1">
            <ShieldCheck size={13} /> تشغيل تتابعي وتحميل محلي آمن
          </p>
        </div>
      </header>

      {/* Tabs & Search */}
      <div className="px-6 py-4 z-10 bg-[#022c22]/90 backdrop-blur-md border-b border-[#059669]/10 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'duas' ? "ابحث عن دعاء مبارك..." : "ابحث عن لطمية أو مجلس..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#064e3b]/60 border border-[#059669]/30 rounded-2xl py-3 pr-12 pl-4 text-[#f0f9ff] placeholder:text-[#059669]/70 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-right"
          />
          <Search className="absolute right-4 top-3.5 text-[#059669]" size={20} />
        </div>

        {/* التبويبات الرئيسية */}
        <div className="grid grid-cols-2 gap-2 bg-[#064e3b]/40 p-1.5 rounded-2xl border border-[#059669]/15">
          <button
            onClick={() => { setActiveTab('duas'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'duas' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span>الأدعية والزيارات</span>
          </button>
          <button
            onClick={() => { setActiveTab('latmiyat'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'latmiyat' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <Headphones size={16} />
            <span>اللطميات والمجالس ({latmiyatList.length})</span>
          </button>
        </div>

        {/* التبويب الفرعي للأدعية: صوتي / مقروء */}
        {activeTab === 'duas' && (
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={() => setDuasSubTab('audio')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${duasSubTab === 'audio' ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#064e3b]/50 text-[#f0f9ff]/60 border border-[#059669]/20'}`}
            >
              🔊 أدعية صوتية ({duasList.length})
            </button>
            <button
              onClick={() => setDuasSubTab('written')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${duasSubTab === 'written' ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#064e3b]/50 text-[#f0f9ff]/60 border border-[#059669]/20'}`}
            >
              📖 أدعية مقروءة ({writtenDuasList.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-36">
        
        {/* 1️⃣ أدعية صوتية */}
        {activeTab === 'duas' && duasSubTab === 'audio' && filteredDuas.map((dua) => {
          const isDownloaded = downloadedIds.includes(dua.id);
          const isDownloading = downloadingId === dua.id;

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={dua.id}>
              <div
                onClick={() => handleTrackSelect(dua)}
                className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}>
                    {currentTrack?.id === dua.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${currentTrack?.id === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}>
                      {dua.name}
                    </h3>
                    <p className="text-xs text-[#059669] flex items-center gap-1">
                      {isDownloaded ? <span className="text-[#38ef7d]">محفّظ أوفلاين (بدون نت)</span> : 'استماع وتحميل مباشر'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDownloadOffline(e, dua)}
                  disabled={isDownloading}
                  className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors"
                >
                  {isDownloading ? (
                    <Loader2 size={20} className="animate-spin text-[#fbbf24]" />
                  ) : isDownloaded ? (
                    <CheckCircle2 size={20} className="text-[#38ef7d]" />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* 2️⃣ أدعية مقروءة */}
        {activeTab === 'duas' && duasSubTab === 'written' && filteredWrittenDuas.map((writtenDua) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={writtenDua.id}>
            <div
              onClick={() => setSelectedWrittenDua(writtenDua)}
              className="flex items-center justify-between p-4 rounded-[24px] border border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl font-bold bg-[#059669]/30 text-[#fbbf24]">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#f0f9ff]">
                    {writtenDua.title}
                  </h3>
                  <p className="text-xs text-[#059669]">قراءة واضحة مع التشكيل</p>
                </div>
              </div>

              <div className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors">
                <Maximize2 size={18} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* 3️⃣ قسم اللطميات */}
        {activeTab === 'latmiyat' && filteredLatmiyat.map((latmia) => {
          const isDownloaded = downloadedIds.includes(latmia.id);
          const isDownloading = downloadingId === latmia.id;

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={latmia.id}>
              <div
                onClick={() => handleTrackSelect(latmia)}
                className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === latmia.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === latmia.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#059669]/20 text-[#fbbf24]'}`}>
                    {currentTrack?.id === latmia.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${currentTrack?.id === latmia.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}>
                      {latmia.name}
                    </h3>
                    <p className="text-xs text-[#059669]">
                      {isDownloaded ? <span className="text-[#38ef7d]">محفّظ أوفلاين (بدون نت)</span> : 'ملف صوتي عالي الجودة'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDownloadOffline(e, latmia)}
                  disabled={isDownloading}
                  className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors"
                >
                  {isDownloading ? (
                    <Loader2 size={20} className="animate-spin text-[#fbbf24]" />
                  ) : isDownloaded ? (
                    <CheckCircle2 size={20} className="text-[#38ef7d]" />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 📖 نافذة عرض الدعاء المقروء */}
      <AnimatePresence>
        {selectedWrittenDua && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-[#022c22]/95 backdrop-blur-lg z-[100] flex flex-col p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-[#059669]/30 pb-4 mb-4">
              <h2 className="font-bold text-lg text-[#fbbf24]">{selectedWrittenDua.title}</h2>
              <button
                onClick={() => setSelectedWrittenDua(null)}
                className="p-2 text-white bg-[#064e3b] rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pl-2 text-[#f0f9ff] text-lg leading-loose font-serif text-justify whitespace-pre-line bg-[#064e3b]/30 p-6 rounded-3xl border border-[#059669]/20 shadow-inner">
              {selectedWrittenDua.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎧 مشغل الصوت السفلي المحسّن بالتشغيل التتابعي */}
      {currentTrack && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-4 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50">
          <div className="flex justify-between items-center">
            <div className="text-right max-w-[55%]">
              <h4 className="font-bold text-[#fbbf24] text-sm truncate">{currentTrack.name}</h4>
              <p className={`text-xs mt-0.5 ${hasError ? 'text-red-400 flex items-center gap-1' : 'text-[#059669]'}`}>
                {hasError ? (
                  <>
                    <AlertCircle size={12} /> تعذر الاتصال بالسيرفر، حمّل الملف أولاً للاستماع بدون إنترنت.
                  </>
                ) : isLoading ? (
                  'جاري الاتصال الآمن بالسيرفر...'
                ) : isPlaying ? (
                  isOfflineTrack ? (
                    <span className="text-[#38ef7d] font-semibold">⚡ جاري التشغيل محلياً (Offline)</span>
                  ) : (
                    'جاري التشغيل التتابعي...'
                  )
                ) : (
                  'متوقف مؤقتاً'
                )}
              </p>
            </div>

            {/* أزرار التحكم بالتشغيل والتنقل */}
            <div className="flex items-center gap-2">
              <button
                onClick={playPrevTrack}
                className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-all"
                title="المقطع السابق"
              >
                <SkipForward size={22} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3.5 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause fill="currentColor" size={22} /> : <Play fill="currentColor" size={22} className="mr-0.5" />}
              </button>

              <button
                onClick={playNextTrack}
                className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-all"
                title="المقطع التالي"
              >
                <SkipBack size={22} />
              </button>
            </div>
          </div>

          <audio
            ref={audioRef}
            onEnded={handleAudioEnded} // 👈 الانقال التلقائي فور انتهاء الصوت
            onCanPlay={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setHasError(true);
              setIsPlaying(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, Pause, Search, Headphones, BookOpen, Volume2, VolumeX,
  Download, Loader2, CheckCircle2,
  SkipForward, SkipBack, X, Sun, Moon, Copy, Check, ZoomIn, ZoomOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// -------------------------------------------------------------
// محرك تخزين صوتيات أوفلاين باستخدام IndexedDB
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

// دالة توحيد وتجهيز النص العربي للبحث الدقيق
const normalizeArabicText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة الحركات والتنوين
    .replace(/[أإآ]/g, 'ا') // توحيد الألفات
    .replace(/ة/g, 'ه') // توحيد التاء المربوطة والهاء
    .replace(/ى/g, 'ي') // توحيد الياء
    .trim();
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
  { id: 'alhujati', name: 'دعاء الحجة عجل الله فرجه', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'alhujbi', name: 'دعاء الحجب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'aljushinalsaghir', name: 'دعاء الجوشن الصغير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aljushinalsaghir_mitham.mp3' },
  { id: 'alaman', name: 'دعاء الامان', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alaman_eamir_alkazmi.mp3' },
  { id: 'alamamzinaleabdin', name: 'دعاء الإمام زين العابدين (ع)', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alamamzinaleabdin_wlid.mp3' },
  { id: 'aliietiqad', name: 'دعاء الاعتقاد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliietiqad_abadhir' },
  { id: 'aliahtijab', name: 'دعاء الاحتجاب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliahtijab_basimi.mp3' },
  { id: 'aliimam_alkazim', name: 'دعاء الامام الكاظم (ع)', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliimam_alkazim(e)wlid.mp3' },
  { id: 'alkasai', name: 'دعاء حديث الكساء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alkasai_eamiralkazmi.mp3' },
  { id: 'alhayeuzmialbalai', name: 'دعاء الهي عظم البلاء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhayeuzmialbalai_mustafaa.mp3' },
  { id: 'alhialuilli', name: 'دعاء الهي الويل لي للامام السجاد عليه السلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhialuilli_abadhar.mp3' }
];

// 2. قائمة اللطميات
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
  { id: 'latmia-30', name: 'قصيدة االبدوية - حسين المرياني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/albadawia.mp3' },
  { id: 'latmia-31', name: 'قصيدة سيناء الغيرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sayna_alghayra.mp3' },
  { id: 'latmia-32', name: 'قصيدة زلزل - حيدر بوحمد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/zalzal_haydr_buhamd.mp3' },
  { id: 'latmia-33', name: 'قصيدة ودعت الحسين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/wadaeti_alhsin_basim_alkarbilayiy.mp3' },
  { id: 'latmia-34', name: 'قصيدة شخبار اهلنة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shakhbari_ahlanah_mihamadi_aljanami.mp3' },
  { id: 'latmia-35', name: 'قصيدة سادة العشرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sadatu_aleashra_mihamadi_aljanami.mp3' },
  { id: 'latmia-36', name: 'قصيدة قتلني فلان وفلان - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/qutilini_flan_wflan-Haidar Al-Bayati.mp3' },
  { id: 'latmia-37', name: 'قصيدة نذرت الحب - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nadharti_alhub_basim_alkarbilayiy.mp3' },
  { id: 'latmia-38', name: 'قصيدة من اربع جهاتي - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mun_arbaea_jahati_mihamadi_aljanami.mp3' },
  { id: 'latmia-39', name: 'قصيدة ملكة صغيرة - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/malikati_saghira-Haidar Al-Bayati.mp3' },
  { id: 'latmia-40', name: 'قصيدة اخرج الينا - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhruji_alina_mihamadi_aljanami.mp3' },
  { id: 'latmia-41', name: 'قصيدة حضرة السند - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/3hadratu_alsand_ali_alsaaeidi.mp3' },
  { id: 'latmia-42', name: 'قصيدة اجيبوني - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/2ajybwny_ali_alsaaeidi.mp3' },
  { id: 'latmia-43', name: 'قصيدة راية عباس - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1rayat_abbas_ali_alsaaeidi.mp3' },
  { id: 'latmia-44', name: 'قصيدة انكسار - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1Inkisar-Haidar Al-Bayati.mp3' },
  { id: 'latmia-45', name: 'قصيدة رجعلي رقية - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/rpaiea.mp3'},
  { id: 'latmia-46', name: 'قصيدة ظعن الشمس - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/dahinalsmis3.mp3'},
  { id: 'latmia-47', name: 'قصيدة نايحه - محمد باقر الخاقاني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nahiea.mp3'},
  { id: 'latmia-48', name: 'قصيدة خرابة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/baseim1985.mp3'}
];

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, Pause, Search, Headphones, BookOpen, Volume2, VolumeX,
  Download, Loader2, CheckCircle2,
  SkipForward, SkipBack, X, Sun, Moon, Copy, Check, ZoomIn, ZoomOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// -------------------------------------------------------------
// محرك تخزين صوتيات أوفلاين باستخدام IndexedDB
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

// دالة توحيد وتجهيز النص العربي للبحث الدقيق
const normalizeArabicText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة الحركات والتنوين
    .replace(/[أإآ]/g, 'ا') // توحيد الألفات
    .replace(/ة/g, 'ه') // توحيد التاء المربوطة والهاء
    .replace(/ى/g, 'ي') // توحيد الياء
    .trim();
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
  { id: 'alhujati', name: 'دعاء الحجة عجل الله فرجه', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'alhujbi', name: 'دعاء الحجب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhujati_abadhir.mp3' },
  { id: 'aljushinalsaghir', name: 'دعاء الجوشن الصغير', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aljushinalsaghir_mitham.mp3' },
  { id: 'alaman', name: 'دعاء الامان', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alaman_eamir_alkazmi.mp3' },
  { id: 'alamamzinaleabdin', name: 'دعاء الإمام زين العابدين (ع)', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alamamzinaleabdin_wlid.mp3' },
  { id: 'aliietiqad', name: 'دعاء الاعتقاد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliietiqad_abadhir' },
  { id: 'aliahtijab', name: 'دعاء الاحتجاب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliahtijab_basimi.mp3' },
  { id: 'aliimam_alkazim', name: 'دعاء الامام الكاظم (ع)', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_aliimam_alkazim(e)wlid.mp3' },
  { id: 'alkasai', name: 'دعاء حديث الكساء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alkasai_eamiralkazmi.mp3' },
  { id: 'alhayeuzmialbalai', name: 'دعاء الهي عظم البلاء', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhayeuzmialbalai_mustafaa.mp3' },
  { id: 'alhialuilli', name: 'دعاء الهي الويل لي للامام السجاد عليه السلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/duaa_alhialuilli_abadhar.mp3' }
];

// 2. قائمة اللطميات
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
  { id: 'latmia-30', name: 'قصيدة االبدوية - حسين المرياني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/albadawia.mp3' },
  { id: 'latmia-31', name: 'قصيدة سيناء الغيرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sayna_alghayra.mp3' },
  { id: 'latmia-32', name: 'قصيدة زلزل - حيدر بوحمد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/zalzal_haydr_buhamd.mp3' },
  { id: 'latmia-33', name: 'قصيدة ودعت الحسين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/wadaeti_alhsin_basim_alkarbilayiy.mp3' },
  { id: 'latmia-34', name: 'قصيدة شخبار اهلنة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shakhbari_ahlanah_mihamadi_aljanami.mp3' },
  { id: 'latmia-35', name: 'قصيدة سادة العشرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sadatu_aleashra_mihamadi_aljanami.mp3' },
  { id: 'latmia-36', name: 'قصيدة قتلني فلان وفلان - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/qutilini_flan_wflan-Haidar Al-Bayati.mp3' },
  { id: 'latmia-37', name: 'قصيدة نذرت الحب - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nadharti_alhub_basim_alkarbilayiy.mp3' },
  { id: 'latmia-38', name: 'قصيدة من اربع جهاتي - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mun_arbaea_jahati_mihamadi_aljanami.mp3' },
  { id: 'latmia-39', name: 'قصيدة ملكة صغيرة - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/malikati_saghira-Haidar Al-Bayati.mp3' },
  { id: 'latmia-40', name: 'قصيدة اخرج الينا - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhruji_alina_mihamadi_aljanami.mp3' },
  { id: 'latmia-41', name: 'قصيدة حضرة السند - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/3hadratu_alsand_ali_alsaaeidi.mp3' },
  { id: 'latmia-42', name: 'قصيدة اجيبوني - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/2ajybwny_ali_alsaaeidi.mp3' },
  { id: 'latmia-43', name: 'قصيدة راية عباس - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1rayat_abbas_ali_alsaaeidi.mp3' },
  { id: 'latmia-44', name: 'قصيدة انكسار - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1Inkisar-Haidar Al-Bayati.mp3' },
  { id: 'latmia-45', name: 'قصيدة رجعلي رقية - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/rpaiea.mp3'},
  { id: 'latmia-46', name: 'قصيدة ظعن الشمس - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/dahinalsmis3.mp3'},
  { id: 'latmia-47', name: 'قصيدة نايحه - محمد باقر الخاقاني', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nahiea.mp3'},
  { id: 'latmia-48', name: 'قصيدة خرابة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/baseim1985.mp3'}
];

// 3. قائمة الأدعية المقروءة (المكتوبة)
const writtenDuasList = [
  {
    id: 'Faraj',
    title: 'دعاء الفرج',
    content: `إِلَهِي عَظُمَ الْبَلاءُ وَبَرِحَ الْخَفَاءُ وَانْكَشَفَ الْغِطَاءُ وَانْقَطَعَ الرَّجَاءُ، وَضَاقَتِ الأَرْضُ وَمُنِعَتِ السَّمَاءُ، وَأَنْتَ الْمُسْتَعَانُ وَإِلَيْكَ الْمُشْتَكَى، وَعَلَيْكَ الْمُعَوَّلُ فِي الشِّدَّةِ وَالرَّخَاءِ.

اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ أُولِي الأَمْرِ الَّذِينَ فَرَضْتَ عَلَيْنَا طَاعَتَهُمْ وَعَرَّفْتَنَا بِذَلِكَ مَنْزِلَتَهُمْ، فَفَرِّجْ عَنَّا بِحَقِّهِمْ فَرَجاً عَاجِلاً قَرِيباً كَلَمْحِ الْبَصَرِ أَوْ هُوَ أَقْرَبُ.

يَا مُحَمَّدُ يَا عَلِيُّ، يَا عَلِيُّ يَا مُحَمَّدُ، اكْفِيَانِي فَإِنَّكُمَا كَافِيَانِ، وَانْصُرَانِي فَإِنَّكُمَا نَاصِرَانِ. يَا مَوْلانَا يَا صَاحِبَ الزَّمَانِ، الْغَوْثَ الْغَوْثَ الْغَوْثَ، أَدْرِكْنِي أَدْرِكْنِي أَدْرِكْنِي، السَّاعَةَ السَّاعَةَ السَّاعَةَ، الْعَاجَلَ الْعَاجَلَ الْعَاجَلَ، يَا أَرْحَمَ الرَّاحِمِينَ بِحَقِّ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ.`
  },
  {
    id: 'alhujati',
    title: 'دعاء الحجة (عجل الله فرجه)',
    content: `اللَّهُمَّ كُنْ لِوَلِيِّكَ الحُجَّةِ بْنِ الحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ وَلِيّاً وَحَافِظاً وَقَائِداً وَنَاصِراً وَدَلِيلاً وَعَيْناً حَتَّى تُسْكِنَهُ أَرْضَكَ طَوْعاً وَتُمَتِّعَهُ فِيهَا طَوِيلاً بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.`
  },
  {
    id: 'alnuwr',
    title: 'دعاء النور',
    content: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ، بِسْمِ اللَّهِ النُّورِ، بِسْمِ اللَّهِ نُورِ النُّورِ، بِسْمِ اللَّهِ نُورٌ عَلَى نُورٍ، بِسْمِ اللَّهِ الَّذِي هُوَ مُدَبِّرُ الأُمُورِ، بِسْمِ اللَّهِ الَّذِي خَلَقَ النُّورَ مِنَ النُّورِ.

الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ النُّورَ مِنَ النُّورِ، وَأَنْزَلَ النُّورَ عَلَى الطُّورِ، فِي كِتَابٍ مَسْطُورٍ، فِي رَقٍّ مَنْشُورٍ، بِقَدَرٍ مَقْدُورٍ، عَلَى نَبِيٍّ مَحْبُورٍ.

الْحَمْدُ لِلَّهِ الَّذِي هُوَ بِالْعِزِّ مَذْكُورٌ، وَبِالْفَخْرِ مَشْهُورٌ، وَعَلَى السَّرَّاءِ وَالضَّرَّاءِ مَشْكُورٌ. وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ.`
  },
  {
    id: 'alaghibati',
    title: 'دعاء زمن الغيبة',
    content: `اللَّهُمَّ عَرِّفْنِي نَفْسَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي نَفْسَكَ لَمْ أَعْرِفْ نَبِيَّكَ، اللَّهُمَّ عَرِّفْنِي رَسُولَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي رَسُولَكَ لَمْ أَعْرِفْ حُجَّتَكَ، اللَّهُمَّ عَرِّفْنِي حُجَّتَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي حُجَّتَكَ ضَلَلْتُ عَنْ دِينِي.`
  },
  {
    id: 'aliahtijab',
    title: 'دعاء الاحتجاب',
    content: `احْتَجَبْتُ بِنُورِ وَجْهِ اللَّهِ الْكَرِيمِ الْكَامِلِ، وَتَحَصَّنْتُ بِحِصْنِ اللَّهِ الْقَوِيِّ الشَّامِخِ، وَرَمَيْتُ مَنْ بَغَى عَلَيَّ بِسَهْمِ اللَّهِ وَسَيْفِهِ الْقَاطِعِ.
اللَّهُمَّ يَا غَالِباً عَلَى أَمْرِهِ، وَيَا قَائِماً فَوْقَ خَلْقِهِ، وَيَا حَائِلاً بَيْنَ الْمَرْءِ وَقَلْبِهِ، حُلْ بَيْنِي وَبَيْنَ الشَّيْطَانِ وَنَزْغِهِ، وَبَيْنَ مَا لا طَاقَةَ لِي بِهِ مِنْ خَلْقِكَ كُلِّهِمْ.
أَكْفِفْ عَنِّي أَلْسِنَتَهُمْ، وَاغْلُلْ أَيْدِيَهُمْ وَأَرْجُلَهُمْ، وَاجْعَلْ بَيْنِي وَبَيْنَهُمْ سَدّاً مِنْ نُورِ عَظَمَتِكَ، وَحِجَاباً مِنْ قُدْرَتِكَ، وَجُنْداً مِنْ سُلْطَانِكَ، إِنَّكَ قَادِرٌ مُقْتَدِرٌ. اللَّهُمَّ اكْفِنِي شَرَّ مَنْ أَرَادَنِي بِسُوءٍ مِنْ جِنٍّ وَإِنْسٍ، فِي لَيْلِي وَنَهَارِي، وَصَبَاحِي وَمَسَائِي، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ.`
  },
  {
    id: 'aleafiat',
    title: 'دعاء العافية',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ، وَشُكْرَ الْعَافِيَةِ، وَتَمَامَ الْعَافِيَةِ، وَدَوَامَ الْعَافِيَةِ فِي الدُّنْيَا وَالآخِرَةِ.
اللَّهُمَّ أَلْبِسْنِي الْعَافِيَةَ حَتَّى تُهَنِّئَنِي بِالْمَعِيشَةِ، وَاخْتِمْ لِي بِالْمَغْفِرَةِ حَتَّى لا تَضُرَّنِي الذُّنُوبُ، وَاكْفِنِي كُلَّ هَوْلٍ دُونَ الْجَنَّةِ حَتَّى تُبَلِّغَنِيهَا بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.`
  },
  {
    id: 'ahad',
    title: 'دعاء المحبوس',
    content: `بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ

اللّهُمَّ صَلِّ عَلى مُحَمَّدٍ وَآلِ مُحَمَّدٍ

اِلـهي عَظُمَ الْبَلاءُ، وَبَرِحَ الْخَفاءُ، وَانْكَشَفَ الْغِطاءُ، وَانْقَطَعَ الرَّجاءُ، وَضاقَتِ الاَرْضُ، وَمُنِعَتِ السَّماءُ، واَنْتَ الْمُسْتَعانُ، وَاِلَيْكَ الْمُشْتَكى، وَعَلَيْكَ الْمُعَوَّلُ فِي الشِدَّةِ والرَّخاءِ،

اَللّـهُمَّ صَلِّ عَلى مُحَمَّد وَآلِ مُحَمَّد، اُولِي الاَمْرِ الَّذينَ فَرَضْتَ عَلَيْنَا طاعَتَهُمْ، وَعَرَّفْتَنا بِذلِكَ مَنْزِلَتَهُمْ، فَفَرِّجْ عَنا بِحَقِّهِمْ فَرَجاً عاجِلاً قَريباً كَلَمْحِ الْبَصَرِ اَوْ هُوَ اَقْرَبُ،

يا مُحَمَّدُ يا عَلِيُّ يا عَلِيُّ يا مُحَمَّدُ اِكْفِياني فَاِنَّكُما كافِيانِ، وَانْصُراني فَاِنَّكُما ناصِرانِ،

يا مَوْلانا يا صاحِبَ الزَّمانِ، الْغَوْثَ الْغَوْثَ الْغَوْثَ، اَدْرِكْني اَدْرِكْني اَدْرِكْني، السّاعَةَ السّاعَةَ السّاعَةَ، الْعَجَلَ الْعَجَلَ الْعَجَل، يا اَرْحَمَ الرّاحِمينَ، بِحَقِّ مُحَمَّد وَآلِهِ الطّاهِرينَ.`
  },
  {
    id: 'tawassul',
    title: 'دعاء التوسل',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ...`
  },
  {
    id: 'sabah',
    title: 'دعاء الصباح',
    content: `اللَّهُمَّ يَا مَنْ دَلَعَ لِسَانَ الصَّبَاحِ بِنُطْقِ تَبَلُّجِهِ، وَسَرَّحَ قِطَعَ اللَّيْلِ الْمُظْلِمِ بِغَيَاهِبِ تَلَجْلُجِهِ...`
  },
  {
    id: 'alhujbi',
    title: 'دعاء الحجب',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا مَنِ احْتَجَبَ بِشُعَاعِ نُورِهِ عَنْ نَوَاظِرِ خَلْقِهِ...`
  }, 
  {
    id: 'kumail',
    title: 'دعاء كميل',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ...`
  },
  {
    id: 'Mujir',
    title: 'دعاء المجير',
    content: `سُبْحَانَكَ يَا اللَّهُ تَعَالَيْتَ يَا رَحْمَنُ، أَجِرْنَا مِنَ النَّارِ يَا مُجِيرُ...`
  },
  {
    id: 'alkasai',
    title: 'حديث الكساء اليماني المبارك',
    content: `عَنْ فَاطِمَةَ الزَّهْرَاءِ عَلَيْهَا السَّلامُ بِنْتِ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ، قَالَتْ...`
  }, 
  {
    id: 'iftitah',
    title: 'دعاء الافتتاح',
    content: `اللَّهُمَّ إِنِّي أَفْتَتِحُ الثَّنَاءَ بِحَمْدِكَ، وَأَنْتَ مُسَدِّدٌ لِلصَّوَابِ بِمَنِّكَ...`
  },
  {
    id: 'simat',
    title: 'دعاء السمات',
    content: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ الْعَظِيمِ الأَعْظَمِ الأَعَزِّ الأَجَلِّ الأَكْرَمِ، الَّذِي إِذَا دُعِيتَ بِهِ عَلَى مَغَالِقِ أَبْوَابِ السَّمَاءِ لِلْفَتْحِ بِالرَّحْمَةِ انْفَتَحَتْ، وَإِذَا دُعِيتَ بِهِ عَلَى مَضَايِقِ أَبْوَابِ الأَرْضِ لِلْفَرَجِ انْفَرَجَتْ، وَإِذَا دُعِيتَ بِهِ عَلَى الْعُسْرِ لِلْيُسْرِ تَيَسَّرَتْ، وَإِذَا دُعِيتَ بِهِ عَلَى الأَمْوَاتِ لِلنُّشُورِ انْتَشَرَتْ، وَإِذَا دُعِيتَ بِهِ عَلَى كَشْفِ الْبَأْسَاءِ وَالضَّرَّاءِ انْكَشَفَتْ.`
  }
];

export default function ShiaDuasApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'audioDuas' | 'latmiyat' | 'writtenDuas'>('audioDuas');
  const [searchTerm, setSearchTerm] = useState('');
  
  // التحكم في المشغل الصوتي
  const [currentTrack, setCurrentTrack] = useState<{ id: string; name: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // حالة كتم الصوت
  const [downloadingIds, setDownloadingIds] = useState<{ [key: string]: boolean }>({});
  const [offlineStatus, setOfflineStatus] = useState<{ [key: string]: boolean }>({});
  
  // الميزات الإضافية
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // فحص الملفات المحفوظة أوفلاين
  useEffect(() => {
    const checkOfflineFiles = async () => {
      const statusMap: { [key: string]: boolean } = {};
      const allAudioItems = [...duasList, ...latmiyatList];
      for (const item of allAudioItems) {
        const blob = await getAudioBlob(item.id);
        if (blob) statusMap[item.id] = true;
      }
      setOfflineStatus(statusMap);
    };
    checkOfflineFiles();
  }, []);

  // تشغيل مقطع صوتي
  const playTrack = async (item: { id: string; name: string; url: string }) => {
    setCurrentTrack(item);
    setIsPlaying(true);
    const offlineBlob = await getAudioBlob(item.id);
    const src = offlineBlob ? URL.createObjectURL(offlineBlob) : item.url;
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.muted = isMuted; // الحفاظ على حالة الكتم عند الانتقال
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  // تبديل حالة التشغيل / الإيقاف المؤقت
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // تبديل كتم الصوت
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // الحصول على القائمة الحالية المتشغلة
  const getCurrentActiveList = () => {
    if (!currentTrack) return [];
    const isDua = duasList.some((d) => d.id === currentTrack.id);
    return isDua ? duasList : latmiyatList;
  };

  // الانتقال للمقطع التالي (التقديم)
  const handleNextTrack = () => {
    const list = getCurrentActiveList();
    if (!list.length || !currentTrack) return;
    const currentIndex = list.findIndex((item) => item.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      playTrack(list[currentIndex + 1]);
    } else if (list.length > 0) {
      playTrack(list[0]);
    }
  };

  // الانتقال للمقطع السابق (التأخير)
  const handlePrevTrack = () => {
    const list = getCurrentActiveList();
    if (!list.length || !currentTrack) return;
    const currentIndex = list.findIndex((item) => item.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(list[currentIndex - 1]);
    } else {
      playTrack(list[list.length - 1]);
    }
  };

  // تحميل الصوت وحفظه أوفلاين
  const handleDownloadAudio = async (item: { id: string; name: string; url: string }) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [item.id]: true }));
      const response = await fetch(item.url);
      const blob = await response.blob();
      await saveAudioBlob(item.id, blob);
      setOfflineStatus((prev) => ({ ...prev, [item.id]: true }));

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('حدث خطأ أثناء تحميل الملف الصوتى');
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  // نسخ النص
  const handleCopyText = (id: string, title: string, content: string) => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // دالة تصفية نتائج البحث الذكي المحدثة (تعمل بدقة لكافة الأقسام)
  const filterList = (list: any[]) => {
    if (!searchTerm.trim()) return list;
    const cleanSearch = normalizeArabicText(searchTerm);
    return list.filter((item) => {
      const itemTitle = normalizeArabicText(item.name || item.title || '');
      const itemContent = item.content ? normalizeArabicText(item.content) : '';
      return itemTitle.includes(cleanSearch) || itemContent.includes(cleanSearch);
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 dir-rtl ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'}`} style={{ direction: 'rtl' }}>
      
      {/* عنصر الصوت المدمج */}
      <audio 
        ref={audioRef} 
        onEnded={handleNextTrack}
      />

      {/* الهيدر الرئيسي */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b p-4 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-emerald-500/10">
              <ArrowRight className="w-6 h-6 text-emerald-500" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              الأدعية واللطميات
            </h1>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-amber-400 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
            title="تغيير الثيم"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-36">
        
        {/* شريط البحث المطور الذكي */}
        <div className="relative mb-6">
          <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكلمات في الدعاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-11 pl-10 py-3 rounded-2xl border outline-none transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-gray-800'}`}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute left-3 top-3.5 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* التبويبات الثلاثة */}
        <div className={`flex p-1.5 rounded-2xl mb-6 border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-200 border-gray-300'}`}>
          <button
            onClick={() => setActiveTab('audioDuas')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'audioDuas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Headphones className="w-4 h-4" /> أدعية صوتية
          </button>
          <button
            onClick={() => setActiveTab('latmiyat')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'latmiyat' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Volume2 className="w-4 h-4" /> لطميات
          </button>
          <button
            onClick={() => setActiveTab('writtenDuas')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'writtenDuas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" /> أدعية مكتوبة
          </button>
        </div>

        {/* أدوات التحكم بالخط (للأدعية المكتوبة) */}
        {activeTab === 'writtenDuas' && (
          <div className={`flex items-center justify-between p-3 rounded-2xl mb-6 border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
            <span className="text-sm text-gray-400 font-medium">حجم خط القراءة:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className={`p-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-emerald-500">{fontSize}</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                className={`p-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* قوائم الأدعية الصوتية واللطميات */}
        {(activeTab === 'audioDuas' || activeTab === 'latmiyat') && (
          <div className="grid gap-3">
            {filterList(activeTab === 'audioDuas' ? duasList : latmiyatList).map((item) => {
              const isSelected = currentTrack?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : isDarkMode ? 'bg-gray-900/60 border-gray-800/80 hover:border-emerald-500/40' : 'bg-white border-gray-200 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          togglePlayPause();
                        } else {
                          playTrack(item);
                        }
                      }}
                      className={`p-3 rounded-xl transition-all ${
                        isSelected && isPlaying 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold text-base ${isSelected ? 'text-emerald-400' : ''}`}>{item.name}</h3>
                      {offlineStatus[item.id] && (
                        <span className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> محفوظ أوفلاين
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadAudio(item)}
                    disabled={downloadingIds[item.id]}
                    className={`p-2.5 rounded-xl border transition-all ${
                      offlineStatus[item.id]
                        ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                        : isDarkMode ? 'border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                    title="تحميل وحفظ أوفلاين"
                  >
                    {downloadingIds[item.id] ? (
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
            {filterList(activeTab === 'audioDuas' ? duasList : latmiyatList).length === 0 && (
              <p className="text-center py-8 text-gray-500">لا توجد نتائج مطابقة لـ "{searchTerm}"</p>
            )}
          </div>
        )}

        {/* الأدعية المكتوبة */}
        {activeTab === 'writtenDuas' && (
          <div className="grid gap-6">
            {filterList(writtenDuasList).map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800/40">
                  <h3 className="text-xl font-bold text-emerald-500">{item.title}</h3>

                  <button
                    onClick={() => handleCopyText(item.id, item.title, item.content)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      copiedId === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> نسخ النص
                      </>
                    )}
                  </button>
                </div>

                <p 
                  className="leading-relaxed whitespace-pre-line text-justify font-serif"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {item.content}
                </p>
              </div>
            ))}
            {filterList(writtenDuasList).length === 0 && (
              <p className="text-center py-8 text-gray-500">لا توجد نتائج مطابقة لـ "{searchTerm}"</p>
            )}
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* المشغل الصوتي العائم الثابت بالأسفل (مع زر كتم الصوت والتقديم والتأخير) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t backdrop-blur-xl shadow-2xl transition-colors ${
              isDarkMode ? 'bg-gray-900/95 border-gray-800 text-white' : 'bg-white/95 border-gray-200 text-gray-900'
            }`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              
              {/* معلومات المقطع الحالي */}
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl flex-shrink-0">
                  <Volume2 className={`w-5 h-5 ${isPlaying && !isMuted ? 'animate-pulse' : ''}`} />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-sm sm:text-base truncate">{currentTrack.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isMuted ? 'الصوت مكتوم' : isPlaying ? 'جاري التشغيل...' : 'متوقف مؤقتاً'}
                  </p>
                </div>
              </div>

              {/* أزرار التحكم بالصوت (كتم الصوت، تقديم، تأخير، تشغيل/إيقاف، إغلاق) */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                
                {/* زر كتم / تفعيل الصوت المضاف حديثاً */}
                <button 
                  onClick={toggleMute}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                      : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* زر المقطع السابق */}
                <button 
                  onClick={handlePrevTrack}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="المقطع السابق (تأخير)"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* زر التشغيل / الإيقاف المؤقت */}
                <button 
                  onClick={togglePlayPause}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* زر المقطع التالي */}
                <button 
                  onClick={handleNextTrack}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="المقطع التالي (تقديم)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* زر إغلاق المشغل */}
                <button 
                  onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlaying(false);
                    setCurrentTrack(null);
                  }}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors mr-1"
                  title="إغلاق المشغل"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ShiaDuasApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'audioDuas' | 'latmiyat' | 'writtenDuas'>('audioDuas');
  const [searchTerm, setSearchTerm] = useState('');
  
  // التحكم في المشغل الصوتي
  const [currentTrack, setCurrentTrack] = useState<{ id: string; name: string; url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // حالة كتم الصوت
  const [downloadingIds, setDownloadingIds] = useState<{ [key: string]: boolean }>({});
  const [offlineStatus, setOfflineStatus] = useState<{ [key: string]: boolean }>({});
  
  // الميزات الإضافية
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // فحص الملفات المحفوظة أوفلاين
  useEffect(() => {
    const checkOfflineFiles = async () => {
      const statusMap: { [key: string]: boolean } = {};
      const allAudioItems = [...duasList, ...latmiyatList];
      for (const item of allAudioItems) {
        const blob = await getAudioBlob(item.id);
        if (blob) statusMap[item.id] = true;
      }
      setOfflineStatus(statusMap);
    };
    checkOfflineFiles();
  }, []);

  // تشغيل مقطع صوتي
  const playTrack = async (item: { id: string; name: string; url: string }) => {
    setCurrentTrack(item);
    setIsPlaying(true);
    const offlineBlob = await getAudioBlob(item.id);
    const src = offlineBlob ? URL.createObjectURL(offlineBlob) : item.url;
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.muted = isMuted; // الحفاظ على حالة الكتم عند الانتقال
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  // تبديل حالة التشغيل / الإيقاف المؤقت
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // تبديل كتم الصوت
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // الحصول على القائمة الحالية المتشغلة
  const getCurrentActiveList = () => {
    if (!currentTrack) return [];
    const isDua = duasList.some((d) => d.id === currentTrack.id);
    return isDua ? duasList : latmiyatList;
  };

  // الانتقال للمقطع التالي (التقديم)
  const handleNextTrack = () => {
    const list = getCurrentActiveList();
    if (!list.length || !currentTrack) return;
    const currentIndex = list.findIndex((item) => item.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      playTrack(list[currentIndex + 1]);
    } else if (list.length > 0) {
      playTrack(list[0]);
    }
  };

  // الانتقال للمقطع السابق (التأخير)
  const handlePrevTrack = () => {
    const list = getCurrentActiveList();
    if (!list.length || !currentTrack) return;
    const currentIndex = list.findIndex((item) => item.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(list[currentIndex - 1]);
    } else {
      playTrack(list[list.length - 1]);
    }
  };

  // تحميل الصوت وحفظه أوفلاين
  const handleDownloadAudio = async (item: { id: string; name: string; url: string }) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [item.id]: true }));
      const response = await fetch(item.url);
      const blob = await response.blob();
      await saveAudioBlob(item.id, blob);
      setOfflineStatus((prev) => ({ ...prev, [item.id]: true }));

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('حدث خطأ أثناء تحميل الملف الصوتى');
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  // نسخ النص
  const handleCopyText = (id: string, title: string, content: string) => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // دالة تصفية نتائج البحث الذكي المحدثة (تعمل بدقة لكافة الأقسام)
  const filterList = (list: any[]) => {
    if (!searchTerm.trim()) return list;
    const cleanSearch = normalizeArabicText(searchTerm);
    return list.filter((item) => {
      const itemTitle = normalizeArabicText(item.name || item.title || '');
      const itemContent = item.content ? normalizeArabicText(item.content) : '';
      return itemTitle.includes(cleanSearch) || itemContent.includes(cleanSearch);
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 dir-rtl ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'}`} style={{ direction: 'rtl' }}>
      
      {/* عنصر الصوت المدمج */}
      <audio 
        ref={audioRef} 
        onEnded={handleNextTrack}
      />

      {/* الهيدر الرئيسي */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b p-4 ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-emerald-500/10">
              <ArrowRight className="w-6 h-6 text-emerald-500" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              الأدعية واللطميات
            </h1>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-amber-400 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
            title="تغيير الثيم"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-36">
        
        {/* شريط البحث المطور الذكي */}
        <div className="relative mb-6">
          <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الكلمات في الدعاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-11 pl-10 py-3 rounded-2xl border outline-none transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 focus:border-emerald-500 text-white' : 'bg-white border-gray-200 focus:border-emerald-500 text-gray-800'}`}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute left-3 top-3.5 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* التبويبات الثلاثة */}
        <div className={`flex p-1.5 rounded-2xl mb-6 border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-200 border-gray-300'}`}>
          <button
            onClick={() => setActiveTab('audioDuas')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'audioDuas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Headphones className="w-4 h-4" /> أدعية صوتية
          </button>
          <button
            onClick={() => setActiveTab('latmiyat')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'latmiyat' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Volume2 className="w-4 h-4" /> لطميات
          </button>
          <button
            onClick={() => setActiveTab('writtenDuas')}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'writtenDuas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" /> أدعية مكتوبة
          </button>
        </div>

        {/* أدوات التحكم بالخط (للأدعية المكتوبة) */}
        {activeTab === 'writtenDuas' && (
          <div className={`flex items-center justify-between p-3 rounded-2xl mb-6 border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
            <span className="text-sm text-gray-400 font-medium">حجم خط القراءة:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className={`p-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-emerald-500">{fontSize}</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                className={`p-2 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* قوائم الأدعية الصوتية واللطميات */}
        {(activeTab === 'audioDuas' || activeTab === 'latmiyat') && (
          <div className="grid gap-3">
            {filterList(activeTab === 'audioDuas' ? duasList : latmiyatList).map((item) => {
              const isSelected = currentTrack?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : isDarkMode ? 'bg-gray-900/60 border-gray-800/80 hover:border-emerald-500/40' : 'bg-white border-gray-200 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          togglePlayPause();
                        } else {
                          playTrack(item);
                        }
                      }}
                      className={`p-3 rounded-xl transition-all ${
                        isSelected && isPlaying 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold text-base ${isSelected ? 'text-emerald-400' : ''}`}>{item.name}</h3>
                      {offlineStatus[item.id] && (
                        <span className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> محفوظ أوفلاين
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadAudio(item)}
                    disabled={downloadingIds[item.id]}
                    className={`p-2.5 rounded-xl border transition-all ${
                      offlineStatus[item.id]
                        ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                        : isDarkMode ? 'border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                    title="تحميل وحفظ أوفلاين"
                  >
                    {downloadingIds[item.id] ? (
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
            {filterList(activeTab === 'audioDuas' ? duasList : latmiyatList).length === 0 && (
              <p className="text-center py-8 text-gray-500">لا توجد نتائج مطابقة لـ "{searchTerm}"</p>
            )}
          </div>
        )}

        {/* الأدعية المكتوبة */}
        {activeTab === 'writtenDuas' && (
          <div className="grid gap-6">
            {filterList(writtenDuasList).map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800/40">
                  <h3 className="text-xl font-bold text-emerald-500">{item.title}</h3>

                  <button
                    onClick={() => handleCopyText(item.id, item.title, item.content)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      copiedId === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> نسخ النص
                      </>
                    )}
                  </button>
                </div>

                <p 
                  className="leading-relaxed whitespace-pre-line text-justify font-serif"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {item.content}
                </p>
              </div>
            ))}
            {filterList(writtenDuasList).length === 0 && (
              <p className="text-center py-8 text-gray-500">لا توجد نتائج مطابقة لـ "{searchTerm}"</p>
            )}
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* المشغل الصوتي العائم الثابت بالأسفل (مع زر كتم الصوت والتقديم والتأخير) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t backdrop-blur-xl shadow-2xl transition-colors ${
              isDarkMode ? 'bg-gray-900/95 border-gray-800 text-white' : 'bg-white/95 border-gray-200 text-gray-900'
            }`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              
              {/* معلومات المقطع الحالي */}
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl flex-shrink-0">
                  <Volume2 className={`w-5 h-5 ${isPlaying && !isMuted ? 'animate-pulse' : ''}`} />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-sm sm:text-base truncate">{currentTrack.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isMuted ? 'الصوت مكتوم' : isPlaying ? 'جاري التشغيل...' : 'متوقف مؤقتاً'}
                  </p>
                </div>
              </div>

              {/* أزرار التحكم بالصوت (كتم الصوت، تقديم، تأخير، تشغيل/إيقاف، إغلاق) */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                
                {/* زر كتم / تفعيل الصوت المضاف حديثاً */}
                <button 
                  onClick={toggleMute}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                      : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* زر المقطع السابق */}
                <button 
                  onClick={handlePrevTrack}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="المقطع السابق (تأخير)"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* زر التشغيل / الإيقاف المؤقت */}
                <button 
                  onClick={togglePlayPause}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* زر المقطع التالي */}
                <button 
                  onClick={handleNextTrack}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="المقطع التالي (تقديم)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* زر إغلاق المشغل */}
                <button 
                  onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlaying(false);
                    setCurrentTrack(null);
                  }}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors mr-1"
                  title="إغلاق المشغل"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

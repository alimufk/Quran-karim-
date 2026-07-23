import { useState, useRef, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ArrowRight, Play, Pause, Search, Headphones, BookOpen, Volume2, ShieldCheck, Download, AlertCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

// 1. قائمة الأدعية الكاملة والمستقرة
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

// 2. قائمة اللطميات الرسمية (تأكد من مطابقة حالة الأحرف الكبيرة والصغيرة للامتداد MP3 في مستودعك)
const latmiyatList = [
  { id: 'latmia-1', name: 'قصيدة درب احبابي - مرتضى حرب', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/darib_ahbabi.mp3' },
  { id: 'latmia-2', name: 'قصيدة يسجلني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/yusajiluni.mp3' },
  { id: 'latmia-3', name: 'قصيدة  خطت حرب - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/khutat_harb.mp3' },
  { id: 'latmia-4', name: 'قصيدة تزوروني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/tazuruni.mp3' }, 
  { id: 'latmia-5', name: 'قصيدة يمضموني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/m1.mp3' }, 
  { id: 'latmia-6', name: 'قصيدة شد الثامة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shidalthaama.mp3' }, 
  { id: 'latmia-7', name: 'قصيدة بلله ياشمر - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/blahaesmar.mp3' },
  { id: 'latmia-8', name: 'قصيدة يمة اطمنج علية - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/m2.mp3' }, 
  { id: 'latmia-9', name: 'قصيدة درب العشك - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/darab_aleishk.mp3' }, 
  { id: 'latmia-10', name: 'قصيدة الله ياحامي الشريعة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/allah_yahami.mp3' }, 
  { id: 'latmia-11', name: 'قصيدة هاي المنزلة - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Al-Mazlou.mp3' }, 
  { id: 'latmia-12', name: 'قصيدة أنشأ الله - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/an-allah.mp3' }, 
  { id: 'latmia-13', name: 'قصيدة هاذا الغريب منين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hadha_algharib.mp3' },
  { id: 'latmia-14', name: 'قصيدة هضموني - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/hadmuniun.mp3' },
  { id: 'latmia-15', name: 'قصيدة انت الرزق   - ملا جليل', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/anta_alrizq.mp3' }, 
  { id: 'latmia-16', name: 'قصيدة ماحسبت هالكثر - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/biasm_mahsabat-halkuthr.mp3' }, 
  { id: 'latmia-17', name: 'قصيدة طفلة وشفت بالنوم - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/ya_tiflat_taniny.mp3' },
  { id: 'latmia-18', name: 'قصيدة شيعت علي منصورة - سيد سلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shieat_eali_mansura.mp3' },
  { id: 'latmia-19', name: 'قصيدة  ابا عبد الله - سيد سلام', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/Abu_Abdallah.mp3' },
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
  { id: 'latmia-32', name: 'قصيدة زلزل  - حيدر بوحمد', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/zalzal_haydr_buhamd.mp3' },
  { id: 'latmia-33', name: 'قصيدة ودعت الحسين - باسم الكربلائي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/wadaeti_alhsin_basim_alkarbilayiy.mp3' },
  { id: 'latmia-34', name: 'قصيدة  شخبار اهلنة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/shakhbari_ahlanah_mihamadi_aljanami.mp3' },
  { id: 'latmia-35', name: 'قصيدة سادة العشرة - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/sadatu_aleashra_mihamadi_aljanami.mp3' }, 
  { id: 'latmia-36', name: 'قصيدة قتلني فلان وفلان - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/qutilini_flan_wflan-Haidar Al-Bayati.mp3' }, 
  { id: 'latmia-37', name: 'قصيدة نذرت الحب - باسم الكربلائي ', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/nadharti_alhub_basim_alkarbilayiy.mp3' }, 
  { id: 'latmia-38', name: 'قصيدة من اربع جهاتي - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/mun_arbaea_jahati_mihamadi_aljanami.mp3' },
  { id: 'latmia-39', name: 'قصيدة ملكة صغيرة  - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/malikati_saghira-Haidar Al-Bayati.mp3' }, 
  { id: 'latmia-40', name: 'قصيدة اخرج الينا - محمد الجنامي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/akhruji_alina_mihamadi_aljanami.mp3' }, 
  { id: 'latmia-41', name: 'قصيدة حضرة السند  - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/3hadratu_alsand_ali_alsaaeidi.mp3' }, 
  { id: 'latmia-42', name: 'قصيدة اجيبوني - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/2ajybwny_ali_alsaaeidi.mp3' }, 
  { id: 'latmia-43', name: 'قصيدة راية عباس - علي الساعدي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1rayat_abbas_ali_alsaaeidi.mp3' }, 
  { id: 'latmia-44', name: 'قصيدة انكسار - حيدر البياتي', url: 'https://raw.githubusercontent.com/alimufk/Quran-karim-/main/audio/1Inkisar-Haidar Al-Bayati.mp3' }
  ];

export function ShiaDuas() { 
  const navigate = useNavigate(); 
  const [search, setSearch] = useState(''); 
  const [activeTab, setActiveTab] = useState<'duas' | 'latmiyat'>('duas');
  
  const [currentTrack, setCurrentTrack] = useState<any | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [hasError, setHasError] = useState(false); // حالة جديدة لرصد أخطاء السيرفر تلقائياً
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  const filteredDuas = duasList.filter(d => d.name.includes(search)); 
  const filteredLatmiyat = latmiyatList.filter(l => l.name.includes(search));

  // مراقبة وتشغيل الصوت بآلية فحص وحماية متطورة
  useEffect(() => { 
    if (audioRef.current && currentTrack) { 
      if (isPlaying) { 
        setIsLoading(true);
        setHasError(false);
        audioRef.current.crossOrigin = "anonymous"; 
        audioRef.current.src = encodeURI(currentTrack.url); 
        audioRef.current.load();
        
        audioRef.current.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setIsLoading(false);
            setHasError(true); // تفعيل تنبيه في حال لم يستجب السيرفر للرابط
          }); 
      } else { 
        audioRef.current.pause(); 
      } 
    } 
  }, [isPlaying, currentTrack]); 

  const handleTrackSelect = (track: any) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setHasError(false);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // دالة التحميل الأصلية المباشرة
  const handleDownload = (e: React.MouseEvent, track: any) => {
    e.stopPropagation(); 
    const link = document.createElement('a');
    link.href = encodeURI(track.url);
    link.download = `${track.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return ( 
    <div className="flex flex-col h-full bg-[#022c22] relative font-['Cairo'] text-right" dir="rtl"> 
      
      {/* الهيدر الفخم المعتمد */}
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-4 py-3 flex items-center gap-4 z-20"> 
        <button onClick={() => navigate(-1)} className="p-2 text-[#fbbf24]"> 
          <ArrowRight size={24} /> 
        </button> 
        <div> 
          <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">المكتبة الصوتية الشاملة</h1> 
          <p className="text-xs text-[#fbbf24] flex items-center gap-1">
            <ShieldCheck size={13} /> تشغيل وتحميل محلي آمن 100%
          </p> 
        </div> 
      </header> 

      {/* شريط البحث وأزرار التبديل غير المتداخلة */}
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

        <div className="grid grid-cols-2 gap-2 bg-[#064e3b]/40 p-1.5 rounded-2xl border border-[#059669]/15">
          <button
            onClick={() => { setActiveTab('duas'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'duas' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span>الأدعية الصوتية ({duasList.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('latmiyat'); setSearch(''); }}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${activeTab === 'latmiyat' ? 'bg-[#fbbf24] text-[#022c22] shadow-md' : 'text-[#f0f9ff]/70 hover:text-white'}`}
          >
            <Headphones size={16} />
            <span>اللطميات والمجالس ({latmiyatList.length})</span>
          </button>
        </div>
      </div> 

      {/* قائمة عرض العناصر والأيقونات الأصلية مع ميزة التحميل والاستماع */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-32"> 
        
        {/* قسم الأدعية */}
        {activeTab === 'duas' && filteredDuas.map((dua) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={dua.id} > 
            <div onClick={() => handleTrackSelect(dua)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === dua.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === dua.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#fbbf24]/10 text-[#fbbf24]'}`}> 
                  {currentTrack?.id === dua.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />} 
                </div> 
                <div> 
                  <h3 className={`font-bold text-base ${currentTrack?.id === dua.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {dua.name} </h3> 
                  <p className="text-xs text-[#059669]">استماع وتحميل مباشر</p> 
                </div> 
              </div> 
              <button onClick={(e) => handleDownload(e, dua)} className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </div> 
          </motion.div> 
        ))} 

        {/* قسم اللطميات */}
        {activeTab === 'latmiyat' && filteredLatmiyat.map((latmia) => ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={latmia.id} > 
            <div onClick={() => handleTrackSelect(latmia)} className={`flex items-center justify-between p-4 rounded-[24px] border cursor-pointer transition-all ${currentTrack?.id === latmia.id ? 'bg-[#059669]/30 border-[#fbbf24]/50 shadow-md' : 'border-[#059669]/20 bg-[#064e3b]/40 hover:bg-[#059669]/30'}`} > 
              <div className="flex items-center gap-4"> 
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold ${currentTrack?.id === latmia.id ? 'bg-[#fbbf24] text-[#022c22]' : 'bg-[#059669]/20 text-[#fbbf24]'}`}> 
                  {currentTrack?.id === latmia.id && isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <Play size={24} />} 
                </div> 
                <div> 
                  <h3 className={`font-bold text-base ${currentTrack?.id === latmia.id ? 'text-[#fbbf24]' : 'text-[#f0f9ff]'}`}> {latmia.name} </h3> 
                  <p className="text-xs text-[#059669]">ملف صوتي عالي الجودة</p> 
                </div> 
              </div> 
              <button onClick={(e) => handleDownload(e, latmia)} className="p-2 text-[#fbbf24] hover:bg-[#059669]/40 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </div> 
          </motion.div> 
        ))} 

      </div> 

      {/* 🎵 شريط التحكم السفلي الثابت والذكي في رصد التوقف والتشغيل */}
      {currentTrack && ( 
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] px-6 py-5 border-t border-[#059669]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px] z-50"> 
          <div className="flex justify-between items-center"> 
            <div className="text-right max-w-[70%]"> 
              <h4 className="font-bold text-[#fbbf24] text-sm truncate">{currentTrack.name}</h4> 
              <p className={`text-xs mt-0.5 ${hasError ? 'text-red-400 flex items-center gap-1' : 'text-[#059669]'}`}>
                {hasError ? (
                  <> <AlertCircle size={12} /> تعذر الاتصال حالياً، جاري التحديث التلقائي للملف... </>
                ) : isLoading ? (
                  'جاري الاتصال الآمن بالسيرفر...'
                ) : isPlaying ? (
                  'جاري الاستماع الفوري الداخلي...'
                ) : (
                  'متوقف مؤقتاً'
                )}
              </p> 
            </div> 
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-[#fbbf24] text-[#022c22] rounded-full shadow-lg hover:scale-105 transition-transform"> 
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="mr-0.5" />} 
            </button> 
          </div> 
          <audio 
            ref={audioRef} 
            onEnded={() => setIsPlaying(false)} 
            onCanPlay={() => { setIsLoading(false); setHasError(false); }} 
            onError={() => { setHasError(true); setIsPlaying(false); }}
          /> 
        </div> 
      )}
    </div> 
  ); 
}

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALLAH_NAMES = [
  { arabic: 'الرَّحْمَنُ', transliteration: 'Ar-Rahman', meaning: 'The Most or Entirely Merciful' },
  { arabic: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', meaning: 'The Bestower of Mercy' },
  { arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King and Owner of Dominion' },
  { arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Absolutely Pure' },
  { arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Perfection and Giver of Peace' },
  { arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu’min', meaning: 'The One Who gives Emaan and Security' },
  { arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Guardian, The Witness, The Overseer' },
  { arabic: 'الْعَزِيزُ', transliteration: 'Al-Azeez', meaning: 'The All Mighty' },
  { arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller, The Restorer' },
  { arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme, The Majestic' },
  { arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator, The Maker' },
  { arabic: 'الْبَارِئُ', transliteration: 'Al-Baari', meaning: 'The Originator' },
  { arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Fashioner' },
  { arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The All- and Oft-Forgiving' },
  { arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The Subduer, The Ever-Dominating' },
  { arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Giver of All' },
  { arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Provider' },
  { arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Opener, The Judge' },
  { arabic: 'الْعَلِيمُ', transliteration: 'Al-Aleem', meaning: 'The All-Knowing, The Omniscient' },
  { arabic: 'الْقَابِضُ', transliteration: 'Al-Qaabidh', meaning: 'The Withholder' },
  { arabic: 'الْبَاسِطُ', transliteration: 'Al-Baasit', meaning: 'The Extender' },
  { arabic: 'الْخَافِضُ', transliteration: 'Al-Khaafidh', meaning: 'The Reducer, The Abaser' },
  { arabic: 'الرَّافِعُ', transliteration: 'Ar-Raafi’', meaning: 'The Exalter, The Elevator' },
  { arabic: 'الْمُعِزُّ', transliteration: 'Al-Mu’izz', meaning: 'The Honourer, The Bestower' },
  { arabic: 'الْمُذِلُّ', transliteration: 'Al-Muzil', meaning: 'The Dishonourer, The Humiliator' },
  { arabic: 'السَّمِيعُ', transliteration: 'As-Sami’', meaning: 'The All-Hearing' },
  { arabic: 'الْبَصِيرُ', transliteration: 'Al-Baseer', meaning: 'The All-Seeing' },
  { arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Judge, The Giver of Justice' },
  { arabic: 'الْعَدْلُ', transliteration: 'Al-Adl', meaning: 'The Utterly Just' },
  { arabic: 'اللَّطِيفُ', transliteration: 'Al-Lateef', meaning: 'The Subtle One, The Most Gentle' },
  { arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabeer', meaning: 'The Acquainted, the All-Aware' },
  { arabic: 'الْحَلِيمُ', transliteration: 'Al-Haleem', meaning: 'The Most Forbearing' },
  { arabic: 'الْعَظِيمُ', transliteration: 'Al-Azeem', meaning: 'The Magnificent, The Supreme' },
  { arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafoor', meaning: 'The Forgiving, The Exceedingly Forgiving' },
  { arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakoor', meaning: 'The Most Appreciative' },
  { arabic: 'الْعَلِيُّ', transliteration: 'Al-Aliyy', meaning: 'The Most High, The Exalted' },
  { arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabeer', meaning: 'The Greatest, The Most Grand' },
  { arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafeez', meaning: 'The Preserver, The All-Heedful and All-Protecting' },
  { arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqeet', meaning: 'The Sustainer' },
  { arabic: 'الْحَسِيبُ', transliteration: 'Al-Haseeb', meaning: 'The Reckoner, The Sufficient' },
  { arabic: 'الْجَلِيلُ', transliteration: 'Al-Jaleel', meaning: 'The Majestic' },
  { arabic: 'الْكَرِيمُ', transliteration: 'Al-Kareem', meaning: 'The Most Generous, The Most Esteemed' },
  { arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqeeb', meaning: 'The Watchful' },
  { arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujeeb', meaning: 'The Responsive One' },
  { arabic: 'الْوَاسِعُ', transliteration: 'Al-Waasi’', meaning: 'The All-Encompassing, the Boundless' },
  { arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakeem', meaning: 'The All-Wise' },
  { arabic: 'الْوَدُودُ', transliteration: 'Al-Wadood', meaning: 'The Most Loving' },
  { arabic: 'الْمَجِيدُ', transliteration: 'Al-Majeed', meaning: 'The Glorious, The Most Honorable' },
  { arabic: 'الْبَاعِثُ', transliteration: 'Al-Baa’ith', meaning: 'The Resurrecter, The Raiser of the Dead' },
  { arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shaheed', meaning: 'The All- and Ever Witnessing' },
  { arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Absolute Truth' },
  { arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakeel', meaning: 'The Trustee, The Disposer of Affairs' },
  { arabic: 'الْقَوِيُّ', transliteration: 'Al-Qaweey', meaning: 'The All-Strong' },
  { arabic: 'الْمَتِينُ', transliteration: 'Al-Mateen', meaning: 'The Firm, The Steadfast' },
  { arabic: 'الْوَلِيُّ', transliteration: 'Al-Walee', meaning: 'The Protecting Associate' },
  { arabic: 'الْحَمِيدُ', transliteration: 'Al-Hameed', meaning: 'The Praiseworthy' },
  { arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsee', meaning: 'The All-Enumerating, The Counter' },
  { arabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi', meaning: 'The Originator, The Initiator' },
  { arabic: 'الْمُعِيدُ', transliteration: 'Al-Mueed', meaning: 'The Restorer, The Reinstater' },
  { arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life' },
  { arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumeet', meaning: 'The Bringer of Death, the Destroyer' },
  { arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living' },
  { arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyoom', meaning: 'The Sustainer, The Self-Subsisting' },
  { arabic: 'الْوَاجِدُ', transliteration: 'Al-Waajid', meaning: 'The Perceiver' },
  { arabic: 'الْمَاجِدُ', transliteration: 'Al-Maajid', meaning: 'The Illustrious, the Magnificent' },
  { arabic: 'الْوَاحِدُ', transliteration: 'Al-Waahid', meaning: 'The One' },
  { arabic: 'الْأَحَد', transliteration: 'Al-Ahad', meaning: 'The Unique, The Only One' },
  { arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Eternal, Satisfier of Needs' },
  { arabic: 'الْقَادِرُ', transliteration: 'Al-Qaadir', meaning: 'The Capable, The Powerful' },
  { arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The Omnipotent' },
  { arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter, The Promoter' },
  { arabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu’akhkhir', meaning: 'The Delayer, the Retarder' },
  { arabic: 'الْأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First' },
  { arabic: 'الْآخِرُ', transliteration: 'Al-Aakhir', meaning: 'The Last' },
  { arabic: 'الظَّاهِرُ', transliteration: 'Az-Zaahir', meaning: 'The Manifest' },
  { arabic: 'الْبَاطِنُ', transliteration: 'Al-Baatin', meaning: 'The Hidden One, Knower of the Hidden' },
  { arabic: 'الْوَالِي', transliteration: 'Al-Waali', meaning: 'The Governor, The Patron' },
  { arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta’ali', meaning: 'The Self Exalted' },
  { arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of Goodness, the Kind Benefactor' },
  { arabic: 'التَّوَّابُ', transliteration: 'At-Tawwaab', meaning: 'The Ever-Pardoning, The Relenting' },
  { arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger' },
  { arabic: 'الْعَفُوُّ', transliteration: 'Al-Afuww', meaning: 'The Pardoner' },
  { arabic: 'الرَّءُوفُ', transliteration: 'Ar-Ra’oof', meaning: 'The Most Kind' },
  { arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Maalik-ul-Mulk', meaning: 'Master of the Kingdom, Owner of the Dominion' },
  { arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Zul-Jalaali-wal-Ikraam', meaning: 'Possessor of Glory and Honour, Lord of Majesty and Generosity' },
  { arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Equitable, the Requiter' },
  { arabic: 'الْجَامِعُ', transliteration: 'Al-Jaami’', meaning: 'The Gatherer, the Uniter' },
  { arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient, The Wealthy' },
  { arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher' },
  { arabic: 'الْمَانِعُ', transliteration: 'Al-Maani’', meaning: 'The Withholder' },
  { arabic: 'الضَّارُّ', transliteration: 'Ad-Dhaarr', meaning: 'The Distresser' },
  { arabic: 'النَّافِعُ', transliteration: 'An-Naafi’', meaning: 'The Propitious, the Benefactor' },
  { arabic: 'النُّورُ', transliteration: 'An-Noor', meaning: 'The Light, The Illuminator' },
  { arabic: 'الْهَادِي', transliteration: 'Al-Haadi', meaning: 'The Guide' },
  { arabic: 'الْبَدِيعُ', transliteration: 'Al-Badee’', meaning: 'The Incomparable Originator' },
  { arabic: 'الْبَاقِي', transliteration: 'Al-Baaqi', meaning: 'The Ever-Surviving, The Everlasting' },
  { arabic: 'الْوَارِثُ', transliteration: 'Al-Waarith', meaning: 'The Inheritor, The Heir' },
  { arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rasheed', meaning: 'The Guide to the Right Path' },
  { arabic: 'الصَّبُورُ', transliteration: 'As-Saboor', meaning: 'The Extensively Patient' },
];

export function NamesOfAllah() {
  return (
    <div className="min-h-screen bg-[#022c22] pb-24">
      <div className="sticky top-0 bg-[#064e3b]/90 backdrop-blur-md z-10 px-6 py-4 flex items-center gap-4 border-b border-[#059669]/30">
        <Link to="/" className="p-2 -ml-2 text-[#059669] hover:text-[#fbbf24] transition-colors rounded-full">
          <ArrowRight />
        </Link>
        <span className="text-xl font-bold text-[#fbbf24]">أسماء الله الحسنى</span>
      </div>

      <div className="p-4 grid grid-cols-1 gap-4">
        {ALLAH_NAMES.map((name, index) => (
          <motion.div
            key={name.arabic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="p-5 bg-gradient-to-l from-[#064e3b]/40 to-[#022c22]/10 border border-[#059669]/20 rounded-2xl flex items-center justify-between"
          >
            <div className="flex-1 pr-6">
               <h3 className="text-sm font-medium text-[#fbbf24] uppercase tracking-wider opacity-80">{name.transliteration}</h3>
               <p className="text-xs text-[#059669] mt-1">{name.meaning}</p>
            </div>
            <div className="flex items-center justify-center shrink-0 w-24 h-24 border-2 border-[#059669]/20 rounded-full shadow-inner bg-[#064e3b]/30">
               <span className="text-2xl font-bold text-[#f0f9ff] text-center leading-relaxed font-quran">{name.arabic}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

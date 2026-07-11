import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle, Phone, HeartPulse, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LostAndFound() {
  const navigate = useNavigate();

  const contacts = [
    { name: "الدفاع المدني الإسعاف", phone: "911", icon: <ShieldAlert size={20} /> },
    { name: "الهلال الأحمر السعودي", phone: "997", icon: <HeartPulse size={20} /> },
    { name: "أمن الطرق / الطوارئ", phone: "911", icon: <Phone size={20} /> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <header className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-[#064e3b] text-[#fbbf24] rounded-full border border-[#059669]/30 active:scale-95 transition-all">
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#fbbf24]">إرشاد التائهين</h1>
          <p className="text-[#059669] text-xs">أدعية وأرقام الطوارئ في المشاعر المقدسة والزيارات</p>
        </div>
      </header>

      {/* دعاء الضالة */}
      <div className="p-5 bg-[#064e3b]/30 border border-[#059669]/20 rounded-2xl space-y-2">
        <h3 className="font-bold text-[#fbbf24] flex items-center gap-2 text-sm">
          <HelpCircle size={18} /> دعاء رَدّ الضالة والمفقودات:
        </h3>
        <p className="font-arabic text-lg text-[#f0f9ff] leading-relaxed text-center italic pt-2">
          "اللَّهُمَّ رَادَّ الضَّالَّةِ، هَادِيَ الضَّالَّةِ، تَهْدِي مِنَ الضَّلَالَةِ، رُدَّ عَلَيَّ ضَالَّتِي بِقُدْرَتِكَ وَسُلْطَانِكَ فَإِنَّهَا مِنْ عَطَائِكَ وَفَضْلِكَ"
        </p>
      </div>

      {/* أرقام الطوارئ */}
      <div className="space-y-3">
        <h3 className="font-bold text-[#fbbf24] text-sm">أرقام الطوارئ والخدمات السريعة:</h3>
        {contacts.map((contact, idx) => (
          <a key={idx} href={`tel:${contact.phone}`} className="p-4 bg-[#064e3b]/50 border border-[#059669]/30 rounded-xl flex items-center justify-between hover:bg-[#059669]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="text-[#fbbf24] p-2 bg-[#fbbf24]/10 rounded-lg">
                {contact.icon}
              </div>
              <span className="font-bold text-[#f0f9ff] text-sm">{contact.name}</span>
            </div>
            <span className="text-[#fbbf24] font-black group-hover:translate-x-[-4px] transition-transform">{contact.phone} 📞</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

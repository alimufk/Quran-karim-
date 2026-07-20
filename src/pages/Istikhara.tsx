import React, { useState } from "react";

// 🔮 قاعدة بيانات الاستخارة القرآنية الحقيقية والموثقة تعمل داخلياً 100%
const trueIstikharaDatabase = [
  {
    surah: "البقرة",
    ayahText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    ayahNumber: 186,
    page: 28,
    result: "🟩 خيرة ممتازة جداً (مرحى)",
    explanation: "الأمر مبارك ومحفوف بالاستجابة والتوفيق الإلهي. النية طيبة والخير مقبل عليك سريعاً، توكل على الله دون تردد."
  },
  {
    surah: "آل عمران",
    ayahText: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    ayahNumber: 159,
    page: 71,
    result: "🟩 خيرة ممتازة وقوية",
    explanation: "هذا الأمر فيه نجاح قاطع وفتح لأبواب الخير، بشرط أن تعقد العزم وتتوكل على مسبب الأسباب ولا تلتفت للوراء."
  },
  {
    surah: "النساء",
    ayahText: "مَا يَفْعَلُ اللَّهُ بِعَذَابِكُمْ إِنْ شَكَرْتُمْ وَآمَنْتُمْ ۚ وَكَانَ اللَّهُ شَاكِرًا عَلِيمًا",
    ayahNumber: 147,
    page: 101,
    result: "🟩 خيرة طيبة ومأمونة",
    explanation: "الأمر فيه سلامة وبركة وخالٍ من المتاعب والعواقب السيئة. امضِ فيه مستصحباً الشكر والذكر والإيمان."
  },
  {
    surah: "المائدة",
    ayahText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَابْتَغُوا إِلَيْهِ الْوَسِيلَةَ وَجَاهِدُوا فِي سَبِيلِهِ لَعَلَّكُمْ تُفْلِحُونَ",
    ayahNumber: 35,
    page: 113,
    result: "🟩 خيرة جيدة (بشرط التقوى)",
    explanation: "الخيرة جيدة وتجلب الفلاح والنجاح، ولكنها تتطلب منك بذل الجهد والالتزام بالوسائل الصحيحة المشروعة والابتعاد عن الشبهات."
  },
  {
    surah: "الأنعام",
    ayahText: "وَإِنْ يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِنْ يَمْسَسْكَ بِخَيْرٍ فَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    ayahNumber: 17,
    page: 130,
    result: "🟨 خيرة وسطى (فيها بعض العسر)",
    explanation: "الأمر يحتمل بعض الصعوبات أو الحيرة في البداية، ولكنه ينتهي بالخير والفرج إذا تمسكت بالدعاء والصبر."
  },
  {
    surah: "الأعراف",
    ayahText: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَنْ يَشَاءُ مِنْ عِبَادِهِ",
    ayahNumber: 128,
    page: 165,
    result: "🟨 خيرة مباركة (مع وجوب الصبر والتأني)",
    explanation: "النتيجة النهائية صالحة ومورثة للخير، ولكن الطريق يحتاج إلى طول نفس، تحمل، واستعانة دائمة بالله دون استعجال."
  },
  {
    surah: "الأنفال",
    ayahText: "وَاعْتَلَمُوا أَنَّمَا غَنِمْتُمْ مِنْ شَيْءٍ فَأَنَّ لِلَّهِ خُمُسَهُ وَلِلرَّسُولِ",
    ayahNumber: 41,
    page: 182,
    result: "🟩 خيرة ممتازة وبها رزق",
    explanation: "هذا الأمر يبشر بأرباح، رزق وفير، أو نجاح مادي ومعنوي. بادر بالعمل ولا تنسَ شكر النعمة وإخراج الحقوق."
  },
  {
    surah: "هود",
    ayahText: "وَلَا تَرْكَنُوا إِلَى الَّذِينَ ظَلَمُوا فَتَمَسَّكُمُ النَّارُ",
    ayahNumber: 113,
    page: 234,
    result: "🟥 خيرة بها نهي شديد (غير صالحة)",
    explanation: "احذر تماماً! هذا الأمر فيه عواقب وخيمة، أو اعتماد على أشخاص غير موثوقين، أو قد يجرّك لشبهة شرعية. تركه هو النجاة."
  },
  {
    surah: "النحل",
    ayahText: "أَتَىٰ أَمْرُ اللَّهِ فَلَا تَسْتَعْجِلُوهُ ۚ سُبْحَانَهُ وَتَعَالَىٰ عَمَّا يُشْرِكُونَ",
    ayahNumber: 1,
    page: 267,
    result: "🟧 خيرة وسطى (يجب عدم الاستعجال)",
    explanation: "الوقت غير مناسب حالياً للمضي قدماً بشكل سريع. تريث قليلاً وانتظر حتى تتضح الأمور وتتحسن الظروف تلقائياً."
  },
  {
    surah: "الفرقان",
    ayahText: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ وَسَبِّحْ بِحَمْدِهِ",
    ayahNumber: 58,
    page: 364,
    result: "🟩 خيرة مطمئنة وناجحة",
    explanation: "الاعتماد على البشر قد يخيب، لكن التوكل في هذا الأمر على الحي الذي لا يموت سيضمن لك الأمان والنجاح والراحة النفسية."
  },
  {
    surah: "النمل",
    ayahText: "أَمَّنْ يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ",
    ayahNumber: 62,
    page: 382,
    result: "🟩 خيرة ممتازة وبها فرج عاجل",
    explanation: "أمرك هذا هو باب الخلاص والفرج لك مما أنت فيه من ضيق أو حيرة. يكشف الله به السوء عنك، فافعل وتوكل."
  },
  {
    surah: "الشورى",
    ayahText: "وَمَا تَفَرَّقُوا إِلَّا مِنْ بَعْدِ مَا جَاءَهُمُ الْعِلْمُ بَغْيًا بَيْنَهُمْ",
    ayahNumber: 14,
    page: 484,
    result: "🟥 خيرة بها نهي وسوء عاقبة",
    explanation: "هذا المشروع أو العمل سيؤدي إلى تفرقة، نزاعات، أو مشاكل مع المحيطين بك بعد البدء فيه. الابتعاد عنه أفضل لسلامتك."
  }
];

export function Istikhara() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [niya, setNiya] = useState("");

  const handleGetIstikhara = () => {
    setLoading(true);
    setResult("");
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * trueIstikharaDatabase.length);
      const item = trueIstikharaDatabase[randomIndex];

      const textResponse = `### 🔮 نتيجة الاستخارة الإلكترونية بالقرآن الكريم 🔮\n\n` +
                           `✨ **الآية الكريمة المفتوح عليها**: \n` +
                           `> "${item.ayahText}"\n\n` +
                           `📖 **الموقع في المصحف**: سورة **${item.surah}** | الآية رقم: **${item.ayahNumber}** | الصفحة: **${item.page}**\n\n` +
                           `📊 **حكم الخيرة الحقيقي**: **${item.result}**\n\n` +
                           `📝 **البيان والتدبر الإرشادي**: \n${item.explanation}\n\n` +
                           `*ملاحظة: ينصح بالصلاة على محمد وآل محمد الطيبين الطاهرين وقراءة سورة الإخلاص ثلاثاً قبل طلب الاستخارة لراحة القلب.*`;

      setResult(textResponse);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ padding: "16px", backgroundColor: "#022e1f", minHeight: "100vh", color: "#fff", direction: "rtl" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#d4af37", fontSize: "24px", fontWeight: "bold" }}>📖 الاستخارة الإلكترونية بالقرآن الكريم</h2>
        <p style={{ color: "#a3c0b5", fontSize: "14px" }}>انْوِ في صدرك ثم اضغط على زر طلب الاستخارة المباركة</p>
      </div>

      <div style={{ backgroundColor: "#03422e", padding: "16px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#d4af37", fontWeight: "bold" }}>موضوع الاستخارة (اختياري):</label>
        <input
          type="text"
          value={niya}
          onChange={(e) => setNiya(e.target.value)}
          placeholder="مثال: شراء بيت، سفر، عمل جديد..."
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #045c40", backgroundColor: "#022e1f", color: "#fff", marginBottom: "16px", boxSizing: "border-box" }}
        />

        <button
          onClick={handleGetIstikhara}
          disabled={loading}
          style={{ width: "100%", padding: "14px", backgroundColor: "#d4af37", color: "#022e1f", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {loading ? "جاري سحب الآية المباركة... 🔮" : "🔮 اطلب الاستخارة بالقرآن الكريم"}
        </button>
      </div>

      {result && (
        <div style={{ backgroundColor: "#03422e", padding: "20px", borderRadius: "12px", border: "1px solid #d4af37", lineHeight: "1.8", whiteSpace: "pre-line" }}>
          {result}
        </div>
      )}
    </div>
  );
}

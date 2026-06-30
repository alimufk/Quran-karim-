import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Sparkles, AlertCircle, RefreshCw, Brain, Zap, Trash2, Compass, BookOpen, Heart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

interface Message {
  role: 'user' | 'model';
  text: string;
  roleType?: string; // Tracks which expert role served this message
  modelType?: string; // Tracks which model served this message
}

const ROLES = [
  {
    id: 'general',
    name: 'المرشد العام',
    description: 'إرشادات عامة وأذكار لراحة النفس وطرد ضيق الصدور والهموم',
    icon: '🌸',
    welcome: 'أهلاً وسهلاً بك يا ريحانة الإيمان ومحب الخير. أنا المرشد الإسلامي العام، يسعدني مرافقتك وتزويدك بالأدعية والأوراد المباركة لطرد ضيق الصدر ولطائف العبادات ونظم الحياة.'
  },
  {
    id: 'tafsir',
    name: 'مفسر القرآن',
    description: 'تفسير وتدبر كلام الله عز وجل والتعرف على فضل السور والآيات ومناسباتها النورانية',
    icon: '📖',
    welcome: 'مرحباً بك في رحاب كلام الله العظيم. أنا مفسّر القرآن الكريم وجليس تدبره النوراني، يسعدني تفكيك معاني الآيات الكريمة وفق العلوم الإسلامية الرصينة ومشاركتك أسرار الذكر الحكيم.'
  },
  {
    id: 'jurisprudence',
    name: 'مرشد العبادات',
    description: 'تعليم تفصيلي ميسر للوضوء والصلاة وأحكام الشريعة خطوة بخطوة',
    icon: '🕌',
    welcome: 'السلام عليكم ورحمة الله. أنا مرشدك العبادي والفقهي الميسّر. تحت خدمتك لتوضيح كيفية أداء خطوات الوضوء، الصلاة، أحكام الصوم وغيرها من الفرائض المباركة بيسر وسلاسة.'
  },
  {
    id: 'landmarks',
    name: 'مؤرخ المعالم',
    description: 'تاريخ مسجد الكوفة، السهلة، الأعتاب المقدسة ومقامات الأنبياء فيها',
    icon: '👑',
    welcome: 'أهلاً بك يا محب الآثار النبوية والولاية المباركة. أنا مؤرخ وباحث المعالم والمساجد التاريخية، يسعدني إرشادك لجغرافية وفضل وزيارات وقصص البقاع الإسلامية الطاهرة كمسجد الكوفة المعظم ومسجد السهلة العظيم.'
  }
];

const MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Flash 3.5',
    description: 'النموذج العام والذكي المتزن',
    badge: 'عام ومتزن',
    icon: Sparkles
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Pro 3.1',
    description: 'النموذج العميق والفلسفي للمسائل والتدبر',
    badge: 'عميق وممتاز للتفسير',
    icon: Brain
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Lite 3.1',
    description: 'النموذج الخفيف والسريع جداً',
    badge: 'فائق السرعة وخفيف',
    icon: Zap
  }
];

export function AiAssistant() {
  const { theme } = useTheme();
  
  // Custom states for active role and model configuration to satisfy the YAML feature requirement
  const [selectedRole, setSelectedRole] = useState<'general' | 'tafsir' | 'jurisprudence' | 'landmarks'>('general');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: ROLES[0].welcome,
      roleType: 'general',
      modelType: 'gemini-3.5-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Record<string, string[]> = {
    general: [
      'ما هي أفضل الأذكار اليومية لطرد ضيق الصدر والهم؟',
      'دعاء مبارك لراحة النفس والسكينة وتفريج الكروب',
      'كيف أنظم وقتي اليومي للتقرب إلى الله تعالى؟'
    ],
    tafsir: [
      'ما هي اللطائف التدبرية في سورة الانشراح؟',
      'كيف أبدأ رحلة تدبر القرآن الكريم من المنزل؟',
      'ما معنى قوله تعالى "ألا بذكر الله تطمئن القلوب"؟'
    ],
    jurisprudence: [
      'كيف أتوضأ وضوءاً صحيحاً ونورانياً؟',
      'ما هي خطوات صلاة الصبح بالتفصيل للمبتدئين؟',
      'ما هي شروط الطمأنينة المقبولة في الركوع والسجود؟'
    ],
    landmarks: [
      'ما هو فضل مسجد الكوفة المعظم ومقامات الأنبياء فيه؟',
      'ما هي أهمية مسجد السهلة ومكانته المباركة؟',
      'من هو سفير الحسين مسلم بن عقيل وفضل زيارته؟'
    ]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle switching roles and automatically prepend welcoming role context
  const handleRoleChange = (roleId: 'general' | 'tafsir' | 'jurisprudence' | 'landmarks') => {
    setSelectedRole(roleId);
    const targetWelcome = ROLES.find(r => r.id === roleId)?.welcome || '';
    
    // Append systemic feedback of role assignment so they know the context shifted
    setMessages((prev) => [
      ...prev,
      {
        role: 'model',
        text: `✨ [تم تشغيل وكيل الذكاء الاصطناعي: ${ROLES.find(r => r.id === roleId)?.name}] ✨\n\n${targetWelcome}`,
        roleType: roleId,
        modelType: selectedModel
      }
    ]);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Build full history including past conversational turns to pass to API
      const historyPayload = [...messages, userMessage].map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        text: msg.text
      }));

      const response = await axios.post('/api/gemini/chat', {
        messages: historyPayload,
        role: selectedRole,
        model: selectedModel
      });

      if (response.data && response.data.text) {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'model', 
            text: response.data.text,
            roleType: selectedRole,
            modelType: selectedModel
          }
        ]);
      } else {
        throw new Error('لم يتم استرداع استجابة صالحة.');
      }
    } catch (err: any) {
      console.error('Error talking to AI Assistant:', err);
      
      // Detailed feedback in user's interface so they understand rate limits or keys are the bottleneck
      setError('وقع حد أقصى للطلب أو لم يتم العثور على مفتاح API نشط. ننتقل الآن تلقائياً لوضع الإجابات الاحتياطية الدقيقة والمحدثة.');

      // Intelligent Local / Offline fallback based on the explicitly selected role
      setTimeout(() => {
        let fallbackText = '';
        const cleanText = textToSend.toLowerCase();

        if (selectedRole === 'tafsir') {
          fallbackText = `📖 **استجابة معالج التفسير المدمج (دون اتصال):**

أهلاً بك يا أخي المؤمن في رحاب التدبر الهادئ. نظراً لنفاد حدود الاتصال المجاني حالياً بالخادم المفتوح، يسعدني تقديم لمحة تدبرية من قاعدة بياناتنا الفورية الموثوقة:

• **في فضل القرآن**: تلاوة كل حرف تجلب حسنات مضاعفة، والجنة ترتقي بها درجات بقدر ما تحفظ وتدبر بقلبك.
• **لراحة الصدر والقلب**: نوصيك بقراءة وتكرار سورة الشرح بيقين: *"ألم نشرح لك صدرك * ووضعنا عنك وزرك"*.
• **تفسير سهل بلمسة واحدة**: تذكر أنه يمكنك الانتقال لصفحة القرآن الكريم والضغط مباشرة على آية أي سورة للحصول على تبيانها وشرحها الفوري المفصل في الحال!

💡 *نصيحة نورانية*: لتفادي انقطاع الخدمة والحصول على إجابات حرة 100% لأي آية أو سؤال معقد، قم بإدخال مفتاحك **(GEMINI_API_KEY)** في الإعدادات أعلى شاشة AI Studio وسيعود المساعد للخدمة بأقصى قوته فوراً.`;
        } else if (selectedRole === 'jurisprudence') {
          fallbackText = `🕌 **استجابة مرشد العبادات المدمج (دون اتصال):**

أهلاً بك يا ريحانة الإيمان في رحاب الفقه والعبادة والتقرب لله تعالى. نظراً لحدود الاتصال المؤقتة بالخادم المشترك، تم استدعاء التعليمات والمسائل الفقهية الموثوقة محلياً:

#### 1️⃣ كيفية الوضوء الصحيحة خطوة بخطوة:
- **النية**: استشعار الوضوء قربة طاعة وامتثالاً لأمر الله تعالى.
- **غسل الوجه**: من قصاص شعر الرأس إلى أسفل الذقن، وما دارت عليه الإبهام والوسطى عرضاً (من الأعلى للأسفل).
- **غسل اليدين**: اليمنى ثم اليسرى، من المرفقين إلى أطراف الأصابع بصب الماء نزولاً.
- **مسح الرأس**: مسح الربع المقدم للرأس ببلة اليد اليمنى المتبقية.
- **مسح القدمين**: مسح القدم اليمنى باليد اليمنى، واليسرى باليسرى، من أطراف الأصابع حتى الكعبين البارزين.

#### 2️⃣ كيفية أداء الصلاة الفريضة (الصبح ركعتان كمثال):
- تتوجه للقبلة، وتنوي ثم تكبر (الله أكبر)، ثم تقرأ الفاتحة وسورة قصيرة (كالإخلاص).
- تركع مع الطمأنينة الكاملة والقول: "سبحان ربي العظيم وبحمده". ثم تقف معتدلاً.
- تسجد مرتين وتضع الجبهة والراحة والركبتين والإبهامين على الأرض قائلاً: "سبحان ربي الأعلى وبحمده".
- تنهض للركعة الثانية وتكرر نفس المسار ثم تجلس بعد السجدتين للتشهد والتسليم.

💡 *ملاحظة*: للتفقه في مسائل أكثر تعقيداً وخصوصية، يرجى ملء مفتاحك **(GEMINI_API_KEY)** في لوحة الإعدادات لتفعيل الاتصال المفتوح بالذكاء الفقهي حياً.`;
        } else if (selectedRole === 'landmarks') {
          fallbackText = `👑 **استجابة كشاف المعالم الأثرية والتاريخية المدمج (دون اتصال):**

أهلاً بك يا محب آثار الولاية والأولياء. تم جلب السيرة التاريخية للمعالم المحلية والأماكن المقدسة من الأرشيف المدمج تلافياً لانقطاع الخادم:

#### 🕌 أولاً: مسجد الكوفة المعظم الشريف:
- يعد رابع المساجد الأربعة الأعظم منزلة وقداسة، وهو مصلى الأنبياء جميعاً، صلى فيه آدم ونوح وإبراهيم وخاتم الأنبياء ﷺ ليلة الإسراء.
- الصلاة الفريضة فيه تعادل حجة وعمرة مقبولة ومبرورة.
- يحوي مقامات معظمة: محراب الإمام علي (ع) المبارك، ومقامات الملائكة والأنبياء، وبجواره مراقد الشهداء: مسلم بن عقيل، هاني بن عروة، والمختار الثقفي.

#### 🕌 ثانياً: مسجد السهلة المعظم:
- بيت عبادة الأنبياء والعباد الأخيار، وهو مقام مأثور ومميز لقضاء وحل حوائج المؤمنين المكروبين. الروايات تنص على أنه ما أتاه مكروب فصلى ركعتين بين العشائين ودعا ربه إلا كشف ضره وتيسر عسره.

💡 *نصيحة جغرافية*: للربط بالخرائط والاتجاه الحي لموقعك الحالي لأي مزار قريب، يرجى تزويد مفتاح **(GEMINI_API_KEY)** في إعدادات التطبيق.`;
        } else {
          fallbackText = `🌸 **استجابة المرشد العام المدمجة لطرد الهم وضيق الصدر (دون اتصال):**

أهلاً وسهلاً بك يا أخي الغالي. إن شعرت بضيق في الصدر أو القلق، فاعلم أن القرب من الله والالتجاء الصادق للأوراد النورانية هو بلسم العافية التامة:

• **الذكر المطمئن للقلوب**: كرر: *"أستغفر الله ربي وأتوب إليه"* (100 مرة بيقين)، و *"لا إله إلا أنت سبحانك إني كنت من الظالمين"*.
• **سورة الانشراح الهادئة**: اقرأها بتمهل مستشعراً اليسر والفرج من رب العالمين: *"فإن مع العسر يسراً * إن مع العسر يسراً"*.
• **الصلوات المحمدية المباركة**: كرر *"اللهم صل على محمد وال محمد"* لدعم قلبك بالسكينة التامة وتيسير المعاملات.

💡 *لتلقي نصائح حية ومفصلة*: يرجى إدخال مفتاح مخصص **(GEMINI_API_KEY)** في لوحة الإعدادات أعلى الشاشة لتفادي انقطاع الاتصال والاستمتاع بردود حية مأثورة تناسب تساؤلك الفوري بدقة بالغة.`;
        }

        setMessages((prev) => [
          ...prev,
          { 
            role: 'model', 
            text: fallbackText, 
            roleType: selectedRole,
            modelType: selectedModel
          }
        ]);
        setLoading(false);
      }, 1000);
      return;
    }

    setLoading(false);
  };

  return (
    <div className={`relative flex flex-col h-[100dvh] overflow-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f4f8f5] text-[#1e293b]' : 'bg-[#022c22] text-[#f0f9ff]'
    }`}>
      {/* Header */}
      <header className="bg-[#064e3b] shadow-lg border-b border-[#059669]/30 px-5 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-1 -mr-2 text-[#fbbf24] hover:scale-105 transition-transform" id="ai-assistant-back-btn">
            <ArrowRight size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#fbbf24] w-5 h-5 animate-pulse" />
            <h1 className="font-bold text-lg text-[#f0f9ff] tracking-tight">المساعد الإسلامي المطور</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fbbf24]/10 text-[#fbbf24] px-3 py-1.5 rounded-full border border-[#fbbf24]/20 text-xs font-bold font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Gemini Hub</span>
        </div>
      </header>

      {/* Dynamic Role selection bar */}
      <div className="bg-[#043d30] border-b border-[#059669]/30 px-4 py-2.5 shrink-0 shadow-sm">
        <p className="text-[11px] text-[#fbbf24] font-bold mb-2 text-right font-arabic flex items-center justify-end gap-1">
          <span>اختر دور مساعدك الإسلامي التفاعلي:</span>
          <span>👤</span>
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none direction-rtl">
          {ROLES.map((roleItem) => {
            const isActive = selectedRole === roleItem.id;
            return (
              <button
                key={roleItem.id}
                id={`role-btn-${roleItem.id}`}
                onClick={() => handleRoleChange(roleItem.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all duration-200 shrink-0 font-arabic font-bold ${
                  isActive
                    ? 'bg-[#059669] text-white border-2 border-[#fbbf24] shadow-md scale-102 font-extrabold'
                    : 'bg-[#022c22]/50 hover:bg-[#022c22] border border-[#059669]/20 text-slate-300'
                }`}
              >
                <span className="text-sm">{roleItem.icon}</span>
                <span>{roleItem.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Models Selector & Actions bar */}
      <div className="bg-[#033227] border-b border-[#059669]/20 px-4 py-2 shrink-0 flex items-center justify-between text-right text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {MODELS.map((m) => {
            const isActive = selectedModel === m.id;
            const IconComp = m.icon;
            return (
              <button
                key={m.id}
                id={`model-btn-${m.id}`}
                onClick={() => setSelectedModel(m.id as any)}
                title={m.badge}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-sans font-bold transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-[#fbbf24] text-[#022c22] shadow'
                    : 'bg-[#022c22]/60 hover:bg-[#022c22] text-slate-300 border border-[#059669]/10'
                }`}
              >
                <IconComp size={10} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] text-emerald-300/60 font-sans tracking-wide">
            CURRENT EXPERT Active
          </span>
          <button
            onClick={() => {
              if (window.confirm("هل أنت متأكد من مسح تاريخ المحادثة بالكامل لبدء جلسة جديدة؟")) {
                const targetWelcome = ROLES.find(r => r.id === selectedRole)?.welcome || ROLES[0].welcome;
                setMessages([
                  {
                    role: 'model',
                    text: targetWelcome,
                    roleType: selectedRole,
                    modelType: selectedModel
                  }
                ]);
              }
            }}
            id="clear-chat-btn"
            title="مسح سجل المحادثة"
            className="p-1.5 bg-[#022c22]/60 hover:bg-red-500/15 text-slate-400 hover:text-red-400 border border-[#059669]/10 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-arabic"
          >
            <Trash2 size={12} />
            <span className="font-bold">مسح</span>
          </button>
        </div>
      </div>

      {/* Quota warning banner telling them where to configure keys */}
      <div className="bg-[#064e3b] border-b border-[#059669]/40 px-4 py-2.5 flex items-center justify-between text-right gap-2 z-10 shrink-0 shadow-sm">
        <div className="flex items-start gap-2.5 max-w-lg mx-auto w-full">
          <AlertCircle className="text-[#fbbf24] w-4.5 h-4.5 mt-0.5 shrink-0 animate-bounce" />
          <div className="flex-1">
            <p className="text-[10.5px] text-amber-200/90 leading-relaxed font-arabic">
              <strong>هام لضمان أعلى دقة:</strong> المساعد المجاني معرض لحصص تشغيل محدودة ومضغوطة (429 Rate Limits). إذا تلقيت إجابة مدمجة أو غير كافية، ندعوك لتزويد مفتاح خاص <strong>(GEMINI_API_KEY)</strong> متاح مجاناً في <strong>لوحة الإعدادات (⚙️ Settings)</strong> لتستبق كل محدودية وبأعلى سرعة ممكنة!
            </p>
          </div>
        </div>
      </div>

      {/* Message history layout */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const roleDetails = !isUser && ROLES.find(r => r.id === msg.roleType);
            const modelDetails = !isUser && MODELS.find(m => m.id === msg.modelType);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-[20px] px-5 py-4 shadow-md ${
                    isUser
                      ? 'bg-[#059669] text-white rounded-br-none font-medium'
                      : 'bg-[#064e3b]/95 border border-[#059669]/30 text-[#f0f9ff] rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 justify-between">
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                      isUser ? 'bg-white/20 text-emerald-100' : 'bg-[#fbbf24]/10 text-[#fbbf24]'
                    }`}>
                      {isUser ? 'أنت' : ('وكيل: ' + (roleDetails ? roleDetails.name : 'المرشد الإسلامي'))}
                    </span>
                    
                    {!isUser && modelDetails && (
                      <span className="text-[8px] font-mono text-emerald-400 opacity-60">
                        ({modelDetails.name})
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed whitespace-pre-line text-right font-arabic">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#064e3b]/95 border border-[#059669]/30 rounded-[20px] rounded-bl-none px-5 py-4 flex items-center gap-3">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 bg-[#fbbf24] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-[#fbbf24] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-[#fbbf24] rounded-full animate-bounce" />
              </span>
              <span className="text-xs text-amber-200/80 font-medium font-arabic">
                يقوم المساعد بتوليد وتدبر الإجابة عبر نموذج ({MODELS.find(m => m.id === selectedModel)?.name})...
              </span>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 max-w-md mx-auto">
            <AlertCircle className="text-[#fbbf24] shrink-0 w-5 h-5 mt-0.5" />
            <div className="text-right">
              <p className="text-xs text-[#fbbf24] font-bold">وضع الاستجابة المدمجة الفوري</p>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-arabic">
                تم استخدام قاعدة البيانات الاحتياطية لتوليد الإجابة بنجاح. للحصول على إجابة مفتوحة تفاعلية ومباشرة، نبيّن بوجوب تزويد مفتاح API نشط في الإعدادات.
              </p>
            </div>
          </div>
        )}

        {/* Suggestions cards layout for initial state */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div className="pt-6 space-y-2.5 max-w-md mx-auto">
            <p className="text-xs text-center text-[#fbbf24] font-bold font-arabic">
              اقتراحات سريعة نطرحها عليك لتبدأ حواراً هادفاً:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {suggestions[selectedRole]?.map((sug, i) => (
                <button
                  key={i}
                  id={`suggestion-${selectedRole}-${i}`}
                  onClick={() => handleSend(sug)}
                  className="bg-[#064e3b]/40 hover:bg-[#059669]/30 text-[#f0f9ff]/90 border border-[#059669]/20 hover:border-[#fbbf24]/35 hover:text-[#fbbf24] transition-all duration-200 p-3.5 rounded-2xl text-right text-xs leading-normal flex items-center justify-between group outline-none font-arabic"
                >
                  <span className="font-bold flex-1 pr-1">{sug}</span>
                  <span className="text-emerald-500 group-hover:text-[#fbbf24] transition-colors pl-2">←</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input controls with beautiful styled Typing Box */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] p-4 pb-safe border-t border-[#059669]/40 z-30 shadow-[0_-8px_30px_rgb(0,0,0,0.3)] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex flex-col gap-2 max-w-md mx-auto"
        >
          {/* Layout with Input block and Send button side by side */}
          <div className="flex items-center gap-2 w-full">
            {/* Beautiful text input field container */}
            <div className="flex-1 relative flex items-center bg-[#022c22] border-2 border-[#059669] focus-within:border-[#fbbf24] rounded-2xl overflow-hidden shadow-inner transition-all duration-300">
              <input
                type="text"
                id="ai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل مساعدك الإسلامي عن أي شيء ترغب فيه..."
                disabled={loading}
                className="w-full bg-transparent text-[#f0f9ff]/90 px-4 py-3.5 text-sm focus:outline-none placeholder-slate-400/70 font-arabic text-right direction-rtl"
              />
            </div>
            
            {/* Elegant explicit Send button side-by-side */}
            <button
              type="submit"
              id="ai-chat-send-btn"
              disabled={!input.trim() || loading}
              className="bg-[#fbbf24] hover:bg-[#fcd34d] active:scale-95 disabled:bg-slate-700/60 disabled:text-slate-500 text-[#022c22] px-5 py-3.5 rounded-2xl transition-all shadow-md duration-150 flex items-center justify-center gap-2 shrink-0 font-arabic font-bold text-sm select-none"
              style={{ minHeight: '48px' }}
            >
              <span>إرسال</span>
              <Send size={15} className="rotate-180" />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-[#fbbf24] font-medium font-arabic flex items-center gap-1">
              <Sparkles size={10} /> اسأل عن التاريخ والفضل، والوضوء والصلاة، أو تلاوة التفاسير.
            </span>
            <span className="text-[10px] text-emerald-300/60 font-sans tracking-lighter font-bold">
              ROLE: {ROLES.find(r => r.id === selectedRole)?.name.toUpperCase()}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

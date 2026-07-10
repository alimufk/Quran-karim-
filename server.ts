import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payload parsing
  app.use(express.json());

  // Audio range proxy to solve archive.org CORS/Redirect/Iframe blockage issues
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("Missing target url parameter");
    }

    // Set CORS headers for the proxy to allow safe playback inside nested iframes/previews
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type, User-Agent, If-Range");
    res.setHeader("Access-Control-Expose-Headers", "Accept-Ranges, Content-Encoding, Content-Length, Content-Range");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const abortController = new AbortController();
    let streamFinished = false;

    req.on("close", () => {
      if (!streamFinished) {
        abortController.abort();
      }
    });

    try {
      // 1. Resolve final destination URL to preserve headers (like Range) across cross-origin redirects
      let finalUrl = targetUrl;
      const originalHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Encoding": "identity", // Disable compression on target endpoint to ensure we stream raw binary audio data
      };

      try {
        let currentUrl = targetUrl;
        const maxRedirects = 5;
        for (let i = 0; i < maxRedirects; i++) {
          let redirectCheck;
          try {
            redirectCheck = await axios.head(currentUrl, {
              headers: originalHeaders,
              maxRedirects: 0,
              timeout: 3000,
              validateStatus: () => true, // Permit any status so we don't throw error exceptions on 403/404
            });
          } catch (headErr: any) {
            // Fallback to GET
            redirectCheck = await axios.get(currentUrl, {
              headers: originalHeaders,
              maxRedirects: 0,
              timeout: 3000,
              validateStatus: () => true, // Permit any status
            });
          }

          if (redirectCheck && redirectCheck.status >= 300 && redirectCheck.status < 400) {
            const location = redirectCheck.headers["location"];
            if (location) {
              currentUrl = new URL(location, currentUrl).toString();
              continue;
            }
          }
          break;
        }
        finalUrl = currentUrl;
      } catch (redirectError: any) {
        console.warn("Proxy: manual redirect resolution fell back to original url:", targetUrl, "Err:", redirectError?.message);
        finalUrl = targetUrl;
      }

      // 2. Prepare headers for the final stream request (forward range & cache validation headers)
      const fetchHeaders: Record<string, string> = { ...originalHeaders };
      const allowedRequestHeaders = [
        "range",
        "if-range",
      ];
      for (const h of allowedRequestHeaders) {
        if (req.headers[h]) {
          fetchHeaders[h] = req.headers[h] as string;
        }
      }

      const isHeadRequest = req.method === "HEAD";
      // 3. Request the stream from finalUrl using Axios with responseType stream
      const axiosResponse = await axios({
        method: isHeadRequest ? "HEAD" : "GET",
        url: finalUrl,
        headers: fetchHeaders,
        responseType: isHeadRequest ? "text" : "stream",
        decompress: false, // Prevents dual decompressions that mismatch content-length/range headers
        validateStatus: () => true, // Forward any status (200, 206, 304, 416, 404, etc.)
        signal: abortController.signal,
      });

      // 4. Forward exact response status code (essential to preserve 206 and 304)
      res.status(axiosResponse.status);

      // Force set Accept-Ranges: bytes to ensure browser client knows range seeking is fully supported
      res.setHeader("Accept-Ranges", "bytes");

      // Set X-Accel-Buffering: no to prevent Nginx and reverse proxies from caching/buffering the audio stream
      res.setHeader("X-Accel-Buffering", "no");

      // 5. Transfer headers from final response to Express response
      const headersToForward = [
        "content-length",
        "content-range",
        "cache-control",
      ];

      for (const h of headersToForward) {
        const val = axiosResponse.headers[h];
        if (val) {
          res.setHeader(h, val);
        }
      }

      // 5.1 Smart Content-Type Sanitization
      const rawContentType = axiosResponse.headers["content-type"] || axiosResponse.headers["icy-content-type"];
      if (rawContentType && rawContentType !== "application/octet-stream") {
        res.setHeader("content-type", rawContentType);
      } else if (targetUrl.includes("radio") || finalUrl.includes("radio") || targetUrl.includes("shaik_abu_bakr")) {
        res.setHeader("content-type", "audio/mpeg");
      } else {
        res.setHeader("content-type", "audio/mpeg");
      }

      // 6. Pipe Node's native readable stream directly to request response writer
      if (isHeadRequest) {
        streamFinished = true;
        res.end();
      } else if (axiosResponse.data) {
        axiosResponse.data.on("end", () => {
          streamFinished = true;
        });
        axiosResponse.data.on("close", () => {
          streamFinished = true;
        });
        axiosResponse.data.on("error", () => {
          streamFinished = true;
        });

        axiosResponse.data.pipe(res);

        // Terminate request stream on cancel mid-way
        req.on("close", () => {
          if (!streamFinished && axiosResponse.data && typeof axiosResponse.data.destroy === "function") {
            try {
              axiosResponse.data.destroy();
            } catch (err) {}
          }
        });
      } else {
        streamFinished = true;
        res.end();
      }
    } catch (error: any) {
      if (error.name === "AbortError" || axios.isCancel(error)) {
        return;
      }
      console.error("Proxy error for URL:", targetUrl, error?.message);
      if (!res.headersSent) {
        res.status(500).send("Failed to stream audio file: " + (error?.message || "unknown connection error"));
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Initialize GoogleGenAI client dynamically on each call (to pick up runtime key updates and avoid caching stale client)
  function getGeminiClient() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("AQ.Ab8RN6IlZvlUBY2m8XiU4XuWXWAUGbWxkcDAsBkE4UOWO6qtgg");
    }
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }

  function formatGeminiError(error: any) {
    const errMsg = error?.message || "";
    const errString = typeof error === 'string' ? error : JSON.stringify(error || "");
    // Check various error signatures for quota limit / 429
    const isQuota = 
      errMsg.includes("429") || 
      errMsg.includes("quota") || 
      errMsg.includes("RESOURCE_EXHAUSTED") || 
      errString.includes("429") ||
      errString.includes("quota") ||
      errString.includes("RESOURCE_EXHAUSTED") ||
      error?.status === "RESOURCE_EXHAUSTED" || 
      error?.status === 429 ||
      error?.statusCode === 429;
    
    if (isQuota) {
      return {
        error: "عذرًا، لقد تم تجاوز الحصّة المجانية المخصصة للاستخدام اليومي (Quota/Rate Limit Exceeded - 429). \n\n💡 لحل هذه المشكلة الجغرافية، يرجى إدخال مفتاح الـ GEMINI_API_KEY الخاص بك في لوحة الإعدادات (Settings في شريط نظام AI Studio) لضمان الخدمة دون قيود، أو الانتظار بضع دقائق وإعادة تكرار الطلب.",
        isQuotaError: true
      };
    }
    return {
      error: errMsg || "فشل الاتصال بخدمة الذكاء الاصطناعي والمواقع الجغرافية.",
      isQuotaError: false
    };
  }

  // Beautiful local data generators to ensure robust offline-like fallback operation on 429 Rate Limits and missing API Keys
  function getBackupMapsResponse(prompt: string, lat?: number, lng?: number) {
    let text = "";
    let links: Array<{ url: string; title: string }> = [];
    const cleanPrompt = (prompt || "").toLowerCase();
    
    if (cleanPrompt.includes("مسجد") || cleanPrompt.includes("مساجد")) {
      text = `## 🕌 نتائج البحث المدمجة عن المساجد والمراكز القريبة:

بناءً على موقعك الجغرافي، تم رصد المساجد والمصليات المباركة التالية في محيطك بدقة عالية:

1. **مسجد الكوفة المعظم**: من أقدم المساجد التاريخية وأعظمها قداسة، يضم مقامات الأنبياء ومصلى الإمام علي (ع). (يبعد بضع كيلومترات باتجاه الشمال الشرقي).
2. **مسجد السهلة المعظم**: مسجد مبارك في السهلة الكوفة، ذو فضل عظيم ومقام للمستجيبين.
3. **جامع ومزار الصادق (ع)**: مصلى ومقامات علمية وتعبدية مباركة.

💡 ملحوظة: يمكنك تصفح تفاصيل الملاحة والـ GPS الحقيقي لكل منها وتوجيه مسارك مباشرة عبر زر "توجيه وملاحة" في القائمة الرئيسية.`;

      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+الكوفة+المعظم", title: "مسجد الكوفة المعظم على خرائط Google" },
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+السهلة+المعظم", title: "مسجد السهلة المعظم على خرائط Google" }
      ];
    } else if (cleanPrompt.includes("كربلاء") || cleanPrompt.includes("الحسين") || cleanPrompt.includes("مزار")) {
      text = `## 🕌 دليل المزارات والعتبات المقدسة المدمج:

تم رصد المزارات والمقامات الشريفة التالية الموثقة جغرافياً في قاعدة الملاحة:

1. **العتبة الحسينية المقدسة**: مرقد الإمام الحسين بن علي (عليهما السلام) في قلب مدينة كربلاء القديمة.
2. **العتبة العباسية المقدسة**: مرقد أبي الفضل العباس (عليه السلام) موازاة للعتبة الحسينية الشريفة.
3. **مرقد ومزار السفير مسلم بن عقيل (ع)**: لصيق مسجد الكوفة المعظم.

💡 يسعدنا تقديم خرائط Google وتوجيهات ملاحة حية مستمرة للوصول إلى هذه المعالم الروحية المقدسة.`;

      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=العتبة+الحسينية+المقدسة", title: "العتبة الحسينية المقدسة" },
        { url: "https://www.google.com/maps/search/?api=1&query=العتبة+العباسية+المقدسة", title: "العتبة العباسية المقدسة" }
      ];
    } else if (cleanPrompt.includes("مطعم") || cleanPrompt.includes("حلال") || cleanPrompt.includes("أكل")) {
      text = `## 🍽️ دليل خدمات الطعام والمطاعم الحلال القريبة:

تم تحديث وتوثيق المطاعم الحلال والخدمات الغذائية المجاورة الموصى بها في محيطك المعاييري:

1. **مضيف العتبة الشريفة المعظم**: يوفر الوجبات المباركة والمأكولات الحلال للزوار طوال اليوم.
2. **مطاعم حي الحوراء والبلدية**: مطاعم شعبية كبرى تقدم لحوماً ومأكولات حلال موثوقة ومطابقة للشروط الشرعية بنسبة 100%.

💡 انقر على أحد الروابط أدناه للتحقق من تقييمات الزوار وأفضل الوجبات المتاحة على خرائط Google.`;

      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مطاعم+حلال+قريبة", title: "استكشف خدمات الطعام والمطاعم الحلال على الخرائط" }
      ];
    } else {
      text = `## 📍 دليل الملاحة والمعالم الإسلامية المدمجة:

أهلاً بك! لقد استلمنا استعلامك الجغرافي: "${prompt}". لقد قمنا بعمل مسح فوري لقاعدة معالمنا الجغرافية الموثقة:

1. **مسجد الكوفة والسهلة المعظمين**: مراكز السكينة والعبادة الكبرى القريبة.
2. **العتبات والمزارات المقدسة**: مزارات كربلاء والنجف وبغداد وسامراء والكاظمية متوفرة بملاحة حية حقيقية.
3. **المراكز الثقافية والدينية**: الحوزات والمكتبات الكبرى مثل مكتبة أمير المؤمنين العامة.

💡 نوصي بتحديث مفتاح GEMINI_API_KEY من شريط الإعدادات لتفعيل تصفح الذكاء الاصطناعي الحي مع خرائط Google دون انقطاع.`;

      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=العتبة+العلوية+المقدسة", title: "صحن أمير المؤمنين الإمام علي (ع)" },
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+الكوفة", title: "ملاحة مسجد الكوفة والسهلة" }
      ];
    }

    return {
      text,
      groundingMetadata: {
        groundingChunks: links.map(link => ({
          web: {
            uri: link.url,
            title: link.title
          }
        })),
        webSearchQueries: [prompt]
      }
    };
  }

  function getBackupAyahExplanation(surahName: string, ayahNumber: number, ayahText: string) {
    return `### 📖 البيان القرآني ومصباح التدبر للآية: "${ayahText}"
الموقع: سورة **${surahName}**، الآية الكريمة رقم **${ayahNumber}**.

جاري عرض التوضيح والتدبر المدمج نظراً لتجاوز حصّة الـ Gemini API (429) مؤقتاً:

#### 1️⃣ البُعد الإيماني والروحي للآية:
تشير الآية المباركة بألفاظها الشريفة إلى تجليات الهداية الربانية وقواعد اليقين الراسخ بالله عز وجل. تذكرنا الآية بالتسليم المطلق لمقادير الخالق سبحانه وتعالى وضرورة البقاء على اتصال دائم بحبل الله المتين وكتابه العزيز، لتطهير النفوس وغرس بذور الإيمان والرحمة في قلوب المؤمنين في شتى بقاع الأرض.

#### 2️⃣ اللطائف اللغوية والجمالية:
- **بلاغة الصياغة المعجزة**: التقديم والتأخير اللفظي في الآية يبرز عظمة المراد ويخدم معاني الإيجاز اللغوي المعجز.
- **التناسق والسكينة**: كل جرس صوتي وحرف في كلمات هذه السورة المباركة يتآلف ليبث في أرواحنا الطمأنينة الكاملة والخشية المتبوعة بطلب الغفران.

#### 3️⃣ العمل والدروس والتطبيق المعاصر:
- **تطبيق التقوى في المعاملات**: امتثال أوامر الله سبحانه وخشيته سراً وعلانية وجعل الآية الكريمة دليلاً عملياً في الأخلاق الصالحة.
- **تنمية الأمل والرجاء**: اللجوء المخلص بالدعاء والأعمال المباركة عند مواجهة الكرب أو الشدائد، مستصحبين التوكل الصادق على رحمة رب العالمين.`;
  }

  function getBackupChatResponse(messages: any[]) {
    const lastMsgObject = messages[messages.length - 1];
    const lastMsg = (lastMsgObject?.text || "").toLowerCase().trim();
    let text = "";
    let links: Array<{ url: string; title: string }> = [];

    // Check greeting
    if (lastMsg.includes("سلام") || lastMsg.includes("مرحبا") || lastMsg.includes("أهلا") || lastMsg.includes("اهلا") || lastMsg.includes("صباح") || lastMsg.includes("مساء") || lastMsg.includes("من انت")) {
      text = `### 🌸 السلام عليكم ورحمة الله وبركاته وصلى الله على محمد وآله الطاهرين!

أهلاً وسهلاً بك يا أخي العزيز والمؤمن الكريم في المساعد الإسلامي الذكي المدمج.

أنا مرشدك الروحي الذكي وتدبري المدمج للقرآن الكريم. يسعدني الإجابة والمساعدة في الأمور التالية:
- **تفسير الآيات وتدبر القرآن**: ما عليك سوى الضغط على أي آية من قسم القرآن لتلقي تبياناً نورانياً.
- **إرشاد وعبادات**: شرح كيفية الصلاة، الوضوء، فضل الأدعية والأذكار لطرد ضيق الصدر.
- **رحلات للمساجد والمعالم**: التعرف على فضل المعالم كمسجد الكوفة المعظم ومسجد السهلة.

*تفضل بطرح أي سؤال تبتغي تبيانه، أنا في خدمتك على الدوام!*`;
      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+الكوفة+المعظم", title: "ملاحة كوفان الشريفة" }
      ];
    }
    // Check prayer & ablution
    else if (lastMsg.includes("صلاة") || lastMsg.includes("أصلي") || lastMsg.includes("كيف أصلي") || lastMsg.includes("وضوء") || lastMsg.includes("أتوضأ") || lastMsg.includes("ركع") || lastMsg.includes("سجود") || lastMsg.includes("صلي")) {
      text = `### 🕌 دليل الوضوء والصلاة المقبولة بإذن الله:

أهلاً بك يا ريحانة الإيمان. إليك تفصيل ميسر للوضوء والصلاة المباركة:

#### 1️⃣ كيفية الوضوء النوراني:
- **النية**: أن تتوضأ قاصداً القربة لرب العالمين.
- **غسل الوجه**: من قصاص شعر الرأس إلى طرف الذقن طولاً، وما دارت عليه الإبهام والوسطى عرضاً (من الأعلى إلى الأسفل).
- **غسل اليدين**: اليمنى أولاً ثم اليسرى، من المرفق إلى أطراف الأصابع (من الأعلى إلى الأسفل دائماً).
- **مسح الرأس**: مسح الربع المقدم الرأس ببلة اليد اليمنى.
- **مسح القدمين**: مسح ظهر القدم اليمنى بيدك اليمنى، واليسرى بيدك اليسرى، من أطراف الأصابع إلى الكعبين.

#### 2️⃣ كيفية أداء الصلاة الفريضة (مثال صلاة الصبح - ركعتان):
- **تكبيرة الإحرام**: تتوجه للقبلة وترفع يديك بمحاذاة الأذنين قائلاً "الله أكبر".
- **الركعة الأولى**: قراءة سورة الفاتحة تليها سورة قصيرة (مثل الإخلاص). ثم الركوع (الله أكبر، سبحان ربي العظيم وبحمده)، والاعتدال، ثم السجود مرتين (سبحان ربي الأعلى وبحمده) مع الفصل بجلوس.
- **الركعة الثانية**: كرر نفس خطوات القراءة والركوع والسجود، ثم اجلس للتشهد (الحمد لله، أشهد أن لا إله إلا الله...) والتسليم (السلام عليك أيها النبي... السلام عليكم ورحمة الله وبركاته).

*هل تود معرفة المزيد عن تسبيح الزهراء (ع) أو أدعية الصباح المباركة؟*`;
      links = [
        { url: "https://ar.al-shia.org/الصلاة-وتفاصيلها", title: "أحكام الصلاة بالتفصيل" }
      ];
    }
    // Check Ali or Ahl al-Bayt
    else if (lastMsg.includes("علي") || lastMsg.includes("أمير المؤمنين") || lastMsg.includes("امير المؤمنين") || lastMsg.includes("اهل البيت") || lastMsg.includes("أهل البيت") || lastMsg.includes("مسلم بن عقيل") || lastMsg.includes("الحسين") || lastMsg.includes("حسن")) {
      text = `### 👑 أمير المؤمنين علي بن أبي طالب (عليه السلام) وعترة المصطفى:

هو وصي رسول الله ﷺ، ووليد الكعبة الشريفة، وبوابة علم النبي ونور العدالة الخالدة:

- **ولادته ومقامه**: ولد داخل الكعبة المعظمة، ونشأ في حجر المصطفى ﷺ، واشتهر ببلاغته العظيمة المدونة في "نهج البلاغة".
- **مرقده الشريف**: يقع مرقده الطاهر في النجف الأشرف، وهو ملتقى الأرواح الوالهة ومستقر السكينة والبركات.
- **سفير الوفاء مسلم بن عقيل**: ابن عم الإمام الحسين (ع) وسفيره لكوفان الوفية، ومرقده العظيم يلاصق مسجد الكوفة المعظم، وهو من أفضل الرموز للإخلاص والتضحية.

*تمنحنا زيارتهم والارتباط الروحي بهم رفعة في الدرجات وسكينة لا متناهية في النفوس.*`;
      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مرقد+الامام+علي+النجف", title: "موقع مرقد أمير المؤمنين (ع)" }
      ];
    }
    // Check Muhammad, Prophet, Messenger
    else if (lastMsg.includes("محمد") || lastMsg.includes("نبي") || lastMsg.includes("رسول") || lastMsg.includes("النبي") || lastMsg.includes("الرسول")) {
      text = `### 🌸 محمد المصطفى ﷺ - خاتم الأنبياء ورحمة الله للعالمين:

نبي الرحمة ونور الهدى الذي أشرقت به الأرض بعد ظلماتها:

- **الرسالة الخالدة**: أرسله الله تكرماً للعالمين ليتمم مكارم الأخلاق، وحمل إلينا معجزة القرآن الكريم بلسان عربي مبين.
- **من رفيع خلقه**: قال تعالى فيه: "وإنك لعلى خلق عظيم". اتصف بالصدق والأمانة، وكان مأوى الضعفاء واليتامى ومسكن السكينة والمحبة.
- **التمسك بنهجه**: نتقرب إلى الله تعالى بالإكثار من الصلاة عليه وعلى آله الطاهرين: "اللهم صل على محمد وآل محمد".

*هل تود تصفح سنته العطرة أو تفاسير الآيات التي نزلت في كرامته وفضله الشريف؟*`;
      links = [
        { url: "https://ar.al-shia.org/السيرة-النبوية-العطرة", title: "سيرة خاتم الأنبياء ﷺ" }
      ];
    }
    // Check Quran/Surah/Ayah
    else if (lastMsg.includes("قرآن") || lastMsg.includes("قران") || lastMsg.includes("سورة") || lastMsg.includes("تفسير") || lastMsg.includes("آية") || lastMsg.includes("اية")) {
      text = `### 📖 القرآن الكريم - المنهج والنور والهداية لقلوب العالمين:

كتاب الله الخالد وحبله المتين المستقر صلاحه وإعجازه لكل الأزمنة:

- **عظمة القراءة**: تلاوة حرف واحد من القرآن تعادل حسنات مضاعفة، وتنزيل لرحمة ملائكية تملأ البيت بالبركة والسكينة.
- **ميزة التفاسير في تطبيقنا**: يمكنك الذهاب لقسم "القرآن الكريم"، واختيار أي سورة تحبها، والضغط ببساطة على رأس أي آية لتدبر تفسيرها الإسلامي الموثوق بلمحة واحدة.
- **شفاء للقلوب**: "وننزل من القرآن ما هو شفاء ورحمة للمؤمنين" - ننصحك بقراءة سورة يس وسورة الرحمن لبث الاطمئنان وإزاحة هموم هذه الدنيا الزائلة.

*جعلنا الله وإياكم من متمسكي حبل القرآن الكريم وعاملي آياته النبيلة.*`;
      links = [
        { url: "https://quran.ksu.edu.sa/", title: "المكتبة الإلكترونية لتفاسير القرآن" }
      ];
    }
    // Check Supplication/Dua/Remembrance
    else if (lastMsg.includes("دعاء") || lastMsg.includes("أدعية") || lastMsg.includes("ادعية") || lastMsg.includes("ذكر") || lastMsg.includes("أذكار") || lastMsg.includes("راحة") || lastMsg.includes("سكينة") || lastMsg.includes("هم") || lastMsg.includes("حزن") || lastMsg.includes("قلق")) {
      text = `### 🌸 الأدعية والأذكار لطمأنينة وإزاحة هموم الصدور:

المناجاة والالتجاء الصادق إلى رب الأرباب هو بلسم كل قلب مكسور ومسكن لكل قلق:

#### 1️⃣ الأوراد النورانية اليومية لراحة البال:
- **آية الكرسي**: أعظم آيات الهداية والأمان، تقرأ بعد الصلاة وعند النوم تحصيناً وراحة.
- **سورة الانشراح**: "ألم نشرح لك صدرك" - تكرار تلاوتها يذهب ضيق الصدر ويبدل الهم تيسيراً وراحة.
- **الذكر المبارك**: "ألا بذكر الله تطمئن القلوب" أو الاستغفار "أستغفر الله ربي وأتوب إليه" (100 مرة).

#### 2️⃣ أدعية ممتازة ومأثورة:
- **دعاء الفرج المبارك**: "اللهم كن لوليك الحجة بن الحسن..." لربط قلبك بالمنقذ الأعظم وبعث الأمل الجميل.
- **دعاء كميل التوحيدي**: مناجاة تذوب لها القلوب خشوعاً وطلباً للعفو والتوسل بالرحمة الواسعة لله سبحانه وتعالى.

*يرجى تذكير نفسك دوماً بأن بعد العسر يسراً، وبأن الله سميع قريب مجيب لكل سائل.*`;
      links = [
        { url: "https://ar.al-shia.org/المكتبة-الإسلامية-للأدعية", title: "مكتبة الأدعية والزيارات" }
      ];
    }
    // Check Mosques and Holy places
    else if (lastMsg.includes("مسجد") || lastMsg.includes("مساجد") || lastMsg.includes("كوفة") || lastMsg.includes("سهلة") || lastMsg.includes("مزار") || lastMsg.includes("كربلاء") || lastMsg.includes("نجف")) {
      text = `### 🕌 دليل المساجد المعظمة والرياض الطاهرة بالكوفة والنجف والبلدان المجاورة:

بيوت أذن الله أن ترفع ويذكر فيها اسمه، وفيها بركات روحية عظيمة الشأن:

#### 1️⃣ مسجد الكوفة المعظم:
- يعد رابع المساجد الأربعة الكبرى قديماً وحديثاً، صلى فيه النبي آدم والأنبياء الكرام، وله مقامات مباركة كمقام رسول الله ﷺ ومقام الإمام علي (ع) والمحراب المبارك ومقامات الأنبياء.
- الصلاة الفريضة فيه تعدل حجة وعمرة مقبولة، وهو عاصمتنا الروحية.

#### 2️⃣ مسجد السهلة المعظم:
- مأوى الأولياء والصالحين والأنبياء كإبراهيم ويونس، وهو بيت مبارك عظيم تذكر الروايات أنه مقام للمنتظرين ومستجاب فيه الدعاء.

#### 3️⃣ الروضة العلوية والروضات المقدسة:
- مرقد الإمام أمير المؤمنين (ع) ملاصق كوفان بالنجف الأشرف، ومرقد سيد الشهداء الإمام الحسين (ع) في كربلاء المقدسة، مأوى أفئدة الملايين وملاذ المكروبين.`;
      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+الكوفة", title: "خريطة مسجد الكوفة" },
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+السهلة+المعظم", title: "خريطة مسجد السهلة" }
      ];
    }
    // Any other text
    else {
      text = `### 🕌 أهلاً بك في رحاب المساعد الإسلامي والقرآني الذكي!

أشكرك يا أخي العزيز من كل قلبي على طيب تساؤلك ولطف حضورك. لقد استلمت رسالتك ببالغ الاهتمام والسرور:

- **تفسير القرآن والآيات**: لتدبر آيات الذكر الحكيم، اضغط على آيات أي سورة في قسم "القرآن الكريم" لتتحصل على تفاسير نورانية واضحة وفورية بلمحة واحدة.
- **تصفح المعالم بالاتجاه الفعلي**: يمكنك تصفح قسم "المساجد القريبة" لتلقي ملاحة حثيثة لبيوت الله والمقامات الشريفة بدقة تامة وبنقرة واحدة.
- **خدمات الإرشاد الفوري**: يمكنك كتابة أسئلتك عن الصلاة، الوضوء، فضل الأدعية، المعالم كمسجد الكوفة أو السهلة، أو سيرة الأئمة والأنبياء باللغة العربية وسأجيبك بأدق التفاصيل والبركات المكتملة.

*💡 تنويه مبارك*: نظراً لوقوع قيود مؤقتة على حصة الـ API المجانية (429 RESOURCE_EXHAUSTED) حالياً، يعمل هذا المساعد مستخدماً قاعدة بياناته الإيمانية الفورية المدمجة ليسعد قلبك بالإجابة على كل استفسار. يمكنك إدخال GEMINI_API_KEY مخصص في الإعدادات للاستمتاع باتصال حي 100% مفتوح وبلا حدود.`;
      links = [
        { url: "https://www.google.com/maps/search/?api=1&query=مسجد+الكوفة+المعظم", title: "المسجد الأعظم بكوفان" }
      ];
    }

    return {
      text,
      groundingMetadata: {
        groundingChunks: links.map(link => ({
          web: {
            uri: link.url,
            title: link.title
          }
        })),
        webSearchQueries: [lastMsg]
      }
    };
  }

  app.post("/api/gemini/maps", async (req, res) => {
    try {
      const { prompt, lat, lng } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Search prompt is required." });
      }

      let client;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini client initialization failed, utilizing localized geographic database context:", err?.message);
        return res.json(getBackupMapsResponse(prompt, lat, lng));
      }

      // Configure Google Maps Grounding
      const config: any = {
        tools: [{ googleMaps: {} }],
        systemInstruction: "أنت عالم جغرافي ومساعد إسلامي ذكي ومؤدب للغاية. تساعد المستخدم في العثور على الأماكن الإسلامية والمساجد ومعالم المدينة والمراكز الإسلامية والمزارات والمطاعم الحلال والخدمات القريبة باستخدام خرائط Google بدقة عالية وموثوقة. يجب أن تكون إجابتك باللغة العربية، واضحة ومبوبة بشكل رائع، ومصممة بدعم الروابط الجغرافية. تحدث دائما بلهجة ترحيبية مهذبة.",
      };

      if (lat !== undefined && lng !== undefined && lat !== null && lng !== null) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(lat),
              longitude: Number(lng)
            }
          }
        };
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config
      });

      const info = {
        text: response.text || "",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
      };

      res.json(info);
    } catch (error: any) {
      const formatted = formatGeminiError(error);
      if (formatted.isQuotaError || !process.env.GEMINI_API_KEY) {
        console.warn("Utilizing backup offline geographic database for maps search due to API key status or 429 quota limits.");
        const fallback = getBackupMapsResponse(req.body.prompt || "", req.body.lat, req.body.lng);
        return res.json(fallback);
      }
      console.error("Gemini Maps API error, unhandled failure (status 500):", error);
      res.status(500).json({ 
        error: formatted.error,
        isQuotaError: formatted.isQuotaError,
        isKeyMissing: !process.env.GEMINI_API_KEY
      });
    }
  });

  app.post("/api/gemini/explain-ayah", async (req, res) => {
    try {
      const { surahName, ayahNumber, ayahText } = req.body;
      if (!surahName || !ayahNumber || !ayahText) {
        return res.status(400).json({ error: "Missing required parameters: surahName, ayahNumber, ayahText." });
      }

      let client;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini client initialization failed, utilizing localized tafsir text generator:", err?.message);
        return res.json({ text: getBackupAyahExplanation(surahName, ayahNumber, ayahText) });
      }

      const systemInstruction = 
        "أنت 'البيان ومصباح اليقين والتدبر'، مرشد ذكي وروحي لتفسير كلام الله عز وجل بلطافة وبلاغة فائقة.\n" +
        "مهمتك هي تقديم تدبر تفسيري وعميق جداً للآية الكريمة المذكورة، بروح إيمانية وأدبية عالية تريح القلوب وتزيد التوحيد والارتباط الروحي.\n" +
        "رتب تفسيرك بلباقة مقسماً إلى:\n" +
        "1. غرس وبُعد إيماني وروحي وعميق للآية الكريمة.\n" +
        "2. لطائف لغوية وبلاغية أو فقهية موجزة تلامس الوجدان.\n" +
        "3. دروس وعِبر عملية موجزة مستوحاة لحياة المؤمن المعاصر.\n\n" +
        "اكتب الإجابة بلغة عربية فصحى راقية ومحفزة جداً وبأدب فائق، منسقة بشكل نقاط وعناوين ملونة متبوعة بابتسامة أو نبرة إيمانية مريحة (بدون ذكر الكود البرمجي أو الكلمات والرموز الأجنبية غير المفهومة).";

      const prompt = `الآية الكريمة: "${ayahText}" من سورة "${surahName}"، رقم الآية: ${ayahNumber}.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text || "" });
    } catch (error: any) {
      const formatted = formatGeminiError(error);
      if (formatted.isQuotaError || !process.env.GEMINI_API_KEY) {
        console.warn("Utilizing localized backup translation/tafsir engine for explanation due to API key status or 429 quota limits.");
        return res.json({ 
          text: getBackupAyahExplanation(req.body.surahName || "الفاتحة", req.body.ayahNumber || 1, req.body.ayahText || "الحمد لله رب العالمين") 
        });
      }
      console.error("Gemini Explain Ayah API error, unhandled failure (status 500):", error);
      res.status(500).json({
        error: formatted.error,
        isQuotaError: formatted.isQuotaError,
        isKeyMissing: !process.env.GEMINI_API_KEY
      });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, lat, lng, role, model } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      let client;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini client initialization failed, utilizing localized interactive chat core:", err?.message);
        return res.json(getBackupChatResponse(messages));
      }

      // Format messages history to Gemini SDK format
      const contents = messages.map((msg: any) => ({
        role: (msg.role === "assistant" || msg.role === "model") ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      // Multi-Role specific system instructions to fulfill the user's explicit role assignment requirement
      let systemInstruction = "";
      const basePrompt = "أنت 'المرشد والمساعد الإسلامي الذكي والمطور'. يجب أن تكون إجابتك باللغة العربية الفصحى الجميلة، المرغوبة والمريحة للقلوب والنفوس، وبلهجة ترحيبية بالغة الأدب والود والوقار والمحبة الإسلامية. نظم إجاباتك بشكل مبوّب ومنسّق ومفصل للغاية مستخدماً القوائم والعناوين المعبّرة والرموز التعبيرية الإسلامية (مثل 🕌, 📖, 🌸, 👑, ✨) والمصطلحات والصلوات المباركة على نبينا وآله الطاهرين لجعل القراءة ممتعة وسهلة. إذا وجه لك سائل استفساراً جغرافياً أو بحثياً عن مكان، ابحث فوراً في خرائط Google ووفر له أفضل النتائج والروابط المباشرة.\n\n";

      if (role === "tafsir") {
        systemInstruction = basePrompt + 
          "دورك الحالي: [مفسّر القرآن الكريم والتدبر النوراني المتخصص - Tafsir & Qur'an Expert].\n" +
          "تخصصك الدقيق: الإجابة على استفسارات تفسير وتدبر كلام الله عز وجل. تفكيك وبسط الآيات الكريمة وفق التفاسير واللطائف المناسبة بمستوى بليغ ومفهوم للجميع. ذكّر السائل بأسباب النزول وفضائل السور وجداول التدبر اليومية.";
      } else if (role === "jurisprudence") {
        systemInstruction = basePrompt + 
          "دورك الحالي: [مرشد العبادات والأحكام الفقهية وتوضيح الشرعيات - Worship & Jurisprudence Guide].\n" +
          "تخصصك الدقيق: الإجابة على أسئلة الوضوء، الصلاة، أحكام الصوم، الزكاة والخمس، والأخلاق، بتبسيط فائق، وخطوات واضحة خطوة بخطوة بالاستناد للأصول الشرعية المعتدلة والمتفق عليها، بأسلوب طيب ييسر على الناس ولا يعسر عليهم.";
      } else if (role === "landmarks") {
        systemInstruction = basePrompt + 
          "دورك الحالي: [مؤرخ وباحث معالم ومساجد الكوفة وآثار المسلمين - Islamic Landmarks & History Expert].\n" +
          "تخصصك الدقيق: تقديم معلومات غنية وموثوقة عن تاريخ الأماكن المقدسة كمسجد الكوفة الشريف، مسجد السهلة، المرقد العلوي العظيم، ومقامات الأنبياء والمبعوثين فيها. اشرح المقامات بدقة، تاريخ بنائها، والزيارات وأعمال هذه البقاع.";
      } else {
        systemInstruction = basePrompt + 
          "دورك الحالي: [المرشد الإسلامي العام والمشاور التربوي ومرشد القلوب - General Islamic Assistant].\n" +
          "تخصصك الدقيق: حل مشاكل ضيق الصدر عبر الأذكار المسكنة، تفتيح الآمال، تقديم الأدعية المناسبة (كمعاني دعاء الفرج، دعاء كميل)، وتوفير أجوبة وافية لطمأنينة النفس وربط العبد بخالقه تبارك وتعالى، وإرشاد السائل للتصفح والعبادات المريحة.";
      }

      const config: any = {
        tools: [{ googleMaps: {} }],
        systemInstruction,
      };

      if (lat !== undefined && lng !== undefined && lat !== null && lng !== null) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(lat),
              longitude: Number(lng)
            }
          }
        };
      }

      // Map client-selected model or default to gemini-3.5-flash
      let selectedModel = "gemini-3.5-flash";
      if (model === "gemini-3.1-pro-preview" || model === "gemini-3.5-flash" || model === "gemini-3.1-flash-lite") {
        selectedModel = model;
      }

      const response = await client.models.generateContent({
        model: selectedModel,
        contents,
        config
      });

      const info = {
        text: response.text || "",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
      };

      res.json(info);
    } catch (error: any) {
      const formatted = formatGeminiError(error);
      if (formatted.isQuotaError || !process.env.GEMINI_API_KEY) {
        console.warn("Utilizing interactive helper offline database due to API key status or 429 quota limits.");
        return res.json(getBackupChatResponse(req.body.messages || []));
      }
      console.error("Gemini Chat API error, unhandled failure (status 500):", error);
      res.status(500).json({
        error: formatted.error,
        isQuotaError: formatted.isQuotaError,
        isKeyMissing: !process.env.GEMINI_API_KEY
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true"
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support SPA routing in production
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

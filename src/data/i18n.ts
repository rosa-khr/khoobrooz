import { Locale } from "@/core/lib/site";

type ServiceItem = {
  title: string;
  description: string;
  href: string;
  featured?: boolean;
  eyebrow?: string;
  cta?: string;
};

type SimpleItem = {
  title: string;
  description: string;
};

export type Dictionary = {
  brand: { name: string; tagline: string };
  nav: Array<{ label: string; href: string; description?: string; children?: Array<{ label: string; href: string; description?: string }> }>;
  header: { topbar: string; contacts: string; consult: string; language: string };
  footer: { intro: string; address: string; pages: string; mainServices: string; contactSocial: string; rights: string };
  home: {
    metadata: { title: string; description: string };
    hero: { eyebrow: string; title: string; description: string; consult: string; services: string; customsConsult: string };
    services: { title: string; description: string; all: string; aria: string };
    process: { eyebrow: string; title: string; description: string };
    clearance: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
      aria: string;
      request: string;
      requestHint: string;
      general: string;
      generalHint: string;
      customs: string;
      customsHint: string;
    };
    content: { eyebrow: string; title: string; description: string; knowledge: string; education: string; documents: string; featureTitle: string; featureDescription: string };
    trust: { eyebrow: string; title: string; description: string; proof: string[]; aria: string; items: SimpleItem[] };
  };
  services: ServiceItem[];
  knowledgeItems: SimpleItem[];
  documentItems: SimpleItem[];
  processFlow: { aria: string; outcomeTitle: string; outcomes: string[]; steps: Array<SimpleItem> };
  pages: {
    services: { title: string; description: string; eyebrow: string; heading: string; body: string; consult: string; customs: string; view: string };
    customs: { title: string; description: string; eyebrow: string; heading: string; body: string; primary: string; back: string; cardTitle: string; cardBody: string; info: SimpleItem[] };
    about: { title: string; description: string; eyebrow: string; heading: string; body: string; brandPosition: string; brandBody: string; valuesTitle: string; values: string[] };
    contact: { title: string; description: string; eyebrow: string; heading: string; body: string; methods: string; generalWhatsapp: string; customsLine: string; social: string; formTitle: string; name: string; phone: string; type: string; details: string; submit: string; options: string[] };
    documents: { title: string; description: string; eyebrow: string; heading: string; body: string };
    education: { title: string; description: string; eyebrow: string; heading: string; body: string; cards: SimpleItem[] };
    knowledge: { title: string; description: string; eyebrow: string; heading: string; body: string };
    news: { title: string; description: string; eyebrow: string; heading: string; body: string; cards: SimpleItem[] };
    faq: { title: string; description: string; eyebrow: string; heading: string; body: string; q1: string; a1: string; link: string; q2: string; a2: string };
  };
};

const fa: Dictionary = {
  brand: { name: "خوبروز", tagline: "Khoobrooz Trade" },
  nav: [
    { label: "خانه", href: "/" },
    {
      label: "خدمات",
      href: "/services",
      children: [
        { label: "ترخیص کالا", href: "/services/customs-clearance", description: "بررسی مدارک، مراحل و مسیر تماس اختصاصی ترخیص" },
        { label: "ثبت سفارش واردات", href: "/services", description: "مسیر ثبت سفارش کالا و پیش‌نیازهای واردات" },
        { label: "واردات کالا", href: "/services", description: "از بررسی کالا تا حمل، ثبت سفارش و ترخیص" },
        { label: "واردات از چین و کارگو", href: "/services", description: "خرید، حمل، کارگو و مسیر ترخیص کالا از چین" },
        { label: "صادرات کالا", href: "/services", description: "اسناد، مذاکره، آماده‌سازی و مسیر صادرات" }
      ]
    },
    { label: "آموزش و دانشنامه", href: "/knowledge", children: [
      { label: "آموزش صادرات و واردات", href: "/education", description: "مفاهیم پایه، اسناد و مراحل رایج تجارت خارجی" },
      { label: "دانشنامه تجارت", href: "/knowledge", description: "اصطلاحات گمرکی، واردات، صادرات و اسناد تجاری" },
      { label: "بخشنامه‌ها و اخبار", href: "/news", description: "اخبار و محتوای زمان‌دار تجارت و گمرک" }
    ] },
    { label: "فایل‌ها و اسناد", href: "/documents" },
    { label: "بازار", href: "/markets/currency-rates", children: [{ label: "قیمت ارزهای رایج", href: "/markets/currency-rates", description: "جدول ارزهای پرکاربرد تجارت" }] },
    { label: "خوبروز", href: "/about", children: [
      { label: "درباره خوبروز", href: "/about", description: "جایگاه برند، رویکرد و ارزش‌های خوبروز" },
      { label: "تماس با ما", href: "/contact", description: "واتساپ عمومی و مسیر اختصاصی ترخیص" },
      { label: "سوالات متداول", href: "/faq", description: "پاسخ سوال‌های رایج درباره خدمات و فایل‌ها" }
    ] }
  ],
  header: { topbar: "خدمات بازرگانی، ترخیص کالا، واردات و صادرات", contacts: "ارتباطات", consult: "دریافت مشاوره", language: "انتخاب زبان" },
  footer: { intro: "برند خدمات بازرگانی، آموزش تجارت خارجی، ترخیص کالا و اسناد کاربردی واردات و صادرات.", address: "ایران، تهران؛ ارائه خدمات مشاوره و پیگیری بازرگانی به صورت آنلاین و هماهنگ‌شده.", pages: "صفحات", mainServices: "خدمات اصلی", contactSocial: "ارتباط و شبکه‌های اجتماعی", rights: "تمام حقوق مادی و معنوی این وب‌سایت برای خوبروز محفوظ است." },
  home: {
    metadata: { title: "خدمات بازرگانی، واردات، صادرات و ترخیص کالا | خوبروز", description: "خوبروز درباره خدمات بازرگانی، واردات، صادرات، ترخیص کالا، اسناد تجاری و آموزش تجارت خارجی محتوا و مسیرهای تماس تخصصی ارائه می‌کند." },
    hero: { eyebrow: "خدمات بازرگانی، واردات، صادرات و ترخیص کالا", title: "تجارت روشن، مسیر مطمئن", description: "بررسی خدمات بازرگانی، ترخیص و اسناد تجاری.", consult: "دریافت مشاوره", services: "مشاهده خدمات", customsConsult: "مشاوره امور گمرکی" },
    services: { title: "خدمات و مسیرهای اصلی خوبروز", description: "مسیرهای اصلی برای واردات، صادرات، حمل، ترخیص و اسناد تجاری.", all: "همه خدمات", aria: "خدمات اصلی خوبروز" },
    process: { eyebrow: "مسیر همکاری", title: "فرایند بررسی درخواست", description: "نوع کالا، مدارک و مسیر پیگیری جداگانه بررسی می‌شود." },
    clearance: { eyebrow: "تفکیک مسیر تماس", title: "درخواست‌های ترخیص مسیر جدا دارند", description: "درخواست ترخیص جدا بررسی می‌شود: مدارک، اطلاعات کالا و مسیر پیگیری.", cta: "تماس برای مشاوره رایگان", aria: "نمایش تفکیک مسیر تماس عمومی و ترخیص کالا", request: "ثبت درخواست", requestHint: "نوع کالا و نیاز اولیه", general: "مسیر عمومی", generalHint: "پرسش، مشاوره و محتوای مرتبط", customs: "مسیر اختصاصی ترخیص", customsHint: "مدارک، اطلاعات کالا و پیگیری اجرایی" },
    content: { eyebrow: "محتوای آموزشی و مرجع", title: "دانش تجاری، کنار خدمات", description: "محتوا برای شناخت اسناد، اصطلاحات و مسیرهای رایج تجارت خارجی است.", knowledge: "دانشنامه", education: "آموزش", documents: "فایل‌ها", featureTitle: "آموزش واردات و صادرات", featureDescription: "مبانی، اسناد و خطاهای رایج." },
    trust: { eyebrow: "اعتمادسازی واقع‌گرایانه", title: "اعتماد با مسیر روشن", description: "در خدمات بازرگانی، اعتماد از بررسی دقیق، توضیح محدودیت‌ها و پیگیری قابل فهم ساخته می‌شود.", proof: ["مدرک", "بررسی", "اقدام"], aria: "چارچوب اعتماد خوبروز", items: [
      { title: "مدارک روشن", description: "اسناد و اطلاعات کالا قبل از تصمیم بررسی می‌شود." },
      { title: "مسیر پیگیری", description: "درخواست عمومی و ترخیص در مسیر جدا جلو می‌رود." },
      { title: "شفافیت", description: "هزینه، زمان و محدودیت‌ها قطعی‌سازی نمی‌شود." },
      { title: "انتخاب آگاهانه", description: "محتوا برای شناخت بهتر مسیر و مدارک است." }
    ] }
  },
  services: [
    { title: "ترخیص کالا", description: "بررسی اولیه اسناد، اطلاعات کالا، مسیر گمرکی و آماده‌سازی درخواست برای پیگیری اجرایی ترخیص.", href: "/services/customs-clearance", featured: true, eyebrow: "مسیر تخصصی", cta: "بررسی ترخیص" },
    { title: "ثبت سفارش واردات", description: "مرور پیش‌نیازهای ثبت سفارش، مدارک پایه و ارتباط آن با واردات رسمی و ادامه مسیر ترخیص.", href: "/services", eyebrow: "شروع واردات", cta: "بررسی مسیر" },
    { title: "واردات کالا", description: "بررسی مسیر واردات از انتخاب کالا و تامین‌کننده تا حمل، اسناد، ثبت سفارش و تحویل نهایی.", href: "/services", eyebrow: "خدمات بازرگانی", cta: "مشاهده خدمت" },
    { title: "واردات از چین", description: "بررسی منبع‌یابی، خرید، حمل، کارگو، اسناد و ملاحظات ورود کالا از چین به ایران.", href: "/services", eyebrow: "مسیر چین", cta: "شروع بررسی" },
    { title: "کارگو چین", description: "توضیح تفاوت کارگو با مسیرهای حمل رسمی، هزینه‌های موثر، ریسک‌ها و ارتباط آن با ترخیص.", href: "/services", eyebrow: "حمل و لجستیک", cta: "جزئیات کارگو" },
    { title: "صادرات کالا", description: "مرور اسناد پایه صادرات، آماده‌سازی کالا، مذاکره با خریدار، ارسال و پیگیری مسیر فروش خارجی.", href: "/services", eyebrow: "مسیر صادرات", cta: "مسیر صادرات" },
    { title: "آموزش و بلاگ تجاری", description: "محتوای آموزشی درباره واردات، صادرات، گمرک، اسناد تجاری و تصمیم‌های رایج در تجارت خارجی.", href: "/education", eyebrow: "محتوا و یادگیری", cta: "ورود به آموزش" },
    { title: "فایل‌ها و اسناد تجاری", description: "نمونه‌ها و چک‌لیست‌هایی برای نظم دادن به اسناد، مکاتبات و برآوردهای اولیه تجارت خارجی.", href: "/documents", eyebrow: "ابزار کاربردی", cta: "مشاهده فایل‌ها" }
  ],
  knowledgeItems: [
    { title: "مراحل ترخیص کالا از گمرک", description: "از کنترل اسناد تا خروج کالا." },
    { title: "ثبت سفارش کالا در سامانه جامع تجارت", description: "نقش ثبت سفارش در واردات رسمی." },
    { title: "پروفرما اینویس و پکینگ لیست چیست؟", description: "دو سند پایه در خرید خارجی." }
  ],
  documentItems: [
    { title: "چک‌لیست ترخیص کالا", description: "کنترل مدارک قبل از پیگیری." },
    { title: "نمونه پروفرما اینویس", description: "ساختار پایه اطلاعات خرید." },
    { title: "اکسل محاسبه هزینه واردات", description: "برآورد اولیه هزینه‌های واردات." }
  ],
  processFlow: { aria: "نمودار مسیر همکاری خوبروز", outcomeTitle: "خروجی روشن", outcomes: ["مشاوره بازرگانی", "بررسی ترخیص", "آموزش تجارت", "فایل و چک‌لیست"], steps: [
    { title: "شرح درخواست", description: "نوع کالا، مسیر و نیاز اصلی ثبت می‌شود." },
    { title: "دسته‌بندی درخواست", description: "درخواست عمومی و اجرایی جدا می‌شود." },
    { title: "بررسی مدارک و مسیر", description: "اسناد، مبدا، مقصد و الزامات مرور می‌شود." },
    { title: "اقدام بعدی", description: "مسیر تماس، ترخیص یا محتوای لازم مشخص می‌شود." }
  ] },
  pages: {
    services: { title: "خدمات بازرگانی خوبروز | ترخیص، واردات، صادرات و کارگو", description: "صفحه خدمات خوبروز شامل ترخیص کالا، ثبت سفارش واردات، واردات کالا، واردات از چین، کارگو چین، صادرات و مشاوره امور گمرکی است.", eyebrow: "خدمات بازرگانی", heading: "خدمات بازرگانی خوبروز", body: "مسیرهای اصلی واردات، صادرات، حمل، ترخیص و اسناد تجاری در یک نگاه.", consult: "درخواست مشاوره", customs: "ترخیص کالا", view: "مشاهده" },
    customs: { title: "ترخیص کالا | بررسی مدارک و مسیر گمرکی | خوبروز", description: "خدمات ترخیص کالا در خوبروز شامل بررسی مدارک، مراحل ترخیص، عوامل موثر بر هزینه و مسیر تماس اختصاصی برای درخواست‌های ترخیص است.", eyebrow: "ترخیص کالا", heading: "ترخیص کالا از گمرک", body: "بررسی مدارک، اطلاعات کالا و مسیر گمرکی برای شروع پیگیری ترخیص.", primary: "بررسی مسیر ترخیص", back: "بازگشت به خدمات", cardTitle: "مسیر اختصاصی ترخیص", cardBody: "برای درخواست‌های ترخیص، از شماره اختصاصی همین بخش استفاده کنید.", info: [
      { title: "ترخیص کالا چیست؟", description: "ترخیص کالا مجموعه اقداماتی است که برای خروج قانونی کالا از گمرک انجام می‌شود؛ از کنترل مدارک تا اظهار، پرداخت‌ها و پیگیری مجوزها." },
      { title: "مراحل قابل بررسی", description: "بررسی کالا و مدارک، کنترل مجوزها، عوامل موثر بر هزینه و پیگیری مسیر ترخیص." },
      { title: "مدارک و هزینه‌ها", description: "مدارک لازم، مجوزها و عوامل موثر بر هزینه قبل از اقدام مرور می‌شود." }
    ] },
    about: { title: "درباره خوبروز | خدمات بازرگانی و آموزش تجارت خارجی", description: "خوبروز روی خدمات بازرگانی، آموزش صادرات و واردات، ترخیص کالا و فایل‌ها و اسناد تجاری تمرکز دارد.", eyebrow: "درباره خوبروز", heading: "درباره خوبروز", body: "خوبروز در حوزه خدمات بازرگانی، ترخیص کالا و آموزش اسناد تجارت خارجی فعالیت می‌کند.", brandPosition: "جایگاه برند", brandBody: "خدمات بازرگانی محور اصلی خوبروز است؛ آموزش و فایل‌ها نقش پشتیبان دارند.", valuesTitle: "ارزش‌ها", values: ["شفافیت در مسیر و مدارک", "دقت در محتوای تخصصی", "پرهیز از ادعاهای اغراق‌آمیز", "تفکیک روشن درخواست و اقدام بعدی"] },
    contact: { title: "تماس با خوبروز | مشاوره تجارت خارجی و ترخیص کالا", description: "برای مشاوره خدمات بازرگانی، واردات، صادرات، فایل‌های تجاری و ترخیص کالا با خوبروز تماس بگیرید.", eyebrow: "تماس با خوبروز", heading: "تماس با خوبروز", body: "برای مشاوره بازرگانی یا درخواست ترخیص، از مسیر تماس مناسب استفاده کنید.", methods: "مسیرهای تماس", generalWhatsapp: "واتساپ عمومی", customsLine: "مسیر اختصاصی ترخیص", social: "شبکه‌های اجتماعی خوبروز", formTitle: "درخواست مشاوره", name: "نام و نام خانوادگی", phone: "شماره تماس", type: "نوع درخواست", details: "توضیحات", submit: "ارسال در واتساپ", options: ["ترخیص کالا", "واردات کالا", "صادرات کالا", "خرید فایل", "آموزش"] },
    documents: { title: "فایل‌ها و اسناد تجاری | خوبروز", description: "فروش فایل‌ها و اسناد تجاری خوبروز شامل نمونه پروفرما، پکینگ لیست، قرارداد صادراتی، چک‌لیست ترخیص و فایل‌های اکسل محاسباتی.", eyebrow: "اسناد تجاری", heading: "فایل‌ها و اسناد تجاری", body: "نمونه‌ها، چک‌لیست‌ها و فایل‌های کاربردی برای نظم دادن به اسناد تجارت خارجی." },
    education: { title: "آموزش صادرات و واردات | خوبروز", description: "آموزش صادرات و واردات در خوبروز برای آشنایی با مفاهیم پایه تجارت خارجی، اسناد، ثبت سفارش، حمل و ترخیص کالا.", eyebrow: "آموزش تجارت", heading: "آموزش صادرات و واردات", body: "آموزش مفاهیم پایه، اسناد و مراحل رایج واردات و صادرات.", cards: [
      { title: "آموزش واردات", description: "مراحل واردات کالا، ثبت سفارش، حمل و ترخیص." },
      { title: "آموزش صادرات", description: "انتخاب بازار هدف، مذاکره، قرارداد و اسناد صادراتی." },
      { title: "آموزش اسناد تجاری", description: "پروفرما، پکینگ لیست، اینویس و قراردادها." }
    ] },
    knowledge: { title: "دانشنامه تجارت | اصطلاحات واردات، صادرات و گمرک", description: "دانشنامه تجارت خوبروز شامل اصطلاحات گمرکی، واردات، صادرات، پروفرما، پکینگ لیست، بارنامه، HS Code و سامانه جامع تجارت.", eyebrow: "دانشنامه تجارت", heading: "دانشنامه تجارت", body: "اصطلاحات و مفاهیم پرکاربرد واردات، صادرات، گمرک و اسناد تجاری." },
    news: { title: "بخشنامه‌ها و اخبار گمرکی | خوبروز", description: "بخشنامه‌ها و اخبار تجارت و گمرک در خوبروز با تمرکز بر قوانین واردات، صادرات، ثبت سفارش و ترخیص کالا.", eyebrow: "اخبار تجارت", heading: "بخشنامه‌ها و اخبار گمرکی", body: "اخبار و بخشنامه‌های مرتبط با واردات، صادرات، ثبت سفارش و گمرک.", cards: [
      { title: "بخشنامه‌های گمرکی", description: "تغییرات مهم مقررات و رویه‌های گمرکی." },
      { title: "اخبار ثبت سفارش", description: "خبرهای مرتبط با ثبت سفارش و واردات رسمی." },
      { title: "قوانین واردات و صادرات", description: "نکات مهم در مقررات تجارت خارجی." }
    ] },
    faq: { title: "سوالات متداول تجارت خارجی | خوبروز", description: "پاسخ سوالات متداول درباره ترخیص کالا، واردات، صادرات، ثبت سفارش، کارگو چین، آموزش و فایل‌های تجاری خوبروز.", eyebrow: "سوالات متداول", heading: "سوالات متداول", body: "پاسخ کوتاه به پرسش‌های رایج درباره خدمات بازرگانی و ترخیص.", q1: "برای ترخیص کالا از کجا شروع کنم؟", a1: "ابتدا نوع کالا، مدارک و گمرک مورد نظر بررسی می‌شود. برای درخواست ترخیص از شماره اختصاصی ترخیص استفاده کنید.", link: "صفحه ترخیص کالا", q2: "فایل‌های تجاری چه کاربردی دارند؟", a2: "برای کنترل مدارک، برآورد اولیه هزینه‌ها و آماده‌سازی اسناد واردات و صادرات استفاده می‌شوند." }
  }
};

const en: Dictionary = {
  ...fa,
  brand: { name: "Khoobrooz", tagline: "Khoobrooz Trade" },
  header: { topbar: "Trade services, customs clearance, import and export", contacts: "Contacts", consult: "Get consultation", language: "Choose language" },
  footer: { intro: "A trade services brand for foreign trade education, customs clearance, and practical import-export documents.", address: "Tehran, Iran; online and coordinated trade consultation and follow-up services.", pages: "Pages", mainServices: "Main services", contactSocial: "Contact and social channels", rights: "All rights reserved for Khoobrooz." },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services", children: [
      { label: "Customs clearance", href: "/services/customs-clearance", description: "Documents, steps, and dedicated clearance contact route" },
      { label: "Import registration", href: "/services", description: "Order registration path and import prerequisites" },
      { label: "Import services", href: "/services", description: "From product review to shipping, documents, and delivery" },
      { label: "China import and cargo", href: "/services", description: "Sourcing, shipping, cargo, and clearance from China" },
      { label: "Export services", href: "/services", description: "Documents, negotiation, preparation, and export follow-up" }
    ] },
    { label: "Education", href: "/knowledge", children: [
      { label: "Import and export training", href: "/education", description: "Core concepts, documents, and common trade steps" },
      { label: "Trade knowledge base", href: "/knowledge", description: "Customs, import, export, and document terms" },
      { label: "Regulatory updates", href: "/news", description: "Time-sensitive trade and customs updates" }
    ] },
    { label: "Documents", href: "/documents" },
    { label: "Market", href: "/markets/currency-rates", children: [{ label: "Common currency rates", href: "/markets/currency-rates", description: "Currencies used in trade calculations" }] },
    { label: "Khoobrooz", href: "/about", children: [
      { label: "About Khoobrooz", href: "/about", description: "Brand position, approach, and values" },
      { label: "Contact", href: "/contact", description: "General WhatsApp and clearance route" },
      { label: "FAQ", href: "/faq", description: "Common questions about services and documents" }
    ] }
  ],
  home: {
    ...fa.home,
    metadata: { title: "Trade services, import, export and customs clearance | Khoobrooz", description: "Khoobrooz provides service-led content and contact routes for trade services, import, export, customs clearance, commercial documents, and trade education." },
    hero: { eyebrow: "Trade services, import, export and customs clearance", title: "Clear trade, reliable path", description: "Review trade services, clearance, and commercial documents.", consult: "Get consultation", services: "View services", customsConsult: "Customs consultation" },
    services: { title: "Khoobrooz services and main paths", description: "Main routes for import, export, shipping, clearance, and commercial documents.", all: "All services", aria: "Khoobrooz main services" },
    process: { eyebrow: "Cooperation path", title: "Request review process", description: "Product type, documents, and follow-up route are reviewed separately." },
    clearance: { eyebrow: "Separate contact route", title: "Clearance requests have a separate path", description: "Clearance requests are reviewed separately: documents, product data, and follow-up route.", cta: "Call for free consultation", aria: "Separate general and clearance contact paths", request: "Submit request", requestHint: "Product type and initial need", general: "General route", generalHint: "Questions, consultation, and related content", customs: "Dedicated clearance route", customsHint: "Documents, product data, and operational follow-up" },
    content: { eyebrow: "Educational and reference content", title: "Trade knowledge beside services", description: "Content helps users understand documents, terms, and common foreign trade paths.", knowledge: "Knowledge base", education: "Education", documents: "Documents", featureTitle: "Import and export training", featureDescription: "Basics, documents, and common mistakes." },
    trust: { eyebrow: "Realistic trust building", title: "Trust through a clear path", description: "In trade services, trust comes from careful review, explaining limits, and understandable follow-up.", proof: ["Document", "Review", "Action"], aria: "Khoobrooz trust framework", items: [
      { title: "Clear documents", description: "Documents and product data are reviewed before decisions." },
      { title: "Follow-up route", description: "General and clearance requests move through separate paths." },
      { title: "Transparency", description: "Cost, timing, and limits are not presented as guaranteed." },
      { title: "Informed choice", description: "Content helps users understand routes and documents." }
    ] }
  },
  services: [
    { title: "Customs clearance", description: "Initial review of documents, product data, customs route, and request preparation for operational follow-up.", href: "/services/customs-clearance", featured: true, eyebrow: "Specialized route", cta: "Review clearance" },
    { title: "Import registration", description: "Review order registration prerequisites, base documents, and its link with official import.", href: "/services", eyebrow: "Import start", cta: "Review path" },
    { title: "Import services", description: "Review the import path from product and supplier selection to shipping, documents, registration, and delivery.", href: "/services", eyebrow: "Trade services", cta: "View service" },
    { title: "Import from China", description: "Review sourcing, purchasing, shipping, cargo, documents, and China-to-Iran import considerations.", href: "/services", eyebrow: "China route", cta: "Start review" },
    { title: "China cargo", description: "Explain cargo routes, cost factors, risks, and connection with clearance.", href: "/services", eyebrow: "Shipping", cta: "Cargo details" },
    { title: "Export services", description: "Review export documents, product preparation, buyer negotiation, shipping, and sales follow-up.", href: "/services", eyebrow: "Export route", cta: "Export path" },
    { title: "Trade education and blog", description: "Educational content about import, export, customs, commercial documents, and common trade decisions.", href: "/education", eyebrow: "Learning", cta: "Open education" },
    { title: "Trade files and documents", description: "Templates and checklists for documents, correspondence, and initial foreign trade estimates.", href: "/documents", eyebrow: "Practical tools", cta: "View files" }
  ],
  knowledgeItems: [
    { title: "Customs clearance steps", description: "From document control to cargo release." },
    { title: "Import registration in trade systems", description: "The role of registration in official import." },
    { title: "What are proforma invoice and packing list?", description: "Two core documents in foreign purchase." }
  ],
  documentItems: [
    { title: "Clearance checklist", description: "Check documents before follow-up." },
    { title: "Proforma invoice sample", description: "Basic purchase information structure." },
    { title: "Import cost calculator sheet", description: "Initial import cost estimate." }
  ],
  processFlow: { aria: "Khoobrooz cooperation path diagram", outcomeTitle: "Clear outcome", outcomes: ["Trade consultation", "Clearance review", "Trade education", "Files and checklists"], steps: [
    { title: "Request brief", description: "Product type, route, and main need are registered." },
    { title: "Request sorting", description: "General and operational requests are separated." },
    { title: "Document review", description: "Documents, origin, destination, and requirements are reviewed." },
    { title: "Next action", description: "Contact route, clearance, or needed content is clarified." }
  ] },
  pages: {
    ...fa.pages,
    services: { title: "Khoobrooz trade services | Clearance, import, export and cargo", description: "Khoobrooz services include customs clearance, import registration, import services, China cargo, export, and customs consultation.", eyebrow: "Trade services", heading: "Khoobrooz trade services", body: "Import, export, shipping, clearance, and commercial documents at a glance.", consult: "Request consultation", customs: "Customs clearance", view: "View" },
    customs: { ...fa.pages.customs, title: "Customs clearance | Document and customs route review | Khoobrooz", description: "Khoobrooz clearance services include document review, clearance steps, cost factors, and a dedicated contact route.", eyebrow: "Customs clearance", heading: "Customs clearance", body: "Document, product, and customs-route review before clearance follow-up.", primary: "Review clearance path", back: "Back to services", cardTitle: "Dedicated clearance path", cardBody: "Use the dedicated number for clearance requests.", info: [
      { title: "What is customs clearance?", description: "Clearance includes the legal steps required to release goods from customs, from document control to declaration, payments, and permit follow-up." },
      { title: "Reviewable steps", description: "Product and document review, permit checks, cost factors, and clearance follow-up." },
      { title: "Documents and costs", description: "Required documents, permits, and cost factors are reviewed before action." }
    ] },
    about: { ...fa.pages.about, title: "About Khoobrooz | Trade services and foreign trade education", description: "Khoobrooz focuses on trade services, import-export education, customs clearance, and commercial documents.", eyebrow: "About Khoobrooz", heading: "About Khoobrooz", body: "Khoobrooz works across trade services, customs clearance, and foreign-trade document education.", brandPosition: "Brand position", brandBody: "Trade services are the core; education and files support the user’s decision.", valuesTitle: "Values", values: ["Clear routes and documents", "Accurate specialized content", "No exaggerated claims", "Clear request and next action"] },
    contact: { ...fa.pages.contact, title: "Contact Khoobrooz | Foreign trade and customs consultation", description: "Contact Khoobrooz for trade services, import, export, commercial documents, and customs clearance.", eyebrow: "Contact Khoobrooz", heading: "Contact Khoobrooz", body: "Choose the right contact route for trade consultation or clearance requests.", methods: "Contact routes", generalWhatsapp: "General WhatsApp", customsLine: "Dedicated clearance route", social: "Khoobrooz social channels", formTitle: "Consultation request", name: "Full name", phone: "Phone number", type: "Request type", details: "Details", submit: "Send on WhatsApp", options: ["Customs clearance", "Import", "Export", "Document purchase", "Education"] },
    documents: { ...fa.pages.documents, title: "Trade files and documents | Khoobrooz", description: "Khoobrooz commercial documents include proforma, packing list, export contract, clearance checklist, and calculation sheets.", eyebrow: "Commercial documents", heading: "Trade files and documents", body: "Templates, checklists, and practical files for organizing foreign-trade documents." },
    education: { ...fa.pages.education, title: "Import and export education | Khoobrooz", description: "Import and export education for basic foreign trade concepts, documents, registration, shipping, and clearance.", eyebrow: "Trade education", heading: "Import and export education", body: "Core concepts, documents, and common steps in import and export.", cards: [
      { title: "Import education", description: "Import steps, registration, shipping, and clearance." },
      { title: "Export education", description: "Target market, negotiation, contracts, and export documents." },
      { title: "Commercial document education", description: "Proforma, packing list, invoice, and contracts." }
    ] },
    knowledge: { ...fa.pages.knowledge, title: "Trade knowledge base | Import, export and customs terms", description: "Khoobrooz trade knowledge base includes customs, import, export, proforma, packing list, bill of lading, HS Code, and trade systems.", eyebrow: "Trade knowledge base", heading: "Trade knowledge base", body: "Common terms and concepts in import, export, customs, and trade documents." },
    news: { ...fa.pages.news, title: "Customs and trade updates | Khoobrooz", description: "Trade and customs updates focused on import, export, registration, and customs clearance.", eyebrow: "Trade updates", heading: "Customs and trade updates", body: "Updates related to import, export, registration, and customs procedures.", cards: [
      { title: "Customs notices", description: "Important changes in customs rules and procedures." },
      { title: "Registration updates", description: "Updates related to import registration." },
      { title: "Import and export rules", description: "Key points in foreign-trade regulations." }
    ] },
    faq: { ...fa.pages.faq, title: "Foreign trade FAQ | Khoobrooz", description: "Answers to common questions about clearance, import, export, registration, China cargo, education, and trade files.", eyebrow: "FAQ", heading: "FAQ", body: "Short answers to common questions about trade services and clearance.", q1: "Where should I start for customs clearance?", a1: "First, product type, documents, and target customs office are reviewed. Use the dedicated clearance number for clearance requests.", link: "Customs clearance page", q2: "What are trade files used for?", a2: "They help organize documents, estimate initial costs, and prepare import-export paperwork." }
  }
};

function cloneWithLanguage(base: Dictionary, language: "ar" | "ru" | "zh" | "tr"): Dictionary {
  const packs = {
    ar: {
      brand: { name: "خوبروز", tagline: "Khoobrooz Trade" },
      header: { topbar: "خدمات تجارية، تخليص جمركي، استيراد وتصدير", contacts: "قنوات التواصل", consult: "طلب استشارة", language: "اختيار اللغة" },
      hero: { eyebrow: "خدمات تجارية، استيراد، تصدير وتخليص جمركي", title: "تجارة أوضح، مسار موثوق", description: "مراجعة خدمات التجارة والتخليص والمستندات التجارية.", consult: "طلب استشارة", services: "عرض الخدمات", customsConsult: "استشارة جمركية" }
    },
    ru: {
      brand: { name: "Khoobrooz", tagline: "Khoobrooz Trade" },
      header: { topbar: "Торговые услуги, таможенное оформление, импорт и экспорт", contacts: "Контакты", consult: "Получить консультацию", language: "Выбрать язык" },
      hero: { eyebrow: "Торговые услуги, импорт, экспорт и таможенное оформление", title: "Понятная торговля, надежный маршрут", description: "Анализ торговых услуг, таможни и коммерческих документов.", consult: "Консультация", services: "Услуги", customsConsult: "Таможенная консультация" }
    },
    zh: {
      brand: { name: "Khoobrooz", tagline: "Khoobrooz Trade" },
      header: { topbar: "贸易服务、清关、进口与出口", contacts: "联系方式", consult: "获取咨询", language: "选择语言" },
      hero: { eyebrow: "贸易服务、进口、出口和清关", title: "清晰贸易，可靠路径", description: "查看贸易服务、清关和商业文件。", consult: "获取咨询", services: "查看服务", customsConsult: "海关咨询" }
    },
    tr: {
      brand: { name: "Khoobrooz", tagline: "Khoobrooz Trade" },
      header: { topbar: "Ticaret hizmetleri, gümrükleme, ithalat ve ihracat", contacts: "İletişim", consult: "Danışmanlık al", language: "Dil seç" },
      hero: { eyebrow: "Ticaret hizmetleri, ithalat, ihracat ve gümrükleme", title: "Net ticaret, güvenilir yol", description: "Ticaret hizmetleri, gümrükleme ve ticari belgeleri inceleyin.", consult: "Danışmanlık al", services: "Hizmetleri gör", customsConsult: "Gümrük danışmanlığı" }
    }
  }[language];

  const common = {
    ar: {
      nav: ["الرئيسية", "الخدمات", "التعليم والمعرفة", "الملفات والمستندات", "السوق", "خوبروز"],
      services: [
        ["التخليص الجمركي", "مراجعة أولية للمستندات وبيانات البضاعة والمسار الجمركي للمتابعة التنفيذية.", "مسار متخصص", "مراجعة التخليص"],
        ["تسجيل طلب الاستيراد", "مراجعة المتطلبات والمستندات الأساسية وعلاقتها بالاستيراد الرسمي.", "بداية الاستيراد", "مراجعة المسار"],
        ["خدمات الاستيراد", "مراجعة مسار الاستيراد من اختيار المنتج والمورّد إلى الشحن والمستندات والتسليم.", "خدمات تجارية", "عرض الخدمة"],
        ["الاستيراد من الصين", "مراجعة التوريد والشراء والشحن والكارجو والمستندات لدخول البضائع من الصين.", "مسار الصين", "بدء المراجعة"],
        ["كارجو الصين", "توضيح مسارات الكارجو وعوامل التكلفة والمخاطر وعلاقتها بالتخليص.", "الشحن واللوجستيات", "تفاصيل الكارجو"],
        ["تصدير البضائع", "مراجعة مستندات التصدير وتجهيز البضاعة والتفاوض والشحن والمتابعة.", "مسار التصدير", "مسار التصدير"],
        ["تعليم ومدونة تجارية", "محتوى تعليمي حول الاستيراد والتصدير والجمارك والمستندات التجارية.", "تعلم ومحتوى", "الدخول للتعليم"],
        ["ملفات ومستندات تجارية", "نماذج وقوائم تحقق لتنظيم المستندات والمراسلات والتقديرات الأولية.", "أدوات عملية", "عرض الملفات"]
      ],
      knowledge: [["خطوات التخليص الجمركي", "من فحص المستندات إلى خروج البضاعة."], ["تسجيل الطلب في أنظمة التجارة", "دور التسجيل في الاستيراد الرسمي."], ["ما هي الفاتورة الأولية وقائمة التعبئة؟", "مستندان أساسيان في الشراء الخارجي."]],
      docs: [["قائمة تحقق التخليص", "مراجعة المستندات قبل المتابعة."], ["نموذج فاتورة أولية", "هيكل المعلومات الأساسية للشراء."], ["ملف حساب تكلفة الاستيراد", "تقدير أولي لتكاليف الاستيراد."]],
      process: ["وصف الطلب", "تصنيف الطلب", "مراجعة المستندات والمسار", "الإجراء التالي", "نتيجة واضحة", ["استشارة تجارية", "مراجعة التخليص", "تعليم تجاري", "ملفات وقوائم تحقق"]],
      pages: {
        services: ["خدمات خوبروز التجارية", "الاستيراد والتصدير والشحن والتخليص والمستندات التجارية في لمحة.", "طلب استشارة", "التخليص الجمركي", "عرض"],
        about: ["عن خوبروز", "يعمل خوبروز في الخدمات التجارية والتخليص الجمركي وتعليم مستندات التجارة الخارجية.", "مكانة العلامة", "الخدمات التجارية هي المركز؛ التعليم والملفات يدعمان قرار المستخدم.", "القيم"],
        contact: ["التواصل مع خوبروز", "استخدم واتساب العام للتواصل العام والرقم المخصص لطلبات التخليص.", "مسارات التواصل", "واتساب عام", "مسار التخليص المخصص", "طلب استشارة"],
        documents: ["ملفات ومستندات تجارية", "نماذج وقوائم تحقق وملفات عملية لتنظيم مستندات التجارة الخارجية."],
        education: ["تعليم الاستيراد والتصدير", "مفاهيم أساسية ومستندات وخطوات شائعة في الاستيراد والتصدير."],
        knowledge: ["قاعدة المعرفة التجارية", "مصطلحات ومفاهيم شائعة في الاستيراد والتصدير والجمارك."],
        news: ["نشرات وأخبار الجمارك", "أخبار ونشرات مرتبطة بالاستيراد والتصدير والتسجيل والجمارك."],
        faq: ["الأسئلة الشائعة", "إجابات قصيرة على أسئلة الخدمات التجارية والتخليص."]
      }
    },
    ru: {
      nav: ["Главная", "Услуги", "Обучение и база знаний", "Файлы и документы", "Рынок", "Khoobrooz"],
      services: [
        ["Таможенное оформление", "Первичная проверка документов, данных товара и таможенного маршрута.", "Специализированный маршрут", "Проверить оформление"],
        ["Регистрация импорта", "Проверка требований регистрации и связи с официальным импортом.", "Старт импорта", "Проверить маршрут"],
        ["Импортные услуги", "Маршрут импорта от товара и поставщика до доставки.", "Торговые услуги", "Смотреть услугу"],
        ["Импорт из Китая", "Поиск, закупка, доставка, карго и документы для импорта из Китая.", "Китайский маршрут", "Начать проверку"],
        ["Карго Китай", "Факторы стоимости, риски и связь карго с оформлением.", "Логистика", "Детали карго"],
        ["Экспорт товаров", "Документы, подготовка товара, переговоры, отправка и контроль.", "Экспортный маршрут", "Экспорт"],
        ["Обучение и блог", "Материалы об импорте, экспорте, таможне и торговых документах.", "Контент", "К обучению"],
        ["Торговые документы", "Шаблоны и чек-листы для документов и предварительных расчетов.", "Инструменты", "Смотреть файлы"]
      ],
      knowledge: [["Этапы таможенного оформления", "От проверки документов до выпуска груза."], ["Регистрация импорта", "Роль регистрации в официальном импорте."], ["Проформа и упаковочный лист", "Два базовых документа внешней закупки."]],
      docs: [["Чек-лист оформления", "Проверка документов перед сопровождением."], ["Шаблон проформы", "Базовая структура данных закупки."], ["Расчет стоимости импорта", "Первичная оценка импортных расходов."]],
      process: ["Описание запроса", "Классификация", "Проверка документов", "Следующее действие", "Понятный результат", ["Торговая консультация", "Проверка оформления", "Обучение", "Файлы и чек-листы"]],
      pages: {
        services: ["Торговые услуги Khoobrooz", "Импорт, экспорт, логистика, оформление и коммерческие документы.", "Запросить консультацию", "Таможенное оформление", "Смотреть"],
        about: ["О Khoobrooz", "Khoobrooz работает с торговыми услугами, таможенным оформлением и обучением документам.", "Позиция бренда", "Основой являются торговые услуги; обучение и файлы поддерживают решение клиента.", "Ценности"],
        contact: ["Связаться с Khoobrooz", "Для общих вопросов используйте WhatsApp, для таможни — отдельный номер.", "Каналы связи", "Общий WhatsApp", "Таможенный маршрут", "Запрос консультации"],
        documents: ["Торговые файлы и документы", "Шаблоны, чек-листы и практичные файлы для внешнеторговых документов."],
        education: ["Обучение импорту и экспорту", "Материалы объясняют базовые понятия, документы и общие этапы торговли."],
        knowledge: ["База знаний по торговле", "Термины и понятия импорта, экспорта, таможни и документов."],
        news: ["Таможенные и торговые новости", "Новости по импорту, экспорту, регистрации и таможенным процедурам."],
        faq: ["Частые вопросы", "Короткие ответы о торговых услугах и таможенном оформлении."]
      }
    },
    zh: {
      nav: ["首页", "服务", "学习与知识库", "文件资料", "市场", "Khoobrooz"],
      services: [
        ["清关服务", "初步审核文件、货物信息和海关路径。", "专业路径", "审核清关"],
        ["进口登记", "审核登记前提、基础文件及其与正式进口的关系。", "进口开始", "审核路径"],
        ["进口服务", "从产品和供应商选择到运输、文件、登记和交付。", "贸易服务", "查看服务"],
        ["中国进口", "审核采购、运输、货运、文件和从中国进口的注意事项。", "中国路径", "开始审核"],
        ["中国货运", "说明货运成本、风险及其与清关的关系。", "物流", "货运详情"],
        ["出口服务", "审核出口文件、货物准备、谈判、运输和跟进。", "出口路径", "出口路径"],
        ["贸易学习与博客", "关于进口、出口、海关和商业文件的学习内容。", "学习内容", "进入学习"],
        ["贸易文件", "用于文件、邮件和初步估算的模板与清单。", "实用工具", "查看文件"]
      ],
      knowledge: [["清关步骤", "从文件审核到货物放行。"], ["进口登记", "登记在正式进口中的作用。"], ["形式发票和装箱单", "外贸采购中的两个基础文件。"]],
      docs: [["清关清单", "跟进前检查文件。"], ["形式发票模板", "采购信息的基础结构。"], ["进口成本表", "进口成本初步估算。"]],
      process: ["需求说明", "需求分类", "文件与路径审核", "下一步", "明确结果", ["贸易咨询", "清关审核", "贸易学习", "文件与清单"]],
      pages: {
        services: ["Khoobrooz 贸易服务", "进口、出口、运输、清关和商业文件概览。", "请求咨询", "清关服务", "查看"],
        about: ["关于 Khoobrooz", "Khoobrooz 提供贸易服务、清关和外贸文件学习内容。", "品牌定位", "贸易服务是核心；学习和文件帮助用户判断。", "价值观"],
        contact: ["联系 Khoobrooz", "一般联系使用 WhatsApp，清关需求使用专线。", "联系方式", "通用 WhatsApp", "清关专线", "咨询请求"],
        documents: ["贸易文件资料", "用于整理外贸文件的模板、清单和实用文件。"],
        education: ["进出口学习", "学习内容解释基础概念、常用文件和进出口步骤。"],
        knowledge: ["贸易知识库", "进口、出口、海关和贸易文件中的常见术语。"],
        news: ["海关与贸易动态", "与进口、出口、登记和海关流程相关的动态。"],
        faq: ["常见问题", "关于贸易服务和清关的简短回答。"]
      }
    },
    tr: {
      nav: ["Ana sayfa", "Hizmetler", "Eğitim ve bilgi", "Dosyalar ve belgeler", "Piyasa", "Khoobrooz"],
      services: [
        ["Gümrükleme", "Belgeler, ürün bilgisi ve gümrük yolunun ilk incelemesi.", "Uzman rota", "Gümrüklemeyi incele"],
        ["İthalat kayıt süreci", "Kayıt ön koşulları, temel belgeler ve resmi ithalat bağlantısı.", "İthalat başlangıcı", "Rotayı incele"],
        ["İthalat hizmetleri", "Ürün ve tedarikçiden taşıma, belge, kayıt ve teslimata kadar ithalat yolu.", "Ticaret hizmetleri", "Hizmeti gör"],
        ["Çin'den ithalat", "Tedarik, satın alma, taşıma, kargo ve belgelerin incelenmesi.", "Çin rotası", "İncelemeye başla"],
        ["Çin kargo", "Kargo maliyetleri, riskler ve gümrükleme bağlantısı.", "Lojistik", "Kargo detayları"],
        ["İhracat hizmetleri", "İhracat belgeleri, ürün hazırlığı, müzakere, gönderim ve takip.", "İhracat rotası", "İhracat rotası"],
        ["Ticaret eğitimi ve blog", "İthalat, ihracat, gümrük ve ticari belgeler hakkında içerik.", "Öğrenme", "Eğitime git"],
        ["Ticari dosyalar", "Belgeler, yazışmalar ve ilk tahminler için şablonlar ve kontrol listeleri.", "Pratik araçlar", "Dosyaları gör"]
      ],
      knowledge: [["Gümrükleme adımları", "Belge kontrolünden mal çıkışına kadar."], ["İthalat kayıt süreci", "Resmi ithalatta kaydın rolü."], ["Proforma ve paketleme listesi", "Dış alımda iki temel belge."]],
      docs: [["Gümrükleme kontrol listesi", "Takipten önce belgeleri kontrol edin."], ["Proforma örneği", "Satın alma bilgilerinin temel yapısı."], ["İthalat maliyet tablosu", "İthalat maliyetleri için ilk tahmin."]],
      process: ["Talep özeti", "Talep sınıflandırma", "Belge ve rota incelemesi", "Sonraki adım", "Net çıktı", ["Ticaret danışmanlığı", "Gümrükleme incelemesi", "Ticaret eğitimi", "Dosya ve listeler"]],
      pages: {
        services: ["Khoobrooz ticaret hizmetleri", "İthalat, ihracat, taşıma, gümrükleme ve ticari belgeler.", "Danışmanlık iste", "Gümrükleme", "Gör"],
        about: ["Khoobrooz hakkında", "Khoobrooz ticaret hizmetleri, gümrükleme ve dış ticaret belgeleri alanında çalışır.", "Marka konumu", "Ticaret hizmetleri merkezde; eğitim ve dosyalar kararı destekler.", "Değerler"],
        contact: ["Khoobrooz ile iletişim", "Genel iletişim için WhatsApp, gümrükleme için özel numara kullanılır.", "İletişim yolları", "Genel WhatsApp", "Gümrükleme hattı", "Danışmanlık talebi"],
        documents: ["Ticari dosyalar ve belgeler", "Dış ticaret belgelerini düzenlemek için şablonlar, listeler ve pratik dosyalar."],
        education: ["İthalat ve ihracat eğitimi", "İçerikler temel kavramları, belgeleri ve genel ithalat-ihracat adımlarını açıklar."],
        knowledge: ["Ticaret bilgi bankası", "İthalat, ihracat, gümrük ve ticari belgelerde sık kullanılan terimler."],
        news: ["Gümrük ve ticaret haberleri", "İthalat, ihracat, kayıt ve gümrük süreçleriyle ilgili haberler."],
        faq: ["Sık sorulan sorular", "Ticaret hizmetleri ve gümrükleme hakkında kısa yanıtlar."]
      }
    }
  }[language];

  const localizedNav = base.nav.map((item, index) => ({ ...item, label: common.nav[index] ?? item.label }));
  const localizedServices = base.services.map((item, index) => {
    const source = common.services[index];
    return source ? { ...item, title: source[0], description: source[1], eyebrow: source[2], cta: source[3] } : item;
  });
  const localizedKnowledge = common.knowledge.map(([title, description]) => ({ title, description }));
  const localizedDocs = common.docs.map(([title, description]) => ({ title, description }));
  const process = common.process;
  const pagePack = common.pages;

  return {
    ...base,
    brand: packs.brand,
    nav: localizedNav,
    header: packs.header,
    services: localizedServices,
    knowledgeItems: localizedKnowledge,
    documentItems: localizedDocs,
    processFlow: {
      ...base.processFlow,
      outcomeTitle: process[4] as string,
      outcomes: process[5] as string[],
      steps: base.processFlow.steps.map((step, index) => ({ ...step, title: (process[index] as string) ?? step.title }))
    },
    home: {
      ...base.home,
      hero: packs.hero,
      services: { ...base.home.services, title: pagePack.services[0], all: pagePack.services[4] },
      process: { ...base.home.process, eyebrow: process[0] as string, title: process[1] as string },
      content: { ...base.home.content, title: language === "ar" ? "المعرفة التجارية بجانب الخدمات" : language === "ru" ? "Торговые знания рядом с услугами" : language === "zh" ? "服务旁的贸易知识" : "Hizmetlerin yanında ticaret bilgisi" },
      trust: { ...base.home.trust, title: language === "ar" ? "الثقة عبر مسار واضح" : language === "ru" ? "Доверие через понятный путь" : language === "zh" ? "清晰路径建立信任" : "Net yol ile güven" }
    },
    pages: {
      ...base.pages,
      services: { ...base.pages.services, heading: pagePack.services[0], body: pagePack.services[1], consult: pagePack.services[2], customs: pagePack.services[3], view: pagePack.services[4] },
      about: { ...base.pages.about, heading: pagePack.about[0], body: pagePack.about[1], brandPosition: pagePack.about[2], brandBody: pagePack.about[3], valuesTitle: pagePack.about[4] },
      contact: { ...base.pages.contact, heading: pagePack.contact[0], body: pagePack.contact[1], methods: pagePack.contact[2], generalWhatsapp: pagePack.contact[3], customsLine: pagePack.contact[4], formTitle: pagePack.contact[5] },
      documents: { ...base.pages.documents, heading: pagePack.documents[0], body: pagePack.documents[1] },
      education: { ...base.pages.education, heading: pagePack.education[0], body: pagePack.education[1] },
      knowledge: { ...base.pages.knowledge, heading: pagePack.knowledge[0], body: pagePack.knowledge[1] },
      news: { ...base.pages.news, heading: pagePack.news[0], body: pagePack.news[1] },
      faq: { ...base.pages.faq, heading: pagePack.faq[0], body: pagePack.faq[1] }
    },
    footer: language === "ar"
      ? { intro: "علامة لخدمات التجارة، تعليم التجارة الخارجية، التخليص الجمركي والمستندات العملية.", address: "طهران، إيران؛ خدمات استشارة ومتابعة تجارية عبر الإنترنت وبالتنسيق.", pages: "الصفحات", mainServices: "الخدمات الرئيسية", contactSocial: "التواصل والشبكات", rights: "جميع الحقوق محفوظة لخوبروز." }
      : language === "ru"
        ? { intro: "Бренд торговых услуг, обучения внешней торговле, таможенного оформления и практических документов.", address: "Тегеран, Иран; онлайн-консультации и сопровождение торговых запросов.", pages: "Страницы", mainServices: "Основные услуги", contactSocial: "Контакты и соцсети", rights: "Все права защищены Khoobrooz." }
        : language === "zh"
          ? { intro: "面向外贸教育、清关和实用进出口文件的贸易服务品牌。", address: "伊朗德黑兰；提供线上协调的贸易咨询和跟进服务。", pages: "页面", mainServices: "主要服务", contactSocial: "联系与社交", rights: "Khoobrooz 保留所有权利。" }
          : { intro: "Dış ticaret eğitimi, gümrükleme ve pratik ithalat-ihracat belgeleri için ticaret hizmetleri markası.", address: "Tahran, İran; çevrim içi ve koordineli ticaret danışmanlığı.", pages: "Sayfalar", mainServices: "Ana hizmetler", contactSocial: "İletişim ve sosyal kanallar", rights: "Tüm hakları Khoobrooz'a aittir." }
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  fa,
  en,
  ar: cloneWithLanguage(en, "ar"),
  ru: cloneWithLanguage(en, "ru"),
  zh: cloneWithLanguage(en, "zh"),
  tr: cloneWithLanguage(en, "tr")
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.fa;
}

export const currencyRateSource = {
  name: "TGJU",
  url: "https://www.tgju.org/currency",
  updatedAt: "در انتظار اتصال ایجنت نرخ ارز",
  note: "نمایش عدد زنده باید از مسیر کرالر/آپدیت‌کننده تأییدشده انجام شود."
};

export const commonCurrencyRows = [
  {
    symbol: "USD",
    title: "دلار آمریکا",
    useCase: "واردات، قیمت‌گذاری کالا، حواله و اسناد تجاری",
    sourceSlug: "price_dollar_rl"
  },
  {
    symbol: "EUR",
    title: "یورو",
    useCase: "خرید اروپایی، قرارداد و محاسبه هزینه واردات",
    sourceSlug: "price_eur"
  },
  {
    symbol: "AED",
    title: "درهم امارات",
    useCase: "حواله، تجارت منطقه‌ای و واردات از مسیر امارات",
    sourceSlug: "price_aed"
  },
  {
    symbol: "GBP",
    title: "پوند انگلیس",
    useCase: "پرداخت‌های بین‌المللی و قراردادهای ارزی",
    sourceSlug: "price_gbp"
  },
  {
    symbol: "CNY",
    title: "یوان چین",
    useCase: "واردات از چین، کارگو و خرید خارجی",
    sourceSlug: "price_cny"
  },
  {
    symbol: "TRY",
    title: "لیر ترکیه",
    useCase: "تجارت منطقه‌ای و مسیرهای تأمین کالا",
    sourceSlug: "price_try"
  }
];

export const worldClockItems = [
  { city: "تهران", country: "ایران", code: "IR", flag: "🇮🇷", timeZone: "Asia/Tehran", market: "دفتر مرکزی" },
  { city: "دبی", country: "امارات", code: "AE", flag: "🇦🇪", timeZone: "Asia/Dubai", market: "حواله و واردات" },
  { city: "شانگهای", country: "چین", code: "CN", flag: "🇨🇳", timeZone: "Asia/Shanghai", market: "سورسینگ و کارگو" },
  { city: "استانبول", country: "ترکیه", code: "TR", flag: "🇹🇷", timeZone: "Europe/Istanbul", market: "تجارت منطقه‌ای" },
  { city: "هامبورگ", country: "آلمان", code: "DE", flag: "🇩🇪", timeZone: "Europe/Berlin", market: "اروپا و حمل دریایی" }
];

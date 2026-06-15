export const TGJU_API_URL =
  process.env.TGJU_API_URL ??
  "https://call2.tgju.org/ajax.json?rev=E0Wf6KUzcINqAprSkiDbnhZHdM4XGIMImkivgesQwwcAXNQ2RlfNvH4d29bM";

export type MarketRateGroup = "official" | "commercialTransfer" | "commodityTransfer" | "market" | "metal" | "coin";

export type MarketRateDefinition = {
  key?: string;
  title: string;
  symbol: string;
  unit: string;
  group: MarketRateGroup;
};

export type MarketRate = Omit<MarketRateDefinition, "key"> & {
  key: string;
  price: string;
  high: string;
  low: string;
  change: string;
  changePercent: number | null;
  direction: "high" | "low" | "neutral";
  updatedAt: string;
};

type TgjuRawRate = {
  p?: string;
  h?: string;
  l?: string;
  d?: string;
  dp?: number;
  dt?: string;
  ts?: string;
};

type TgjuResponse = {
  current?: Record<string, TgjuRawRate>;
};

export const marketRateDefinitions: MarketRateDefinition[] = [
  { title: "دلار آمریکا", symbol: "USD", unit: "ریال", group: "official" },
  { title: "یورو", symbol: "EUR", unit: "ریال", group: "official" },
  { title: "پوند انگلیس", symbol: "GBP", unit: "ریال", group: "official" },
  { title: "درهم امارات", symbol: "AED", unit: "ریال", group: "official" },
  { title: "یوان چین", symbol: "CNY", unit: "ریال", group: "official" },
  { title: "لیر ترکیه", symbol: "TRY", unit: "ریال", group: "official" },
  { key: "ice_transfer_usd_sell", title: "حواله دلار", symbol: "USD", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_eur_sell", title: "حواله یورو", symbol: "EUR", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_aed_sell", title: "حواله درهم", symbol: "AED", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_cny_sell", title: "حواله یوان", symbol: "CNY", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_rub_sell", title: "حواله روبل", symbol: "RUB", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_commodity_transfer_usd_sell", title: "حواله دلار کالای اساسی", symbol: "USD", unit: "ریال", group: "commodityTransfer" },
  { key: "ice_commodity_transfer_eur_sell", title: "حواله یورو کالای اساسی", symbol: "EUR", unit: "ریال", group: "commodityTransfer" },
  { key: "ice_commodity_transfer_aed_sell", title: "حواله درهم کالای اساسی", symbol: "AED", unit: "ریال", group: "commodityTransfer" },
  { key: "price_dollar_rl", title: "دلار بازار", symbol: "USD", unit: "ریال", group: "market" },
  { key: "price_eur", title: "یورو بازار", symbol: "EUR", unit: "ریال", group: "market" },
  { key: "price_aed", title: "درهم بازار", symbol: "AED", unit: "ریال", group: "market" },
  { key: "price_cny", title: "یوان بازار", symbol: "CNY", unit: "ریال", group: "market" },
  { key: "price_try", title: "لیر بازار", symbol: "TRY", unit: "ریال", group: "market" },
  { key: "price_rub", title: "روبل بازار", symbol: "RUB", unit: "ریال", group: "market" },
  { key: "price_iqd", title: "دینار عراق بازار", symbol: "IQD", unit: "ریال", group: "market" },
  { key: "geram18", title: "طلای ۱۸ عیار", symbol: "18K", unit: "ریال", group: "metal" },
  { key: "geram24", title: "طلای ۲۴ عیار", symbol: "24K", unit: "ریال", group: "metal" },
  { key: "mesghal", title: "مثقال طلا", symbol: "MITHQAL", unit: "ریال", group: "metal" },
  { key: "silver_999", title: "نقره ۹۹۹", symbol: "XAG 999", unit: "ریال", group: "metal" },
  { key: "silver_925", title: "نقره ۹۲۵", symbol: "XAG 925", unit: "ریال", group: "metal" },
  { key: "sekee", title: "سکه امامی", symbol: "Emami", unit: "ریال", group: "coin" },
  { key: "sekeb", title: "سکه بهار آزادی", symbol: "Bahar", unit: "ریال", group: "coin" },
  { key: "nim", title: "نیم سکه", symbol: "1/2", unit: "ریال", group: "coin" },
  { key: "rob", title: "ربع سکه", symbol: "1/4", unit: "ریال", group: "coin" },
  { key: "gerami", title: "سکه گرمی", symbol: "1g", unit: "ریال", group: "coin" }
];

export const marketRateGroupLabels: Record<MarketRateGroup, string> = {
  official: "نرخ رسمی بانک مرکزی",
  commercialTransfer: "نرخ حواله مرکز مبادله",
  commodityTransfer: "حواله کالای اساسی و دارو",
  market: "نرخ بازار برای برآورد غیررسمی",
  metal: "طلا و فلزات",
  coin: "سکه"
};

export const marketRateGroupDescriptions: Record<MarketRateGroup, string> = {
  official: "برای نمایش نرخ رسمی ارز. اتصال مستقیم بانک مرکزی به منبع قابل اعتماد نیاز دارد.",
  commercialTransfer: "برای حواله‌های تجاری و برآورد پرداخت‌های مرتبط با واردات.",
  commodityTransfer: "برای کالاهای اساسی و دارو؛ کاربرد آن با نوع کالا و مقررات روز مشخص می‌شود.",
  market: "برای برآورد عمومی بازار؛ مبنای محاسبات رسمی گمرک نیست.",
  metal: "برای رصد طلا و فلزات پرکاربرد بازار.",
  coin: "برای رصد سکه‌های رایج بازار."
};

export async function fetchTgjuMarketRates(): Promise<{ rates: MarketRate[]; fetchedAt: string; sourceName: string }> {
  const response = await fetch(TGJU_API_URL, {
    next: { revalidate: 21600 }
  });

  if (!response.ok) {
    throw new Error(`TGJU request failed with status ${response.status}`);
  }

  const data = (await response.json()) as TgjuResponse;
  const current = data.current ?? {};

  return {
    rates: marketRateDefinitions.map((definition) => normalizeRate(definition, definition.key ? current[definition.key] : undefined)),
    fetchedAt: new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }),
    sourceName: "TGJU"
  };
}

function normalizeRate(definition: MarketRateDefinition, raw?: TgjuRawRate): MarketRate {
  if (!raw && definition.group === "official") {
    return {
      ...definition,
      key: definition.key ?? `official_${definition.symbol.toLowerCase()}`,
      price: "در انتظار اتصال منبع رسمی",
      high: "—",
      low: "—",
      change: "—",
      changePercent: null,
      direction: "neutral",
      updatedAt: "بانک مرکزی"
    };
  }

  return {
    ...definition,
    key: definition.key ?? `official_${definition.symbol.toLowerCase()}`,
    price: raw?.p ?? "ناموجود",
    high: raw?.h ?? "ناموجود",
    low: raw?.l ?? "ناموجود",
    change: raw?.d ?? "۰",
    changePercent: typeof raw?.dp === "number" ? raw.dp : null,
    direction: raw?.dt === "high" ? "high" : raw?.dt === "low" ? "low" : "neutral",
    updatedAt: raw?.ts ?? "نامشخص"
  };
}

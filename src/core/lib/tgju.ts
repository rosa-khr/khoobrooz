export type MarketRateGroup = "official" | "commercialTransfer" | "commodityTransfer" | "market" | "metal" | "coin" | "board";

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
  { key: "price_dollar_rl", title: "دلار", symbol: "USD", unit: "ریال", group: "market" },
  { key: "price_eur", title: "یورو", symbol: "EUR", unit: "ریال", group: "market" },
  { key: "price_aed", title: "درهم", symbol: "AED", unit: "ریال", group: "market" },
  { key: "price_cny", title: "یوان", symbol: "CNY", unit: "ریال", group: "market" },
  { key: "price_try", title: "لیر", symbol: "TRY", unit: "ریال", group: "market" },
  { key: "price_rub", title: "روبل", symbol: "RUB", unit: "ریال", group: "market" },
  { key: "price_iqd", title: "دینار عراق", symbol: "IQD", unit: "ریال", group: "market" },
  { key: "geram18", title: "طلای ۱۸ عیار", symbol: "18K", unit: "ریال", group: "metal" },
  { key: "geram24", title: "طلای ۲۴ عیار", symbol: "24K", unit: "ریال", group: "metal" },
  { key: "mesghal", title: "مثقال طلا", symbol: "MITHQAL", unit: "ریال", group: "metal" },
  { key: "ons", title: "انس جهانی طلا", symbol: "XAU", unit: "دلار", group: "metal" },
  { key: "silver_999", title: "نقره ۹۹۹", symbol: "XAG 999", unit: "ریال", group: "metal" },
  { key: "silver_925", title: "نقره ۹۲۵", symbol: "XAG 925", unit: "ریال", group: "metal" },
  { key: "sekee", title: "سکه امامی", symbol: "Emami", unit: "ریال", group: "coin" },
  { key: "sekeb", title: "سکه بهار آزادی", symbol: "Bahar", unit: "ریال", group: "coin" },
  { key: "nim", title: "نیم سکه", symbol: "1/2", unit: "ریال", group: "coin" },
  { key: "rob", title: "ربع سکه", symbol: "1/4", unit: "ریال", group: "coin" },
  { key: "gerami", title: "سکه گرمی", symbol: "1g", unit: "ریال", group: "coin" },
  { key: "bourse", title: "بورس", symbol: "TSE", unit: "واحد", group: "board" },
  { key: "oil_brent", title: "نفت برنت", symbol: "BRENT", unit: "دلار", group: "board" },
  { key: "crypto-bitcoin", title: "بیت‌کوین", symbol: "BTC", unit: "دلار", group: "board" }
];

export const marketRateGroupLabels: Record<MarketRateGroup, string> = {
  official: "نرخ رسمی بانک مرکزی",
  commercialTransfer: "نرخ حواله مرکز مبادله",
  commodityTransfer: "حواله کالای اساسی و دارو",
  market: "نرخ ارز",
  metal: "طلا و فلزات",
  coin: "سکه",
  board: "برد بازار"
};

export const marketRateGroupDescriptions: Record<MarketRateGroup, string> = {
  official: "نرخ رسمی ارز.",
  commercialTransfer: "حواله‌های تجاری.",
  commodityTransfer: "حواله کالاهای اساسی و دارو.",
  market: "نرخ روز ارزهای پرکاربرد بازار.",
  metal: "طلا و فلزات پرکاربرد بازار.",
  coin: "سکه‌های رایج بازار.",
  board: "نمای کوتاه نرخ‌های مهم بازار."
};

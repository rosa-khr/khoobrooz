export const marketRatesCacheTtlMs = Number(process.env.NEXT_PUBLIC_MARKET_RATES_CACHE_TTL_MS ?? 3600000);
export const marketRatesCacheKey = "khoobrooz:market-rates:v1";
export const marketRatesWebSocketPath = "/ws/market-rates";

export function getMarketRatesWebSocketUrl() {
  if (process.env.NEXT_PUBLIC_MARKET_RATES_WS_URL) {
    return process.env.NEXT_PUBLIC_MARKET_RATES_WS_URL;
  }

  if (typeof window === "undefined") {
    return `ws://127.0.0.1:8000${marketRatesWebSocketPath}`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const hostname = window.location.hostname || "127.0.0.1";

  return `${protocol}//${hostname}:8000${marketRatesWebSocketPath}`;
}

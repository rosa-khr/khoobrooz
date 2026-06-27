import type { MarketRate } from "@/core/lib/tgju";
import { marketRatesCacheKey, marketRatesCacheTtlMs } from "@/core/lib/marketRateConfig";

export type CachedMarketRates = {
  rates: MarketRate[];
  fetchedAt: string;
  cachedAt: number;
};

type MarketRatesApiPayload = {
  ok?: boolean;
  rates?: MarketRate[];
  fetchedAt?: string;
  message?: string;
};

let inFlightRequest: Promise<CachedMarketRates> | null = null;

function parseCachedMarketRates(value: string | null): CachedMarketRates | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CachedMarketRates>;

    if (!Array.isArray(parsed.rates) || typeof parsed.cachedAt !== "number") {
      return null;
    }

    return {
      rates: parsed.rates,
      fetchedAt: parsed.fetchedAt ?? "نامشخص",
      cachedAt: parsed.cachedAt
    };
  } catch {
    return null;
  }
}

export function getCachedMarketRates(): CachedMarketRates | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseCachedMarketRates(window.localStorage.getItem(marketRatesCacheKey));
}

function isFresh(cache: CachedMarketRates) {
  return Date.now() - cache.cachedAt < marketRatesCacheTtlMs;
}

function saveMarketRates(payload: Omit<CachedMarketRates, "cachedAt">): CachedMarketRates {
  const cache = {
    ...payload,
    cachedAt: Date.now()
  };

  window.localStorage.setItem(marketRatesCacheKey, JSON.stringify(cache));
  return cache;
}

export async function getMarketRatesWithCache({ force = false }: { force?: boolean } = {}): Promise<CachedMarketRates> {
  const cached = getCachedMarketRates();

  if (!force && cached && isFresh(cached)) {
    return cached;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetch("/api/market-rates", { cache: "no-store" })
    .then(async (response) => {
      const payload = (await response.json()) as MarketRatesApiPayload;

      if (!response.ok || payload.ok === false) {
        throw new Error(payload.message ?? "Market rates refresh failed");
      }

      return saveMarketRates({
        rates: payload.rates ?? [],
        fetchedAt: payload.fetchedAt ?? "نامشخص"
      });
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

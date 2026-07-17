import type { MarketRate } from "@/core/lib/marketRatesSchema";
import { getMarketRatesWebSocketUrl, marketRatesCacheKey, marketRatesCacheTtlMs } from "@/core/lib/marketRateConfig";

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
let liveSocket: WebSocket | null = null;
let liveReconnectTimer: number | null = null;
let liveReconnectAttempt = 0;
const liveListeners = new Set<(payload: CachedMarketRates) => void>();
const liveErrorListeners = new Set<() => void>();

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

function normalizeMarketRatesPayload(payload: MarketRatesApiPayload): Omit<CachedMarketRates, "cachedAt"> {
  return {
    rates: payload.rates ?? [],
    fetchedAt: payload.fetchedAt ?? "نامشخص"
  };
}

function publishMarketRates(payload: CachedMarketRates) {
  liveListeners.forEach((listener) => listener(payload));
}

function publishLiveError() {
  liveErrorListeners.forEach((listener) => listener());
}

function scheduleLiveReconnect() {
  if (liveListeners.size === 0 || liveReconnectTimer !== null) {
    return;
  }

  const delay = Math.min(30000, 1000 * 2 ** liveReconnectAttempt);
  liveReconnectAttempt += 1;

  liveReconnectTimer = window.setTimeout(() => {
    liveReconnectTimer = null;
    openMarketRatesSocket();
  }, delay);
}

function closeMarketRatesSocket() {
  if (liveReconnectTimer !== null) {
    window.clearTimeout(liveReconnectTimer);
    liveReconnectTimer = null;
  }

  liveSocket?.close();
  liveSocket = null;
  liveReconnectAttempt = 0;
}

function openMarketRatesSocket() {
  if (typeof window === "undefined" || !("WebSocket" in window) || liveSocket || liveListeners.size === 0) {
    return;
  }

  const socket = new WebSocket(getMarketRatesWebSocketUrl());
  liveSocket = socket;

  socket.addEventListener("open", () => {
    liveReconnectAttempt = 0;
  });

  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(String(event.data)) as MarketRatesApiPayload;

      if (payload.ok === false) {
        publishLiveError();
        return;
      }

      const cache = saveMarketRates(normalizeMarketRatesPayload(payload));
      publishMarketRates(cache);
    } catch {
      publishLiveError();
    }
  });

  socket.addEventListener("error", () => {
    publishLiveError();
  });

  socket.addEventListener("close", () => {
    if (liveSocket === socket) {
      liveSocket = null;
      scheduleLiveReconnect();
    }
  });
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

      const cache = saveMarketRates(normalizeMarketRatesPayload(payload));
      publishMarketRates(cache);

      return cache;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export function subscribeToMarketRates(
  listener: (payload: CachedMarketRates) => void,
  options: { onError?: () => void } = {}
) {
  liveListeners.add(listener);

  if (options.onError) {
    liveErrorListeners.add(options.onError);
  }

  const cached = getCachedMarketRates();

  if (cached) {
    listener(cached);
  }

  openMarketRatesSocket();

  return () => {
    liveListeners.delete(listener);

    if (options.onError) {
      liveErrorListeners.delete(options.onError);
    }

    if (liveListeners.size === 0) {
      closeMarketRatesSocket();
    }
  };
}

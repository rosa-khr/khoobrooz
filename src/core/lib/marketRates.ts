import type { MarketRate } from "@/core/lib/tgju";

export type MarketRatesPayload = {
  rates: MarketRate[];
  fetchedAt: string;
  sourceName: string;
};

const backendApiBaseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

export async function fetchBackendMarketRates(): Promise<MarketRatesPayload> {
  const response = await fetch(`${backendApiBaseUrl.replace(/\/$/, "")}/market-rates/board`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Backend market rates request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<MarketRatesPayload> & { ok?: boolean; message?: string };

  if (payload.ok === false) {
    throw new Error(payload.message ?? "Backend market rates request failed");
  }

  return {
    rates: payload.rates ?? [],
    fetchedAt: payload.fetchedAt ?? "نامشخص",
    sourceName: payload.sourceName ?? "TGJU"
  };
}

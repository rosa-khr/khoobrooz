import http from "node:http";

const port = Number(process.env.BACKEND_PORT ?? 8000);
const syncIntervalMs = Number(process.env.TGJU_SYNC_INTERVAL_MS ?? 120000);
const tgjuApiUrl =
  process.env.TGJU_API_URL ??
  "https://call2.tgju.org/ajax.json?rev=E0Wf6KUzcINqAprSkiDbnhZHdM4XGIMImkivgesQwwcAXNQ2RlfNvH4d29bM";

const definitions = [
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
  { key: "sekee", title: "سکه امامی", symbol: "Emami", unit: "ریال", group: "coin" },
  { key: "sekeb", title: "سکه بهار آزادی", symbol: "Bahar", unit: "ریال", group: "coin" },
  { key: "nim", title: "نیم سکه", symbol: "1/2", unit: "ریال", group: "coin" },
  { key: "rob", title: "ربع سکه", symbol: "1/4", unit: "ریال", group: "coin" },
  { key: "gerami", title: "سکه گرمی", symbol: "1g", unit: "ریال", group: "coin" }
];

let board = {
  rates: [],
  fetchedAt: "نامشخص",
  sourceName: "TGJU"
};
let lastError = null;
let syncing = false;

function normalizeDirection(direction) {
  if (direction === "high" || direction === "low") {
    return direction;
  }

  return "neutral";
}

async function syncTgju() {
  if (syncing) {
    return;
  }

  syncing = true;

  try {
    const response = await fetch(tgjuApiUrl, {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`TGJU request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const current = payload.current ?? {};

    board = {
      rates: definitions.map((definition) => {
        const raw = current[definition.key] ?? {};

        return {
          ...definition,
          price: raw.p ?? "ناموجود",
          high: raw.h ?? "ناموجود",
          low: raw.l ?? "ناموجود",
          change: raw.d ?? "۰",
          changePercent: typeof raw.dp === "number" ? raw.dp : null,
          direction: normalizeDirection(raw.dt),
          updatedAt: raw.ts ?? "نامشخص"
        };
      }),
      fetchedAt: new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }),
      sourceName: "TGJU"
    };
    lastError = null;
    console.log(`[tgju-dev] synced ${board.rates.length} rates at ${board.fetchedAt}`);
  } catch (error) {
    lastError = error instanceof Error ? error.message : "TGJU sync failed";
    console.error(`[tgju-dev] ${lastError}`);
  } finally {
    syncing = false;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "GET" && (url.pathname === "/api/v1/market-rates" || url.pathname === "/api/v1/market-rates/board")) {
    if (board.rates.length === 0) {
      await syncTgju();
    }

    sendJson(response, lastError && board.rates.length === 0 ? 502 : 200, {
      ok: !lastError || board.rates.length > 0,
      ...board,
      message: lastError
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/admin/market-rates/sync") {
    await syncTgju();
    sendJson(response, lastError ? 502 : 200, {
      ok: !lastError,
      ...board,
      message: lastError
    });
    return;
  }

  sendJson(response, 404, {
    ok: false,
    message: "Not found"
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[tgju-dev] backend listening on http://127.0.0.1:${port}`);
  syncTgju();
  setInterval(syncTgju, syncIntervalMs);
});

import http from "node:http";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import mysql from "mysql2/promise";

const port = Number(process.env.BACKEND_PORT ?? 8000);
const syncIntervalMs = Number(process.env.TGJU_SYNC_INTERVAL_MS ?? 120000);
const contentSourceSyncIntervalMs = Number(process.env.CONTENT_SOURCE_SYNC_INTERVAL_MS ?? 1800000);
const databasePassword = process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD;

if (!databasePassword) {
  throw new Error("DB_PASSWORD must be set.");
}

const tgjuApiUrl =
  process.env.TGJU_API_URL ??
  "https://call2.tgju.org/ajax.json?rev=E0Wf6KUzcINqAprSkiDbnhZHdM4XGIMImkivgesQwwcAXNQ2RlfNvH4d29bM";
const databasePool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  database: process.env.DB_DATABASE ?? process.env.MYSQL_DATABASE ?? "khoobrooz",
  user: process.env.DB_USERNAME ?? process.env.MYSQL_USER ?? "khoobrooz",
  password: databasePassword,
  charset: "utf8mb4_unicode_ci",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 5
});

const definitions = [
  { key: "price_dollar_rl", title: "دلار", symbol: "USD", unit: "ریال", group: "market" },
  { key: "price_eur", title: "یورو", symbol: "EUR", unit: "ریال", group: "market" },
  { key: "price_aed", title: "درهم", symbol: "AED", unit: "ریال", group: "market" },
  { key: "price_cny", title: "یوان", symbol: "CNY", unit: "ریال", group: "market" },
  { key: "price_try", title: "لیر", symbol: "TRY", unit: "ریال", group: "market" },
  { key: "price_rub", title: "روبل", symbol: "RUB", unit: "ریال", group: "market" },
  { key: "price_iqd", title: "دینار عراق", symbol: "IQD", unit: "ریال", group: "market" },
  { key: "ice_transfer_usd_sell", title: "حواله تجاری دلار", symbol: "USD", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_eur_sell", title: "حواله تجاری یورو", symbol: "EUR", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_aed_sell", title: "حواله تجاری درهم", symbol: "AED", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_cny_sell", title: "حواله تجاری یوان", symbol: "CNY", unit: "ریال", group: "commercialTransfer" },
  { key: "ice_transfer_rub_sell", title: "حواله تجاری روبل", symbol: "RUB", unit: "ریال", group: "commercialTransfer" },
  { key: "geram18", title: "طلای ۱۸ عیار", symbol: "18K", unit: "ریال", group: "metal" },
  { key: "geram24", title: "طلای ۲۴ عیار", symbol: "24K", unit: "ریال", group: "metal" },
  { key: "mesghal", title: "مثقال طلا", symbol: "MITHQAL", unit: "ریال", group: "metal" },
  { key: "sekee", title: "سکه امامی", symbol: "Emami", unit: "ریال", group: "coin" },
  { key: "sekeb", title: "سکه بهار آزادی", symbol: "Bahar", unit: "ریال", group: "coin" },
  { key: "nim", title: "نیم سکه", symbol: "1/2", unit: "ریال", group: "coin" },
  { key: "rob", title: "ربع سکه", symbol: "1/4", unit: "ریال", group: "coin" },
  { key: "gerami", title: "سکه گرمی", symbol: "1g", unit: "ریال", group: "coin" }
];

let board = { rates: [], fetchedAt: "نامشخص" };
let lastError = null;
let syncing = false;
let contentSourceSyncing = false;
const marketRateSockets = new Set();

function getMarketRatesSocketPayload() {
  return {
    ok: !lastError || board.rates.length > 0,
    ...board,
    message: lastError
  };
}

function createWebSocketFrame(payload, opcode = 0x1) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload), "utf8");
  const headerLength = data.length < 126 ? 2 : data.length <= 65535 ? 4 : 10;
  const frame = Buffer.allocUnsafe(headerLength + data.length);

  frame[0] = 0x80 | opcode;

  if (data.length < 126) {
    frame[1] = data.length;
    data.copy(frame, 2);
  } else if (data.length <= 65535) {
    frame[1] = 126;
    frame.writeUInt16BE(data.length, 2);
    data.copy(frame, 4);
  } else {
    frame[1] = 127;
    frame.writeBigUInt64BE(BigInt(data.length), 2);
    data.copy(frame, 10);
  }

  return frame;
}

function sendMarketRatesSocketPayload(socket) {
  if (socket.destroyed) return;
  socket.write(createWebSocketFrame(JSON.stringify(getMarketRatesSocketPayload())), (error) => {
    if (error) {
      socket.destroy();
      marketRateSockets.delete(socket);
    }
  });
}

function broadcastMarketRates() {
  for (const socket of marketRateSockets) {
    sendMarketRatesSocketPayload(socket);
  }
}

function handleWebSocketData(socket, buffer) {
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const firstByte = buffer[offset];
    const secondByte = buffer[offset + 1];
    const opcode = firstByte & 0x0f;
    let payloadLength = secondByte & 0x7f;
    let headerLength = 2;

    if (payloadLength === 126) {
      if (offset + 4 > buffer.length) return;
      payloadLength = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (payloadLength === 127) {
      if (offset + 10 > buffer.length) return;
      const largePayloadLength = buffer.readBigUInt64BE(offset + 2);
      if (largePayloadLength > BigInt(Number.MAX_SAFE_INTEGER)) {
        socket.destroy();
        return;
      }
      payloadLength = Number(largePayloadLength);
      headerLength = 10;
    }

    const masked = Boolean(secondByte & 0x80);
    const frameLength = headerLength + (masked ? 4 : 0) + payloadLength;
    if (offset + frameLength > buffer.length) return;

    if (opcode === 0x8) {
      socket.end(createWebSocketFrame("", 0x8));
      marketRateSockets.delete(socket);
      return;
    }

    if (opcode === 0x9) {
      socket.write(createWebSocketFrame("", 0xA));
    }

    offset += frameLength;
  }
}

function handleMarketRatesSocket(request, socket) {
  const websocketKey = request.headers["sec-websocket-key"];

  if (typeof websocketKey !== "string") {
    socket.destroy();
    return;
  }

  const acceptKey = crypto
    .createHash("sha1")
    .update(`${websocketKey}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptKey}`,
      "",
      ""
    ].join("\r\n")
  );

  marketRateSockets.add(socket);
  socket.on("data", (buffer) => handleWebSocketData(socket, buffer));
  socket.on("close", () => marketRateSockets.delete(socket));
  socket.on("error", () => marketRateSockets.delete(socket));

  if (board.rates.length === 0) {
    void syncTgju().then(() => sendMarketRatesSocketPayload(socket));
  } else {
    sendMarketRatesSocketPayload(socket);
  }
}

const adminResources = new Set(["menus", "categories", "pages", "services", "articles", "news", "tags", "world-clocks", "countries", "content-sources", "source-items"]);
const adminResourceTables = {
  menus: "menus",
  categories: "categories",
  pages: "pages",
  services: "services",
  articles: "articles",
  news: "news",
  tags: "tags",
  "world-clocks": "world_clock_items",
  countries: "countries",
  "content-sources": "content_sources",
  "source-items": "source_items"
};

const relevantKeywords = [
  "واردات", "صادرات", "تجارت خارجی", "گمرک", "بخشنامه", "تعرفه", "حقوق ورودی", "سود بازرگانی",
  "ثبت سفارش", "سامانه جامع تجارت", "تخصیص ارز", "تأمین ارز", "تامین ارز", "رفع تعهد ارزی",
  "حواله", "حواله یوان", "یوان", "دلار", "درهم", "ارز تجاری", "بانک مرکزی", "وزارت صمت",
  "سازمان توسعه تجارت", "کارت بازرگانی", "ممنوعیت واردات", "ممنوعیت صادرات", "مجوز واردات",
  "مجوز صادرات", "ترخیص کالا", "ارزش گمرکی", "HS Code", "کد تعرفه", "چین", "تجارت ایران و چین",
  "خرید از چین", "حمل دریایی", "حمل هوایی", "بندر", "کانتینر", "ثبت منشأ ارز", "پروفرما", "اینکوترمز",
  "import", "export", "customs", "tariff", "trade", "shipping", "container", "china"
];

const catalogPageRequest = {
  pageing: { pageNumbber: 1, PageSize: 15 },
  sorting: [{ field: "string", direction: "asc|desc" }],
  filters: {}
};

const catalogResponse = (items, total = "number") => ({ responseStatus: "0|1", response: { items, total } });
const serviceCatalog = [
  { id: 1, serviceName: "MenuService", title: "Site menus", description: "Navigation menu contract.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 100 + index + 1, name, title: `${name} menu`, method: "POST", path: `/api/admin/menus/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number" } }, response: catalogResponse([{ id: "number", title: "string", url: "string", accuracy: "0|1|2" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 9, serviceName: "CategoryService", title: "Categories", description: "SEO category pages for encyclopedia, news, and circulars.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 900 + index + 1, name, title: `${name} category`, method: "POST", path: `/api/admin/categories/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", parentId: "number|null", type: "encyclopedia|news|circular", seoTitle: "string", seoDescription: "string" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", type: "string" }], name === "loadPage" ? "number" : 1), status: "active" })) },
  { id: 10, serviceName: "PageService", title: "Pages", description: "Editable static landing pages and route content.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 1000 + index + 1, name, title: `${name} page`, method: "POST", path: `/api/admin/pages/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", summary: "string", content: "string" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", summary: "string" }], name === "loadPage" ? "number" : 1), status: "active" })) },
  { id: 2, serviceName: "ArticleService", title: "Articles", description: "Article content, tags, approval, publishing, and SEO.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 200 + index + 1, name, title: `${name} article`, method: "POST", path: `/api/admin/articles/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", tagIds: ["number"] } }, response: catalogResponse([{ id: "number", title: "string", approve: "boolean", tagIds: ["number"] }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 3, serviceName: "NewsService", title: "News", description: "News content, tags, approval, publishing, and SEO.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 300 + index + 1, name, title: `${name} news`, method: "POST", path: `/api/admin/news/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", tagIds: ["number"] } }, response: catalogResponse([{ id: "number", title: "string", approve: "boolean", tagIds: ["number"] }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 4, serviceName: "TagService", title: "Tags", description: "Tag lookup and tag landing-page content.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 400 + index + 1, name, title: `${name} tag`, method: "POST", path: `/api/admin/tags/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", content: "string", seoTitle: "string", seoDescription: "string", accuracy: "0|1|2" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", content: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 5, serviceName: "ServiceService", title: "Services", description: "Dynamic trade-service cards and service pages.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 500 + index + 1, name, title: `${name} service`, method: "POST", path: `/api/admin/services/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", summary: "string", accuracy: "0|1|2" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", summary: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 6, serviceName: "WorldClockService", title: "World clocks", description: "Selected trade cities, up to seven active items.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 600 + index + 1, name, title: `${name} world clock`, method: "POST", path: `/api/admin/world-clocks/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", countryId: "number|null" } }, response: catalogResponse([{ id: "number", city: "string", country: "string", timezone: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 7, serviceName: "CountryService", title: "Countries", description: "Country lookup for admin dropdowns.", actions: [
    { id: 701, name: "loadPage", title: "loadPage countries", method: "POST", path: "/api/admin/countries/loadPage", scope: "Admin", request: catalogPageRequest, response: catalogResponse([{ id: "number", nameFa: "string", capital: "string|null", continent: "string" }]), status: "planned" },
    { id: 702, name: "cities", title: "load country cities", method: "POST", path: "/api/admin/countries/cities", scope: "Admin", request: { body: { countryId: "number" } }, response: catalogResponse([{ id: "number", city: "string", cityEn: "string", timezone: "string" }]), status: "active" }
  ] },
  { id: 8, serviceName: "MarketRateService", title: "Market rates", description: "Market-rate board used by frontend.", actions: [{ id: 801, name: "loadPage", title: "Load market board", method: "POST", path: "/api/v1/market-rates/board", scope: "Public", request: catalogPageRequest, response: catalogResponse([{ key: "string", title: "string", price: "string" }]), status: "active" }] },
  { id: 11, serviceName: "ContentSourceService", title: "Content sources", description: "RSS/Atom/API/Scraper/manual source configuration for trade news monitoring.", actions: ["loadPage", "find", "add", "update", "delete", "fetch", "fetchAll"].map((name, index) => ({ id: 1100 + index + 1, name, title: `${name} content source`, method: "POST", path: `/api/admin/content-sources/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", sourceType: "rss|atom|api|scraper|manual", allowAutoPublish: false } }, response: catalogResponse([{ id: "number", name: "string", connectionStatus: "ready|needs_configuration|manual_required|error" }], name === "loadPage" ? "number" : 1), status: "active" })) },
  { id: 12, serviceName: "SourceItemService", title: "Source items", description: "Incoming news/circular review queue. No item is auto-published.", actions: ["loadPage", "find", "update", "approve", "publish", "reject", "archive", "markDuplicate"].map((name, index) => ({ id: 1200 + index + 1, name, title: `${name} source item`, method: "POST", path: `/api/admin/source-items/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", processingStatus: "pending_review|approved|published|rejected|duplicate|archived|failed" } }, response: catalogResponse([{ id: "number", originalTitle: "string", processingStatus: "pending_review" }], name === "loadPage" ? "number" : 1), status: "active" })) }
];

function sqlString(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "NULL";
}

function sqlBit(value) {
  return value === true || value === "true" || value === 1 || value === "1" ? "1" : "0";
}

function sqlDateValue(value) {
  if (!value) return "NULL";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "NULL";
  return sqlString(date.toISOString().slice(0, 19).replace("T", " "));
}

function normalizeAccuracy(value) {
  const parsed = Number(value);
  return parsed === 1 || parsed === 2 ? parsed : 0;
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value ?? ""), "utf8").digest("hex");
}

function decodeEntities(value = "") {
  return String(value)
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .trim();
}

function stripUnsafeHtml(value = "") {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function textFromHtml(value = "") {
  return stripUnsafeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeTitle(value = "") {
  return textFromHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
}

function isPrivateHostname(hostname = "") {
  const host = hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(host)) return true;
  if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  if (/^169\.254\./.test(host) || /^metadata\.google\.internal$/.test(host)) return true;
  return false;
}

function safeUrl(value, baseUrl = "") {
  try {
    const parsed = new URL(value, baseUrl || undefined);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    if (isPrivateHostname(parsed.hostname)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function xmlTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return decodeEntities(match?.[1] ?? "");
}

function xmlAttr(block, tagName, attrName) {
  const match = block.match(new RegExp(`<${tagName}\\b([^>]*)>`, "i"));
  const attrs = match?.[1] ?? "";
  const attr = attrs.match(new RegExp(`${attrName}=["']([^"']+)["']`, "i"));
  return decodeEntities(attr?.[1] ?? "");
}

function parseFeedItems(xml, source) {
  const sourceBase = source.feedUrl || source.websiteUrl || "";
  const rssBlocks = [...String(xml).matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const atomBlocks = [...String(xml).matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  const blocks = rssBlocks.length ? rssBlocks : atomBlocks;
  const isAtom = !rssBlocks.length && atomBlocks.length > 0;

  return blocks.map((block) => {
    const title = textFromHtml(xmlTag(block, "title"));
    const summary = stripUnsafeHtml(xmlTag(block, "description") || xmlTag(block, "summary"));
    const content = stripUnsafeHtml(xmlTag(block, "content:encoded") || xmlTag(block, "content") || summary);
    const guid = xmlTag(block, "guid") || xmlTag(block, "id");
    const link = isAtom ? xmlAttr(block, "link", "href") || xmlTag(block, "link") : xmlTag(block, "link");
    const image = xmlAttr(block, "media:content", "url") || xmlAttr(block, "enclosure", "url");
    const author = xmlTag(block, "dc:creator") || xmlTag(block, "author");
    const published = xmlTag(block, "pubDate") || xmlTag(block, "published") || xmlTag(block, "updated");
    const updated = xmlTag(block, "updated");
    const sourceUrl = safeUrl(link || guid, sourceBase);

    return {
      guid: guid || sourceUrl,
      sourceUrl,
      originalTitle: title,
      originalSummary: summary,
      originalContent: content,
      originalImageUrl: safeUrl(image, sourceBase),
      originalAuthor: textFromHtml(author),
      sourcePublishedAt: published ? new Date(published) : null,
      sourceUpdatedAt: updated ? new Date(updated) : null,
      rawPayload: { block: block.slice(0, 8000) }
    };
  }).filter((item) => item.originalTitle && item.sourceUrl);
}

function relevanceScore(item) {
  const haystack = `${item.originalTitle} ${textFromHtml(item.originalSummary)} ${textFromHtml(item.originalContent)}`.toLowerCase();
  const hits = relevantKeywords.filter((keyword) => haystack.includes(keyword.toLowerCase())).length;
  return Math.min(100, hits * 12);
}

function detectContentType(source, item) {
  const haystack = `${item.originalTitle} ${textFromHtml(item.originalSummary)}`;
  if (source.defaultArticleType && source.defaultArticleType !== "news") return source.defaultArticleType;
  if (/بخشنامه|ابلاغیه|مصوبه|آیین.?نامه|تصویب.?نامه|مقرره|regulation|circular/i.test(haystack)) return "circular";
  return "news";
}

function successResponse(items = [], total = 0) {
  return { responseStatus: 1, response: { items: Array.isArray(items) ? items : [items].filter(Boolean), total } };
}

function errorResponse(message) {
  return { responseStatus: 0, response: { items: [], total: 0 }, message };
}

function normalizeAdminItems(resource, items = []) {
  return items.map((item) => {
    if ((resource === "articles" || resource === "news") && typeof item.tagIdsCsv === "string") {
      return {
        ...item,
        tagIds: item.tagIdsCsv.split(",").map((value) => Number(value)).filter(Number.isFinite),
        tagTitles: typeof item.tagTitlesCsv === "string" ? item.tagTitlesCsv.split("، ").filter(Boolean) : [],
        tagIdsCsv: undefined,
        tagTitlesCsv: undefined
      };
    }
    return item;
  });
}

function getPageRequest(body = {}) {
  const pageing = body.pageing ?? body.paging ?? {};
  const pageNumber = Number(pageing.pageNumbber ?? pageing.pageNumber ?? body.pageNumbber ?? body.pageNumber ?? 1);
  const pageSize = Number(pageing.PageSize ?? pageing.pageSize ?? body.PageSize ?? body.pageSize ?? 15);
  return {
    filters: body.filters && typeof body.filters === "object" ? body.filters : {},
    pageNumber: Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 15,
    sorting: Array.isArray(body.sorting) ? body.sorting : []
  };
}

function firstSort(sorting, allowedColumns, fallback) {
  const sort = sorting[0] ?? {};
  const requestedColumn = allowedColumns[sort.field] ?? allowedColumns[sort.column];
  const direction = String(sort.direction ?? sort.sort ?? "").toLowerCase() === "asc" ? "ASC" : "DESC";
  return requestedColumn ? `${requestedColumn} ${direction}` : fallback;
}

function filterConditions(filters, map) {
  return Object.entries(filters)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => {
      const column = map[key];
      if (!column) return null;
      if (typeof value === "boolean") return `${column} = ${value ? 1 : 0}`;
      if (typeof value === "number") return `${column} = ${value}`;
      if (key === "search") {
        return `(${column.split("|").map((part) => `${part} LIKE ${sqlString(`%${value}%`)}`).join(" OR ")})`;
      }
      return `${column} = ${sqlString(value)}`;
    })
    .filter(Boolean);
}

function continentCase(alias = "") {
  const prefix = alias ? `${alias}.` : "";
  return `CASE
    WHEN ${prefix}iso2 IN ('CN','JP','KR','IN','AE','TR','IQ','RU','SG','MY','TH','VN','ID','PH','SA','QA','KW','OM','PK','AF','AM','AZ','BH','BD','BT','BN','KH','CY','GE','HK','IR','IL','JO','KZ','KG','LA','LB','MO','MV','MN','MM','NP','PS','LK','SY','TW','TJ','TL','TM','UZ','YE') THEN 'Asia'
    WHEN ${prefix}iso2 IN ('DE','GB','FR','IT','ES','NL','BE','CH','AT','SE','NO','DK','FI','PL','CZ','GR','IE','PT','RO','UA','BY','BG','HR','IS','LV','LT','LU','MT','MD','RS','SK','SI','AL','AD','BA','MK','ME') THEN 'Europe'
    WHEN ${prefix}iso2 IN ('US','CA','MX','GT','BZ','SV','HN','NI','CR','PA','CU','DO','HT','JM','TT','BS','BB','AG','DM','GD','KN','LC','VC') THEN 'North America'
    WHEN ${prefix}iso2 IN ('BR','AR','CL','CO','PE','VE','UY','PY','BO','EC','GY','SR') THEN 'South America'
    WHEN ${prefix}iso2 IN ('ZA','EG','MA','NG','KE','ET','DZ','TN','GH','CI','CM','SN','TZ','UG','AO','BJ','BW','BF','BI','CV','CF','TD','KM','CG','CD','DJ','GQ','ER','GA','GM','GN','GW','LS','LR','LY','MG','MW','ML','MR','MU','MZ','NA','NE','RW','SC','SL','SO','SS','SD','SZ','TG','ZM','ZW') THEN 'Africa'
    WHEN ${prefix}iso2 IN ('AU','NZ','FJ','PG','SB','VU','WS','TO','KI','FM','MH','NR','PW','TV') THEN 'Oceania'
    ELSE 'Other'
  END`;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function runSql(query) {
  const [results] = await databasePool.query(query);
  const resultSets = Array.isArray(results) && results.some(Array.isArray) ? results : [results];
  const values = [];

  for (const resultSet of resultSets) {
    if (!Array.isArray(resultSet)) continue;
    for (const row of resultSet) {
      for (const value of Object.values(row)) {
        if (value !== null && value !== undefined) {
          values.push(typeof value === "string" ? value : JSON.stringify(value));
        }
      }
    }
  }

  return values.join("\n").trim();
}

async function runJsonSql(query, fallback = {}) {
  const output = await runSql(query);
  if (!output) return fallback;
  const start = output.search(/[{\[]/);
  const end = Math.max(output.lastIndexOf("}"), output.lastIndexOf("]"));
  if (start === -1 || end === -1) return fallback;
  return JSON.parse(output.slice(start, end + 1));
}

async function ensureContentIngestionSchema() {
  const schemaSql = readFileSync("database-design/mysql/001_core_schema.sql", "utf8");
  const seedSql = readFileSync("database-design/mysql/006_content_ingestion_seed.sql", "utf8");
  await runSql(schemaSql);
  await runSql(seedSql);
  console.log("[content-ingestion] ensured content source tables and initial sources");
}

function mysqlDate(column) {
  return `DATE_FORMAT(${column}, '%Y-%m-%d %H:%i:%s')`;
}

function jsonArraySelect(selectSql, fromSql, whereSql, orderSql, limitSql = "") {
  return `
    SELECT JSON_OBJECT(
      'data', COALESCE((SELECT JSON_ARRAYAGG(row_json) FROM (${selectSql} ${fromSql} ${whereSql} ${orderSql} ${limitSql}) AS rows_source), JSON_ARRAY()),
      'total', (SELECT COUNT(1) ${fromSql} ${whereSql})
    );
  `;
}

function adminListQuery(resource, body = {}) {
  const { filters, pageNumber, pageSize, sorting } = getPageRequest(body);
  const offset = (pageNumber - 1) * pageSize;
  const limitSql = `LIMIT ${pageSize} OFFSET ${offset}`;

  if (resource === "countries") {
    const whereParts = filterConditions(filters, { id: "c.id", continent: "COALESCE(c.continent, '')", search: "c.name_fa|c.name_en|c.iso2|c.iso3|c.capital" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "c.id", nameFa: "c.name_fa", nameEn: "c.name_en" }, "c.name_en ASC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', c.id, 'nameFa', c.name_fa, 'nameEn', c.name_en, 'iso2', c.iso2, 'iso3', c.iso3, 'capital', c.capital, 'continent', COALESCE(c.continent, ${continentCase("c")})) AS row_json`,
      "FROM countries c",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "menus") {
    const whereParts = filterConditions(filters, { id: "m.id", accuracy: "m.accuracy", isPublished: "m.is_published", parentId: "m.parent_id", search: "m.title|m.url|m.slug|m.seo_title" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "m.id", title: "m.title", level: "m.level", sortOrder: "m.sort_order", modifiedAt: "COALESCE(m.modified_at, m.created_at)" }, "m.sort_order ASC, m.id ASC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', m.id, 'title', m.title, 'parentId', m.parent_id, 'parentTitle', p.title, 'url', COALESCE(m.url, ''), 'slug', COALESCE(m.slug, ''), 'seoTitle', COALESCE(m.seo_title, ''), 'seoDescription', COALESCE(m.seo_description, ''), 'level', m.level, 'sortOrder', m.sort_order, 'isPublished', IF(m.is_published = 1, TRUE, FALSE), 'accuracy', m.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(m.modified_at, m.created_at)")}) AS row_json`,
      "FROM menus m LEFT JOIN menus p ON p.id = m.parent_id",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "categories") {
    const whereParts = filterConditions(filters, { id: "c.id", accuracy: "c.accuracy", isPublished: "c.is_published", parentId: "c.parent_id", type: "c.type", search: "c.title|c.slug|c.seo_title|c.seo_description" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "c.id", title: "c.title", type: "c.type", sortOrder: "c.sort_order", modifiedAt: "COALESCE(c.modified_at, c.created_at)" }, "c.type ASC, COALESCE(p.sort_order, c.sort_order) ASC, c.parent_id IS NOT NULL ASC, c.sort_order ASC, c.id ASC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', c.id, 'title', c.title, 'parentId', c.parent_id, 'parentTitle', p.title, 'type', COALESCE(c.type, 'encyclopedia'), 'slug', c.slug, 'summary', COALESCE(c.summary, ''), 'contentTop', COALESCE(c.content_top, ''), 'contentBottom', COALESCE(c.content_bottom, ''), 'seoTitle', COALESCE(c.seo_title, ''), 'seoDescription', COALESCE(c.seo_description, ''), 'canonicalUrl', COALESCE(c.canonical_url, ''), 'coverImageUrl', COALESCE(c.cover_image_url, ''), 'sortOrder', COALESCE(c.sort_order, 0), 'isPublished', IF(c.is_published = 1, TRUE, FALSE), 'isIndexable', IF(c.is_indexable = 1, TRUE, FALSE), 'accuracy', c.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(c.modified_at, c.created_at)")}) AS row_json`,
      "FROM categories c LEFT JOIN categories p ON p.id = c.parent_id",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "articles" || resource === "news") {
    const table = resource === "articles" ? "articles" : "news";
    const relationTable = resource === "articles" ? "article_tag" : "news_tag";
    const parentColumn = resource === "articles" ? "article_id" : "news_id";
    const headline = resource === "articles" ? "a.excerpt" : "a.summary";
    const whereParts = filterConditions(filters, { id: "a.id", accuracy: "a.accuracy", approve: "a.approve", categoryId: "a.category_id", isPublished: "a.is_published", search: "a.title|a.slug|a.seo_title" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "a.id", title: "a.title", modifiedAt: "COALESCE(a.modified_at, a.created_at)", scheduledAt: "a.scheduled_at" }, "COALESCE(a.modified_at, a.created_at) DESC, a.id DESC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', a.id, 'title', a.title, 'headline', COALESCE(${headline}, ''), 'categoryId', a.category_id, 'category', c.title, 'slug', a.slug, 'seoTitle', COALESCE(a.seo_title, ''), 'seoDescription', COALESCE(a.seo_description, ''), 'content', COALESCE(a.body, ''), 'approve', IF(a.approve = 1, TRUE, FALSE), 'isPublished', IF(a.is_published = 1, TRUE, FALSE), 'accuracy', a.accuracy, 'scheduledAt', ${mysqlDate("a.scheduled_at")}, 'modifiedAt', ${mysqlDate("COALESCE(a.modified_at, a.created_at)")}, 'tagIdsCsv', COALESCE((SELECT GROUP_CONCAT(rel.tag_id ORDER BY rel.tag_id SEPARATOR ',') FROM ${relationTable} rel WHERE rel.${parentColumn} = a.id AND rel.accuracy <> 2), ''), 'tagTitlesCsv', COALESCE((SELECT GROUP_CONCAT(t.title ORDER BY t.title SEPARATOR '، ') FROM ${relationTable} rel JOIN tags t ON t.id = rel.tag_id WHERE rel.${parentColumn} = a.id AND rel.accuracy <> 2 AND t.accuracy <> 2), '')) AS row_json`,
      `FROM ${table} a LEFT JOIN categories c ON c.id = a.category_id`,
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "world-clocks") {
    const whereParts = filterConditions(filters, { id: "w.id", accuracy: "w.accuracy", isPublished: "w.is_published", search: "w.city|w.country|w.timezone|w.market_label" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "w.id", city: "w.city", country: "w.country", sortOrder: "w.sort_order", modifiedAt: "COALESCE(w.modified_at, w.created_at)" }, "w.sort_order ASC, w.id ASC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', w.id, 'countryId', w.country_id, 'cityId', w.city_id, 'city', w.city, 'country', w.country, 'countryCode', w.country_code, 'continent', COALESCE(c.continent, ${continentCase("c")}), 'timezone', w.timezone, 'marketLabel', w.market_label, 'flag', COALESCE(w.flag, c.flag, w.country_code), 'sortOrder', w.sort_order, 'isPublished', IF(w.is_published = 1, TRUE, FALSE), 'accuracy', w.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(w.modified_at, w.created_at)")}) AS row_json`,
      "FROM world_clock_items w LEFT JOIN countries c ON c.id = w.country_id",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "pages") {
    const whereParts = filterConditions(filters, { id: "p.id", accuracy: "p.accuracy", isPublished: "p.is_published", search: "p.title|p.slug|p.summary|p.seo_title|p.seo_description" });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "p.id", title: "p.title", slug: "p.slug", modifiedAt: "COALESCE(p.modified_at, p.created_at)" }, "COALESCE(p.modified_at, p.created_at) DESC, p.id DESC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', p.id, 'title', p.title, 'slug', p.slug, 'summary', COALESCE(p.summary, ''), 'description', COALESCE(p.summary, ''), 'content', COALESCE(p.body, ''), 'seoTitle', COALESCE(p.seo_title, ''), 'seoDescription', COALESCE(p.seo_description, ''), 'href', CONCAT('/', p.slug), 'isPublished', IF(p.is_published = 1, TRUE, FALSE), 'accuracy', p.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(p.modified_at, p.created_at)")}) AS row_json`,
      "FROM pages p",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "content-sources") {
    const whereParts = filterConditions(filters, {
      id: "s.id",
      accuracy: "s.accuracy",
      isActive: "s.is_active",
      sourceType: "s.source_type",
      sourceCategory: "s.source_category",
      connectionStatus: "s.connection_status",
      search: "s.name|s.slug|s.website_url|s.feed_url|s.terms_notes"
    });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "s.id", name: "s.name", sourceType: "s.source_type", modifiedAt: "COALESCE(s.modified_at, s.created_at)" }, "s.source_category ASC, s.name ASC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', s.id, 'title', s.name, 'name', s.name, 'slug', s.slug, 'websiteUrl', s.website_url, 'feedUrl', COALESCE(s.feed_url, ''), 'sourceType', s.source_type, 'sourceCategory', s.source_category, 'language', s.language, 'country', COALESCE(s.country, ''), 'defaultArticleType', s.default_article_type, 'defaultCategoryId', s.default_category_id, 'defaultCategory', c.title, 'trustLevel', s.trust_level, 'fetchIntervalMinutes', s.fetch_interval_minutes, 'backfillDays', s.backfill_days, 'maxBackfillItems', s.max_backfill_items, 'requiresReview', IF(s.requires_review = 1, TRUE, FALSE), 'allowAutoPublish', IF(s.allow_auto_publish = 1, TRUE, FALSE), 'isActive', IF(s.is_active = 1, TRUE, FALSE), 'respectRobots', IF(s.respect_robots = 1, TRUE, FALSE), 'connectionStatus', s.connection_status, 'termsNotes', COALESCE(s.terms_notes, ''), 'parserKey', COALESCE(s.parser_key, ''), 'lastFetchedAt', ${mysqlDate("s.last_fetched_at")}, 'lastSuccessfulFetchAt', ${mysqlDate("s.last_successful_fetch_at")}, 'lastErrorAt', ${mysqlDate("s.last_error_at")}, 'lastErrorMessage', COALESCE(s.last_error_message, ''), 'etag', COALESCE(s.etag, ''), 'lastModified', COALESCE(s.last_modified, ''), 'accuracy', s.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(s.modified_at, s.created_at)")}) AS row_json`,
      "FROM content_sources s LEFT JOIN categories c ON c.id = s.default_category_id",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  if (resource === "source-items") {
    const whereParts = filterConditions(filters, {
      id: "i.id",
      accuracy: "i.accuracy",
      sourceId: "i.source_id",
      processingStatus: "i.processing_status",
      detectedContentType: "i.detected_content_type",
      categoryId: "i.suggested_category_id",
      search: "i.original_title|i.source_url|i.original_summary|i.issuer|i.circular_number"
    });
    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const orderBy = firstSort(sorting, { id: "i.id", fetchedAt: "i.fetched_at", relevanceScore: "i.relevance_score" }, "i.fetched_at DESC, i.id DESC");
    return jsonArraySelect(
      `SELECT JSON_OBJECT('id', i.id, 'title', i.original_title, 'sourceId', i.source_id, 'sourceName', s.name, 'sourceUrl', i.source_url, 'originalTitle', i.original_title, 'originalSummary', COALESCE(i.original_summary, ''), 'originalContent', COALESCE(i.original_content, ''), 'originalImageUrl', COALESCE(i.original_image_url, ''), 'originalAuthor', COALESCE(i.original_author, ''), 'originalLanguage', i.original_language, 'sourcePublishedAt', ${mysqlDate("i.source_published_at")}, 'sourceUpdatedAt', ${mysqlDate("i.source_updated_at")}, 'fetchedAt', ${mysqlDate("i.fetched_at")}, 'detectedContentType', i.detected_content_type, 'suggestedCategoryId', i.suggested_category_id, 'suggestedCategory', c.title, 'relevanceScore', i.relevance_score, 'processingStatus', i.processing_status, 'duplicateOfId', i.duplicate_of_id, 'articleId', i.article_id, 'newsId', i.news_id, 'circularNumber', COALESCE(i.circular_number, ''), 'issuer', COALESCE(i.issuer, ''), 'issuedAt', ${mysqlDate("i.issued_at")}, 'effectiveAt', ${mysqlDate("i.effective_at")}, 'attachmentUrl', COALESCE(i.attachment_url, ''), 'officialPageUrl', COALESCE(i.official_page_url, ''), 'validityStatus', COALESCE(i.validity_status, ''), 'reviewTitle', COALESCE(i.title, i.original_title), 'slug', COALESCE(i.slug, ''), 'summary', COALESCE(i.summary, i.original_summary, ''), 'content', COALESCE(i.body, i.original_content, ''), 'seoTitle', COALESCE(i.seo_title, ''), 'seoDescription', COALESCE(i.seo_description, ''), 'selectedImageUrl', COALESCE(i.selected_image_url, ''), 'accuracy', i.accuracy, 'modifiedAt', ${mysqlDate("COALESCE(i.modified_at, i.created_at)")}) AS row_json`,
      "FROM source_items i JOIN content_sources s ON s.id = i.source_id LEFT JOIN categories c ON c.id = i.suggested_category_id",
      where,
      `ORDER BY ${orderBy}`,
      limitSql
    );
  }

  const simpleTable = resource === "services" ? "services" : "tags";
  const whereParts = filterConditions(filters, {
    id: "id",
    accuracy: "accuracy",
    ...(resource === "services" ? { isPublished: "is_published" } : {}),
    search: resource === "services" ? "title|slug|summary" : "title|slug|seo_title|seo_description"
  });
  const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
  const orderBy = firstSort(sorting, { id: "id", title: "title", modifiedAt: "COALESCE(modified_at, created_at)" }, "title ASC");
  return jsonArraySelect(
    `SELECT JSON_OBJECT('id', id, 'title', title, 'slug', slug, 'summary', ${simpleTable === "services" ? "COALESCE(summary, '')" : "''"}, 'description', ${simpleTable === "services" ? "COALESCE(summary, '')" : "''"}, 'content', ${simpleTable === "tags" ? "COALESCE(body, '')" : "''"}, 'seoTitle', ${simpleTable === "tags" ? "COALESCE(seo_title, '')" : "''"}, 'seoDescription', ${simpleTable === "tags" ? "COALESCE(seo_description, '')" : "''"}, 'cta', ${simpleTable === "services" ? "COALESCE(short_title, 'مشاهده خدمت')" : "''"}, 'href', ${simpleTable === "services" ? "CONCAT('/services/', slug)" : "''"}, 'isPublished', ${simpleTable === "services" || simpleTable === "tags" ? "IF(is_published = 1, TRUE, FALSE)" : "TRUE"}, 'accuracy', accuracy, 'modifiedAt', ${mysqlDate("COALESCE(modified_at, created_at)")}) AS row_json`,
    `FROM ${simpleTable}`,
    where,
    `ORDER BY ${orderBy}`,
    limitSql
  );
}

function findQueryFromList(resource, id) {
  const query = adminListQuery(resource, { pageing: { pageNumbber: 1, PageSize: 1 }, filters: { id: Number(id) } });
  if (resource === "countries") return query.replace("c.name_en ASC", "c.id ASC").replace("WHERE c.id = ", "WHERE c.id = ");
  return query;
}

function adminFindQuery(resource, id) {
  const tableAlias = resource === "menus" ? "m" : resource === "articles" || resource === "news" ? "a" : resource === "world-clocks" ? "w" : resource === "countries" ? "c" : "";
  const filters = tableAlias ? { id: Number(id) } : { id: Number(id) };
  return adminListQuery(resource, { pageing: { pageNumbber: 1, PageSize: 1 }, filters });
}

function adminWriteQuery(resource, action, body) {
  const id = sqlNumber(body.id);
  const accuracy = normalizeAccuracy(body.accuracy);

  if (resource === "menus") {
    const values = [sqlString(body.title), sqlString(body.url), sqlString(body.slug), sqlNumber(body.parentId), sqlNumber(body.level ?? 1), sqlString(body.seoTitle), sqlString(body.seoDescription), sqlBit(body.isPublished), accuracy];
    if (action === "add") {
      return `INSERT INTO menus (title, url, slug, parent_id, level, seo_title, seo_description, is_published, accuracy, created_by) VALUES (${values.join(", ")}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE menus SET title=${values[0]}, url=${values[1]}, slug=${values[2]}, parent_id=${values[3]}, level=${values[4]}, seo_title=${values[5]}, seo_description=${values[6]}, is_published=${values[7]}, accuracy=${values[8]}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "categories") {
    const values = [
      sqlString(body.title),
      sqlString(body.slug),
      sqlNumber(body.parentId),
      sqlString(body.type ?? "encyclopedia"),
      sqlString(body.summary),
      sqlString(body.contentTop),
      sqlString(body.contentBottom),
      sqlString(body.seoTitle),
      sqlString(body.seoDescription),
      sqlString(body.canonicalUrl),
      sqlString(body.coverImageUrl),
      sqlNumber(body.sortOrder ?? 0),
      sqlBit(body.isPublished ?? true),
      sqlBit(body.isIndexable ?? true),
      accuracy
    ];
    if (action === "add") {
      return `INSERT INTO categories (title, slug, parent_id, type, summary, content_top, content_bottom, seo_title, seo_description, canonical_url, cover_image_url, sort_order, is_published, is_indexable, accuracy, created_by) VALUES (${values.join(", ")}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE categories SET title=${values[0]}, slug=${values[1]}, parent_id=${values[2]}, type=${values[3]}, summary=${values[4]}, content_top=${values[5]}, content_bottom=${values[6]}, seo_title=${values[7]}, seo_description=${values[8]}, canonical_url=${values[9]}, cover_image_url=${values[10]}, sort_order=${values[11]}, is_published=${values[12]}, is_indexable=${values[13]}, accuracy=${values[14]}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "articles" || resource === "news") {
    const table = resource === "articles" ? "articles" : "news";
    const headlineColumn = resource === "articles" ? "excerpt" : "summary";
    const scheduledAt = body.scheduledAt ? sqlString(body.scheduledAt) : "NULL";
    if (action === "add") {
      return `INSERT INTO ${table} (title, ${headlineColumn}, slug, body, category_id, seo_title, seo_description, approve, is_published, scheduled_at, accuracy, created_by) VALUES (${sqlString(body.title)}, ${sqlString(body.headline)}, ${sqlString(body.slug)}, ${sqlString(body.content)}, ${sqlNumber(body.categoryId)}, ${sqlString(body.seoTitle)}, ${sqlString(body.seoDescription)}, ${sqlBit(body.approve)}, ${sqlBit(body.isPublished)}, ${scheduledAt}, ${accuracy}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE ${table} SET title=${sqlString(body.title)}, ${headlineColumn}=${sqlString(body.headline)}, slug=${sqlString(body.slug)}, body=${sqlString(body.content)}, category_id=${sqlNumber(body.categoryId)}, seo_title=${sqlString(body.seoTitle)}, seo_description=${sqlString(body.seoDescription)}, approve=${sqlBit(body.approve)}, is_published=${sqlBit(body.isPublished)}, scheduled_at=${scheduledAt}, accuracy=${accuracy}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "world-clocks") {
    if (action === "add") {
      return `INSERT INTO world_clock_items (country_id, city_id, city, country, country_code, timezone, market_label, sort_order, is_published, accuracy, created_by) VALUES (${sqlNumber(body.countryId)}, ${sqlNumber(body.cityId)}, ${sqlString(body.city)}, ${sqlString(body.country)}, ${sqlString(body.countryCode)}, ${sqlString(body.timezone)}, ${sqlString(body.marketLabel)}, ${sqlNumber(body.sortOrder ?? 0)}, ${sqlBit(body.isPublished)}, ${accuracy}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE world_clock_items SET country_id=${sqlNumber(body.countryId)}, city_id=${sqlNumber(body.cityId)}, city=${sqlString(body.city)}, country=${sqlString(body.country)}, country_code=${sqlString(body.countryCode)}, timezone=${sqlString(body.timezone)}, market_label=${sqlString(body.marketLabel)}, sort_order=${sqlNumber(body.sortOrder ?? 0)}, is_published=${sqlBit(body.isPublished)}, accuracy=${accuracy}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "services") {
    if (action === "add") {
      return `INSERT INTO services (title, slug, short_title, summary, is_published, accuracy, created_by) VALUES (${sqlString(body.title)}, ${sqlString(body.slug)}, ${sqlString(body.cta ?? body.shortTitle)}, ${sqlString(body.summary ?? body.description)}, ${sqlBit(body.isPublished ?? true)}, ${accuracy}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE services SET title=${sqlString(body.title)}, slug=${sqlString(body.slug)}, short_title=${sqlString(body.cta ?? body.shortTitle)}, summary=${sqlString(body.summary ?? body.description)}, is_published=${sqlBit(body.isPublished ?? true)}, accuracy=${accuracy}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "pages") {
    if (action === "add") {
      return `INSERT INTO pages (title, slug, summary, body, seo_title, seo_description, is_published, accuracy, created_by) VALUES (${sqlString(body.title)}, ${sqlString(body.slug)}, ${sqlString(body.summary ?? body.description)}, ${sqlString(body.content)}, ${sqlString(body.seoTitle)}, ${sqlString(body.seoDescription)}, ${sqlBit(body.isPublished ?? true)}, ${accuracy}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE pages SET title=${sqlString(body.title)}, slug=${sqlString(body.slug)}, summary=${sqlString(body.summary ?? body.description)}, body=${sqlString(body.content)}, seo_title=${sqlString(body.seoTitle)}, seo_description=${sqlString(body.seoDescription)}, is_published=${sqlBit(body.isPublished ?? true)}, accuracy=${accuracy}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "content-sources") {
    const values = [
      sqlString(body.name ?? body.title),
      sqlString(body.slug),
      sqlString(body.websiteUrl),
      sqlString(body.feedUrl),
      sqlString(body.sourceType ?? "manual"),
      sqlString(body.sourceCategory ?? "official"),
      sqlString(body.language ?? "fa"),
      sqlString(body.country),
      sqlString(body.defaultArticleType ?? "news"),
      sqlNumber(body.defaultCategoryId),
      sqlString(body.trustLevel ?? "medium"),
      sqlNumber(body.fetchIntervalMinutes ?? 60),
      sqlNumber(body.backfillDays ?? 7),
      sqlNumber(body.maxBackfillItems ?? 20),
      sqlBit(body.requiresReview ?? true),
      sqlBit(false),
      sqlBit(body.isActive),
      sqlBit(body.respectRobots ?? true),
      sqlString(body.connectionStatus ?? "needs_configuration"),
      sqlString(body.termsNotes),
      sqlString(body.parserKey ?? "rss-generic"),
      accuracy
    ];
    if (action === "add") {
      return `INSERT INTO content_sources (name, slug, website_url, feed_url, source_type, source_category, language, country, default_article_type, default_category_id, trust_level, fetch_interval_minutes, backfill_days, max_backfill_items, requires_review, allow_auto_publish, is_active, respect_robots, connection_status, terms_notes, parser_key, accuracy, created_by) VALUES (${values.join(", ")}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
    }
    return `UPDATE content_sources SET name=${values[0]}, slug=${values[1]}, website_url=${values[2]}, feed_url=${values[3]}, source_type=${values[4]}, source_category=${values[5]}, language=${values[6]}, country=${values[7]}, default_article_type=${values[8]}, default_category_id=${values[9]}, trust_level=${values[10]}, fetch_interval_minutes=${values[11]}, backfill_days=${values[12]}, max_backfill_items=${values[13]}, requires_review=${values[14]}, allow_auto_publish=0, is_active=${values[16]}, respect_robots=${values[17]}, connection_status=${values[18]}, terms_notes=${values[19]}, parser_key=${values[20]}, accuracy=${values[21]}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (resource === "source-items") {
    return `UPDATE source_items SET detected_content_type=${sqlString(body.detectedContentType ?? "news")}, suggested_category_id=${sqlNumber(body.suggestedCategoryId)}, processing_status=${sqlString(body.processingStatus ?? "pending_review")}, title=${sqlString(body.reviewTitle ?? body.title)}, slug=${sqlString(body.slug)}, summary=${sqlString(body.summary)}, body=${sqlString(body.content)}, seo_title=${sqlString(body.seoTitle)}, seo_description=${sqlString(body.seoDescription)}, selected_image_url=${sqlString(body.selectedImageUrl)}, circular_number=${sqlString(body.circularNumber)}, issuer=${sqlString(body.issuer)}, effective_at=${body.effectiveAt ? sqlString(body.effectiveAt) : "NULL"}, validity_status=${sqlString(body.validityStatus)}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
  }

  if (action === "add") {
    return `INSERT INTO tags (title, slug, body, seo_title, seo_description, is_published, accuracy, created_by) VALUES (${sqlString(body.title)}, ${sqlString(body.slug)}, ${sqlString(body.content)}, ${sqlString(body.seoTitle)}, ${sqlString(body.seoDescription)}, ${sqlBit(body.isPublished ?? true)}, ${accuracy}, 1); SELECT JSON_OBJECT('id', LAST_INSERT_ID());`;
  }
  return `UPDATE tags SET title=${sqlString(body.title)}, slug=${sqlString(body.slug)}, body=${sqlString(body.content)}, seo_title=${sqlString(body.seoTitle)}, seo_description=${sqlString(body.seoDescription)}, is_published=${sqlBit(body.isPublished ?? true)}, accuracy=${accuracy}, modified_at=UTC_TIMESTAMP(), modified_by=1 WHERE id=${id}; SELECT JSON_OBJECT('id', ${id});`;
}

async function syncContentTags(resource, id, tagIds = []) {
  if (resource !== "articles" && resource !== "news") return;
  const parentColumn = resource === "articles" ? "article_id" : "news_id";
  const relationTable = resource === "articles" ? "article_tag" : "news_tag";
  const normalizedIds = [...new Set((Array.isArray(tagIds) ? tagIds : []).map((tagId) => Number(tagId)).filter(Number.isFinite))];
  const statements = [`UPDATE ${relationTable} SET accuracy = 2, modified_at = UTC_TIMESTAMP(), modified_by = 1 WHERE ${parentColumn} = ${sqlNumber(id)};`];
  for (const tagId of normalizedIds) {
    statements.push(`INSERT INTO ${relationTable} (${parentColumn}, tag_id, accuracy, created_by) VALUES (${sqlNumber(id)}, ${sqlNumber(tagId)}, 1, 1) ON DUPLICATE KEY UPDATE accuracy = 1, modified_at = UTC_TIMESTAMP(), modified_by = 1;`);
  }
  await runSql(statements.join("\n"));
}

async function loadPublicServices() {
  const result = await runJsonSql(adminListQuery("services", { pageing: { pageNumbber: 1, PageSize: 20 }, sorting: [{ field: "id", direction: "asc" }], filters: { accuracy: 1, isPublished: true } }), { data: [], total: 0 });
  return successResponse(normalizeAdminItems("services", result.data ?? []), result.total ?? 0);
}

async function loadPublicPage(slug) {
  const result = await runJsonSql(adminListQuery("pages", { pageing: { pageNumbber: 1, PageSize: 1 }, filters: { search: slug, accuracy: 1, isPublished: true } }), { data: [] });
  const page = (result.data ?? []).find((item) => item.slug === slug);
  return successResponse(page ? [page] : [], page ? 1 : 0);
}

async function loadPublicMenus() {
  const result = await runJsonSql(adminListQuery("menus", { pageing: { pageNumbber: 1, PageSize: 100 }, sorting: [{ field: "sortOrder", direction: "asc" }], filters: { accuracy: 1, isPublished: true } }), { data: [], total: 0 });
  const items = normalizeAdminItems("menus", result.data ?? []).map((item) => ({
    id: item.id,
    parentId: item.parentId,
    label: item.title,
    href: item.url || `/${item.slug}`,
    description: item.seoDescription || "",
    sortOrder: item.sortOrder ?? item.id
  }));
  const byParent = new Map();

  for (const item of items) {
    const key = item.parentId ?? null;
    byParent.set(key, [...(byParent.get(key) ?? []), item]);
  }

  const buildTree = (parentId = null) => (byParent.get(parentId) ?? [])
    .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
    .map((item) => {
      const children = buildTree(item.id);
      return {
        label: item.label,
        href: item.href,
        description: item.description,
        ...(children.length ? { children } : {})
      };
    });

  const tree = buildTree(null);
  return successResponse(tree, tree.length);
}

async function loadPublicWorldClocks() {
  const result = await runJsonSql(adminListQuery("world-clocks", { pageing: { pageNumbber: 1, PageSize: 7 }, sorting: [{ field: "sortOrder", direction: "asc" }], filters: { accuracy: 1, isPublished: true } }), { data: [], total: 0 });
  return successResponse(normalizeAdminItems("world-clocks", result.data ?? []), result.total ?? 0);
}

async function loadPublicNewsCollection(kind = "all", slug = "") {
  const categoryFilter = kind === "circulars" ? "AND c.type = 'circular'" : kind === "news" ? "AND (c.type IS NULL OR c.type = 'news')" : "";
  const slugFilter = slug ? `AND n.slug = ${sqlString(slug)}` : "";
  const limitSql = slug ? "LIMIT 1" : "LIMIT 20";
  const result = await runJsonSql(
    `
      SELECT JSON_OBJECT(
        'data', COALESCE((SELECT JSON_ARRAYAGG(row_json) FROM (
          SELECT JSON_OBJECT(
            'id', n.id,
            'title', n.title,
            'slug', n.slug,
            'summary', COALESCE(n.summary, ''),
            'content', COALESCE(n.body, ''),
            'category', c.title,
            'categorySlug', c.slug,
            'categoryType', c.type,
            'sourceName', COALESCE(n.source_name, ''),
            'sourceUrl', COALESCE(n.source_url, ''),
            'sourcePublishedAt', ${mysqlDate("n.news_date")},
            'publishedAt', ${mysqlDate("n.published_at")},
            'seoTitle', COALESCE(n.seo_title, ''),
            'seoDescription', COALESCE(n.seo_description, '')
          ) AS row_json
          FROM news n
          LEFT JOIN categories c ON c.id = n.category_id
          WHERE n.accuracy = 1 AND n.approve = 1 AND n.is_published = 1 ${categoryFilter} ${slugFilter}
          ORDER BY COALESCE(n.published_at, n.created_at) DESC, n.id DESC
          ${limitSql}
        ) AS public_news), JSON_ARRAY()),
        'total', (
          SELECT COUNT(1)
          FROM news n
          LEFT JOIN categories c ON c.id = n.category_id
          WHERE n.accuracy = 1 AND n.approve = 1 AND n.is_published = 1 ${categoryFilter} ${slugFilter}
        )
      );
    `,
    { data: [], total: 0 }
  );
  return successResponse(result.data ?? [], result.total ?? 0);
}

async function loadCountryCities(body = {}) {
  const countryId = sqlNumber(body.countryId);
  if (countryId === "NULL") return successResponse([], 0);

  const result = await runJsonSql(
    `
      SELECT JSON_OBJECT(
        'data', COALESCE((
          SELECT CAST(CONCAT('[', GROUP_CONCAT(row_json ORDER BY sort_order ASC, name_en ASC SEPARATOR ','), ']') AS JSON)
          FROM (
            SELECT id, name_en, sort_order, JSON_OBJECT('id', id, 'city', name_fa, 'cityEn', name_en, 'timezone', timezone, 'isTradeCity', IF(is_trade_city = 1, TRUE, FALSE)) AS row_json
            FROM cities
            WHERE country_id = ${countryId} AND accuracy = 1
          ) ordered_cities
        ), JSON_ARRAY()),
        'total', (SELECT COUNT(1) FROM cities WHERE country_id = ${countryId} AND accuracy = 1)
      );
    `,
    { data: [], total: 0 }
  );
  return successResponse(result.data ?? [], result.total ?? 0);
}

async function loadSourceForFetch(sourceId) {
  const result = await runJsonSql(adminFindQuery("content-sources", sourceId), { data: [] });
  return Array.isArray(result.data) ? normalizeAdminItems("content-sources", result.data)[0] : null;
}

async function storeSourceItem(source, item) {
  const score = relevanceScore(item);
  if (score <= 0) {
    return { inserted: false, duplicate: false, filtered: true };
  }

  const detectedContentType = detectContentType(source, item);
  const contentHash = sha256(`${item.originalTitle}\n${textFromHtml(item.originalSummary)}\n${textFromHtml(item.originalContent)}`);
  const titleHash = sha256(normalizeTitle(item.originalTitle));
  const duplicate = await runJsonSql(
    `
      SELECT JSON_OBJECT(
        'data', COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id)) FROM source_items WHERE source_id=${sqlNumber(source.id)} AND (guid=${sqlString(item.guid)} OR source_url=${sqlString(item.sourceUrl)} OR content_hash=${sqlString(contentHash)}) LIMIT 1), JSON_ARRAY())
      );
    `,
    { data: [] }
  );

  if (duplicate.data?.length) {
    return { inserted: false, duplicate: true, id: duplicate.data[0].id };
  }

  const slugBase = normalizeTitle(item.originalTitle).replace(/\s+/g, "-").slice(0, 180) || `source-item-${Date.now()}`;
  const rawPayload = JSON.stringify(item.rawPayload ?? {});
  const fetchMetadata = JSON.stringify({ parser: source.parserKey || "rss-generic", importedWithoutRewrite: true });

  const result = await runJsonSql(
    `
      INSERT INTO source_items (
        source_id, external_id, guid, source_url, original_title, original_summary, original_content,
        original_image_url, original_author, original_language, source_published_at, source_updated_at,
        content_hash, normalized_title_hash, detected_content_type, suggested_category_id, relevance_score,
        processing_status, raw_payload, fetch_metadata, title, slug, summary, body, seo_title, seo_description,
        created_by, accuracy
      ) VALUES (
        ${sqlNumber(source.id)}, ${sqlString(item.guid)}, ${sqlString(item.guid)}, ${sqlString(item.sourceUrl)},
        ${sqlString(item.originalTitle)}, ${sqlString(item.originalSummary)}, ${sqlString(item.originalContent)},
        ${sqlString(item.originalImageUrl)}, ${sqlString(item.originalAuthor)}, ${sqlString(source.language || "fa")},
        ${sqlDateValue(item.sourcePublishedAt)}, ${sqlDateValue(item.sourceUpdatedAt)},
        ${sqlString(contentHash)}, ${sqlString(titleHash)}, ${sqlString(detectedContentType)}, ${sqlNumber(source.defaultCategoryId)},
        ${sqlNumber(score)}, 'pending_review', CAST(${sqlString(rawPayload)} AS JSON), CAST(${sqlString(fetchMetadata)} AS JSON),
        ${sqlString(item.originalTitle)}, ${sqlString(slugBase)}, ${sqlString(textFromHtml(item.originalSummary))},
        ${sqlString(stripUnsafeHtml(item.originalContent))}, ${sqlString(item.originalTitle)}, ${sqlString(textFromHtml(item.originalSummary).slice(0, 500))},
        1, 1
      );
      SELECT JSON_OBJECT('id', LAST_INSERT_ID());
    `,
    {}
  );

  return { inserted: true, duplicate: false, filtered: false, id: result.id, status: "pending_review" };
}

async function fetchContentSource(sourceId) {
  const source = await loadSourceForFetch(sourceId);
  if (!source) return { status: 404, payload: errorResponse("Source was not found.") };
  if (!["rss", "atom"].includes(source.sourceType)) {
    await runSql(`UPDATE content_sources SET last_fetched_at=UTC_TIMESTAMP(), last_error_at=UTC_TIMESTAMP(), last_error_message=${sqlString("Only RSS/Atom sources can be fetched automatically in this step.")}, connection_status='manual_required', modified_at=UTC_TIMESTAMP() WHERE id=${sqlNumber(source.id)};`);
    return { status: 400, payload: errorResponse("این منبع هنوز نیازمند تنظیم دستی یا parser اختصاصی است.") };
  }

  const feedUrl = safeUrl(source.feedUrl);
  if (!feedUrl) {
    await runSql(`UPDATE content_sources SET last_fetched_at=UTC_TIMESTAMP(), last_error_at=UTC_TIMESTAMP(), last_error_message=${sqlString("Feed URL is empty or unsafe.")}, connection_status='needs_configuration', modified_at=UTC_TIMESTAMP() WHERE id=${sqlNumber(source.id)};`);
    return { status: 400, payload: errorResponse("Feed URL معتبر نیست.") };
  }

  try {
    const headers = {
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.7",
      "User-Agent": "KhoobroozNewsMonitor/1.0 (+https://khoobrooz.com)"
    };
    if (source.etag) headers["If-None-Match"] = source.etag;
    if (source.lastModified) headers["If-Modified-Since"] = source.lastModified;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(feedUrl, { headers, signal: controller.signal });
    clearTimeout(timeout);

    if (response.status === 304) {
      await runSql(`UPDATE content_sources SET last_fetched_at=UTC_TIMESTAMP(), last_successful_fetch_at=UTC_TIMESTAMP(), last_error_message=NULL, modified_at=UTC_TIMESTAMP() WHERE id=${sqlNumber(source.id)};`);
      return { status: 200, payload: successResponse([{ fetched: 0, inserted: 0, duplicates: 0, notModified: true }], 1) };
    }

    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
    const text = await response.text();
    const parsedItems = parseFeedItems(text, source).slice(0, Number(source.maxBackfillItems || 20));
    let inserted = 0;
    let duplicates = 0;
    let filtered = 0;

    for (const item of parsedItems) {
      const stored = await storeSourceItem(source, item);
      if (stored.inserted) {
        inserted += 1;
      } else if (stored.filtered) {
        filtered += 1;
      } else if (stored.duplicate) {
        duplicates += 1;
      }
    }

    await runSql(`UPDATE content_sources SET last_fetched_at=UTC_TIMESTAMP(), last_successful_fetch_at=UTC_TIMESTAMP(), last_error_at=NULL, last_error_message=NULL, etag=${sqlString(response.headers.get("etag"))}, last_modified=${sqlString(response.headers.get("last-modified"))}, connection_status='ready', modified_at=UTC_TIMESTAMP() WHERE id=${sqlNumber(source.id)};`);
    return { status: 200, payload: successResponse([{ fetched: parsedItems.length, inserted, duplicates, filtered, notModified: false }], 1) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Source fetch failed";
    await runSql(`UPDATE content_sources SET last_fetched_at=UTC_TIMESTAMP(), last_error_at=UTC_TIMESTAMP(), last_error_message=${sqlString(message)}, connection_status='error', modified_at=UTC_TIMESTAMP() WHERE id=${sqlNumber(source.id)};`);
    return { status: 502, payload: errorResponse(message) };
  }
}

async function fetchActiveContentSources() {
  if (contentSourceSyncing) return;
  contentSourceSyncing = true;

  try {
    const sources = await runJsonSql(
      adminListQuery("content-sources", {
        pageing: { pageNumbber: 1, PageSize: 200 },
        filters: { isActive: true, accuracy: 1 }
      }),
      { data: [] }
    );

    let processed = 0;
    let inserted = 0;
    let duplicates = 0;
    let filtered = 0;
    let failed = 0;

    for (const source of sources.data ?? []) {
      if (!["rss", "atom"].includes(source.sourceType)) continue;

      const result = await fetchContentSource(source.id);
      const row = result.payload.response.items[0] ?? {};
      processed += 1;
      inserted += Number(row.inserted ?? 0);
      duplicates += Number(row.duplicates ?? 0);
      filtered += Number(row.filtered ?? 0);
      if (result.status >= 400) failed += 1;
    }

    console.log(`[content-ingestion] active source sync processed=${processed} inserted=${inserted} duplicates=${duplicates} filtered=${filtered} failed=${failed}`);
  } catch (error) {
    console.error(`[content-ingestion] ${error instanceof Error ? error.message : "active source sync failed"}`);
  } finally {
    contentSourceSyncing = false;
  }
}

async function updateSourceItemStatus(id, status, extra = "") {
  await runSql(`UPDATE source_items SET processing_status=${sqlString(status)}, modified_at=UTC_TIMESTAMP(), modified_by=1 ${extra} WHERE id=${sqlNumber(id)};`);
  const saved = await runJsonSql(adminFindQuery("source-items", id), { data: [] });
  const item = Array.isArray(saved.data) ? normalizeAdminItems("source-items", saved.data)[0] : null;
  return { status: 200, payload: successResponse(item ? [item] : [], item ? 1 : 0) };
}

async function publishSourceItem(id) {
  const found = await runJsonSql(adminFindQuery("source-items", id), { data: [] });
  const item = Array.isArray(found.data) ? found.data[0] : null;
  if (!item) return { status: 404, payload: errorResponse("Source item was not found.") };
  if (item.processingStatus !== "approved") {
    return { status: 400, payload: errorResponse("آیتم باید ابتدا تایید شود و سپس منتشر شود.") };
  }

  const slug = item.slug || normalizeTitle(item.reviewTitle || item.originalTitle).replace(/\s+/g, "-").slice(0, 180) || `news-${id}`;
  const result = await runJsonSql(
    `
      INSERT INTO news (title, slug, summary, body, source_name, source_url, news_date, category_id, seo_title, seo_description, approve, is_published, published_at, published_by, created_by, accuracy)
      VALUES (${sqlString(item.reviewTitle || item.originalTitle)}, ${sqlString(slug)}, ${sqlString(item.summary || item.originalSummary)}, ${sqlString(item.content || item.originalContent)}, ${sqlString(item.sourceName)}, ${sqlString(item.sourceUrl)}, ${sqlDateValue(item.sourcePublishedAt)}, ${sqlNumber(item.suggestedCategoryId)}, ${sqlString(item.seoTitle || item.originalTitle)}, ${sqlString(item.seoDescription || textFromHtml(item.originalSummary).slice(0, 500))}, 1, 1, UTC_TIMESTAMP(), 1, 1, 1);
      SELECT JSON_OBJECT('id', LAST_INSERT_ID());
    `,
    {}
  );

  return updateSourceItemStatus(id, "published", `, news_id=${sqlNumber(result.id)}`);
}

async function handleAdminResource(resource, action, body) {
  if (resource === "api-services" && action === "loadPage") return { status: 200, payload: successResponse(serviceCatalog, serviceCatalog.length) };
  if (!adminResources.has(resource)) return { status: 404, payload: errorResponse("Unknown admin resource.") };
  if (resource === "countries" && action === "cities") return { status: 200, payload: await loadCountryCities(body) };
  if (resource === "content-sources" && action === "fetch") return fetchContentSource(body.id);
  if (resource === "content-sources" && action === "fetchAll") {
    const sources = await runJsonSql(adminListQuery("content-sources", { pageing: { pageNumbber: 1, PageSize: 100 }, filters: { isActive: true, accuracy: 1 } }), { data: [] });
    const results = [];
    for (const source of sources.data ?? []) {
      if (!["rss", "atom"].includes(source.sourceType)) continue;
      const result = await fetchContentSource(source.id);
      results.push({ sourceId: source.id, status: result.status, message: result.payload.message ?? null, result: result.payload.response.items[0] ?? null });
    }
    return { status: 200, payload: successResponse(results, results.length) };
  }
  if (resource === "source-items" && action === "approve") return updateSourceItemStatus(body.id, "approved");
  if (resource === "source-items" && action === "reject") return updateSourceItemStatus(body.id, "rejected");
  if (resource === "source-items" && action === "archive") return updateSourceItemStatus(body.id, "archived");
  if (resource === "source-items" && action === "markDuplicate") return updateSourceItemStatus(body.id, "duplicate", `, duplicate_of_id=${sqlNumber(body.duplicateOfId)}`);
  if (resource === "source-items" && action === "publish") return publishSourceItem(body.id);

  if (action === "loadPage") {
    const result = await runJsonSql(adminListQuery(resource, body), { data: [], total: 0 });
    return { status: 200, payload: successResponse(normalizeAdminItems(resource, result.data ?? []), result.total ?? 0) };
  }

  if (action === "find") {
    const result = await runJsonSql(adminFindQuery(resource, body.id), { data: [] });
    const item = Array.isArray(result.data) ? normalizeAdminItems(resource, result.data)[0] : null;
    return { status: 200, payload: successResponse(item ? [item] : [], item ? 1 : 0) };
  }

  if (action === "add" || action === "update") {
    if (resource === "countries") return { status: 400, payload: errorResponse("Country write is not supported from admin panel.") };
    const result = await runJsonSql(adminWriteQuery(resource, action, body), {});
    if (!result.id) return { status: 404, payload: errorResponse("Record was not saved.") };
    await syncContentTags(resource, result.id, body.tagIds);
    const saved = await runJsonSql(adminFindQuery(resource, result.id), { data: [] });
    const item = Array.isArray(saved.data) ? normalizeAdminItems(resource, saved.data)[0] : null;
    return { status: 200, payload: successResponse(item ? [item] : [], item ? 1 : 0) };
  }

  if (action === "delete") {
    const table = adminResourceTables[resource];
    if (!table || resource === "countries") return { status: 400, payload: errorResponse("Delete is not supported for this resource.") };
    await runSql(`UPDATE ${table} SET accuracy = 2, modified_at = UTC_TIMESTAMP(), modified_by = 1 WHERE id = ${sqlNumber(body.id)};`);
    return { status: 200, payload: successResponse([{ id: Number(body.id), accuracy: 2 }], 1) };
  }

  return { status: 404, payload: errorResponse("Unknown admin action.") };
}

function normalizeDirection(direction) {
  if (direction === "high" || direction === "low") return direction;
  return "neutral";
}

async function syncTgju() {
  if (syncing) return;
  syncing = true;
  try {
    const response = await fetch(tgjuApiUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`TGJU request failed with status ${response.status}`);
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
      fetchedAt: new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })
    };
    lastError = null;
    console.log(`[tgju-dev] synced ${board.rates.length} rates at ${board.fetchedAt}`);
    broadcastMarketRates();
  } catch (error) {
    lastError = error instanceof Error ? error.message : "TGJU sync failed";
    console.error(`[tgju-dev] ${lastError}`);
  } finally {
    syncing = false;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
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
  if (request.method === "GET" && url.pathname === "/") {
    sendJson(response, 200, { ok: true, service: "khoobrooz-api" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    try {
      await databasePool.query("SELECT 1");
      sendJson(response, 200, { ok: true, service: "khoobrooz-api", database: "ok" });
    } catch {
      sendJson(response, 503, { ok: false, service: "khoobrooz-api", database: "unavailable" });
    }
    return;
  }

  const adminMatch = url.pathname.match(/^\/api\/admin\/([^/]+)\/([^/]+)$/);
  if (request.method === "POST" && adminMatch) {
    const [, resource, action] = adminMatch;
    try {
      const body = await readBody(request);
      const result = await handleAdminResource(resource, action, body);
      sendJson(response, result.status, result.payload);
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Admin API failed"));
    }
    return;
  }

  if (request.method === "GET" && (url.pathname === "/api/v1/market-rates" || url.pathname === "/api/v1/market-rates/board")) {
    if (board.rates.length === 0) await syncTgju();
    sendJson(response, lastError && board.rates.length === 0 ? 502 : 200, { ok: !lastError || board.rates.length > 0, ...board, message: lastError });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/v1/services") {
    try {
      sendJson(response, 200, await loadPublicServices());
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Service list failed"));
    }
    return;
  }

  const pageMatch = url.pathname.match(/^\/api\/v1\/pages\/(.+)$/);
  if (request.method === "GET" && pageMatch) {
    try {
      const slug = decodeURIComponent(pageMatch[1].replace(/^\/+|\/+$/g, ""));
      sendJson(response, 200, await loadPublicPage(slug));
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Page load failed"));
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/v1/menus") {
    try {
      sendJson(response, 200, await loadPublicMenus());
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Menu list failed"));
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/v1/world-clocks") {
    try {
      sendJson(response, 200, await loadPublicWorldClocks());
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "World clock list failed"));
    }
    return;
  }

  const publicNewsMatch = url.pathname.match(/^\/api\/(news|circulars)(?:\/(.+))?$/);
  if (request.method === "GET" && publicNewsMatch) {
    try {
      const [, resource, rawSlug] = publicNewsMatch;
      const slug = rawSlug ? decodeURIComponent(rawSlug.replace(/^\/+|\/+$/g, "")) : "";
      sendJson(response, 200, await loadPublicNewsCollection(resource === "circulars" ? "circulars" : "news", slug));
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Public news load failed"));
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/trade-updates") {
    try {
      sendJson(response, 200, await loadPublicNewsCollection("all"));
    } catch (error) {
      sendJson(response, 500, errorResponse(error instanceof Error ? error.message : "Trade updates load failed"));
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/admin/market-rates/sync") {
    await syncTgju();
    sendJson(response, lastError ? 502 : 200, { ok: !lastError, ...board, message: lastError });
    return;
  }

  sendJson(response, 404, { ok: false, message: "Not found" });
});

server.on("upgrade", (request, socket) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/ws/market-rates") {
    handleMarketRatesSocket(request, socket);
    return;
  }

  socket.destroy();
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[tgju-dev] backend listening on http://127.0.0.1:${port}`);
  void ensureContentIngestionSchema().catch((error) => {
    console.error(`[content-ingestion] ${error instanceof Error ? error.message : "bootstrap failed"}`);
  }).then(() => {
    void fetchActiveContentSources();
  });
  syncTgju();
  setInterval(syncTgju, syncIntervalMs);
  setInterval(() => {
    void fetchActiveContentSources();
  }, contentSourceSyncIntervalMs);
  setInterval(() => {
    for (const socket of marketRateSockets) {
      if (socket.destroyed) {
        marketRateSockets.delete(socket);
      } else {
        socket.write(createWebSocketFrame("", 0x9));
      }
    }
  }, 30000);
});

import http from "node:http";
import mysql from "mysql2/promise";

const port = Number(process.env.BACKEND_PORT ?? 8000);
const syncIntervalMs = Number(process.env.TGJU_SYNC_INTERVAL_MS ?? 120000);
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

const adminResources = new Set(["menus", "services", "articles", "news", "tags", "world-clocks", "countries"]);
const adminResourceTables = {
  menus: "menus",
  services: "services",
  articles: "articles",
  news: "news",
  tags: "tags",
  "world-clocks": "world_clock_items",
  countries: "countries"
};

const catalogPageRequest = {
  pageing: { pageNumbber: 1, PageSize: 15 },
  sorting: [{ field: "string", direction: "asc|desc" }],
  filters: {}
};

const catalogResponse = (items, total = "number") => ({ responseStatus: "0|1", response: { items, total } });
const serviceCatalog = [
  { id: 1, serviceName: "MenuService", title: "Site menus", description: "Navigation menu contract.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 100 + index + 1, name, title: `${name} menu`, method: "POST", path: `/api/admin/menus/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number" } }, response: catalogResponse([{ id: "number", title: "string", url: "string", accuracy: "0|1|2" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 2, serviceName: "ArticleService", title: "Articles", description: "Article content, tags, approval, publishing, and SEO.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 200 + index + 1, name, title: `${name} article`, method: "POST", path: `/api/admin/articles/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", tagIds: ["number"] } }, response: catalogResponse([{ id: "number", title: "string", approve: "boolean", tagIds: ["number"] }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 3, serviceName: "NewsService", title: "News", description: "News content, tags, approval, publishing, and SEO.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 300 + index + 1, name, title: `${name} news`, method: "POST", path: `/api/admin/news/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", tagIds: ["number"] } }, response: catalogResponse([{ id: "number", title: "string", approve: "boolean", tagIds: ["number"] }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 4, serviceName: "TagService", title: "Tags", description: "Tag lookup and tag landing-page content.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 400 + index + 1, name, title: `${name} tag`, method: "POST", path: `/api/admin/tags/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", content: "string", seoTitle: "string", seoDescription: "string", accuracy: "0|1|2" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", content: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 5, serviceName: "ServiceService", title: "Services", description: "Dynamic trade-service cards and service pages.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 500 + index + 1, name, title: `${name} service`, method: "POST", path: `/api/admin/services/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", title: "string", slug: "string", summary: "string", accuracy: "0|1|2" } }, response: catalogResponse([{ id: "number", title: "string", slug: "string", summary: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 6, serviceName: "WorldClockService", title: "World clocks", description: "Selected trade cities, up to seven active items.", actions: ["loadPage", "find", "add", "update", "delete"].map((name, index) => ({ id: 600 + index + 1, name, title: `${name} world clock`, method: "POST", path: `/api/admin/world-clocks/${name}`, scope: "Admin", request: name === "loadPage" ? catalogPageRequest : { body: { id: "number", countryId: "number|null" } }, response: catalogResponse([{ id: "number", city: "string", country: "string", timezone: "string" }], name === "loadPage" ? "number" : 1), status: "planned" })) },
  { id: 7, serviceName: "CountryService", title: "Countries", description: "Country lookup for admin dropdowns.", actions: [
    { id: 701, name: "loadPage", title: "loadPage countries", method: "POST", path: "/api/admin/countries/loadPage", scope: "Admin", request: catalogPageRequest, response: catalogResponse([{ id: "number", nameFa: "string", capital: "string|null", continent: "string" }]), status: "planned" },
    { id: 702, name: "cities", title: "load country cities", method: "POST", path: "/api/admin/countries/cities", scope: "Admin", request: { body: { countryId: "number" } }, response: catalogResponse([{ id: "number", city: "string", cityEn: "string", timezone: "string" }]), status: "active" }
  ] },
  { id: 8, serviceName: "MarketRateService", title: "Market rates", description: "Market-rate board used by frontend.", actions: [{ id: 801, name: "loadPage", title: "Load market board", method: "POST", path: "/api/v1/market-rates/board", scope: "Public", request: catalogPageRequest, response: catalogResponse([{ key: "string", title: "string", price: "string" }]), status: "active" }] }
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

function normalizeAccuracy(value) {
  const parsed = Number(value);
  return parsed === 1 || parsed === 2 ? parsed : 0;
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
      `FROM ${table} a LEFT JOIN menus c ON c.id = a.category_id`,
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

async function handleAdminResource(resource, action, body) {
  if (resource === "api-services" && action === "loadPage") return { status: 200, payload: successResponse(serviceCatalog, serviceCatalog.length) };
  if (!adminResources.has(resource)) return { status: 404, payload: errorResponse("Unknown admin resource.") };
  if (resource === "countries" && action === "cities") return { status: 200, payload: await loadCountryCities(body) };

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
  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
    sendJson(response, 200, { ok: true, service: "khoobrooz-api" });
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

  if (request.method === "POST" && url.pathname === "/api/admin/market-rates/sync") {
    await syncTgju();
    sendJson(response, lastError ? 502 : 200, { ok: !lastError, ...board, message: lastError });
    return;
  }

  sendJson(response, 404, { ok: false, message: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[tgju-dev] backend listening on http://127.0.0.1:${port}`);
  syncTgju();
  setInterval(syncTgju, syncIntervalMs);
});

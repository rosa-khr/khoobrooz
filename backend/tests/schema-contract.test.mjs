import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sqlPath = path.join(root, "database-design/mysql/001_core_schema.sql");
const migrationsDir = path.join(root, "backend/database/migrations");
const countriesSeedPath = path.join(root, "database-design/mysql/002_seed_core.sql");

const sql = fs.readFileSync(sqlPath, "utf8");
const migrationText = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".php"))
  .sort()
  .map((file) => fs.readFileSync(path.join(migrationsDir, file), "utf8"))
  .join("\n");

const sqlTables = [...sql.matchAll(/CREATE TABLE IF NOT EXISTS `?([a-z_]+)`?/g)].map((match) => match[1]);
const migrationTables = [...migrationText.matchAll(/Schema::create\('([a-z_]+)'/g)].map((match) => match[1]);

assert.ok(sqlTables.length >= 10, "MySQL schema must include the core dynamic tables.");

for (const table of sqlTables) {
  assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS \`?${table}\`?`), `Missing MySQL table ${table}.`);
}

const seoTables = ["menus", "categories", "tags", "pages", "services", "articles", "news", "documents"];
for (const table of seoTables) {
  const tableBlock = migrationText.match(new RegExp(`Schema::create\\('${table}'[\\s\\S]*?\\n\\s*}\\);`));
  assert.match(tableBlock?.[0] ?? "", /seoColumns\(\$table\)|seo_title/, `${table} must include SEO columns.`);
}

const approvalTables = ["articles", "news"];
for (const table of approvalTables) {
  const tableBlock = migrationText.match(new RegExp(`Schema::create\\('${table}'[\\s\\S]*?\\n\\s*}\\);`));
  assert.match(tableBlock?.[0] ?? "", /approvalColumns\(\$table\)|approve/, `${table} must include approve workflow columns.`);
}

assert.match(migrationText, /tinyInteger\('accuracy'\)/, "Migrations must include the shared accuracy field.");

const countriesSeed = fs.readFileSync(countriesSeedPath, "utf8");
const countryIso2Values = [...countriesSeed.matchAll(/'([A-Z]{2})',\s*'([A-Z]{3})'/g)].map((match) => match[1]);
const countryIso3Values = [...countriesSeed.matchAll(/'([A-Z]{2})',\s*'([A-Z]{3})'/g)].map((match) => match[2]);
const countryCapitalValues = [...countriesSeed.matchAll(/'([A-Z]{3})',\s*NULL,\s*(NULL|'[^']*')/g)].map((match) => match[2]);

assert.ok(countryIso2Values.length >= 190, "Country seed must include the full ISO country list.");
assert.equal(new Set(countryIso2Values).size, countryIso2Values.length, "Country iso2 values must be unique.");
assert.equal(new Set(countryIso3Values).size, countryIso3Values.length, "Country iso3 values must be unique.");
assert.ok(countryCapitalValues.some((capital) => capital !== "null"), "Country seed must include capitals.");

console.log("Backend MySQL schema contract is valid.");

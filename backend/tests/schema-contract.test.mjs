import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sqlPath = path.join(root, "database-design/sql/001_core_schema.sql");
const migrationsDir = path.join(root, "backend/database/migrations");

const sql = fs.readFileSync(sqlPath, "utf8");
const migrationText = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".php"))
  .sort()
  .map((file) => fs.readFileSync(path.join(migrationsDir, file), "utf8"))
  .join("\n");

const sqlTables = [...sql.matchAll(/CREATE TABLE dbo\.([a-z_]+)/g)].map((match) => match[1]);
const migrationTables = [...migrationText.matchAll(/Schema::create\('([a-z_]+)'/g)].map((match) => match[1]);

assert.deepEqual(
  [...migrationTables].sort(),
  [...sqlTables].sort(),
  "Laravel migrations must cover every SQL Server design table."
);

for (const table of sqlTables) {
  const tableBlock = migrationText.match(new RegExp(`Schema::create\\('${table}'[\\s\\S]*?\\n\\s*}\\);`));
  assert.ok(tableBlock, `Missing migration block for ${table}.`);
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

console.log("Backend schema contract is valid.");

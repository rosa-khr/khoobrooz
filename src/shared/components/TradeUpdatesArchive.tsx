import Link from "next/link";
import { localizedPath, type Locale } from "@/core/lib/site";

type TradeUpdateItem = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category?: string | null;
  categoryType?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  sourcePublishedAt?: string | null;
  publishedAt?: string | null;
};

type TradeUpdateResponse = {
  responseStatus: 0 | 1;
  response: {
    items: TradeUpdateItem[];
    total: number;
  };
};

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

async function loadUpdates(endpoint: "trade-updates" | "news" | "circulars") {
  try {
    const response = await fetch(`${backendApiBaseUrl}/api/${endpoint}`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = (await response.json()) as TradeUpdateResponse;
    return payload.responseStatus === 1 ? payload.response.items : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeZone: "Asia/Tehran" }).format(new Date(value));
}

export async function TradeUpdatesArchive({ endpoint, locale, mode }: { endpoint: "trade-updates" | "news" | "circulars"; locale: Locale; mode: "all" | "news" | "circulars" }) {
  const items = await loadUpdates(endpoint);
  const featured = items[0];
  const rest = items.slice(1, 9);
  const title = mode === "circulars" ? "بخشنامه‌ها" : mode === "news" ? "اخبار تجارت" : "اخبار و بخشنامه‌ها";
  const description = mode === "circulars"
    ? "آخرین بخشنامه‌ها و ابلاغیه‌های رسمی مرتبط با گمرک، واردات، صادرات و ارز."
    : mode === "news"
      ? "آخرین خبرهای تجارت خارجی، گمرک، واردات، صادرات، ارز و چین."
      : "پایش خبرهای تجارت و بخشنامه‌های رسمی؛ فقط موارد تایید و منتشرشده نمایش داده می‌شوند.";

  return (
    <main className="bg-background">
      <section className="border-b border-line bg-white">
        <div className="container py-8">
          <nav className="mb-4 text-xs font-bold text-muted">
            <Link href={localizedPath(locale, "/")}>خانه</Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="text-3xl font-black text-primary md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-8 text-muted">{description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-extrabold">
            <Link className="rounded-[5px] border border-line bg-white px-3 py-2 text-primary hover:border-accent hover:text-accent" href={localizedPath(locale, "/trade-updates")}>همه</Link>
            <Link className="rounded-[5px] border border-line bg-white px-3 py-2 text-primary hover:border-accent hover:text-accent" href={localizedPath(locale, "/trade-news")}>اخبار تجارت</Link>
            <Link className="rounded-[5px] border border-line bg-white px-3 py-2 text-primary hover:border-accent hover:text-accent" href={localizedPath(locale, "/trade-circulars")}>بخشنامه‌ها</Link>
          </div>
        </div>
      </section>

      <section className="container grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          {featured ? (
            <article className="grid gap-4 rounded-khoobrooz border border-line bg-white p-5 shadow-soft md:grid-cols-[1fr_1.2fr]">
              <div className="flex aspect-[16/10] items-center justify-center rounded-[6px] bg-primary text-5xl font-black text-accent">
                {featured.categoryType === "circular" ? "ب" : "خ"}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-black text-accent">{featured.category || (featured.categoryType === "circular" ? "بخشنامه" : "خبر")}</span>
                <h2 className="mt-2 text-2xl font-black leading-10 text-primary">{featured.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-muted">{featured.summary}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-muted">
                  {featured.sourceName ? <span>{featured.sourceName}</span> : null}
                  <span>{formatDate(featured.sourcePublishedAt || featured.publishedAt)}</span>
                </div>
              </div>
            </article>
          ) : (
            <section className="rounded-khoobrooz border border-line bg-white p-6 text-primary">
              <strong>هنوز مورد منتشرشده‌ای وجود ندارد</strong>
              <p className="mt-2 text-sm font-semibold text-muted">اخبار ورودی پس از بررسی و انتشار مدیر در این بخش نمایش داده می‌شوند.</p>
            </section>
          )}

          <div className="grid gap-3">
            {rest.map((item) => (
              <article className="grid gap-3 rounded-khoobrooz border border-line bg-white p-4 md:grid-cols-[120px_1fr]" key={item.id}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-[5px] bg-[#f7f0df] text-xl font-black text-accent">
                  {item.categoryType === "circular" ? "بخشنامه" : "خبر"}
                </div>
                <div>
                  <span className="text-xs font-black text-accent">{item.category || "تجارت"}</span>
                  <h3 className="mt-1 text-lg font-black leading-8 text-primary">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-7 text-muted">{item.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-muted">
                    {item.sourceName ? <span>{item.sourceName}</span> : null}
                    <span>{formatDate(item.sourcePublishedAt || item.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid h-max gap-4 rounded-khoobrooz border border-line bg-white p-4">
          <h2 className="text-base font-black text-primary">دسته‌های خبری</h2>
          <div className="flex flex-wrap gap-2 text-xs font-extrabold">
            {["تجارت", "گمرک", "واردات", "صادرات", "ارز و حواله", "چین", "حمل‌ونقل"].map((item) => (
              <span className="rounded-[4px] border border-line px-2.5 py-1.5 text-muted" key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

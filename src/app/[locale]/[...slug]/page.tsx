import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { Locale, localizedPath } from "@/core/lib/site";
import { sitePageContent, type SitePageContent } from "@/data/sitePageContent";

type PageProps = {
  params: Promise<{
    locale: Locale;
    slug: string[];
  }>;
};

type DbPage = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

type PageResponse = {
  responseStatus: 0 | 1;
  response: {
    items: DbPage[];
    total: number;
  };
};

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

function getFallbackPage(slugSegments: string[]) {
  return sitePageContent[slugSegments.join("/")];
}

async function loadDbPage(slugSegments: string[]) {
  const slug = slugSegments.join("/");

  try {
    const response = await fetch(`${backendApiBaseUrl}/api/v1/pages/${encodeURIComponent(slug)}`, {
      cache: "no-store"
    });
    const payload = (await response.json()) as PageResponse;

    if (!response.ok || payload.responseStatus !== 1) {
      return null;
    }

    return payload.response.items[0] ?? null;
  } catch {
    return null;
  }
}

function toFallbackShape(page: DbPage): SitePageContent {
  return {
    eyebrow: "صفحه",
    title: page.title,
    description: page.summary || page.seoDescription,
    sections: []
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbPage = await loadDbPage(slug);
  const page = dbPage ? toFallbackShape(dbPage) : getFallbackPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | خوبروز`,
    description: page.description
  };
}

export default async function DynamicSitePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const dbPage = await loadDbPage(slug);
  const page = dbPage ? toFallbackShape(dbPage) : getFallbackPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.title}>
        <p>{page.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={localizedPath(locale, "/contact")}>ارتباط با خوبروز</Button>
          <Button href={localizedPath(locale, "/services")} variant="secondary">مشاهده خدمات</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        {dbPage?.content ? (
          <div className="container">
            <article className="prose prose-slate max-w-none rounded-khoobrooz border border-line bg-white p-6 leading-8 prose-headings:text-primary prose-a:text-secondary" dangerouslySetInnerHTML={{ __html: dbPage.content }} />
          </div>
        ) : (
          <div className="container grid gap-4 md:grid-cols-2">
            {page.sections.length > 0 ? page.sections.map((section, index) => (
              <Card key={section.title} warm={index === 0}>
                <h2 className="mb-3 text-xl font-black text-primary">{section.title}</h2>
                <p className="text-muted">{section.body}</p>
              </Card>
            )) : (
              <Card warm>
                <h2 className="mb-3 text-xl font-black text-primary">محتوای صفحه آماده ورود است</h2>
                <p className="text-muted">این route ساخته شده و از پنل مدیریت صفحات قابل تکمیل است.</p>
              </Card>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

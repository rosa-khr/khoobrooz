import type { Locale } from "@/core/lib/site";
import { TradeUpdatesArchive } from "@/shared/components/TradeUpdatesArchive";

export default async function TradeNewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <TradeUpdatesArchive endpoint="news" locale={locale} mode="news" />;
}

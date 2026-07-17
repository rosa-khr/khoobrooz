import type { Locale } from "@/core/lib/site";
import { TradeUpdatesArchive } from "@/shared/components/TradeUpdatesArchive";

export default async function TradeCircularsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <TradeUpdatesArchive endpoint="circulars" locale={locale} mode="circulars" />;
}

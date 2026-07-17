import { TradeUpdatesArchive } from "@/shared/components/TradeUpdatesArchive";
import type { Locale } from "@/core/lib/site";

export default async function TradeUpdatesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <TradeUpdatesArchive endpoint="trade-updates" locale={locale} mode="all" />;
}

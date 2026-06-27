import { NextResponse } from "next/server";
import { fetchBackendMarketRates } from "@/core/lib/marketRates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await fetchBackendMarketRates();

    return NextResponse.json({
      ok: true,
      ...payload
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Market rates update failed"
      },
      { status: 502 }
    );
  }
}

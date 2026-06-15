import { NextResponse } from "next/server";
import { fetchTgjuMarketRates } from "@/core/lib/tgju";

export const revalidate = 21600;

export async function GET() {
  try {
    const payload = await fetchTgjuMarketRates();

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

import { NextResponse } from "next/server";

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

export async function GET() {
  try {
    const response = await fetch(`${backendApiBaseUrl}/api/v1/menus`, {
      cache: "no-store"
    });

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        responseStatus: 0,
        response: { items: [], total: 0 },
        message: error instanceof Error ? error.message : "Menu request failed"
      },
      { status: 502 }
    );
  }
}

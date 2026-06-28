import { NextRequest, NextResponse } from "next/server";

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://127.0.0.1:8000";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ resource: string; action: string }> }
) {
  try {
    const { resource, action } = await context.params;
    const response = await fetch(
      `${backendApiBaseUrl}/api/admin/${encodeURIComponent(resource)}/${encodeURIComponent(action)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: await request.text(),
        cache: "no-store"
      }
    );

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        responseStatus: 0,
        response: { items: [], total: 0 },
        message: error instanceof Error ? error.message : "Admin API request failed"
      },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/core/lib/site";

const PUBLIC_FILE = /\.(.*)$/;

function requireAdminAuthentication(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const credentials = atob(authorization.slice(6));
      const separatorIndex = credentials.indexOf(":");
      const providedUsername = credentials.slice(0, separatorIndex);
      const providedPassword = credentials.slice(separatorIndex + 1);
      if (providedUsername === username && providedPassword === password) {
        return null;
      }
    } catch {
      // Invalid Basic Auth payloads are handled by the challenge below.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Khoobrooz Admin", charset="UTF-8"'
    }
  });
}

function rejectCrossOriginAdminMutation(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/admin") || request.method === "GET") {
    return null;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  try {
    if (new URL(origin).host === request.headers.get("host")) {
      return null;
    }
  } catch {
    // Malformed origins are rejected below.
  }

  return new NextResponse("Cross-origin admin requests are not allowed.", { status: 403 });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return rejectCrossOriginAdminMutation(request) ?? requireAdminAuthentication(request) ?? NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

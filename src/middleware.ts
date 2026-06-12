import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/core/lib/site";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale === defaultLocale) {
    const url = request.nextUrl.clone();
    const cleanPath = `/${segments.slice(2).join("/")}`.replace(/\/$/, "");
    url.pathname = cleanPath || "/";
    return NextResponse.redirect(url, 308);
  }

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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "./lib/fetcher";

const API_STATUS_ENDPOINT = `${API_URL}/auth/users/me`
// 公開路徑 (白名單)：只有這些頁面是未登入者可以訪問的
  const publicPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 判斷當前路徑是否為公開路徑
  const isPublicPath = publicPaths.includes(pathname);

  const token = request.cookies.get("access_token")?.value;
  console.log(
    `[Middleware] Path: ${pathname}, Token Exists: ${!!token}, Is Public: ${isPublicPath}`
  ); // 🌟 新增日誌 1

  if (token && isPublicPath) {
    console.log(`[Middleware] Checking API Status: ${API_STATUS_ENDPOINT}`); // 🌟 新增日誌 2
    try {
      const response = await fetch(API_STATUS_ENDPOINT, {
        headers: request.headers,
      });

      console.log(`[Middleware] API Status Response: ${response.status}`); // 🌟 新增日誌 3

      if (response.status === 200) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error("[Middleware Error] Fetch failed:", err); // 🌟 新增日誌 4
      console.error(err);

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!token && !isPublicPath) {
    console.log(`[Middleware] Redirecting to /login (Token Missing)`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 其他情況 (已登入訪問受保護頁面、未登入訪問公開頁面) -> 放行
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
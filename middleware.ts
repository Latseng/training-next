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

  if (token && isPublicPath) {
    try {
      const response = await fetch(API_STATUS_ENDPOINT, {
        headers: request.headers,
      });

      if (response.status === 200) {
        // 登入狀態無效，重定向到登入頁
        return NextResponse.redirect(new URL("/", request.url));
      }
      // 狀態 OK (200)，允許繼續
      return NextResponse.next();
    } catch (err) {
      // 網路錯誤或其他異常，重定向
      console.error(err);
      
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  if (!token && !isPublicPath) {

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
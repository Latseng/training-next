import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 公開路徑 (白名單)：只有這些頁面是未登入者可以訪問的
  const publicPaths = ["/login", "/signup"];

  // 判斷當前路徑是否為公開路徑
  const isPublicPath = publicPaths.includes(pathname);

  const token = request.cookies.get("access_token")?.value;

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  if (!token && !isPublicPath) {

    const loginUrl = new URL("/login", request.url);
    // 避免 redirect loop，確保不會一直重複添加參數 (雖非必須但較乾淨)
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

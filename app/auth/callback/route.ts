import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ACCESS_TOKEN_MAX_AGE = 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("Supabase Session Exchange Error:", error);
      return NextResponse.redirect(
        `${origin}/login?error=session-exchange-failed`
      );
    }

    const { access_token, refresh_token } = data.session;

    const response = NextResponse.redirect(new URL("/", origin)); 

    response.cookies.set("access_token", access_token, {
      ...COOKIE_OPTS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set("refresh_token", refresh_token, {
      ...COOKIE_OPTS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  }

  // 錯誤處理
  return NextResponse.redirect(`${origin}/login?error=auth-code-missing`);
}

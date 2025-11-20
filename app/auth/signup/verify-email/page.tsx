"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { API_PROXY } from "@/lib/fetcher";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push("/auth/signup");
    }
  }, [email, router]);

  // 倒數計時器
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((sec) => sec - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResend() {
    setCooldown(60)
    if (!email) return;

    try {
      setIsResending(true);
      
      const res = await fetch(`${API_PROXY}/auth/resend-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        toast.error("重寄驗證信失敗");
        console.log(data);
        
        return;
      }

      toast.success("驗證信已重新寄送！");
    } catch (e) {
      console.error(e);
      toast.error("發生錯誤");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Mail className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-xl font-bold mt-2">
            請至信箱接收註冊確認信
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            已寄出一封驗證信到：
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>

          <div className="flex flex-col gap-4">
            {/* 重新寄送驗證信 */}
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  重新寄送中...
                </>
              ) : cooldown > 0 ? (
                `已重新寄送驗證信（${cooldown} ）`
              ) : (
                "重新寄送驗證信"
              )}
            </Button>

            {/* 我已完成驗證 */}
            <Button onClick={() => router.push("/auth/login")}>
              我已完成驗證，前往登入
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
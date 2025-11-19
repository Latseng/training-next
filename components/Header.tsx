"use client"

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const LOGO_PATH = "/training-logo.png";

const Header = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("登出成功！");
        router.push("/");
        router.push("/login");
      } else {
        toast.warning("登出失敗，發生預期外錯誤，請稍後再試");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.warning("登出失敗，發生預期外錯誤，請稍後再試");
    }
  };

  return (
    <header className="px-4 m-4 md:m-0 border rounded-lg md:rounded-none flex justify-between items-center">
      <Link href="/" className="m-2 hover:bg-gray-100 flex items-center rounded-xl">
        <div className="relative w-20 h-20">
          {/* fill: true 讓圖片填滿父層 div
                alt: 必填，用於 SEO 和無障礙設計
              */}
          <Image
            src={LOGO_PATH}
            alt="Logo"
            fill={true}
            className="object-contain"
          />
        </div>
        <span className="mr-4">Training Tracker</span>
      </Link>
      <Button variant="ghost" size="sm" onClick={() => handleLogout()}>
        <LogOut />
        登出
      </Button>
    </header>
  );
}

export default Header
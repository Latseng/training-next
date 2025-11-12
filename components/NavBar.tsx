"use client"

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NavBar = () => {
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
    <header className="p-4 m-4 md:m-0 border rounded-lg md:rounded-none flex justify-between items-center">
      <Link href="/" className="hover:bg-gray-100">
        訓練追蹤
      </Link>
      <Button variant="ghost" size="sm" onClick={() => handleLogout()}>
        <LogOut />
        登出
      </Button>
    </header>
  );
}

export default NavBar
"use client"

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NavBar = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
    toast.success("登出成功！");
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
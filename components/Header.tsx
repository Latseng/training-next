"use client"

import { CircleUser, LogOut} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { API_PROXY } from "@/lib/fetcher";
import { Button } from "./ui/button";

const LOGO_PATH = "/training-logo.png";

const Header = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_PROXY}/auth/logout`, {
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
    <header className="px-4 md:px-8 m-4 md:m-0 border rounded-lg md:rounded-none flex justify-between items-center">
      <Link href="/" className="flex items-center rounded-xl">
        <div className="relative w-20 h-20">
          <Image
            src={LOGO_PATH}
            alt="Logo"
            fill={true}
            className="object-contain"
          />
        </div>
        <span className="mr-4">Training Tracker</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            asChild
          >
            <CircleUser strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            asChild
          >
            <Link href="/profile">個人資訊</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogOut />
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header
"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { FileUser, Mail, Undo, X } from "lucide-react";
import Link from "next/link";

const API_ENDPOINT = "/auth/users/me";

const ProfileCard = () => {
  const { data } = useSWR(API_ENDPOINT, fetcher);

  return (
    <Card className="m-4 px-4">
      <CardHeader>
        <CardTitle>個人資訊</CardTitle>
        <CardAction>
          <Button variant="ghost" asChild>
            <Link href="/">
              <Undo />
              返回
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      {data ? (
        <>
          <CardContent className="space-y-4">
            <p className="flex gap-4">
              <FileUser />暱稱：
              {data.username}
            </p>
            <p className="flex gap-4">
              <Mail />Email：
              {data.email}
            </p>
          </CardContent>
          {/* <CardFooter>
            <Button variant="outline">修改密碼</Button>
          </CardFooter> */}
        </>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-8 w-100" />
          <Skeleton className="h-8 w-80" />
        </div>
      )}
    </Card>
  );
};

export default ProfileCard;

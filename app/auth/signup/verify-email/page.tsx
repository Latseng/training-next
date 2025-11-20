import VerifyEmailClient from "@/components/VerifyEmailClient";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Suspense
        fallback={
          <div className="my-20 mx-20 flex items-center justify-center p-8 rounded-xl shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";


export default function Home() {
  return (
    <section>
      <div className="flex flex-col items-center my-2 md:my-4">
        <Button className="text-blue-700 hover:text-blue-900" variant="ghost" size="icon-2xl" asChild>
          <SquarePlus strokeWidth={1.2} />
        </Button>
        <p className="text-gray-500 font-semibold text-lg md:text-xl">新增訓練</p>
      </div>
    </section>
  );
}

import { ReactNode } from "react";
import Link from "next/link";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <header className="p-4 m-4 md:m-0 border rounded-lg md:rounded-none">
        <Link href="/" className="hover:bg-gray-100">
          訓練追蹤
        </Link>
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default layout;

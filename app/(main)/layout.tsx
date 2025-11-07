import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default layout;

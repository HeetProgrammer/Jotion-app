

import Navbar from "@/components/marketing/navbar";
import { ReactNode } from "react";

export default function MarketingLayout({ children }:{
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
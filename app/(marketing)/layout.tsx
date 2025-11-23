

import Navbar from "@/components/marketing/navbar";

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
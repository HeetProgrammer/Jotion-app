import { Toaster } from "sonner";
import ToastListener from "@/components/global/toast-listener";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <ToastListener />
      
      <main>
        {children}
      </main>
    </>
  );
}
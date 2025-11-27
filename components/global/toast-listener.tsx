"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error === "unauthorized") {
      toast.error("You are not authorized to access that route");
      
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return <></>

}
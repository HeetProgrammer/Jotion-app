"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignIn({ provider }: { provider: "google" | "github" | "microsoft" } ) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: "google" | "github" | "microsoft") => {
    setLoading(provider);
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/dashboard", 
    });
    setLoading(null);
  };
  console.log(provider);

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10 text-black">
      <button
        onClick={() => handleLogin(provider)}
        className="p-3 bg-black text-white rounded hover:opacity-90 flex items-center justify-center gap-2"
      >
        {loading === provider ? "Loading..." : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
      </button>

    </div>
  );
}
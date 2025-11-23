"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignIn() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: "google" | "github" | "microsoft") => {
    setLoading(provider);
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/dashboard", 
    });
    setLoading(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10 text-black">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      
      <button
        onClick={() => handleLogin("google")}
        className="p-3 border rounded hover:bg-gray-100 flex items-center justify-center gap-2"
      >
        {loading === "google" ? "Loading..." : "Continue with Google"}
      </button>

      <button
        onClick={() => handleLogin("github")}
        className="p-3 bg-black text-white rounded hover:opacity-90 flex items-center justify-center gap-2"
      >
        {loading === "github" ? "Loading..." : "Continue with GitHub"}
      </button>

      <button
        onClick={() => handleLogin("microsoft")}
        className="p-3 bg-blue-600 text-white rounded hover:opacity-90 flex items-center justify-center gap-2"
      >
        {loading === "microsoft" ? "Loading..." : "Continue with Microsoft"}
      </button>
    </div>
  );
}
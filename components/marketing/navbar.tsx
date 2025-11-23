"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black">
            <BookOpen className="w-6 h-6" />
            <span>Jotion</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Log in
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Get Jotion free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
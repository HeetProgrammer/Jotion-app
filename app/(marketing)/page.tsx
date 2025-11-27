import { getSession } from "next-auth/react";
import { BookOpen } from "lucide-react"; 
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center py-12 my-0.5">
      
      <div className="text-center mb-6">
        <Link href="/" className="flex justify-center items-center gap-2 mb-4">
          <div className="bg-black text-white p-2 rounded-lg">
             <BookOpen size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">Jotion</span>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Log in and set up your workspace
        </h2>
      </div>

    </div>
  );
}
    

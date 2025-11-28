import { createWorkspace } from "@/actions/workspace";
import { BookOpen } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="bg-black text-white p-3 rounded-xl w-12 h-12 mx-auto flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Name your workspace</h1>
        </div>

        <form action={createWorkspace} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Type your Name here"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition text-gray-950"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import { FileText, ArrowLeft } from "lucide-react";



export default async function WorkspaceIdPage({ params }) {
  const { workspaceId } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if(!workspace){
    return;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-8 bg-white">
      
      <div className="bg-blue-50 p-6 rounded-full shadow-sm">
        <FileText className="h-12 w-12 text-blue-600" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to {workspace.name}
        </h2>
        <p className="text-gray-500">
          This is the start of your workspace. Select a page from the sidebar to start editing, or create a new one.
        </p>
      </div>

    </div>
  );
}
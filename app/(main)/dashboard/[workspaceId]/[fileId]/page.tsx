import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Editor from "@/components/editor/editor";


export default async function FilePage({ params }) {
  const { workspaceId, fileId } = await params;
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if(!session) return;

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: workspaceId,
      userId: session.user.id
    }
  });

  const canEdit = ["OWNER", "EDITOR"].includes(membership.role)

  if(!file){ 
    return <div>File not found</div>;
    }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-40">
        
        <div className="group px-12 pt-12 pb-4">
            <h1 className="text-4xl font-bold text-gray-900 outline-none">
                {file.title}
            </h1>
        </div>

        <div className="px-12">
            <Editor 
                fileId={file.id}
                initialContent={file.content}
                editable={canEdit}
            />
        </div>
        
      </div>
    </div>
  );
}
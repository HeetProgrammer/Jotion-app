import { prisma } from "@/lib/prisma";
import Editor from "@/components/editor/editor";


export default async function FilePage({ params }) {
  const { workspaceId, fileId } = await params;


  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

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
            />
        </div>
        
      </div>
    </div>
  );
}
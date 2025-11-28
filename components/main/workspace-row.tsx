"use client";

import { Workspace, WorkspaceMember } from "@prisma/client";
import { deleteWorkspace } from "@/actions/workspace";
import { toast } from "sonner";
import { useState } from "react";
import { getWorkspaces } from "@/actions/workspace";
import { useRouter } from "next/navigation";




export default function WorkspaceRow(props: {
    relation: WorkspaceMember,
    workspace: Workspace | null
}) {
    const relation = props.relation;
    const workspace = props.workspace;
    const [isDeleted, setIsDeleted] = useState(false);
    const router = useRouter();

    const handleDelete = async ()=>{
        if(!workspace){
            return;
        }
        if(!confirm("Are you sure you want to delete this workspace?")){
            return;
        }
        try{
            deleteWorkspace(workspace.id);
            toast.success("Workspace deleted successfully");
            setIsDeleted((prev)=>!prev);
            router.refresh();
        }
        catch{
            toast.error("Failed to delete workspace");

        }

    }
    if(isDeleted){
        return <></>
    }
    return <>
    <tr className="bg-neutral-primary-soft border-b  border-default">
        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
            { workspace.name }
        </th>
        <td className="px-6 py-4">
            { relation.joinedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',    
          })}
        </td>
        <td className="px-6 py-4">
            { relation.role }
        </td>
        <td className="px-6 py-4">
            <button type="button" className="text-white bg-gray-950 box-border border border-transparent hover:bg-black focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
            <a href={`/dashboard/${workspace.id}`} className="font-medium text-fg-brand "> View Workspace </a>
            </button>
            
        </td>
        {relation.role === "OWNER" && <td className="px-6 py-4">
            <button type="button" className="text-white bg-red-700 box-border border border-transparent hover:bg-red-800 trsnsition hover:cursor-pointer focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" onClick={handleDelete}>
                Delete Workspace
            </button>

        </td>}

    </tr>
            
    </>
    
}
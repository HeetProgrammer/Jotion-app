"use client";

import { Workspace, WorkspaceMember } from "@prisma/client";


export default function WorkspaceRow(props: {
    relation: WorkspaceMember,
    workspace: Workspace | null
}) {
    const relation = props.relation;
    const workspace = props.workspace;
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
            <button type="button" className="text-white bg-gray-950 box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
            <a href={`/dashboard/${workspace.id}`} className="font-medium text-fg-brand "> View Workspace </a>
            </button>
            
        </td>
        <td className="px-6 py-4">
            <button type="button" className="text-white bg-red-700 box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                <a href={`/dashboard/${workspace.id}/delete`} className="font-medium text-fg-brand "> Delete Workspace </a>
            </button>

        </td>

    </tr>
            
    </>
    
}
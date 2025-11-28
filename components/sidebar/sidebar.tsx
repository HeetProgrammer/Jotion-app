"use client";

import { useState } from "react";
import { ChevronsLeft, FilePlus, FolderPlus } from "lucide-react";
import FilesList from "./files-list";
import FileRowInput from "./file-row-input"; 

export default function Sidebar({ workspaceId, workspaceName }: { workspaceId: string, workspaceName: string }) {
    const [refreshId, setRefreshId] = useState(0);
    const [isCreating, setIsCreating] = useState<{ isFolder: boolean } | null>(null);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between p-3 mb-2 hover:bg-gray-100 transition-colors">
                <span className="font-semibold text-sm text-gray-700 pl-2">
                    { workspaceName }
                </span>
            </div>

            <div className="px-3 space-y-1">
                <button
                    onClick={() => setIsCreating({ isFolder: false })} // Start creating File
                    className="flex items-center text-sm font-medium text-gray-600 hover:bg-gray-200 w-full p-2 rounded-md transition-colors"
                >
                    <FilePlus className="h-4 w-4 mr-2" /> New File
                </button>
                <button
                    onClick={() => setIsCreating({ isFolder: true })} // Start creating Folder
                    className="flex items-center text-sm font-medium text-gray-600 hover:bg-gray-200 w-full p-2 rounded-md transition-colors"
                >
                    <FolderPlus className="h-4 w-4 mr-2" /> New Folder
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2">
                
                {isCreating && (
                    <FileRowInput 
                        workspaceId={workspaceId}
                        parentId={null}
                        level={0} 
                        isFolder={isCreating.isFolder}
                        onComplete={() => setIsCreating(null)} // Hide input
                        onCreated={()=>setRefreshId((prev) => prev + 1)}    // Trigger refresh
                    />
                )}

                <FilesList 
                    key={refreshId} // Changing this forces the list to reload
                    workspaceId={workspaceId} 
                /> 
            </div>
        </div>
    );
}
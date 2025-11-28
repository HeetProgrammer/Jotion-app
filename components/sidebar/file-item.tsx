"use client";

import {
    ChevronDown,
    ChevronRight,
    File as FileIcon,
    Folder as FolderIcon,
    FilePlus,
    FolderPlus,
    Trash
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { deleteFile } from "@/actions/file";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import FilesList from "./files-list";
import FileRowInput from "./file-row-input";
import { renameFile } from "@/actions/file";
import { Pencil } from "lucide-react";



export default function FileItem({ file, workspaceId }) {
    const router = useRouter();
    const pathname = usePathname();

    // State
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [folderIsCreating, setFolderIsCreating] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [refreshId, setRefreshId] = useState(0);

    const itemPath = `/dashboard/${workspaceId}/${file.id}`;
    const isActive = pathname === itemPath;
    const hasChildren = file.children && file.children.length > 0;
    const showArrow = hasChildren || file.isFolder;
    const [title, setTitle] = useState(file.title);



    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    const handleNavigate = () => {
        if (!file.isFolder) {
            router.push(itemPath);
        }
    };

    const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget);
        const newTitle = formData.get("title") as string;

        try {
            await renameFile(file.id, newTitle);
            toast.success("Renamed file successfully");
            setIsRenaming(false);
            router.refresh();
            setRefreshId((prev) => prev + 1);
            setTitle(newTitle);
        } catch (error) {
            toast.error("Failed to rename");
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete "${file.title}"?`)) {
            return;
        }
        try {
            await deleteFile(file.id);
            toast.success("Successfully deleted");
            setIsDeleted(true);
            router.refresh();
            router.push(`/dashboard/${workspaceId}`);
        } catch (error) {
            toast.error("Failed to delete file");
        }
    };

    const handleCreateStart = (e: React.MouseEvent, isFolder: boolean) => {
        e.stopPropagation();
        if (!isExpanded) {
            setIsExpanded(true);
        }
        setFolderIsCreating(isFolder);
        setIsCreating(true);
    };

    const handleRefresh = () => {
        setRefreshId((prev) => prev + 1);
    };

    const handleStartRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRenaming(true);
    };

    if (isDeleted) {
        return null;
    }

    return (
        <div>
            <div
                onClick={handleNavigate}
                role="button"
                style={{ paddingLeft: `${(file.level * 12) + 12}px` }}
                className={`group flex items-center py-1 pr-3 w-full min-h-7 cursor-pointer text-sm transition-colors
          ${isActive ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}
        `}
            >
                <div
                    role="button"
                    onClick={handleExpand}
                    className={`h-full rounded-sm hover:bg-gray-200 mr-1 p-0.5 flex items-center justify-center transition-opacity ${showArrow ? 'opacity-100' : 'opacity-0'}`}
                >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </div>

                <span className="shrink-0 mr-2">
                    {file.isFolder ? <FolderIcon className="h-4 w-4 text-blue-400 fill-blue-400/20" /> : <FileIcon className="h-4 w-4" />}
                </span>
                {isRenaming ? (
                    <form onSubmit={handleRename} className="flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
                        <input
                            name="title"
                            defaultValue={title}
                            autoFocus
                            onBlur={() => setIsRenaming(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setIsRenaming(false);
                                }
                            }}
                            className="w-full bg-white ring-2 ring-blue-400 rounded-sm px-1 text-gray-900 h-6 outline-none"
                        />
                    </form>
                ) : (
                    <span className="truncate flex-1 select-none">{title}
                    {!file.isFolder && (
                    <span className="text-gray-400 text-xs ml-0.5">.md</span>)
                    }
                    </span>
                )}

                <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">

                    {!isRenaming && (
                        <div
                            role="button"
                            onClick={handleStartRename}
                            className="p-1 rounded-sm hover:bg-gray-300 hover:text-gray-900"
                            title="Rename"
                        >
                            <Pencil className="h-3 w-3" />
                        </div>
                    )}<div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                        <div role="button" onClick={handleDelete} className="p-1 rounded-sm hover:bg-gray-300 hover:text-red-500">
                            <Trash className="h-3 w-3" />
                        </div>
                        {file.isFolder && (
                            <>
                                <div role="button" onClick={(e) => handleCreateStart(e, false)} className="p-1 rounded-sm hover:bg-gray-300 hover:text-gray-900">
                                    <FilePlus className="h-3 w-3" />
                                </div>

                                <div role="button" onClick={(e) => handleCreateStart(e, true)} className="p-1 rounded-sm hover:bg-gray-300 hover:text-gray-900">
                                    <FolderPlus className="h-3 w-3" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <>
                    {isCreating && (
                        <FileRowInput
                            workspaceId={workspaceId}
                            parentId={file.id}
                            level={file.level + 1}
                            isFolder={folderIsCreating} // Tells the input to create a file or folder
                            onComplete={() => setIsCreating(false)}
                            onCreated={handleRefresh}
                        />
                    )}

                    <FilesList
                        key={refreshId} // Updates when new file is made
                        workspaceId={workspaceId}
                        parentId={file.id}
                    />
                </>
            )}
        </div>

    );
}
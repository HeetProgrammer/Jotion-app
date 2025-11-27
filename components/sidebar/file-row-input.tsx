"use client";

import { File as FileIcon, Folder as FolderIcon } from "lucide-react";
import { useState, useRef } from "react"; // We use useRef instead of useState
import { toast } from "sonner";
import { createFile } from "@/actions/file";
import { useRouter } from "next/navigation";

export default function FileRowInput({
    workspaceId,
    parentId,
    isFolder,
    level,
    onComplete,
    onCreated
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Stops the page from reloading
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;

        if (!title.trim()) {
            onComplete();
            return;
        }

        setIsLoading(true);
        try {
            await createFile({
                title: title,
                workspaceId,
                parentId,
                isFolder,
                level: 0
            });

            router.refresh();
            onCreated();
            onComplete();
            toast.success("File created successfully");
        } catch (error) {
            toast.error("Failed to create file");
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onComplete(); // Cancel
        }
    };

    // If the user clicks away, form submits automatically
    const handleBlur = () => {
        formRef.current?.requestSubmit();
    }

    return (
        <div
            style={{ paddingLeft: `${(level * 12) + 12}px` }}
            className="flex items-center py-1 pr-3 w-full bg-gray-100 min-h-7 text-sm"
        >
            <div className="w-6 shrink-0 mr-1" />

            <span className="shrink-0 mr-2">
                {isFolder ? (
                    <FolderIcon className="h-4 w-4 text-blue-400 fill-blue-400/20" />
                ) : (
                    <FileIcon className="h-4 w-4 text-gray-400" />
                )}
            </span>

            <form ref={formRef} onSubmit={onSubmit} className="flex-1 h-full">
                <input
                    name="title"
                    autoFocus
                    type="text"
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    autoComplete="off"
                    className="bg-transparent outline-none text-gray-700 placeholder-gray-400 h-full w-full"
                    placeholder={isFolder ? "Folder name..." : "File name..."}
                />
            </form>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { getFiles } from "@/actions/get-files"; // Ensure this path is correct
import FileItem from "./file-item";
import { toast } from "sonner";

interface FilesListProps {
  workspaceId: string;
  parentId?: string | null; // Optional: If null, fetches root files
}

export default function FilesList({ workspaceId, parentId = null }: FilesListProps) {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles(workspaceId, parentId);
        setFiles(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load files");
      } 
    };

    fetchFiles();
  }, [workspaceId, parentId]);


  // Ultimately, after recursion this code will run and rendering stops
  if (files.length === 0) {
    return (
      <></>
    );
  }

  return (
    <div className="flex flex-col space-y-0.5">
      {files.map((file) => (
        <FileItem key={file.id} file={file} workspaceId={workspaceId} />
      ))}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { File, Folder, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchFiles } from "@/actions/search";
import { Command } from "cmdk";



export const SearchCommand = ({ workspaceId }: {workspaceId: string}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle on Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle Searching
  const handleSearch = async (query: string) => {
    if (!query) {
        setResults([]);
        return;
    }
    setIsLoading(true);
    try {
        const data = await searchFiles(workspaceId, query);
        setResults(data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const onSelect = (id: string,isFolder: boolean) => {
    if(!isFolder){
    router.push(`/dashboard/${workspaceId}/${id}`);
    setOpen(false); // Closes the search palette
    }
  };

  if (!open){ 
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-99999 flex items-center justify-center p-4"
        onClick={(e) => {
            if (e.target === e.currentTarget){ 
                setOpen(false);
            }
        }}
    >
      <div className="bg-white dark:bg-[#1F1F1F] w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        
        <Command label="Global Search" className="w-full">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input 
                autoFocus
                placeholder="Search files by name or content..."
                onValueChange={handleSearch}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>


          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2">
            
            {/* Empty States */}
            {!isLoading && results.length === 0 && (
                 <div className="py-6 text-center text-sm text-gray-500">No results found.</div>
            )}
            {isLoading && (
                 <div className="py-6 text-center text-sm text-gray-500">Searching...</div>
            )}

            {/* Render Items */}
            {results.map((file) => (
              
              <Command.Item
                key={file.id}
                value={`${file.id}-${file.title}`}
                onSelect={() => onSelect(file.id, file.isFolder)}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-blue-100 aria-selected:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50"
              >
                {file.isFolder ? (
                    <Folder className="mr-2 h-4 w-4 text-blue-500" />
                ) : (
                    <File className="mr-2 h-4 w-4 text-gray-500" />
                )}
                <span>{file.title}</span>
              </Command.Item>
            ))}

          </Command.List>
        </Command>
      </div>
    </div>
  );
};
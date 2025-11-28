"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"; 
import { updateFileContent } from "@/actions/file";
import { useState } from "react";
import { FileDown, Code, FileText } from "lucide-react";



export default function Editor({ fileId, initialContent, editable = true }) {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const editor = useCreateBlockNote({
    initialContent: initialContent 
      ? JSON.parse(initialContent) 
      : undefined,
  });

  const handleUpload = (json: string) => {
    setSaveStatus("Saving...");
    updateFileContent(fileId, json).then(() => {
        setSaveStatus("Saved");
    });
  };

  let saveTimer: NodeJS.Timeout;


  // Function that helps in downloading file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };


  // Exports as Markdown
  const handleExportMarkdown = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    downloadFile(markdown, "document.md", "text/markdown");
  };

  // Exports as HTML
  const handleExportHTML = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    downloadFile(html, "document.html", "text/html");
  };

  // Exports as Plain Text (Markdown syntax removed)
  const handleExportText = async () => {
    // We loop through every block and just grab the raw text
    const text = editor.document.map((block) => {
        const content = block.content;
        if (Array.isArray(content)) {
            // Join all text segments in this block
            return content.map((c) => c.text).join("");
        }
        return ""; // Empty lines or image blocks return empty string
    }).join("\n"); // Join blocks with newlines

    downloadFile(text, "document.txt", "text/plain");
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute -top-10 right-0 flex items-center gap-2">
        {/* Status Text */}
        <div className="text-xs text-gray-400 mr-4 select-none">
            {saveStatus}
        </div>

        {/* Markdown Button */}
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
          title="Export Markdown"
        >
          <FileDown className="h-3 w-3" />
          <span>MD</span>
        </button>

        {/* HTML Button */}
        <button
          onClick={handleExportHTML}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
          title="Export HTML"
        >
          <Code className="h-3 w-3" />
          <span>HTML</span>
        </button>

        {/* Text Button */}
        <button
          onClick={handleExportText}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
          title="Export Plain Text"
        >
          <FileText className="h-3 w-3" />
          <span>TXT</span>
        </button>
      </div>

      <div className="-mx-[54px] my-4 bg-white">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="light"
          onChange={() => {
            // Clear previous timer
            clearTimeout(saveTimer);
            
            // Wait 1s, then save
            saveTimer = setTimeout(() => {
                const json = JSON.stringify(editor.document);
                handleUpload(json);
            }, 1000);
          }}
        />
      </div>
    </div>
  );
}
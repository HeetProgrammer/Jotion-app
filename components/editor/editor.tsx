"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"; 
import { updateFileContent } from "@/actions/file";
import { useState } from "react";



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

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Save Status Indicator */}
      <div className="absolute top-[-30px] right-0 text-xs text-gray-400">
        {saveStatus}
      </div>

      <div className="-mx-[54px] my-4 bg-white dark:bg-[#1F1F1F]">
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
"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@/liveblocks.config";
import { useEffect, useState } from "react";
import { updateFileContent } from "@/actions/file";
import { toast } from "sonner";
import { FileJson } from "lucide-react";
import { Download } from "lucide-react";
import { FileCode } from "lucide-react";
import { FileType } from "lucide-react";



export default function Editor({ fileId, initialContent, editable = true }: {
  fileId: string;
  initialContent?: string | null;
  editable?: boolean;
}) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();
  const [saveStatus, setSaveStatus] = useState("Synced");

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <BlockNoteEditor
      doc={doc}
      provider={provider}
      fileId={fileId}
      initialContent={initialContent}
      saveStatus={saveStatus}
      setSaveStatus={setSaveStatus}
      editable={editable}
    />
  );
}

function BlockNoteEditor({ doc, provider, fileId, initialContent, saveStatus, setSaveStatus, editable }: any) {

  const userInfo = useSelf((me) => me.info);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name || "Guest",
        color: userInfo?.color || "#ff0000",
      },
    },
  });

  useEffect(() => {
    async function loadInitial() {
      if (editor.document.length === 0 && initialContent) {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, JSON.parse(initialContent));
      }
    }
    loadInitial();
  }, [editor, initialContent]);

  useEffect(() => {
    const interval = setInterval(() => {
      const json = JSON.stringify(editor.document);
      const plainText = editor.document.map((block: any) => {
        const content = block.content;
        if (Array.isArray(content)) {
          return content.map((c) => c.text).join("");
        }
        return "\n";
      }).join("\n");

      updateFileContent(fileId, json, plainText).then(() => setSaveStatus("Saved"));
    }, 5000);

    return () => clearInterval(interval);

  }, [editor, fileId, setSaveStatus]);


  const handleExport = async (format: string) => {
    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    try {
      if (format === "markdown") {
        content = await editor.blocksToMarkdownLossy(editor.document);
        mimeType = "text/markdown";
        extension = "md";
      } else if (format === "html") {
        // Uses built-in HTML exporter if available, otherwise falls back to simple conversion
        content = await editor.blocksToHTMLLossy(editor.document);
        mimeType = "text/html";
        extension = "html";
      } else if (format === "text") {
        // Extracts plain text manually
        content = editor.document.map((block: any) => {
          const contentArr = block.content;
          if (Array.isArray(contentArr)) {
            return contentArr.map((c: any) => c.text).join("");
          }
          return "";
        }).join("\n");
        mimeType = "text/plain";
        extension = "txt";
      }

      // Trigger Download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jotion-export-${fileId}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${extension.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed");
    }
  };

  return (<>
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute top-[-30px] right-0 text-xs text-gray-400">
        {saveStatus}
      </div>
      <div className="relative inline-block text-left">
        <button
          className="peer flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition"
        >
          <Download className="h-3 w-3" /> Export
        </button>

        <div className="hidden peer-hover:block hover:block absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
          <button
            onClick={() => handleExport("markdown")}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-100 text-gray-700"
          >
            <FileCode className="h-3 w-3" /> Markdown
          </button>
          <button
            onClick={() => handleExport("html")}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-100 text-gray-700"
          >
            <FileType className="h-3 w-3" /> HTML
          </button>
          <button
            onClick={() => handleExport("text")}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-100 text-gray-700"
          >
            <FileJson className="h-3 w-3" /> Text
          </button>
        </div>
      </div>
    </div>

    <div className="-mx-[54px] my-4 bg-white min-h-[500px]">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
      />
    </div>

  </>)
}

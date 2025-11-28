"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@/liveblocks.config";
import { useEffect, useState } from "react";
import { updateFileContent } from "@/actions/file";



export default function Editor({ fileId, initialContent, editable = true }:{
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

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-[-30px] right-0 text-xs text-gray-400">
                {saveStatus}
            </div>
            
            <div className="-mx-[54px] my-4 bg-white">
                <BlockNoteView
                    editor={editor}
                    editable={editable}
                    theme="light"
                />
            </div>
        </div>
    );
}
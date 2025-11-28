"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import Editor from "./editor";
import { Loader2 } from "lucide-react";

export default function CollaborativeRoom({ 
    roomId, 
    initialContent,
    editable
}: { 
    roomId: string; 
    initialContent: string | null;
    editable: boolean;
}) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={
          <div className="flex items-center justify-center h-full text-gray-400">
             <Loader2 className="animate-spin mr-2" /> Loading workspace...
          </div>
      }>
        {() => <Editor fileId={roomId} initialContent={initialContent} editable={editable} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
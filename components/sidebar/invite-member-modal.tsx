"use client";

import { useState, useEffect } from "react";
import { UserPlus, X, Loader2, Mail, Check, Clock } from "lucide-react";
import { inviteUser } from "@/actions/invite";
import { getPendingInvites } from "@/actions/invite";
import { toast } from "sonner"; 



export default function InviteMemberModal({ workspaceId }: {workspaceId: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  // Fetch pending invites when modal opens
  useEffect(() => {
    if (isOpen) {
        getPendingInvites(workspaceId).then(setPendingInvites);
    }
  }, [isOpen, workspaceId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await inviteUser(workspaceId, email);

    if (res!.error) {
        toast.error(res!.error);
    } else {
        toast.success("Invitation sent!");
        setEmail("");
        // Refresh the list immediately
        getPendingInvites(workspaceId).then(setPendingInvites);
    }
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 transition-colors w-full"
      >
        <UserPlus className="h-3 w-3" />
        <span>Invite Members</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-900">Invite Members</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6">
                {/* Invite Form */}
                <form onSubmit={handleInvite} className="flex gap-2 mb-6">
                    <input 
                        type="email" 
                        placeholder="colleague@gmail.com" 
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <button 
                        disabled={isLoading} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Send"}
                    </button>
                </form>

                {/* Pending List */}
                <div className="border-t pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Pending Invites</h3>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {pendingInvites.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No pending invitations.</p>
                        )}

                        {pendingInvites.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span>{inv.email}</span>
                                </div>
                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="h-2 w-2" /> Pending
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useState } from "react";
import { inviteUser } from "@/actions/invite";
import { toast } from "sonner";
import { Mail, Loader2, Check, Clock } from "lucide-react";

export default function InviteManager({ workspaceId, invites }: { workspaceId: string, invites: any[] }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try{
            await inviteUser(workspaceId, email);
            toast.success("Email sent");
            setEmail("");
        }
        catch{
            toast.error("There was an error in sending the email");
        }
        finally{
        setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Invite Form */}
            <form onSubmit={handleInvite} className="flex gap-2">
                <input 
                    type="email" 
                    placeholder="colleague@example.com" 
                    className="flex-1 border p-2 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Invite"}
                </button>
            </form>

            {/* Invite List */}
            <div className="border rounded-md">
                <div className="bg-gray-50 p-2 border-b font-medium text-sm">Pending Invites</div>
                {invites.length === 0 && <div className="p-4 text-gray-500 text-sm">No pending invites</div>}
                
                {invites.map((inv) => (
                    <div key={inv.id} className="p-3 flex justify-between items-center border-b last:border-0">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{inv.email}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {inv.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
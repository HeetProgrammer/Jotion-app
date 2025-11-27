import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/sidebar";
import { ReactNode } from "react";
import { checkUserExists, checkWorkspaceMembership } from "@/lib/auth-functions";

export default async function WorkspaceLayout({
    children,
    params
}:{
    children: ReactNode,
    params: Promise<{ workspaceId: string}>,
}) {
    const { workspaceId } = await params;
    const workspace = await prisma.workspace.findUnique(
        {
            where:{
                id: workspaceId,
            }
        }
    );
    const session = await checkUserExists();
    const member = await checkWorkspaceMembership(workspaceId, session);
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-64 shrink-0 hidden md:block border-r bg-gray-50 h-full overflow-y-auto z-50">
                <Sidebar workspaceId={workspaceId} workspaceName = {workspace.name} />
            </div>

            <main className="flex-1 h-full overflow-y-auto bg-white">
                {children}
            </main>
        </div>
    );
}
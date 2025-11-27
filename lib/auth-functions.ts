import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceMember } from "@prisma/client";

export async function checkUserExists(){
const session = await auth.api.getSession({
    headers: await headers()
  });

  if(!session){
    redirect("/login?error=unauthorized");
  }
  return session;
}


export async function checkWorkspaceMembership(workspaceId: string, session: any) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: session.user.id
      }
    }
  });

  if (!member) {
    redirect("/dashboard?error=unauthorized");
  }
  return member

}



export function checkWorkspacePermissions(membership: WorkspaceMember ){
  const workspaceId = membership.workspaceId;
  if(membership.role === "READER"){
    redirect(`/dashboard/${workspaceId}?error=unauthorized`);
  }
}
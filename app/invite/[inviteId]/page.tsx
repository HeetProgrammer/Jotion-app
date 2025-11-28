import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

export default async function InvitePage({ params }: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // If user is not logged in, this will redirect them to login page and then to this page
  if (!session){
    return redirect(`/login?callbackUrl=/invite/${inviteId}`);
  }

  //Fetch Invite
  const invite = await prisma.invite.findUnique({
    where: { id: inviteId },
    include: { workspace: true }
  });

  if (!invite || invite.status !== "PENDING") {
    return  <div>Invalid or expired invite.</div>;
  }

  // Match Emails
  if (invite.email !== session.user.email) {
      return <div>This invite was sent to {invite.email}, but you are logged in as {session.user.email}. Please logout and switch accounts.</div>
  }

  //Server Action to Accept
  async function acceptInvite() {
    "use server";
    
    // Create Membership
    await prisma.workspaceMember.create({
      data: { userId: session!.user.id, workspaceId: invite!.workspaceId, role: "MEMBER" }
    });// New member is Reader by default

    // Update Invite Status
    await prisma.invite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" }
    });

    const owner = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: invite!.workspaceId,
            role: "OWNER"
        }
    });
   
    // Sends notification to owner whenever user accepts invite
    if (owner) {
        await prisma.notification.create({
            data: {
                userId: owner.userId,
                message: `${session!.user.name} has joined ${invite!.workspace.name}`
            }
        });
    }

    redirect(`/dashboard/${invite!.workspaceId}`);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">Join {invite.workspace.name}</h1>
        <p className="text-gray-500 mb-6">You have been invited to collaborate.</p>
        <form action={acceptInvite}>
           <button className="w-full bg-blue-600 text-white py-2 rounded-md">Accept Invitation</button>
        </form>
      </div>
    </div>
  );
}
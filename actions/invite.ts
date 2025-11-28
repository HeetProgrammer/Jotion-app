"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { auth } from "@/lib/auth"; // Your auth setup
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { checkUserExists } from "@/lib/auth-functions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function inviteUser(workspaceId: string, email: string){
    const session = await checkUserExists();
    const receivingUserId = await prisma.user.findFirst({
        where:{
            email: email,
        }
    })
   if(receivingUserId){


    const existingMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: receivingUserId.id,
            workspaceId,
        }
    });
    
    

    if (existingMember) {
        return { error: "User is already a member of this workspace" };
    }}

    // Create Invite
    const invite = await prisma.invite.create({
        data: {
            email,
            workspaceId,
            status: "PENDING"
        }
    });

    console.log(invite);

    // Send Email
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Join my workspace',
        html: `
          <p>You have been invited to join a workspace!</p>
          <p>Click here to accept: <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.id}">Join Now</a></p>
        `
    });

    revalidatePath(`/dashboard/${workspaceId}/settings`); // Refresh owner view

}

export async function getPendingInvites(workspaceId: string) {
    const session = checkUserExists();
    if (!session){
        return [];
    }
    
    return await prisma.invite.findMany({
        where: {
            workspaceId,
            status: "PENDING"
        },
        orderBy: { createdAt: "desc" }
    });
}
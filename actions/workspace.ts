"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {checkUserExists, checkWorkspaceMembership}  from "@/lib/auth-functions";

export async function createWorkspace(formData: FormData) {
  const session = await checkUserExists();


  const name = formData.get("name") as string;
  if (!name || name.length < 2) {
    return { 
        error: "Workspace name is too short" ,
    }
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: name,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });

  redirect(`/dashboard`);
}
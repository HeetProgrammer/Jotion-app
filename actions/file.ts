"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { checkUserExists, checkWorkspaceMembership, checkWorkspacePermissions } from "@/lib/auth-functions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateFileContent(fileId: string, content: string, plainText: string) {

  await prisma.file.update({
    where: { 
        id: fileId 
    },
    data: {
         content,
         searchText: plainText, 
        }
  });
}

export async function createFile({
    title,
    workspaceId,
    parentId,
    isFolder,
    level
}: {
    title: string,
    workspaceId: string,
    parentId?: string,
    isFolder: boolean,
    level: number,

}) {

    const session = await checkUserExists();
    const membership = await checkWorkspaceMembership(workspaceId, session);
    checkWorkspacePermissions(membership);
    let child_level: number = 0;
    if(parentId){
        child_level = level + 1;

    }
    // Create the file
    const file = await prisma.file.create({
        data: {
            title,
            workspaceId,
            parentId, // This links it to a parent document (recursiob)
            isFolder,
            level: child_level,
            permissions:{
              create:{
                userId: session.user.id,
                canEdit: true
              }
            }
        }
    });
   return file;
}


export async function deleteFile(fileId: string){
    const session = await checkUserExists();
    const file = await prisma.file.findUnique({
        where:{
            id: fileId,
        }
    })

    if(!file){
        return;
    }
    const membership =  await checkWorkspaceMembership(file.workspaceId, session);

    if(membership.role === "READER"){
        return redirect(`/dashboard/${file.workspaceId}/${file.id}`);
    }
    await prisma.file.delete({
    where: {
        id: fileId 
           }
     });
    revalidatePath(`/dashboard/${file.workspaceId}`, 'layout');

  }


export async function renameFile(fileId: string, newTitle: string) {
  const file = await prisma.file.findUnique({
    where:{
        id: fileId,
    }
  })
  const session = await checkUserExists();
  if(!file){
    return;
  }
  const membership = await checkWorkspaceMembership(file.workspaceId, session);
  
  if(membership.role === "READER"){
    return;
  }

  

  const updatedFile = await prisma.file.update({
    where: { id: fileId },
    data: { title: newTitle }
  });

  revalidatePath(`/dashboard/${updatedFile.workspaceId}`);

  return updatedFile;
}





export async function getPermission(fileId: string, workspaceId: string) {
  const session = await checkUserExists();

  const fileOverride = await prisma.filePermission.findFirst({
    where: {
      fileId: fileId,
      userId: session.user.id
    }
  });

  if (fileOverride) {
      return fileOverride.canEdit; // Obey the overriden role
  }

  // Fallback to Workspace Role
  const membership = await prisma.workspaceMember.findFirst({
    where: { 
        userId: session.user.id,
        workspaceId: workspaceId 
    }
  });

  if (!membership) return false;

  // Defines who can edit
  const allowedRoles = ["OWNER", "EDITOR"]; 
  

  return allowedRoles.includes(membership.role);
}
    


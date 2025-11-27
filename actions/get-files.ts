"use server";

import { prisma } from "@/lib/prisma";


export async function getFiles(workspaceId: string, parentId: string | null = null) {

  return await prisma.file.findMany({
    where: { workspaceId, parentId },
    orderBy: { createdAt: 'asc' },
  });
}
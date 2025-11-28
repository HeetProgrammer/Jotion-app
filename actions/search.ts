"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkUserExists } from "@/lib/auth-functions";

export async function searchFiles(workspaceId: string, query: string) {
  const session = await checkUserExists();

  if(!query){
    return [];
  }

  const files = await prisma.file.findMany({
    where: {
      workspaceId,
      OR: [
        { 
          title: { 
            contains: query, 
            mode: "insensitive" // Case insensitive
          } 
        },
        { 
          searchText: { 
            contains: query, 
            mode: "insensitive" 
          } 
        }
      ]
    },
    take: 10, // Limit results to prevent lag
  });

  return files;
}
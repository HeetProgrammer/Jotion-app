"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkUserExists } from "@/lib/auth-functions";

export async function getNotifications() {
  const session = await checkUserExists();
  if(!session){
    return [];
  }
  return await prisma.notification.findMany({
    where: { 
        userId: session.user.id 
    },
    orderBy: { 
        createdAt: 'desc' 
    },
    take: 10 // Only show last 10
  });
}

export async function markRead(notificationId: string) {
   await prisma.notification.update({
     where: { id: notificationId },
     data: { isRead: true }
   });
}
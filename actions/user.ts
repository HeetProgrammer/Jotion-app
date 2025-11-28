"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { checkUserExists } from "@/lib/auth-functions";
import { z } from "zod";

// Validation Rules
const userSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    email: z.email("Please enter a valid email address"),
});

export async function updateUserProfile(data: { name: string; email: string }) {
    const session = await checkUserExists();
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.name);
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser && existingUser.id !== session.user.id) {
        throw new Error("This email is already taken by another account");
    }


    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                email: data.email,
            },
        });
        revalidatePath("/");
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to update profile");
    }

    // Forces the dashboard to reload the new data
    revalidatePath("/");
}

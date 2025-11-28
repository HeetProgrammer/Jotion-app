"use server";

import { auth } from "@/lib/auth"; // Your custom auth setup
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signOutAction() {
    await auth.api.signOut();
    //Redirect the user to the login page
    redirect("/login");
}
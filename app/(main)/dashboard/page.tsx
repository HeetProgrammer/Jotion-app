import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WorkspaceRow from "@/components/main/workspace-row";
import { Workspace } from "@prisma/client";
import { checkUserExists } from "@/lib/auth-functions";
import UserProfileDialog from "@/components/main/user-profile-dialog";
import NotificationBell from "@/components/main/notification-bell";

export default async function WorkspaceListPage() {

    const session =  await auth.api.getSession({
        headers: await headers()
    });

    if(!session){
        return;
    }
    
    const pendingInvite = await prisma.invite.findFirst({
        where: {
            email: session.user.email,
            status: "PENDING"
        }
    });


    if (pendingInvite) {
        // Redirect them to the email acceptance page
        return redirect(`/invite/${pendingInvite.id}`);
    }
    const memberships = await prisma.workspaceMember.findMany({
        where: {
            userId: session.user.id
        },
    });

    // Redirects the user to set up a workspace if he has not created one
    if (!memberships[0]) {
        return redirect("/onboarding");
    }

    const workspacePromises = memberships.map((membership) =>
        prisma.workspace.findFirst({
            where: {
                id: membership.workspaceId
            },
        }),
    );

    // Returns a list of workspaces after resolving all promises
    const workspaces = await Promise.all(workspacePromises);
    if (!workspaces) {
        return redirect("/onboarding");
    }

    const combinedData = memberships.map((membership, index) => ({
        membership,
        workspace: workspaces[index]
    }))



    return (
    <div className="min-h-screen bg-white p-8 md:p-12 text-gray-950">
        <div className="max-w-5xl mx-auto">
            
            <div className="mb-10">
                <div className="flex items-center justify-between"> 
                    
                    {/* Left Side: Welcome Text */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Welcome, {session.user.name}
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            Select a workspace to jump back in or create a new one
                        </p>
                    </div>

                    {/* Right Side: Actions Group */}
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        
                        <UserProfileDialog
                            initialName={session.user.name}
                            initialEmail={session.user.email}
                        />
                    </div>

                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                                Joined At
                            </th>
                            <th scope="col" className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {combinedData.map((data) => (
                            <WorkspaceRow
                                key={data.workspace!.id}
                                relation={data.membership}
                                workspace={data.workspace!}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            
            <a href="/onboarding" className="inline-block my-5">
                <button type="button" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-4 py-2.5 transition hover:cursor-pointer">
                    Create Workspace
                </button>
            </a>
        </div>
    </div>
);
}
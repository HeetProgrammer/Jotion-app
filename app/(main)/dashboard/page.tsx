import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WorkspaceRow from "@/components/main/workspace-row";
import { Workspace } from "@prisma/client";
import { checkUserExists } from "@/lib/auth-functions";

export default async function WorkspaceListPage() {
    
    const session = await checkUserExists();
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

    const combinedData = memberships.map((membership, index) => ({
        membership,
        workspace: workspaces[index]
    }))

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-gray-950">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome, {session.user.name}
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Select a workspace to jump back in.
                    </p>
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
                                    key={data.workspace.id}
                                    relation={data.membership}
                                    workspace={data.workspace}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
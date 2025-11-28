import { Liveblocks } from "@liveblocks/node";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  // Get the User Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();

  if (!room) {
    return new Response("Missing room ID", { status: 400 });
  }

  const userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);


  // This creates a blank session for the user
  const liveblocksSession = liveblocks.prepareSession(
    session.user.id,
    {
      userInfo: {
        name: session.user.name || session.user.email || "User",
        email: session.user.email,
        color: userColor,
      },
    }
  );

  liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);

  // Authorize and return the token
  const { status, body } = await liveblocksSession.authorize();
  return new Response(body, { status });
}
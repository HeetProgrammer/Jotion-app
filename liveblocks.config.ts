import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

//Define what your User Info looks like
type UserMeta = {
  id: string;
  info: {
    name: string;
    email: string;
    color: string;
  };
};

//Pass it to the context creator
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useOthers,
  useSelf,
} = createRoomContext<unknown, unknown, UserMeta>(client);


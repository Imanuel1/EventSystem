import { DisconnectReason, Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types/socket.type";
import { io } from "../server";
import { getAllData } from "../redis/redis";

export const socketInit = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>
) => {
  console.log("inside socket init");
  io.on(
    "connection",
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        any
      >
    ) => {
      console.log(
        `web socket successfully connected, client id: ${socket?.id}`
      );

      //subscribe to string topics
      socket.on("eventsInit", async () => {
        //get all events from Redis and send to this client via topic "allEvents"
        const data = await getAllData();

        socket.emit("allEvents", data);
      });

      socket.on("disconnect", (reason: DisconnectReason) => {
        console.error(`client disconnect: ${socket?.id}, reason: ${reason}`);
      });
      socket.on("error", (err) => {
        console.error(`client error: ${socket?.id}, ${err}`);
      });
    }
  );
};

//publish functions for client
export const updateEvent = (value: string) => {
  //TODO: get the data from Radis subscribe

  io.emit("updateEvent", value);
};

export const addEvent = (value: string) => {
  //TODO: get the data from Radis subscribe

  io.emit("addEvent", value);
};

export const deleteEvent = (value: string) => {
  //TODO: get the data from Radis subscribe

  io.emit("deleteEvent", value);
};

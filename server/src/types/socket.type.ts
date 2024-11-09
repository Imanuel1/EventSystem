import { Socket } from "socket.io";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  allEvents: (data: string[]) => void;
  updateEvent: (data: string) => void;
  addEvent: (data: string) => void;
  deleteEvent: (data: string) => void;
}

export interface ClientToServerEvents {
  eventsInit: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

//same as EventType
export interface SocketData {
  name: string;
  age: number;
}

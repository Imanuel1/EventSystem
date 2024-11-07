// src/hooks/useSocket.ts
import { useState, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { eventInitTopic, serverUrl } from "../utils/environment";

const useSocket = (url: string = serverUrl) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io(url, { autoConnect: true });
    setSocket(newSocket);
    setIsConnected(true);

    newSocket.on("connect", () => {
      setIsConnected(true);
      emit(eventInitTopic, undefined);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => disconnect();
  }, []);

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  return { on, emit, disconnect, isConnected };
};

export default useSocket;

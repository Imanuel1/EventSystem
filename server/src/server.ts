import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { port } from "./environment";
import { socketInit } from "./middleware/socketHandler";
import { redisSetUp } from "./redis/redis";

const app = express();
const server = http.createServer(app);
export const io = new Server({
  cors: {
      origin: 'http://localhost:3000', // Replace with your client URL
  }
});

app
  .use(cors())
  .use(express.json({ limit: "5mb" }))
  .use(express.urlencoded({ extended: false }))
  .listen(port, () => {
    socketInit(io);
    redisSetUp();
    console.log(`Server is running op port ${port}`);
  });

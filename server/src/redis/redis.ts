import { createClient } from "redis";
import express, { NextFunction, Request, Response } from "express";
import { redisDb, redisUrl } from "../environment";
import { v4 } from "uuid";
import { EventType } from "../types/event.type";
import { addEvent, deleteEvent, updateEvent } from "../middleware/socketHandler";

export const redisClient = createClient({ url: redisUrl });

//one option - use pub / sub after updating the redis, and get the data using redis.on("message")
//option two - use config command that will trigger listener for exipre and set, than listener for those

export const redisSetUp = () => {
  redisClient.on("error", (err) => console.log("Redis client error: ", err));

  redisClient.connect().then(async () => {
    console.log("Redis connected");
    try {
      //option one
      //set commands set and expired to be notify
      await redisClient.sendCommand([
        "CONFIG",
        "SET",
        "notify-keyspace-events",
        "Kxg",
      ]);
      console.log(
        "Keyspace notifications configured for set and expired events."
      );

      setupListeners();

      //option two
      messageListener();
    } catch (error) {
      console.log("configuration command failed!");
    }

  });
};

const setupListeners = async () => {
  const sub = redisClient.duplicate();
  await sub.connect();

  sub.subscribe(`__keyevent@${redisDb}__:expired`, async (message, channel) => {
    console.log(`event expire key=> message ${message}, channel: ${channel}`);
    // do something with key, can't retrieve value here
    const key = channel.substring(`__keyspace@${redisDb}__:`.length);
    const data = (await sub.get(key)) || "";
    deleteEvent(data);
  });

  sub.subscribe(`__keyevent@${redisDb}__:set`, async (message, channel) => {
    console.log(
      `event set/setEx key=> message ${message}, channel: ${channel}`
    );
    // do something with key, can't retrieve value here
    const key = channel.substring(`__keyspace@${redisDb}__:`.length);
    const data = (await sub.get(key)) || "";
    updateEvent(data);
  });
};

const messageListener = async () => {
  //pub sub messages listener
  const sub = redisClient.duplicate();
  await sub.connect();

  sub.on("message", (channel, message) => {
    console.log(`Received message from ${channel} channel. message ${message}`);
    switch (channel) {
      case "updateEvent":
        updateEvent(message);
        break;
      case "addEvent":
        addEvent(message);
        break;
      case "deleteEvent":
        deleteEvent(message);
        break;
    }
  });
}

//TODO: listener to expire keys - https://github.com/redis-developer/keyspace-notifications-node-redis/blob/main/keyspace_events_demo.gif
// client.configSet("notify-keyspace-events", "Ex");
// const sub = client.duplicate();
// sub.connect();

// sub.subscribe(
//   `__keyevent@${process.env.REDIS_DATABASE_INDEX}__:expired`,
//   (key) => {
//     console.log("key=> ", key);
//     // do something with key, can't retrieve value here
//   }
// );

// generic publish changes data - add/ update/ delete
export const publishDataChanges = (channel: string, message: string) => {
  redisClient.publish(channel, JSON.stringify(message));
};

export const updateRedisData = async (data: EventType) => {
  try {
    const cacheData = await redisClient.get(data.id as string);
    if (cacheData) {
      await redisClient.set(data.id as string, JSON.stringify(data), {
        KEEPTTL: true,
      });
    } else {
      await redisClient.setEx(data.id as string, 86400, JSON.stringify(data));
    }
  } catch (error) {
    console.log("error update redis data :", error);
  }
};

export const getAllData = async (): Promise<string[]> => {
  const allData: string[] = [];
  let cursor = 0;
  do {
    //get every time 100
    const res = await redisClient.scan(cursor, { MATCH: "*11*", COUNT: 100 });
    cursor = res.cursor;
    const keys = res.keys;
    if (keys.length > 0) {
      const values = await redisClient.mGet(keys);
      values.forEach((value, index) => {
        allData.push(value || "");
      });
    }
  } while (cursor !== 0); //until cursor is "0"
  return allData;
};

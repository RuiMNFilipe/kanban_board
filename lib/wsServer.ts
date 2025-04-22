import { cookies } from "next/headers";
import { WebSocketServer, WebSocket } from "ws";
import { auth } from "./auth";
import redisClient from "./redis";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map<string, WebSocket>();

wss.on("connection", async (ws: WebSocket, req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      ws.close();
      return;
    }

    clients.set(userId, ws);

    const subscriber = redisClient.duplicate();
    await subscriber.subscribe(`user:${userId}:notifications`);

    subscriber.on("message", (_, message) => {
      ws.send(message);
    });

    ws.on("close", () => {
      clients.delete(userId);
      subscriber.unsubscribe(`user:${userId}:notifications`);
      subscriber.quit();
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    ws.close();
  }
});

console.log("WebSocket server started on port 8080");

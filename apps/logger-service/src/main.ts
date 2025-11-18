import express from "express";
import http from "http";
import WebSocket from "ws";
import { consumeKafkaMessages } from "./logger-consumer";

const app = express();

const wsServer = new WebSocket.Server({ noServer: true });

export const clients = new Set<WebSocket>();

wsServer.on("connection", (ws) => {
  console.log("New Logger client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("Logger client disconnected");
    clients.delete(ws);
  });
});

const server = http.createServer(app);

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit("connection", ws, request);
  });
});

const port = process.env.PORT || 6008;

server.listen(port, () => {
  console.log(`Listenting at http://localhost/api`);
});

// start kafka consumer
consumeKafkaMessages();

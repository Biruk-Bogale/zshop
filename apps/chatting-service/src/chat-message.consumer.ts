import { Consumer, EachMessagePayload } from "kafkajs";
import { kafka } from "@packages/utils/kafka";
import prisma from "@packages/libs/primsa";
import { incrementUnseenCount } from "@packages/libs/redis/message.redis";

interface BufferedMessage {
  conversationId: string;
  senderId: string;
  senderType: string;
  content: string;
  createdAt: string;
}

const TOPIC = "chat.new_message";
const GROUP_ID = "chat-message-db-writer";
const BATCH_INTERVAL_MS = 3000;

let buffer: BufferedMessage[] = [];
let flushTimer: NodeJS.Timeout | null = null;

// intialize kafka consumer
export async function starConsumer() {
  const consumer: Consumer = kafka.consumer({ groupId: GROUP_ID });

  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  console.log(`Kafka consumer connected and subscribed to "${TOPIC}"`);

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (!message.value) return;

      try {
        const parsed: BufferedMessage = JSON.parse(message.value.toString());
        buffer.push(parsed);

        // if this is the first message in an empty array then start the timer
        if (buffer.length === 1 && !flushTimer) {
          flushTimer = setTimeout(flushBufferToDb, BATCH_INTERVAL_MS);
        }
      } catch (error) {
        console.log("Failed to parse message:", error);
      }
    },
  });
}

// Flush the buffer to the database and reset the timer
async function flushBufferToDb() {
  const toInsert = buffer.splice(0, buffer.length);

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (toInsert.length === 0) return;

  try {
    const prismaPayLoad = toInsert.map((msg) => ({
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderType: msg.senderType,
      content: msg.content,
      createdAt: new Date(msg.createdAt),
    }));

    await prisma.message.createMany({
      data: prismaPayLoad,
    });

    // redis unseen counter (only id DB insert successfully)
    for (const msg of prismaPayLoad) {
      const receiverType = msg.senderType === "user" ? "seller" : "user";
      await incrementUnseenCount(receiverType, msg.conversationId);
    }

    console.log(`Flushed ${prismaPayLoad.length} message to DB and Redis.`);
  } catch (error) {
    console.error("Error inserting message to DB:", error);

    buffer.unshift(...toInsert);
    if (!flushTimer) {
      flushTimer = setTimeout(flushBufferToDb, BATCH_INTERVAL_MS);
    }
  }
}

"use server";

import { kafka } from "packages/utils/kafka";

const producer = kafka.producer();

export async function sendKafkaEvent(eventData: {
  userId?: string;
  productId?: string;
  shopId?: string;
  action?: string;
  device?: string;
  country?: string;
  city?: string;
}) {
  try {
    console.log(eventData);
    await producer.connect();

    const a = await producer.send({
      topic: "users-events",
      messages: [{ value: JSON.stringify(eventData) }],
    });

    console.log(a);
  } catch (error) {
    console.log(error);
  } finally {
    await producer.disconnect();
  }
}

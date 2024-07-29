import { z } from "zod";
import { floorToSequence } from "./utils";

export const autoPostSchema = z
  .object({
    byr_id: z.string(),
    topic: z.string(),
    createdAt: z.string(),
    userName: z.string(),
  })
  .transform((data) => ({
    ...data,
    createdAt:
      data.createdAt === "unknow" ? new Date() : new Date(data.createdAt),
    updatedAt:
      data.createdAt === "unknow" ? new Date() : new Date(data.createdAt),
  }));

export const commentSchema = z
  .object({
    userName: z.string(),
    content: z.string(),
    floor: z.string(),
    like: z.number(),
    dislike: z.number(),
    time: z.string(),
  })
  .transform((data) => ({
    ...data,
    sequence: floorToSequence(data.floor),
    time: new Date(data.time),
  }));

const browserPushSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
});

const telegramSchema = z.object({
  chatId: z.string(),
});

const emailSchema = z.object({
  email: z.string().email(),
});

export const notificationSchema = z.union([
  browserPushSchema,
  telegramSchema,
  emailSchema,
]);

// export type NotificationType = "BROWSER_PUSH" | "TELEGRAM" | "EMAIL";

export type TNotification = z.infer<typeof notificationSchema>;

export const typeFieldMap = {
  BROWSER_PUSH: ["endpoint", "p256dh", "auth"],
  TELEGRAM: ["chatId"],
  EMAIL: ["email"],
};
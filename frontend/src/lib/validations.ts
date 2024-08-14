import { z } from "zod";
import { floorToSequence } from "./utils";

export const autoPostSchema = z
  .object({
    byr_id: z.string(),
    topic: z.string(),
    createdAt: z.string(),
    userName: z.string(),
  })
  .transform((data) => {
    const createdAt =
      data.createdAt === "unknow" ? new Date() : new Date(data.createdAt);

    return {
      ...data,
      createdAt,
      updatedAt: createdAt,
    };
  });

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

export const browserPushSchema = z.object({
  disable: z.boolean(),
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
});

export const telegramSchema = z.object({
  disable: z.boolean(),
  chatId: z.string(),
});

export const emailSchema = z.object({
  disable: z.boolean(),
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
  webpush: ["disable", "endpoint", "p256dh", "auth"],
  telegram: ["disable", "chatId"],
  email: ["disable", "email"],
};

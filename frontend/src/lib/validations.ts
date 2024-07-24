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
    createdAt: data.createdAt==="unknow" ? new Date() : new Date(data.createdAt),
    updatedAt: data.createdAt==="unknow" ? new Date() : new Date(data.createdAt),
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

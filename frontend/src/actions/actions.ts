"use server";

import prisma from "@lib/db";
import { autoPostSchema, commentSchema } from "@lib/validations";

// ----- Scheduled Task -----
export async function getScheduledTask() {
  return await prisma.scheduledTask.findMany();
}

// ----- Post Task -----





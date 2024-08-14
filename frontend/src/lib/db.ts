import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';
import { sendMessage } from "./notifications/server-utils";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate()).$extends({
    query: {
      message: {
        async create({ args, query }) {
          const message = await query(args);
          await sendMessage(message);
          return message;
        },
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
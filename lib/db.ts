import { PrismaClient } from "@prisma/client";

import { sendMessage } from "./notifications/server-utils";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
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

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// 确保 Prisma Client 连接已就绪（在生产环境中 warmup）
if (process.env.NODE_ENV === "production") {
  prisma.$connect().catch((e) => {
    console.error("Failed to connect to database:", e);
  });
}

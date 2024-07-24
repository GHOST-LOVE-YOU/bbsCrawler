import prisma from "@lib/db";
import { UserTag } from "@prisma/client";
import "server-only";

export async function addBotUser(name: string) {
  const newUser = await prisma.user.create({
    data: {
      name: name,
      tag: [UserTag.bot],
    },
  });

  return newUser;
}

export async function getUser(name: string, tag: UserTag) {
  return (
    (await prisma.user.findFirst({
      where: {
        name,
        tag: {
          has: tag,
        },
      },
    })) ?? (await addBotUser(name))
  );
}

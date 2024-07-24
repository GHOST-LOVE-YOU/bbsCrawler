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

const backgroundColors = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"];

export const getAvatarUrl = (userId: string) => {
  const hash = userId
    .slice(0, 5)
    .split("")
    .reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

  const backColor = backgroundColors[hash % backgroundColors.length];
  return `https://api.dicebear.com/9.x/micah/jpg?seed=${userId}&backgroundColor=${backColor}`;
};

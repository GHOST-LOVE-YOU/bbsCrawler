import "server-only";

import prisma from "@lib/db";
import { UserTag } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { toZonedTime } from "date-fns-tz";
import { setHours, setMilliseconds, setMinutes, setSeconds, subDays } from "date-fns";

export async function addBotUser(name: string) {
  const newUser = await prisma.user.create({
    data: {
      name: name,
      tag: [UserTag.bot],
    },
  });

  return newUser;
}

export async function clientGetUser() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return null;
  }
  const kindeUsers = await getUser();
  if (!kindeUsers) {
    return null;
  }
  const user = await getUserByKindeId(kindeUsers.id, kindeUsers.given_name!);
  return user;
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

export async function getUserByKindeId(kinde_id: string, given_name: string) {
  // Query the user by kinde_id
  let user = await prisma.user.findUnique({
    where: { kinde_id },
  });

  // If the user exists, return it
  if (user) {
    return user;
  }

  // If the user does not exist, create a new user with the user tag
  user = await prisma.user.create({
    data: {
      kinde_id,
      name: given_name,
      tag: { set: ["user"] },
    },
  });

  return user;
}

export async function getUserByUserId(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function searchUserByName(name: string) {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }
  return await prisma.user.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });
}

export async function getOptimizedUserData(userId: string) {
  const beijingTimeZone = "Asia/Shanghai";
  const now = new Date();
  const currentTimeInBeijing = toZonedTime(now, beijingTimeZone);
  const previousMorning8AM = setMilliseconds(
    setSeconds(setMinutes(setHours(subDays(currentTimeInBeijing, 1), 8), 0), 0), 0
  );

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: {
          createdAt: { gte: previousMorning8AM }
        },
        select: {
          id: true,
          topic: true,
        }
      },
      comments: {
        where: {
          time: { gte: previousMorning8AM }
        },
        select: {
          postId: true,
          sequence: true,
          content: true,
          post: {
            select: {
              topic: true,
            },
          },
        },
        orderBy: {
          time: 'desc',
        },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
        }
      }
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const joinedDays = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    joinedDays,
    postCount: user._count.posts,
    commentCount: user._count.comments,
    topicsList: user.posts,
    commentsList: user.comments.map((comment) => ({
      postId: comment.postId,
      postTitle: comment.post.topic,
      commentSequence: comment.sequence,
      content: comment.content,
    })),
  };
}
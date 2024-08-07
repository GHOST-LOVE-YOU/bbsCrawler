import "server-only";
import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";
import { NotificationAction, NotificationTargetType } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import {
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns";

export async function getPostNotificationsOverview() {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }

  const beijingTimeZone = "Asia/Shanghai";
  const now = new Date();
  const currentTimeInBeijing = toZonedTime(now, beijingTimeZone);
  const previousMorning8AM = setMilliseconds(
    setSeconds(setMinutes(setHours(subDays(currentTimeInBeijing, 1), 8), 0), 0),
    0
  );

  // Get all notification rules for this user
  const notificationRules = await prisma.notificationRule.findMany({
    where: {
      userId: user.id,
      targetType: NotificationTargetType.POST,
    },
    select: {
      targetId: true,
      action: true,
    },
  });

  // Separate NOTIFY and DONT_NOTIFY rules
  const notifyPostIds = new Set(
    notificationRules
      .filter((rule) => rule.action === NotificationAction.NOTIFY)
      .map((rule) => rule.targetId)
  );
  const dontNotifyPostIds = new Set(
    notificationRules
      .filter((rule) => rule.action === NotificationAction.DONT_NOTIFY)
      .map((rule) => rule.targetId)
  );

  // Get bot IDs bound to the user
  const botBindings = await prisma.userBinding.findMany({
    where: {
      userId: user.id,
    },
    select: {
      botId: true,
    },
  });
  const botIds = botBindings.map((binding) => binding.botId);

  // Get posts from bots with time constraint
  const postsFromBots = await prisma.post.findMany({
    where: {
      userId: { in: botIds },
      createdAt: { gte: previousMorning8AM },
      AND: {
        id: { notIn: Array.from(dontNotifyPostIds) },
      },
    },
    select: {
      id: true,
    },
  });

  // Combine and deduplicate post IDs
  const allPostIds = new Set([
    ...Array.from(notifyPostIds),
    ...postsFromBots.map((post) => post.id),
  ]);

  // Remove DONT_NOTIFY posts
  dontNotifyPostIds.forEach((id) => allPostIds.delete(id));

  // Fetch post details
  const postDetails = await prisma.post.findMany({
    where: {
      id: { in: Array.from(allPostIds) },
    },
    select: {
      id: true,
      topic: true,
      createdAt: true,
    },
  });

  return postDetails;
}

export async function getCommentNotificationsOverview() {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }

  const beijingTimeZone = "Asia/Shanghai";
  const now = new Date();
  const currentTimeInBeijing = toZonedTime(now, beijingTimeZone);
  const previousMorning8AM = setMilliseconds(
    setSeconds(setMinutes(setHours(subDays(currentTimeInBeijing, 1), 8), 0), 0),
    0
  );

  // 1. Get all notification rules for this user
  const notificationRules = await prisma.notificationRule.findMany({
    where: {
      userId: user.id,
      targetType: NotificationTargetType.COMMENT,
    },
  });

  // Separate NOTIFY and DONT_NOTIFY rules
  const notifyCommentIds = new Set(
    notificationRules
      .filter((rule) => rule.action === NotificationAction.NOTIFY)
      .map((rule) => rule.targetId)
  );
  const dontNotifyCommentIds = new Set(
    notificationRules
      .filter((rule) => rule.action === NotificationAction.DONT_NOTIFY)
      .map((rule) => rule.targetId)
  );

  // 2. Get bot IDs bound to the user
  const botBindings = await prisma.userBinding.findMany({
    where: {
      userId: user.id,
    },
    select: {
      botId: true,
    },
  });
  const botIds = botBindings.map((binding) => binding.botId);

  // 3. Fetch all relevant comments
  const comments = await prisma.comment.findMany({
    where: {
      OR: [
        { id: { in: Array.from(notifyCommentIds) } },
        {
          userId: { in: botIds },
          AND: {
            id: { notIn: Array.from(dontNotifyCommentIds) },
            time: { gte: previousMorning8AM }, // Add time constraint here
          },
        },
      ],
    },
    select: {
      id: true,
      content: true,
      sequence: true,
      time: true,
      post: {
        select: {
          id: true,
          topic: true,
        },
      },
    },
  });

  // Format the result
  return comments.map((comment) => ({
    postId: comment.post.id,
    postTitle: comment.post.topic,
    commentSequence: comment.sequence,
    content: comment.content ?? "--",
    id: comment.id,
    time: comment.time,
  }));
}

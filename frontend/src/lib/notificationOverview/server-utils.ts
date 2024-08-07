import "server-only";
import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";
import { NotificationAction, NotificationTargetType } from "@prisma/client";

export async function getPostNotificationsOverview() {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }

  // Get posts from direct notification rules
  const directNotifications = await prisma.notificationRule.findMany({
    where: {
      userId: user.id,
      targetType: NotificationTargetType.POST,
      action: NotificationAction.NOTIFY,
    },
    select: {
      targetId: true,
    },
  });

  // Get posts from bot bindings
  const botBindings = await prisma.userBinding.findMany({
    where: {
      userId: user.id,
    },
    select: {
      botId: true,
    },
  });

  const botIds = botBindings.map((binding) => binding.botId);

  const postsFromBots = await prisma.post.findMany({
    where: {
      userId: {
        in: botIds,
      },
    },
    select: {
      id: true,
    },
  });

  // Combine and deduplicate post IDs
  const allPostIds = new Set([
    ...directNotifications.map((notification) => notification.targetId),
    ...postsFromBots.map((post) => post.id),
  ]);

  // Fetch post details
  const postDetails = await prisma.post.findMany({
    where: {
      id: {
        in: Array.from(allPostIds),
      },
    },
    select: {
      id: true,
      topic: true,
    },
  });

  return postDetails;
}

export async function getCommentNotificationsOverview() {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }

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
          },
        },
      ],
    },
    select: {
      id: true,
      content: true,
      sequence: true,
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
    content: comment.content,
    id: comment.id,
  }));
}

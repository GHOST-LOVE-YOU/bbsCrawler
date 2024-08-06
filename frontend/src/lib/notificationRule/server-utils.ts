import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";


type NotificationLists = {
  notifyPostList: notifyPost[];
  notifyCommentList: notifyComment[];
  dontNotifyPostList: notifyPost[];
  dontNotifyCommentList: notifyComment[];
};

export async function getAllNotificationLists(): Promise<NotificationLists> {
  const user = await clientGetUser();
  if (!user) {
    return {
      notifyPostList: [],
      notifyCommentList: [],
      dontNotifyPostList: [],
      dontNotifyCommentList: [],
    };
  }

  try {
    // Fetch all notification rules for the user in a single query
    const allRules = await prisma.notificationRule.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        targetId: true,
        targetType: true,
        action: true,
      },
    });

    // Separate rules by type and action
    const notifyPostRules = allRules.filter(rule => rule.targetType === "POST" && rule.action === "NOTIFY");
    const notifyCommentRules = allRules.filter(rule => rule.targetType === "COMMENT" && rule.action === "NOTIFY");
    const dontNotifyPostRules = allRules.filter(rule => rule.targetType === "POST" && rule.action === "DONT_NOTIFY");
    const dontNotifyCommentRules = allRules.filter(rule => rule.targetType === "COMMENT" && rule.action === "DONT_NOTIFY");

    // Fetch all relevant posts in a single query
    const postIds = [...notifyPostRules, ...dontNotifyPostRules].map(rule => rule.targetId);
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: { id: true, topic: true },
    });
    const postsMap = posts.reduce((map, post) => {
      map[post.id] = post;
      return map;
    }, {} as Record<string, { id: string; topic: string }>);

    // Fetch all relevant comments in a single query
    const commentIds = [...notifyCommentRules, ...dontNotifyCommentRules].map(rule => rule.targetId);
    const comments = await prisma.comment.findMany({
      where: { id: { in: commentIds } },
      select: {
        id: true,
        sequence: true,
        content: true,
        post: {
          select: {
            id: true,
            topic: true,
          },
        },
      },
    });
    const commentsMap = comments.reduce((map, comment) => {
      map[comment.id] = comment;
      return map;
    }, {} as Record<string, typeof comments[0]>);

    // Create the final lists
    const notifyPostList = notifyPostRules.map(rule => ({
      id: rule.id,
      targetId: rule.targetId,
      title: postsMap[rule.targetId]?.topic || "",
    }));

    const dontNotifyPostList = dontNotifyPostRules.map(rule => ({
      id: rule.id,
      targetId: rule.targetId,
      title: postsMap[rule.targetId]?.topic || "",
    }));

    const notifyCommentList = notifyCommentRules.map(rule => {
      const comment = commentsMap[rule.targetId];
      return {
        id: rule.id,
        postId: comment?.post.id || "",
        postTitle: comment?.post.topic || "",
        commentSequence: comment?.sequence || 0,
        content: comment?.content || "",
      };
    });

    const dontNotifyCommentList = dontNotifyCommentRules.map(rule => {
      const comment = commentsMap[rule.targetId];
      return {
        id: rule.id,
        postId: comment?.post.id || "",
        postTitle: comment?.post.topic || "",
        commentSequence: comment?.sequence || 0,
        content: comment?.content || "",
      };
    });

    return {
      notifyPostList,
      notifyCommentList,
      dontNotifyPostList,
      dontNotifyCommentList,
    };
  } catch (error) {
    console.error("Error fetching notification lists:", error);
    throw new Error("Error fetching notification lists: " + error);
  }
}
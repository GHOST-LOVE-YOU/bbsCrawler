import {
  Comment,
  User,
  NotificationAction,
  NotificationTargetType,
  Post,
  MessagesType,
} from "@prisma/client";
import prisma from "@lib/db";

export async function autoHandleNewComment(comment: Comment) {
  console.log("New comment created", comment);

  try {
    // 1. 获取评论作者、帖子和帖子作者
    const [commentAuthor, post] = await Promise.all([
      prisma.user.findUnique({ where: { id: comment.userId } }),
      prisma.post.findUnique({
        where: { id: comment.postId },
        include: { user: true },
      }),
    ]);

    if (
      !commentAuthor ||
      !post ||
      !commentAuthor.tag.includes("bot") ||
      !post.user.tag.includes("bot")
    ) {
      throw new Error("Comment author or post author is not a bot");
    }

    // 2. 向帖子作者(机器人)发送通知
    const content1 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 回复了[我的帖子](/post/${post.id}) ：${post.topic}`;
    await sendNotification(post.user, "POST_REPLY", content1);

    // 3. 向绑定了该帖子的真实用户发送通知
    await notifyUsersWithPostRule(post, commentAuthor, post.user);

    // 4. 向绑定了帖子作者且没有取消该帖子通知的真实用户发送通知
    await notifyUsersBindingPostAuthor(post.user, post, commentAuthor);

    // 5 & 6. 检查是否引用了其他评论，如果是，通知被引用的评论作者
    const quotedCommentInfo = extractQuotedComment(comment.content);
    if (quotedCommentInfo) {
      await handleQuotedCommentNotification(
        quotedCommentInfo,
        commentAuthor,
        post,
        comment
      );
    }

    return { created: true, comment };
  } catch (error) {
    console.error("Error handling new comment:", error);
    return { created: false, error: (error as Error).message };
  }
}

async function sendNotification(
  recipient: User,
  type: MessagesType,
  content: string
) {
  const inbox = await prisma.inbox.upsert({
    where: { userId: recipient.id },
    update: {},
    create: { userId: recipient.id },
  });

  await prisma.message.create({
    data: {
      inboxId: inbox.id,
      type,
      content,
      isRead: false,
    },
  });
}

async function notifyUsersWithPostRule(
  post: Post,
  commentAuthor: User,
  postAuthor: User
) {
  const usersToNotify = await prisma.notificationRule.findMany({
    where: {
      targetType: NotificationTargetType.POST,
      targetId: post.id,
      action: NotificationAction.NOTIFY,
    },
    include: { user: true },
  });

  let content2: string;
  for (const rule of usersToNotify) {
    content2 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 回复了[${postAuthor.name}](/space/${postAuthor.id})的[帖子](/post/${post.id}) ：${post.topic}`;
    await sendNotification(rule.user, "WATCHED_POST_NEW_COMMENT", content2);
  }
}

async function notifyUsersBindingPostAuthor(
  postAuthor: User,
  post: Post,
  commentAuthor: User
) {
  const bindings = await prisma.userBinding.findMany({
    where: { botId: postAuthor.id },
    include: { user: true },
  });

  let content3: string;
  for (const binding of bindings) {
    const notificationRule = await prisma.notificationRule.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: binding.user.id,
          targetType: NotificationTargetType.POST,
          targetId: post.id,
        },
      },
    });

    if (notificationRule?.action !== NotificationAction.DONT_NOTIFY) {
      content3 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 回复了[${postAuthor.name}](/space/${postAuthor.id})的[帖子](/post/${post.id}) ：${post.topic}`;
      await sendNotification(
        binding.user,
        "WATCHED_POST_NEW_COMMENT",
        content3
      );
    }
  }
}

function extractQuotedComment(
  content: string | null
): { author: string; content: string } | null {
  if (!content) {
    return null;
  }
  const match = content.match(/【 在 (.+?) 的大作中提到: 】<br>(.+?)/);
  if (match) {
    return {
      author: match[1],
      content: match[2].trim(),
    };
  }
  return null;
}

async function notifyUsersBindingQuotedAuthor(
  quotedAuthor: User,
  post: Post,
  commentAuthor: User,
  quotedComment: Comment,
  newComment: Comment
) {
  const bindings = await prisma.userBinding.findMany({
    where: { botId: quotedAuthor.id },
    include: { user: true },
  });

  let content5: string;
  for (const binding of bindings) {
    const notificationRule = await prisma.notificationRule.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: binding.user.id,
          targetType: NotificationTargetType.POST,
          targetId: post.id,
        },
      },
    });

    if (notificationRule?.action !== NotificationAction.DONT_NOTIFY) {
      content5 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 在[帖子](/post/${post.id})中回复了[${quotedAuthor.name}](/space/${quotedAuthor.id})的[评论](/post/${post.id}?sequence=${quotedComment.sequence})：${newComment.content}`;
      await sendNotification(
        binding.user,
        "WATCHED_COMMENT_NEW_QUOTED",
        content5
      );
    }
  }
}

async function notifyUsersWithCommentRule(
  quotedComment: Comment,
  post: Post,
  commentAuthor: User,
  newComment: Comment
) {
  const usersToNotify = await prisma.notificationRule.findMany({
    where: {
      targetType: NotificationTargetType.COMMENT,
      targetId: quotedComment.id,
      action: NotificationAction.NOTIFY,
    },
    include: { user: true },
  });

  const content6 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 在[帖子](/post/${post.id})中回复了你关注的[评论](/post/${post.id}?sequence=${quotedComment.sequence})：${newComment.content}`;

  for (const rule of usersToNotify) {
    await sendNotification(rule.user, "WATCHED_COMMENT_NEW_QUOTED", content6);
  }
}

async function handleQuotedCommentNotification(
  quotedCommentInfo: { author: string; content: string },
  commentAuthor: User,
  post: Post,
  newComment: Comment
) {
  // 查找被引用的评论作者（机器人）
  const quotedAuthor = await prisma.user.findFirst({
    where: { name: quotedCommentInfo.author, tag: { has: "bot" } },
  });

  if (quotedAuthor) {
    // 从该帖子的所有评论中查找匹配的评论
    const matchedComment = await prisma.comment.findFirst({
      where: {
        postId: post.id,
        user: { name: quotedCommentInfo.author },
        content: { contains: quotedCommentInfo.content },
      },
      orderBy: { sequence: "desc" }, // 如果有多个匹配，选择最新的一个
    });

    // 构建通知内容
    let content4: string;
    if (matchedComment) {
      content4 = `[${commentAuthor.name}](/space/${commentAuthor.id}) 在[帖子](/post/${post.id})中回复了你的[评论](/post/${post.id}?sequence=${matchedComment.sequence})：${newComment.content}`;

      // 通知被引用的评论作者（机器人）
      await sendNotification(quotedAuthor, "COMMENT_REPLY", content4);

      // 通知绑定了被引用评论的真实用户
      await notifyUsersWithCommentRule(
        matchedComment,
        post,
        commentAuthor,
        newComment
      );

      // 通知绑定了被引用评论作者的真实用户
      await notifyUsersBindingQuotedAuthor(
        quotedAuthor,
        post,
        commentAuthor,
        matchedComment,
        newComment
      );
    }
  }
}

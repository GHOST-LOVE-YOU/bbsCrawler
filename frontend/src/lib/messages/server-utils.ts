import { clientGetUser, getAvatarUrl } from "@lib/user/server-utils";
import prisma from "../db";
import {
  Comment,
  User,
  NotificationAction,
  NotificationTargetType,
  Post,
  MessagesType,
} from "@prisma/client";

export async function autoHandleNewComment(comment: Comment) {
  // console.log("New comment created", comment);

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

    // 3 & 4. 向满足条件的真实用户发送通知（合并处理）
    await notifyRelevantUsers(post, commentAuthor, post.user);

    // 5 & 6. 检查是否引用了其他评论，如果是，通知被引用的评论作者
    const quotedCommentInfo = extractQuotedComment(comment.content);
    // console.log("quotedCommentInfo", quotedCommentInfo);
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

async function notifyRelevantUsers(
  post: Post,
  commentAuthor: User,
  postAuthor: User
) {
  // 获取所有需要通知的用户
  const [postRules, authorBindings] = await Promise.all([
    prisma.notificationRule.findMany({
      where: {
        targetType: NotificationTargetType.POST,
        targetId: post.id,
        action: NotificationAction.NOTIFY,
      },
      include: { user: true },
    }),
    prisma.userBinding.findMany({
      where: { botId: postAuthor.id },
      include: { user: true },
    }),
  ]);

  // 创建一个 Set 来存储已通知的用户 ID
  const notifiedUsers = new Set<string>();

  // 处理帖子规则
  for (const rule of postRules) {
    if (!notifiedUsers.has(rule.user.id)) {
      const content = `[${commentAuthor.name}](/space/${commentAuthor.id}) 回复了[${postAuthor.name}](/space/${postAuthor.id})的[帖子](/post/${post.id}) ：${post.topic}`;
      await sendNotification(rule.user, "WATCHED_POST_NEW_COMMENT", content);
      notifiedUsers.add(rule.user.id);
    }
  }

  // 处理作者绑定
  for (const binding of authorBindings) {
    if (!notifiedUsers.has(binding.user.id)) {
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
        const content = `[${commentAuthor.name}](/space/${commentAuthor.id}) 回复了[${postAuthor.name}](/space/${postAuthor.id})的[帖子](/post/${post.id}) ：${post.topic}`;
        await sendNotification(
          binding.user,
          "WATCHED_POST_NEW_COMMENT",
          content
        );
        notifiedUsers.add(binding.user.id);
      }
    }
  }
}

function extractQuotedComment(
  content: string | null
): { author: string; content: string } | null {
  if (!content) {
    return null;
  }

  // 匹配引用的作者
  const authorMatch = content.match(/【 在 (.+?) 的大作中提到: 】/);
  if (!authorMatch) {
    return null;
  }

  const author = authorMatch[1];

  // 提取引用的内容
  const contentMatch = content.match(/【 在 .+? 的大作中提到: 】<br>([\s\S]+)/);
  if (!contentMatch) {
    return null;
  }

  // 处理引用的内容，移除 HTML 标签但保留 <br>
  let quotedContent = contentMatch[1]
    .replace(/<font class="f006">: /g, "")
    .replace(/<\/font>/g, "")
    .replace(/^: /gm, "") // 移除每行开头的 ": "
    .replace(/<br>$/, "") // 移除最后的 <br> 标签
    .trim();

  return {
    author,
    content: quotedContent,
  };
}

async function notifyRelevantUsersForQuotedComment(
  quotedComment: Comment,
  quotedAuthor: User,
  post: Post,
  commentAuthor: User,
  newComment: Comment,
  notificationContent: string
) {
  // 获取所有需要通知的用户
  const [commentRules, authorBindings] = await Promise.all([
    prisma.notificationRule.findMany({
      where: {
        targetType: NotificationTargetType.COMMENT,
        targetId: quotedComment.id,
        action: NotificationAction.NOTIFY,
      },
      include: { user: true },
    }),
    prisma.userBinding.findMany({
      where: { botId: quotedAuthor.id },
      include: { user: true },
    }),
  ]);

  // console.log("commentRules", commentRules);
  // console.log("targetId", quotedComment.id);

  // 创建一个 Set 来存储已通知的用户 ID
  const notifiedUsers = new Set<string>();

  // 处理评论规则
  for (const rule of commentRules) {
    if (!notifiedUsers.has(rule.user.id)) {
      await sendNotification(
        rule.user,
        "WATCHED_COMMENT_NEW_QUOTED",
        notificationContent
      );
      notifiedUsers.add(rule.user.id);
    }
  }

  // 处理作者绑定
  for (const binding of authorBindings) {
    if (!notifiedUsers.has(binding.user.id)) {
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
        await sendNotification(
          binding.user,
          "WATCHED_COMMENT_NEW_QUOTED",
          notificationContent
        );
        notifiedUsers.add(binding.user.id);
      }
    }
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

    if (matchedComment) {
      // 构建通知内容
      const content = `[${commentAuthor.name}](/space/${commentAuthor.id}) 在[帖子](/post/${post.id})中回复了[${quotedAuthor.name}](/space/${quotedAuthor.id})的[评论](/post/${post.id}?sequence=${matchedComment.sequence})：${newComment.content}`;

      // 通知被引用的评论作者（机器人）
      await sendNotification(quotedAuthor, "COMMENT_REPLY", content);

      // 通知相关的真实用户（合并处理）
      await notifyRelevantUsersForQuotedComment(
        matchedComment,
        quotedAuthor,
        post,
        commentAuthor,
        newComment,
        content
      );
    }
  }
}

// user actions
export type MessageWithAvatar = {
  id: string;
  type: MessagesType;
  content: string;
  isRead: boolean;
  createdAt: Date;
  avatarUrl: string | null;
};

function extractUserId(content: string): string | null {
  const match = content.match(/\/space\/([0-9a-fA-F-]{36})/);
  return match ? match[1] : null;
}

export async function userGetMessages(
  types: MessagesType[]
): Promise<MessageWithAvatar[]> {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }
  const messages = await prisma.message.findMany({
    where: {
      inbox: { userId: user.id },
      type: { in: types },
    },
    orderBy: { createdAt: "desc" },
  });

  const messagesWithAvatar: MessageWithAvatar[] = await Promise.all(
    messages.map(async (message) => {
      const extractedUserId = extractUserId(message.content);
      const avatarUrl = extractedUserId
        ? await getAvatarUrl(extractedUserId)
        : null;

      return {
        ...message,
        avatarUrl,
      };
    })
  );

  return messagesWithAvatar;
}

export async function userGetUnreadMessageCount(): Promise<number> {
  const user = await clientGetUser();

  if (!user) {
    return 0;
  }

  const userWithInbox = await prisma.user.findUnique({
    where: { id: user.id },
    select: { inbox: { select: { id: true } } },
  });

  if (!userWithInbox || !userWithInbox.inbox) {
    return 0; // User has no inbox, so there can't be any unread messages
  }

  // Now count unread messages
  const unreadCount = await prisma.message.count({
    where: {
      inbox: { id: userWithInbox.inbox.id },
      isRead: false,
    },
  });

  return unreadCount;
}

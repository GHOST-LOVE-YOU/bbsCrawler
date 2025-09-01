import "server-only";

import { MessagesType } from "@prisma/client";

import prisma from "@/lib/db";
import { clientGetUser } from "@/lib/user/server-utils";

export async function getNotifications() {
  const user = await clientGetUser();

  if (!user) {
    return {
      emailNotification: null,
      telegramNotification: null,
      browserPushNotification: null,
    };
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        emailNotification: true,
        telegramNotification: true,
        browserPushNotification: true,
      },
    });

    if (!userData) {
      throw new Error("User data not found");
    }

    return {
      emailNotification: userData.emailNotification,
      telegramNotification: userData.telegramNotification,
      browserPushNotification: userData.browserPushNotification,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      emailNotification: null,
      telegramNotification: null,
      browserPushNotification: null,
    };
  } finally {
    await prisma.$disconnect();
  }
}

const NotificationTitle: Record<MessagesType, string> = {
  POST_REPLY: "有人回复了你的帖子",
  COMMENT_REPLY: "有人回复了你的评论",
  WATCHED_POST_NEW_COMMENT: "你关注的帖子有新评论",
  WATCHED_COMMENT_NEW_QUOTED: "你关注的帖子有新回复",
};

interface BrowserPushNotification {
  disable: boolean;
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function getUserWithNotification(inboxId: string) {
  const inbox = await prisma.inbox.findUnique({
    where: { id: inboxId },
    include: {
      user: {
        include: {
          browserPushNotification: true,
        },
      },
    },
  });

  if (!inbox || !inbox.user) {
    throw new Error("User or Inbox not found");
  }

  return inbox.user;
}

function createNotificationPayload(type: MessagesType, content: string) {
  return {
    title: NotificationTitle[type],
    body: content,
    icon: "https://some-image-url.jpg",
    data: { url: "https://example.com" },
  };
}

async function sendWebPushNotification(
  notification: BrowserPushNotification,
  payload: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXTJS_FRONTEND_URL}/api/notifications/webpush/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: {
            endpoint: notification.endpoint,
            keys: {
              p256dh: notification.p256dh,
              auth: notification.auth,
            },
          },
          payload,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send push notification");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export async function sendMessage(message: any) {
  const user = await getUserWithNotification(message.inboxId);

  if (!user.browserPushNotification || user.browserPushNotification.disable) {
    return;
  }

  const notificationPayload = createNotificationPayload(
    message.type,
    message.content
  );

  await sendWebPushNotification(
    user.browserPushNotification,
    notificationPayload
  );
}

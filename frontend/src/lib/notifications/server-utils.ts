import "server-only";

import { clientGetUser } from "@lib/user/server-utils";
import prisma from "@lib/db";
import webpush from "web-push";
import { MessagesType } from "@prisma/client";

export async function getNotifications() {
  const user = await clientGetUser();

  if (!user) {
    throw new Error("User not found");
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
    await webpush.sendNotification(
      {
        endpoint: notification.endpoint,
        keys: {
          p256dh: notification.p256dh,
          auth: notification.auth,
        },
      },
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export async function sendMessage(message: any) {
  const user = await getUserWithNotification(message.inboxId);

  if (!user.browserPushNotification || user.browserPushNotification.disable) {
    console.log("User has no browser push notification settings");
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

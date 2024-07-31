import "server-only";

import { clientGetUser } from "@lib/user/server-utils";
import webpush from "web-push";
import prisma from "@lib/db";

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

type webPushData = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function testWebPush({ endpoint, p256dh, auth }: webPushData) {
  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  try {
    await webpush.sendNotification(
      {
        endpoint,
        keys: {
          p256dh,
          auth,
        },
      },
      JSON.stringify(notificationPayload)
    );
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

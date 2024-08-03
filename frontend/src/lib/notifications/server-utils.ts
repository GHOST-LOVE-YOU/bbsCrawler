import "server-only";

import { clientGetUser } from "@lib/user/server-utils";
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

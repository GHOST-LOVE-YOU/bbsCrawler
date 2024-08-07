"use server";

import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";
import { browserPushSchema } from "@lib/validations";
import { NotificationAction, NotificationTargetType } from "@prisma/client";

export async function addNotification(data: unknown) {
  const user = await clientGetUser();
  if (!user) {
    return {
      success: false,
      message: "You are not logged in.",
    };
  }

  const validatedNotification = browserPushSchema.safeParse(data);
  if (!validatedNotification.success) {
    return {
      success: false,
      message: "Invalid notification data.",
    };
  }

  const { disable, endpoint, p256dh, auth } = validatedNotification.data;

  try {
    const existingNotification =
      await prisma.browserPushNotification.findUnique({
        where: { userId: user.id },
      });

    if (existingNotification) {
      await prisma.browserPushNotification.update({
        where: { userId: user.id },
        data: {
          disable,
          endpoint,
          p256dh,
          auth,
        },
      });

      return {
        success: true,
        message: "Notification updated successfully.",
      };
    } else {
      await prisma.browserPushNotification.create({
        data: {
          disable,
          endpoint,
          p256dh,
          auth,
          userId: user.id,
        },
      });

      return {
        success: true,
        message: "Notification added successfully.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error processing notification.",
    };
  }
}

export async function deletebindingBot(id: string) {
  const user = await clientGetUser();
  if (!user) {
    return {
      success: false,
      message: "You are not logged in.",
    };
  }

  try {
    await prisma.userBinding.deleteMany({
      where: {
        AND: [{ userId: user.id }, { botId: id }],
      },
    });

    return { success: true, message: "Bot unbound successfully." };
  } catch (error) {
    return { success: false, message: "Error unbinding bot." };
  }
}

export async function deleteNotificationRule(id: string) {
  const user = await clientGetUser();
  if (!user) {
    return {
      success: false,
      message: "You are not logged in.",
    };
  }

  try {
    await prisma.notificationRule.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return {
      success: true,
      message: "Notification rule deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error deleting notification rule.",
    };
  }
}

export async function dontNotify(id: string, type: NotificationTargetType) {
  const user = await clientGetUser();
  if (!user) {
    return { success: false, message: "You are not logged in." };
  }

  try {
    // Check if a NotificationRule already exists
    const existingRule = await prisma.notificationRule.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: type,
          targetId: id,
        },
      },
    });

    if (existingRule) {
      // Update existing rule
      await prisma.notificationRule.update({
        where: { id: existingRule.id },
        data: { action: NotificationAction.DONT_NOTIFY },
      });
    } else {
      // Create new rule
      await prisma.notificationRule.create({
        data: {
          userId: user.id,
          targetType: type,
          targetId: id,
          action: NotificationAction.DONT_NOTIFY,
        },
      });
    }

    return {
      success: true,
      message: "Notification rule updated successfully.",
    };
  } catch (error) {
    console.error("Error in dontNotify:", error);
    return {
      success: false,
      message: "An error occurred while updating the notification rule.",
    };
  }
}

import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";
import { NextRequest, NextResponse } from "next/server";
import { NotificationAction } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { targetId, action, targetType } = await req.json();

    if (!targetId || !action || !targetType) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const notificationRule = await prisma.notificationRule.upsert({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: targetType,
          targetId: targetId,
        },
      },
      update: {
        action: action as NotificationAction,
      },
      create: {
        userId: user.id,
        targetType: targetType,
        targetId: targetId,
        action: action as NotificationAction,
      },
    });

    return NextResponse.json({ notificationRule });
  } catch (error) {
    console.error("Error creating/updating notification rule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { targetId, action, targetType } = await req.json();

    if (!targetId) {
      return NextResponse.json(
        { message: "Missing targetId parameter" },
        { status: 400 }
      );
    }

    await prisma.notificationRule.delete({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: targetType,
          targetId: targetId,
        },
      },
    });

    return NextResponse.json({
      message: "Notification rule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification rule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

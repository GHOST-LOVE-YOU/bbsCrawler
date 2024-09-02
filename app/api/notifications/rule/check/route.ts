import prisma from "@/lib/db";
import { clientGetUser } from "@/lib/user/server-utils";
import { NotificationTargetType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const commentId = searchParams.get("targetId");
    const targetType = searchParams.get("targetType") as NotificationTargetType;
    if (!targetType || !commentId) {
      return NextResponse.json(
        { message: "Missing or invalid targetId or targetType parameter" },
        { status: 400 }
      );
    }

    const notificationRule = await prisma.notificationRule.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: targetType,
          targetId: commentId,
        },
      },
    });

    const isBound = !!notificationRule && notificationRule.action === "NOTIFY";

    return NextResponse.json({ isBound });
  } catch (error) {
    console.error("Error checking notification rule:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

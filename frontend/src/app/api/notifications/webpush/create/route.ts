import { NextRequest, NextResponse } from "next/server";
import { clientGetUser } from "@/lib/user/server-utils";
import prisma from "@lib/db";

type RequestBody = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function POST(req: NextRequest) {
  const user = await clientGetUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const body: RequestBody = await req.json();
  const { endpoint, p256dh, auth } = body;

  try {
    const existingNotificationMethod =
      await prisma.notificationMethod.findFirst({
        where: {
          userId: user.id,
          type: "BROWSER_PUSH",
          browserPush: {
            endpoint,
            p256dh,
            auth,
          },
        },
        include: {
          browserPush: true,
        },
      });

    if (existingNotificationMethod) {
      return NextResponse.json(
        { error: "Notification method already exists" },
        { status: 409 }
      );
    }

    const notificationMethod = await prisma.notificationMethod.create({
      data: {
        userId: user.id,
        type: "BROWSER_PUSH",
        browserPush: {
          create: {
            endpoint,
            p256dh,
            auth,
          },
        },
      },
      include: {
        browserPush: true,
      },
    });

    return NextResponse.json({ success: true, data: notificationMethod });
  } catch (error) {
    console.error("Error creating NotificationMethod:", error);
    return NextResponse.json(
      { error: "Failed to create NotificationMethod" },
      { status: 500 }
    );
  }
}

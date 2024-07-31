import prisma from "@lib/db";
import { clientGetUser } from "@lib/user/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await clientGetUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const userWithNotification = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        browserPushNotification: true,
      },
    });

    if (!userWithNotification) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    if (!userWithNotification.browserPushNotification) {
      return NextResponse.json(
        { message: "No browser push notification found for this user" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        browserPushNotification: userWithNotification.browserPushNotification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user's browser push notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

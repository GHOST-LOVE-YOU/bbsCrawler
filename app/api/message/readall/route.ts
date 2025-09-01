import { MessagesType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { clientGetUser } from "@/lib/user/server-utils";

export async function GET(req: NextRequest) {
  const user = await clientGetUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const searchParams = req.nextUrl.searchParams;
  const messagesType = searchParams.get("messagesType") as MessagesType | null;

  if (!messagesType) {
    return NextResponse.json(
      { message: "Messages type not found" },
      { status: 400 }
    );
  }

  try {
    // Find the user's inbox
    const inbox = await prisma.inbox.findUnique({
      where: { userId: user.id },
    });

    if (!inbox) {
      return NextResponse.json({ message: "Inbox not found" }, { status: 404 });
    }

    // Update all unread messages of the specified type to read
    const updateResult = await prisma.message.updateMany({
      where: {
        inboxId: inbox.id,
        type: messagesType,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(
      {
        message: "Messages marked as read",
        updatedCount: updateResult.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

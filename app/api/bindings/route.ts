import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { clientGetUser } from "@/lib/user/server-utils";

export async function POST(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { botId } = await req.json();

    if (!botId) {
      return NextResponse.json(
        { message: "Missing botId in request body" },
        { status: 400 }
      );
    }

    // Check if the bot exists and is actually a bot
    const bot = await prisma.user.findFirst({
      where: {
        id: botId,
        tag: {
          has: "bot",
        },
      },
    });

    if (!bot) {
      return NextResponse.json({ message: "Invalid bot ID" }, { status: 400 });
    }

    // Check if the binding already exists
    const existingBinding = await prisma.userBinding.findFirst({
      where: {
        userId: user.id,
        botId,
      },
    });

    if (existingBinding) {
      return NextResponse.json(
        { message: "Binding already exists" },
        { status: 400 }
      );
    }

    // Create the binding
    const binding = await prisma.userBinding.create({
      data: {
        userId: user.id,
        botId,
      },
    });

    return NextResponse.json({
      message: "Binding created successfully",
      binding,
    });
  } catch (error) {
    console.error("Error creating binding:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { botId } = await req.json();

    if (!botId) {
      return NextResponse.json(
        { message: "Missing botId in request body" },
        { status: 400 }
      );
    }

    // Delete the binding
    const result = await prisma.userBinding.deleteMany({
      where: {
        userId: user.id,
        botId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Binding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Binding deleted successfully" });
  } catch (error) {
    console.error("Error deleting binding:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

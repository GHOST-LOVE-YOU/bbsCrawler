import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { clientGetUser } from "@/lib/user/server-utils";

export async function GET(req: NextRequest) {
  try {
    const user = await clientGetUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const botId = searchParams.get("botId");

    if (!botId) {
      return NextResponse.json(
        { message: "Missing botId parameter" },
        { status: 400 }
      );
    }

    const binding = await prisma.userBinding.findFirst({
      where: {
        userId: user.id,
        botId,
      },
    });

    return NextResponse.json({ isBound: !!binding });
  } catch (error) {
    console.error("Error checking binding status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

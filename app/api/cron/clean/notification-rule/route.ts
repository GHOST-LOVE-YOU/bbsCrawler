// 每天北京时间早上5点 cron: 0 0 5 * * *
import { cleanOldNotificationRules } from "@/lib/notificationRule/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await cleanOldNotificationRules();
    return NextResponse.json({
      message: "Notification rules cleaned successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

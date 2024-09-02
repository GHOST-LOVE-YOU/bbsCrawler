// 每天北京时间早上5点 cron: 0 0 5 * * *
import { deleteOldMessages } from "@/lib/messages/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await deleteOldMessages();
    return NextResponse.json({ message: "Messages cleaned successfully" });
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

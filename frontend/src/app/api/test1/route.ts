import { getCommentNotificationsOverview } from "@lib/notificationOverview/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getCommentNotificationsOverview();

  return NextResponse.json({ data });
}

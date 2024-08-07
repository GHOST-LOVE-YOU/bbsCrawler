import { getCommentNotificationsOverview } from "@lib/notificationOverview/server-utils";
import { searchPostsByKeyword } from "@lib/posts/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await searchPostsByKeyword("本部", 1);

  return NextResponse.json({ data });
}

import { getNotifyCommentList, getNotifyPostList } from "@lib/notificationRule/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const notifyCommentList = await getNotifyCommentList();

  return NextResponse.json({ notifyCommentList });
}

import { getOneDayCommentByUserId } from "@lib/comments/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const notifyCommentList = await getOneDayCommentByUserId("e8aaffab-c53f-421b-8b04-baf299043556");

  return NextResponse.json({ notifyCommentList });
}

import prisma from "@lib/db";
import { autoHandleNewComment } from "@lib/messages/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  // const comment = await prisma.comment.findUnique({
  //   where: {
  //     id: "017283c2-2da6-484f-b92d-62aaf54c4044",
  //   },
  // });
  // if (!comment) {
  //   return NextResponse.json({ error: "Comment not found" });
  // }
  // await autoHandleNewComment(comment);

  // return NextResponse.json({ comment });
  return NextResponse.json({ message: "Hello, World!" });
}

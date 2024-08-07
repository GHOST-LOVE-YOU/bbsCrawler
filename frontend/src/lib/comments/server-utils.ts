import "server-only";

import prisma from "@lib/db";
import { getUser } from "@lib/user/server-utils";
import { commentSchema } from "@lib/validations";
import { autoHandleNewComment } from "@lib/messages/server-utils";
import { toZonedTime } from "date-fns-tz";
import {
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns";

export async function autoAddComment(Comment: unknown, post_id: string) {
  const validatedComment = commentSchema.parse(Comment);
  const user = await getUser(validatedComment.userName, "bot");
  const { userName, floor, ...commentData } = validatedComment;
  try {
    const newComment = await prisma.comment.create({
      data: {
        ...commentData,
        user: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: post_id,
          },
        },
      },
    });
    // 更新post的updatedAt
    await prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        updatedAt: commentData.time,
      },
    });
    // 有一个新评论发布了
    await autoHandleNewComment(newComment);
  } catch (e) {
    return { message: "Comment already exists", success: false };
  }
  return { message: "Comment added successfully", success: true };
}


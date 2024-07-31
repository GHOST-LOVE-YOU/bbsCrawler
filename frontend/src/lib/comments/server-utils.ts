import "server-only";

import prisma from "@lib/db";
import { getUser } from "@lib/user/server-utils";
import { commentSchema } from "@lib/validations";

export async function autoAddComment(Comment: unknown, post_id: string) {
  const validatedComment = commentSchema.parse(Comment);
  const user = await getUser(validatedComment.userName, "bot");
  const { userName, floor, ...commentData } = validatedComment;
  try {
    await prisma.comment.create({
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
  } catch (e) {
    return { message: "Comment already exists", success: false };
  }
  return { message: "Comment added successfully", success: true };
}

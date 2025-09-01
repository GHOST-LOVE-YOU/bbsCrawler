import "server-only";

import prisma from "@/lib/db";
import { autoHandleNewComment } from "@/lib/messages/server-utils";
import { autoGetBot } from "@/lib/user/server-utils";
import { commentSchema } from "@/lib/validations";

import logger from "../logger";

export async function autoAddComment(Comment: unknown, postId: string) {
  const validatedComment = commentSchema.parse(Comment);
  const user = await autoGetBot(validatedComment.author);
  const { author, floor, ...commentData } = validatedComment;
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
            id: postId,
          },
        },
      },
    });
    // 更新post的updatedAt
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        updatedAt: commentData.time,
      },
    });
    // 有一个新评论发布了
    await autoHandleNewComment(newComment);
  } catch (e) {
    return { message: "评论已存在", success: false };
  }
  logger.info("评论添加成功");
  return { message: "评论添加成功", success: true };
}

export async function getCommentsByPage(postId: string, page: number) {
  // 睡眠一下以防止频率限制（只在开发环境）
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // 确定分页参数
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // 查找对应的帖子标题
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      topic: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // 查找相关的评论
  const comments = await prisma.comment.findMany({
    where: { postId },
    skip,
    take: pageSize,
    orderBy: { sequence: "asc" },
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  // 处理评论数据
  const result = comments.map((comment) => ({
    commentId: comment.id,
    sequence: comment.sequence,
    content: comment.content,
    like: comment.like,
    dislike: comment.dislike,
    time: comment.time,
    userName: comment.user.name,
    userId: comment.user.id,
  }));

  return {
    postTitle: post.topic,
    op: post.user.id,
    comments: result,
    maxPage: Math.ceil(
      (await prisma.comment.count({ where: { postId } })) / pageSize
    ),
    currentPage: page,
  };
}

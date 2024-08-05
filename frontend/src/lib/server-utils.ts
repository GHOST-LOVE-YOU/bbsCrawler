import "server-only";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./db";





export async function getCommentsByPage(postId: string, page: number) {
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

// ---- User Task ----


export async function getUserNameByID() {}

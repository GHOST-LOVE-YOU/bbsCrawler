import "server-only";

import prisma from "@/lib/db";
import { autoGetBot } from "@/lib/user/server-utils";
import { autoPostSchema } from "@/lib/validations";

// ---- auto ----
export async function autoGetPost(data: unknown) {
  const validatedPost = autoPostSchema.parse(data);

  const existingPost = await prisma.post.findUnique({
    where: {
      byr_id: validatedPost.byr_id,
    },
  });

  if (existingPost) {
    return { created: false, post: existingPost };
  }

  const user = await autoGetBot(validatedPost.author);
  const { author, ...postData } = validatedPost;
  const newPost = await prisma.post.create({
    data: {
      ...postData,
      userId: user.id,
    },
  });

  // 有一个新帖子发布了
  return { created: true, post: newPost };
}

// ---- user ----
export async function userGetPost(
  page: number,
  sortBy: "createdAt" | "updatedAt"
) {
  // Simulating a delay for development purposes
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const pageSize = 50;
  const skip = pageSize * (page - 1);

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: "desc",
      },
      include: {
        user: true,
        comments: {
          orderBy: {
            sequence: "desc",
          },
          include: {
            user: true,
          },
        },
      },
    }),
    prisma.post.count({}),
  ]);

  const maxPage = Math.ceil(totalCount / pageSize);

  const formattedPosts = posts.map(
    ({ id, topic, user, comments, createdAt }) => ({
      postId: id,
      topic,
      userName: user.name,
      userId: user.id,
      userAvatar: user.avatar,
      commentCount: comments.length,
      latestCommentTime: comments[0]?.time || null,
      latestCommentUserName: comments[0]?.user.name || null,
      latestCommentUserId: comments[0]?.user.id || null,
      createdAtTime: createdAt,
    })
  );

  const sortedPosts = formattedPosts.sort((a, b) => {
    if (sortBy === "createdAt") {
      return b.createdAtTime.getTime() - a.createdAtTime.getTime();
    } else {
      const aTime = a.latestCommentTime || a.createdAtTime;
      const bTime = b.latestCommentTime || b.createdAtTime;
      return bTime.getTime() - aTime.getTime();
    }
  });

  return {
    posts: sortedPosts,
    maxPage,
  };
}

export async function searchPostsByKeyword(keyword: string, page: number) {
  const pageSize = 50;
  const skip = pageSize * (page - 1);

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: pageSize,
      where: {
        topic: {
          contains: keyword,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date, most recent first
      },
      include: {
        user: true,
        comments: {
          orderBy: {
            sequence: "desc",
          },
          include: {
            user: true,
          },
        },
      },
    }),
    prisma.post.count({
      where: {
        topic: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    }),
  ]);

  const maxPage = Math.ceil(totalCount / pageSize);

  const formattedPosts = posts.map(
    ({ id, topic, user, comments, createdAt }) => ({
      postId: id,
      topic,
      userName: user.name,
      userId: user.id,
      userAvatar: user.avatar,
      commentCount: comments.length,
      latestCommentTime: comments[0]?.time || null,
      latestCommentUserName: comments[0]?.user.name || null,
      latestCommentUserId: comments[0]?.user.id || null,
      createdAtTime: createdAt,
    })
  );

  return {
    posts: formattedPosts,
    maxPage,
  };
}

export async function searchCommentsByKeyword(keyword: string, page: number) {
  const pageSize = 10;

  // 首先获取所有匹配的评论
  const allMatchingComments = await prisma.comment.findMany({
    where: {
      content: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    orderBy: {
      time: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          topic: true,
        },
      },
    },
  });

  // 过滤掉引用内容
  const filteredComments = allMatchingComments.filter((comment) => {
    const contentWithoutQuote =
      comment.content
        ?.replace(/【\s*在.*?的大作中提到:\s*】[\s\S]*?(?=\n|$)/g, "")
        .trim() || "";
    return contentWithoutQuote.toLowerCase().includes(keyword.toLowerCase());
  });

  // 按帖子分组
  const groupedComments = filteredComments.reduce(
    (acc, comment) => {
      if (!acc[comment.post.id]) {
        acc[comment.post.id] = [];
      }
      acc[comment.post.id].push(comment);
      return acc;
    },
    {} as Record<string, typeof filteredComments>
  );

  // 计算分页
  const groupKeys = Object.keys(groupedComments);
  const totalGroups = groupKeys.length;
  const maxPage = Math.ceil(totalGroups / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 获取当前页的评论组
  const currentPageGroups = groupKeys.slice(startIndex, endIndex);

  // 格式化结果
  const formattedComments: notifyComment[] = currentPageGroups.flatMap(
    (postId) =>
      groupedComments[postId].map(({ id, content, sequence, post }) => ({
        id,
        postId: post.id,
        postTitle: post.topic,
        commentSequence: sequence,
        content:
          content
            ?.replace(/【\s*在.*?的大作中提到:\s*】[\s\S]*?(?=\n|$)/g, "")
            .trim() || "--",
      }))
  );

  return {
    comments: formattedComments,
    maxPage,
  };
}

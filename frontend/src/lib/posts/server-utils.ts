import "server-only";

import prisma from "@lib/db";
import { autoPostSchema } from "@lib/validations";
import { getUser } from "@lib/user/server-utils";

// ---- auto ----
export async function checkPostExistByByrId(byr_id: string) {
  return await prisma.post.findUnique({
    where: {
      byr_id,
    },
  });
}

export async function autoGetPost(data: unknown) {
  const validatedPost = autoPostSchema.parse(data);

  const post = await checkPostExistByByrId(validatedPost.byr_id);
  if (post) {
    return { created: false, post };
  }
  const user = await getUser(validatedPost.userName, "bot");
  const { userName, ...postData } = validatedPost;
  const newPost = await prisma.post.create({
    data: {
      ...postData,
      section: "IWhisper",
      userId: user.id,
    },
  });
  return { created: true, post: newPost };
}

// ---- user ----
export async function userGetPost(
  page: number,
  sortBy: "createdAt" | "updatedAt"
) {
  const pageSize = 50;
  const posts = await prisma.post.findMany({
    skip: pageSize * (page - 1),
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
  });

  return posts.map(({ id, topic, user, comments }) => ({
    postId: id,
    topic,
    userName: user.name,
    userId: user.id,
    userAvatar: user.avatar,
    commentCount: comments.length,
    latestCommentTime: comments[0]?.time || null,
    latestCommentUserName: comments[0]?.user.name || null,
    latestCommentUserId: comments[0]?.user.id || null,
  }));
}

export async function userGetMaxPage() {
  const pageSize = 50;
  const count = await prisma.post.count();
  return Math.ceil(count / pageSize);
}
import { MessageSquare } from "lucide-react";
import React from "react";

import CommentCard from "@/components/CommentCard";
import ParamPagination from "@/components/common/ParamPagination";
import { searchCommentsByKeyword } from "@/lib/posts/server-utils";

type CommentListPageProps = {
  params: Promise<{
    q: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

type GroupedComments = {
  [key: string]: CardComment;
};

export default async function CommentListPage(props: CommentListPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const q = decodeURIComponent(params.q);
  const page = parseInt(searchParams.page as string) || 1;
  const { comments, maxPage } = await searchCommentsByKeyword(q, page);

  const groupedComments: GroupedComments = comments.reduce((acc, comment) => {
    const key = `${comment.postId}-${comment.postTitle}`;
    if (!acc[key]) {
      acc[key] = {
        postId: comment.postId,
        postTitle: comment.postTitle,
        comments: [],
      };
    }
    acc[key].comments.push({
      sequence: comment.commentSequence,
      content: comment.content,
    });
    return acc;
  }, {} as GroupedComments);

  // Sort comments within each group
  Object.values(groupedComments).forEach((group) => {
    group.comments.sort((a, b) => a.sequence - b.sequence);
  });

  return (
    <div
      className={`
        bg-background-light p-6
        dark:bg-background-dark
      `}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center">
          <MessageSquare
            className={`
              text-text-light mr-3 h-8 w-8
              dark:text-text-dark
            `}
          />
          <h1
            className={`
              text-text-light text-3xl font-bold
              dark:text-text-dark
            `}
          >
            搜索评论
          </h1>
        </div>
        {Object.keys(groupedComments).length > 0 ? (
          <div className="space-y-4">
            {Object.values(groupedComments).map((group) => (
              <CommentCard key={group.postId} group={group} />
            ))}
            <div className="flex justify-end pt-4">
              <ParamPagination maxPage={maxPage} />
            </div>
          </div>
        ) : (
          <div
            className={`
              text-text-light mt-12 text-center text-xl
              dark:text-text-dark
            `}
          >
            未找到匹配的评论。
          </div>
        )}
      </div>
    </div>
  );
}

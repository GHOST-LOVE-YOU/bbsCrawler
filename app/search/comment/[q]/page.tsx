import React from "react";
import { MessageSquare } from "lucide-react";
import ParamPagination from "@/components/common/ParamPagination";
import { searchCommentsByKeyword } from "@/lib/posts/server-utils";
import CommentCard from "@/components/CommentCard";

type CommentListPageProps = {
  params: {
    q: string;
  };
  searchParams: { [key: string]: string | undefined };
};

type GroupedComments = {
  [key: string]: CardComment;
};

export default async function CommentListPage({
  params,
  searchParams,
}: CommentListPageProps) {
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
    <div className="p-6 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <MessageSquare className="text-text-light dark:text-text-dark mr-3 h-8 w-8" />
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold">
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
          <div className="text-center text-text-light dark:text-text-dark text-xl mt-12">
            未找到匹配的评论。
          </div>
        )}
      </div>
    </div>
  );
}

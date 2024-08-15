import { searchCommentsByKeyword } from "@lib/posts/server-utils";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import ParamPagination from "@components/param_pagination";

type CommentListPageProps = {
  params: {
    q: string;
  };
  searchParams: { [key: string]: string | undefined };
};

type GroupedComments = {
  [key: string]: {
    postId: string;
    postTitle: string;
    comments: { id: string; content: string; commentSequence: number }[];
  };
};

export default async function CommentListPage({
  params,
  searchParams,
}: CommentListPageProps) {
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
      id: comment.id,
      content: comment.content,
      commentSequence: comment.commentSequence,
    });
    return acc;
  }, {} as GroupedComments);

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
              <Card
                key={group.postId}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 break-words"
              >
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/post/${group.postId}`}
                      className="text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary"
                    >
                      {group.postTitle}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {group.comments.map((comment) => (
                    <div key={comment.id} className="mb-2 last:mb-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Comment #{comment.commentSequence}
                      </p>
                      <p className="mt-1 text-text-light dark:text-text-dark break-words">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
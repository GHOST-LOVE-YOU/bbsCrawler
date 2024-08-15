"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@contexts/notification-rule-context-provider";
import Link from "next/link";

export default function DontNotifyCommentList() {
  const { dontNotifyCommentList, unclaim } = useNotificationRule();

  const groupedComments = dontNotifyCommentList.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = { postTitle: comment.postTitle, comments: [] };
    }
    acc[comment.postId].comments.push(comment);
    return acc;
  }, {} as Record<string, { postTitle: string; comments: typeof dontNotifyCommentList }>);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        不会通知的评论
      </h2>
      {Object.entries(groupedComments).length > 0 ? (
        Object.entries(groupedComments).map(
          ([postId, { postTitle, comments }]) => (
            <div
              key={postId}
              className="bg-background-light dark:bg-background-dark rounded-lg p-4 hover:shadow-md transition-shadow duration-200 border border-gray-300 dark:border-gray-7000"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-gray-800 dark:text-gray-200 text-base font-medium">
                  <Link href={`/post/${postId}`} className="hover:underline">
                    {postTitle}
                  </Link>
                </h3>
              </div>
              <div className="space-y-0">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-start border-t pt-2 first:border-t-0 first:pt-0"
                  >
                    <p className="text-sm flex-grow">{comment.content}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-4 shrink-0"
                      onClick={() => unclaim(comment.id, "DONT_NOTIFY_COMMENT")}
                    >
                      取消屏蔽
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-background-light dark:bg-background-dark rounded-lg border border-gray-300 dark:border-gray-700">
          --空--
        </div>
      )}
    </div>
  );
}

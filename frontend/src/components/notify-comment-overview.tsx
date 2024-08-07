"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNotificationOverview } from "@contexts/notification-overview-context-provider";

export default function NotifyCommentOverview() {
  const { notifyCommentOverview, onDontNotify } = useNotificationOverview();
  const groupedComments = notifyCommentOverview.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = { postTitle: comment.postTitle, comments: [] };
    }
    acc[comment.postId].comments.push(comment);
    return acc;
  }, {} as Record<string, { postTitle: string; comments: notifyComment[] }>);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">相关联的评论</h2>
      {Object.entries(groupedComments).map(
        ([postId, { postTitle, comments }]) => (
          <Card key={postId} className="w-full">
            <CardContent className="p-4">
              <h3 className="text-slate-800 text-lg font-semibold mb-2">
                <Link href={`/post/${postId}`}>{postTitle}</Link>
              </h3>
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
                      onClick={() => onDontNotify(comment.id, "COMMENT")}
                    >
                      屏蔽
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

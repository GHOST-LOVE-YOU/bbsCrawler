"use client";

import React from "react";
import { useNotificationRule } from "@/providers/NotificationRuleProvider";
import EmptyCard from "./EmptyCard";
import CommentCard from "@/components/CommentCard";

export default function NotifyCommentList() {
  const { notifyCommentList, unclaim } = useNotificationRule();
  const groupedComments = notifyCommentList.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = {
        postId: comment.postId,
        postTitle: comment.postTitle,
        comments: [],
      };
    }
    acc[comment.postId].comments.push({
      id: comment.id,
      sequence: comment.commentSequence,
      content: comment.content,
    });
    return acc;
  }, {} as Record<string, CardComment>);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        已认领的评论
      </h2>
      {Object.entries(groupedComments).length > 0 ? (
        Object.entries(groupedComments).map(([postId, group]) => (
          <CommentCard
            key={postId}
            group={group}
            onButtonClick={(commentId) => unclaim(commentId, "COMMENT")}
            buttonText="取消认领"
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

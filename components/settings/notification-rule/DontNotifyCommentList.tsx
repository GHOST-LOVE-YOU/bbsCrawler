"use client";

import React from "react";

import CommentCard from "@/components/CommentCard";
import { useNotificationRule } from "@/providers/NotificationRuleProvider";

import EmptyCard from "./EmptyCard";

export default function NotifyCommentList() {
  const { dontNotifyCommentList, unclaim } = useNotificationRule();
  const groupedComments = dontNotifyCommentList.reduce(
    (acc, comment) => {
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
    },
    {} as Record<string, CardComment>
  );

  return (
    <div className="space-y-4">
      <h2
        className={`
          mb-3 text-lg font-semibold text-gray-900
          dark:text-gray-100
        `}
      >
        不会通知的评论
      </h2>
      {Object.entries(groupedComments).length > 0 ? (
        Object.entries(groupedComments).map(([postId, group]) => (
          <CommentCard
            key={postId}
            group={group}
            onButtonClick={(commentId) =>
              unclaim(commentId, "DONT_NOTIFY_COMMENT")
            }
            buttonText="取消屏蔽"
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

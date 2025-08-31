"use client";

import React from "react";

import CommentCard from "@/components/CommentCard";
import { useNotificationOverview } from "@/providers/NotificationOverviewProvider";

import EmptyCard from "../notification-rule/EmptyCard";

export default function NotifyCommentList() {
  const { notifyCommentOverview, onDontNotify } = useNotificationOverview();
  const groupedComments = notifyCommentOverview.reduce(
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
          mb-3 text-2xl font-semibold text-gray-900
          dark:text-gray-100
        `}
      >
        相关联的评论
      </h2>
      {Object.entries(groupedComments).length > 0 ? (
        Object.entries(groupedComments).map(([postId, group]) => (
          <CommentCard
            key={postId}
            group={group}
            onButtonClick={(commentId) => onDontNotify(commentId, "COMMENT")}
            buttonText="屏蔽"
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

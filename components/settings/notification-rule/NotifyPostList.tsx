"use client";

import React from "react";
import { useNotificationRule } from "@/providers/NotificationRuleProvider";
import EmptyCard from "./EmptyCard";
import PostCard from "@/components/PostCard";

export default function NotifyPostList() {
  const { notifyPostList, unclaim } = useNotificationRule();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        关注的帖子
      </h2>
      {notifyPostList.length > 0 ? (
        notifyPostList.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.targetId,
              topic: post.title,
            }}
            buttonText="取消认领"
            onButtonClick={() => unclaim(post.id, "POST")}
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

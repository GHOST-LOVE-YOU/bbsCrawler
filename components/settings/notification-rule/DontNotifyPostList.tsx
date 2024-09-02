"use client";

import React from "react";
import { useNotificationRule } from "@/providers/NotificationRuleProvider";
import EmptyCard from "./EmptyCard";
import PostCard from "@/components/PostCard";

export default function DontNotifyPostList() {
  const { dontNotifyPostList, unclaim } = useNotificationRule();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        不会通知的帖子
      </h2>
      {dontNotifyPostList.length > 0 ? (
        dontNotifyPostList.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.targetId,
              topic: post.title,
            }}
            buttonText="取消屏蔽"
            onButtonClick={() => unclaim(post.id, "DONT_NOTIFY_POST")}
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

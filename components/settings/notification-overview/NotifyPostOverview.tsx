"use client";

import React from "react";

import PostCard from "@/components/PostCard";
import { useNotificationOverview } from "@/providers/NotificationOverviewProvider";

import EmptyCard from "../notification-rule/EmptyCard";

export default function NotifyPostOverview() {
  const { notifyPostOverview, onDontNotify } = useNotificationOverview();

  return (
    <div className="space-y-4">
      <h2
        className={`
          mb-3 text-2xl font-semibold text-gray-900
          dark:text-gray-100
        `}
      >
        相关联的帖子
      </h2>
      {notifyPostOverview.length > 0 ? (
        notifyPostOverview.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              topic: post.topic,
            }}
            buttonText="屏蔽"
            onButtonClick={() => onDontNotify(post.id, "POST")}
            smallText
          />
        ))
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}

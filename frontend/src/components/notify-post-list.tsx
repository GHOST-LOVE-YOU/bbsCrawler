"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@contexts/notification-rule-context-provider";
import Link from "next/link";
import { unclaimType } from "@lib/notificationRule/type";

type PostCardProps = {
  post: notifyPost;
  onUnclaim: (id: string, type: unclaimType) => void;
};

const PostCard = ({ post, onUnclaim }: PostCardProps) => (
  <div className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
    <h3 className="text-slate-800 text-lg font-semibold">
      <Link href={`/post/${post.targetId}`}>{post.title}</Link>
    </h3>
    <Button
      variant="destructive"
      size="sm"
      onClick={() => onUnclaim(post.id, "POST")}
    >
      取消认领
    </Button>
  </div>
);

export default function NotifyPostList() {
  const { notifyPostList, unclaim } = useNotificationRule();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-3">已认领的帖子</h2>
      {notifyPostList.map((post) => (
        <PostCard key={post.id} post={post} onUnclaim={unclaim} />
      ))}
    </div>
  );
}

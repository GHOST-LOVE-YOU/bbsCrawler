"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNotificationOverview } from "@contexts/notification-overview-context-provider";
import { NotificationTargetType } from "@prisma/client";

type PostCardProps = {
  post: notifyPostOverView;
  onUnclaim: (id: string, type: NotificationTargetType) => void;
};

const PostCard = ({ post, onUnclaim }: PostCardProps) => (
  <div className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
    <h3 className="text-slate-800 text-lg font-semibold">
      <Link href={`/post/${post.id}`}>{post.topic}</Link>
    </h3>
    <Button
      variant="destructive"
      size="sm"
      onClick={() => onUnclaim(post.id, "POST")}
    >
      屏蔽
    </Button>
  </div>
);

export default function NotifyPostOverview() {
  const { notifyPostOverview, onDontNotify } = useNotificationOverview();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-3">已认领的帖子</h2>
      {notifyPostOverview.map((post) => (
        <PostCard key={post.id} post={post} onUnclaim={onDontNotify} />
      ))}
    </div>
  );
}

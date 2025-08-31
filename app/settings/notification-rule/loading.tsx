import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="space-y-8">
      <SkeletonSection title="通知方式" />
      <SkeletonSection title="已绑定机器人" />
      <SkeletonSection title="关注的帖子" />
      <SkeletonSection title="已认领的评论" />
      <SkeletonSection title="不再关注的帖子" />
      <SkeletonSection title="不再通知的评论" />
    </div>
  );
};

const SkeletonSection = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h2
      className={`
        mb-3 text-lg font-semibold text-gray-900
        dark:text-gray-100
      `}
    >
      {title}
    </h2>
    <div className="space-y-2">
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

export default Loading;

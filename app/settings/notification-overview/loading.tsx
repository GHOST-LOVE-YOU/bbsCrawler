import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="space-y-8">
      <SkeletonSection title="相关联的帖子" />
      <SkeletonSection title="相关联的评论" />
    </div>
  );
};

const SkeletonSection = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
      {title}
    </h2>
    <div className="space-y-2">
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

export default Loading;

import React from "react";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="p-6 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <MessageSquare className="text-text-light dark:text-text-dark mr-3 h-8 w-8" />
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold">
            搜索评论
          </h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 p-4 rounded-lg"
            >
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

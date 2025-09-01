import { MessageSquare } from "lucide-react";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`
        bg-background-light p-6
        dark:bg-background-dark
      `}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center">
          <MessageSquare
            className={`
              text-text-light mr-3 h-8 w-8
              dark:text-text-dark
            `}
          />
          <h1
            className={`
              text-text-light text-3xl font-bold
              dark:text-text-dark
            `}
          >
            搜索评论
          </h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`
                w-full rounded-lg border border-gray-300 bg-slate-50 p-4
                dark:border-gray-700 dark:bg-slate-900
              `}
            >
              <Skeleton className="mb-4 h-6 w-3/4" />
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

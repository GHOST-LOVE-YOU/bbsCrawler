import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InboxHeaderLoading() {
  return (
    <div className="flex items-center justify-between rounded-t-xl bg-gray-600 p-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-12 bg-gray-500" />
        <Skeleton className="h-6 w-20 bg-gray-500" />
      </div>
      <Skeleton className="h-6 w-24 bg-gray-500" />
    </div>
  );
}

export function InboxContentLoading() {
  return (
    <div className="h-[400px]">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className={`
            flex items-start space-x-4 border-b border-gray-200 p-2
            dark:border-gray-700
          `}
        >
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="grow space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Card
        className={`
          w-full max-w-4xl bg-slate-50
          dark:bg-slate-900
        `}
      >
        <CardContent className="p-0">
          <InboxHeaderLoading />
          <InboxContentLoading />
        </CardContent>
      </Card>
    </div>
  );
}

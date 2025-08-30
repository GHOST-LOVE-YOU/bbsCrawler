import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InboxHeaderLoading() {
  return (
    <div className="flex justify-between items-center bg-gray-600 rounded-t-xl p-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-12 h-6 bg-gray-500" />
        <Skeleton className="w-20 h-6 bg-gray-500" />
      </div>
      <Skeleton className="w-24 h-6 bg-gray-500" />
    </div>
  );
}

export function InboxContentLoading() {
  return (
    <div className="h-[400px]">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-start space-x-4"
        >
          <Skeleton className="w-8 h-8 rounded-md" />
          <div className="grow space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900">
        <CardContent className="p-0">
          <InboxHeaderLoading />
          <InboxContentLoading />
        </CardContent>
      </Card>
    </div>
  );
}

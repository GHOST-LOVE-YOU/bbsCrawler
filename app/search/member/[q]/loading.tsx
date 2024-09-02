import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingUserCard = () => (
  <Card className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:shadow-lg transition-shadow duration-300 border border-gray-300 dark:border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <Skeleton className="h-12 w-12 rounded-md mr-4" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function Loading() {
  return (
    <div className="p-6 bg-background-light dark:bg-background-dark">
      <div className="mx-auto">
        <div className="flex items-center mb-8">
          <Users className="text-text-light dark:text-text-dark mr-3 h-8 w-8" />
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold">
            查找用户
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, index) => (
            <LoadingUserCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

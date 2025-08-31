import { Users } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingUserCard = () => (
  <Card
    className={`
      bg-background-light text-text-light border border-gray-300 transition-shadow duration-300
      dark:bg-background-dark dark:text-text-dark dark:border-gray-700
      hover:shadow-lg
    `}
  >
    <CardContent className="p-6">
      <div className="mb-4 flex items-center">
        <Skeleton className="mr-4 h-12 w-12 rounded-md" />
        <div>
          <Skeleton className="mb-2 h-6 w-32" />
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
    <div
      className={`
        bg-background-light p-6
        dark:bg-background-dark
      `}
    >
      <div className="mx-auto">
        <div className="mb-8 flex items-center">
          <Users
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
            查找用户
          </h1>
        </div>
        <div
          className={`
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          `}
        >
          {[...Array(12)].map((_, index) => (
            <LoadingUserCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

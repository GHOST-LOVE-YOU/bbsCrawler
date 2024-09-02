import { ParamPaginationLoading } from "@/components/common/ParamPagination";
import { ReplyListLoading } from "@/components/ReplyList";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col md:border-2 md:border-gray-300 dark:border-gray-700 md:p-4 rounded-xl">
      <div className="flex flex-row items-center space-x-4">
        <div className="text-2xl cursor-pointer font-extrabold hover:text-stone-500">
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
      <ReplyListLoading />
      <div className="flex justify-end pt-2">
        <ParamPaginationLoading />
      </div>
    </div>
  );
};

export default Loading;

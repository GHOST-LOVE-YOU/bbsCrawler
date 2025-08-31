import React from "react";

import { ParamPaginationLoading } from "@/components/common/ParamPagination";
import { ReplyListLoading } from "@/components/ReplyList";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`
      flex flex-col rounded-xl
      md:border-2 md:border-gray-300 md:p-4
      dark:border-gray-700
    `}
    >
      <div className="flex flex-row items-center space-x-4">
        <div
          className={`
          cursor-pointer text-2xl font-extrabold
          hover:text-stone-500
        `}
        >
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

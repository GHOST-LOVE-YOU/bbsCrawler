import React from "react";

import { ParamPaginationLoading } from "@/components/common/ParamPagination";
import { ReplyListLoading } from "@/components/ReplyList";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="card md:shadow-lg md:rounded-xl">
          <div className="p-4 md:p-6 space-y-6">            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">              <Skeleton className="h-8 md:h-10 w-full max-w-md" />
            </div>
            
            <ReplyListLoading />
            
            <div className="flex justify-end pt-4">
              <ParamPaginationLoading />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

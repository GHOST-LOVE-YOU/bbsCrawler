import React from "react";

import { ParamPaginationLoading } from "@/components/common/ParamPagination";
import { ReplyListLoading } from "@/components/ReplyList";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`
        container mx-auto
        md:px-4 md:py-6
      `}
    >
      <div className="mx-auto max-w-full">
        <div
          className={`
            card
            md:rounded-xl md:shadow-lg
          `}
        >
          <div
            className={`
              space-y-6 p-4
              md:p-6
            `}
          >
            <div
              className={`
                flex flex-col gap-4 border-b border-border pb-4
                sm:flex-row sm:items-center sm:justify-between
              `}
            >
              {" "}
              <Skeleton
                className={`
                  h-8 w-full max-w-full
                  md:h-10
                `}
              />
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

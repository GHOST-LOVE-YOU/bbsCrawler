import { PagePaginationLoading } from "@/components/common/PagePagination";
import { PostListLoading } from "@/components/PostList";
import { SortbyLoading } from "@/components/Sortby";

export default function Loading() {
  return (
    <div
      className={`
        flex flex-col
        md:flex-row
      `}
    >
      <div
        className={`
          w-full flex-1 space-y-4
          md:w-auto
        `}
      >
        <div className="flex items-center justify-between">
          <SortbyLoading />
          <PagePaginationLoading />
        </div>
        <PostListLoading />
        <div className="flex justify-end">
          <PagePaginationLoading />
        </div>
      </div>
    </div>
  );
}

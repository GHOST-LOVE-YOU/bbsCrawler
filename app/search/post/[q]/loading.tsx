import { PagePaginationLoading } from "@/components/common/PagePagination";
import { PostListLoading } from "@/components/PostList";
import { SortbyLoading } from "@/components/Sortby";

export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 w-full md:w-auto space-y-4">
        <div className="flex justify-between items-center">
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

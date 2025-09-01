import { PagePaginationLoading } from "@/components/common/PagePagination";
import { PostListLoading } from "@/components/PostList";
import { SortbyLoading } from "@/components/Sortby";

export default function AreaLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex items-center justify-between">
        <SortbyLoading />
        <PagePaginationLoading />
      </div>
      <PostListLoading />
      <div className="flex justify-end py-2">
        <PagePaginationLoading />
      </div>
    </div>
  );
}

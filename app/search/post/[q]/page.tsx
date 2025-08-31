import { Suspense } from "react";

import ParamPagination from "@/components/common/ParamPagination";
import SideBar, { SideBarLoading } from "@/components/header/SideBar";
import PostList from "@/components/PostList";
import Sortby from "@/components/Sortby";
import { searchPostsByKeyword } from "@/lib/posts/server-utils";

type PostListPageProps = {
  params: Promise<{
    q: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function PostListPage(props: PostListPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const q = decodeURIComponent(params.q);
  const page = parseInt(searchParams.page as string) || 1;
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const { posts, maxPage } = await searchPostsByKeyword(q, page);

  return (
    <div
      className={`
        flex flex-col p-1
        md:flex-row
      `}
    >
      <div
        className={`
          w-full flex-1
          md:w-auto
        `}
      >
        <div className="flex items-center justify-between">
          <Sortby />
          <ParamPagination maxPage={maxPage} />
        </div>
        <PostList sortBy={sortBy} posts={posts} />
        <div className="flex justify-end py-2">
          <ParamPagination maxPage={maxPage} />
        </div>
      </div>
      <div
        className={`
          hidden
          md:block
        `}
      >
        <Suspense fallback={<SideBarLoading />}>
          <SideBar />
        </Suspense>
      </div>
    </div>
  );
}

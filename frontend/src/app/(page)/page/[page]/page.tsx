import { Suspense } from "react";
import PostList from "@components/post_list";
import SideBar from "@components/sidebar";
import Sortby from "@components/sortby";
import PagePagination from "@components/page_pagination";
import ServiceWorkerRegistration from "@components/service_worker_registration";
import { userGetPost } from "@lib/posts/server-utils";
import Loading from "../../loading";

async function PostsDataWrapper({
  sortBy,
  page,
}: {
  sortBy: "createdAt" | "updatedAt";
  page: number;
}) {
  const { posts, maxPage } = await userGetPost(page, sortBy);

  return (
    <>
      <div className="flex justify-between items-center">
        <Sortby sortBy={sortBy} />
        <PagePagination maxPage={maxPage} sortBy={sortBy} />
      </div>
      <PostList posts={posts} sortBy={sortBy} />
      <div className="flex justify-end pt-2">
        <PagePagination maxPage={maxPage} sortBy={sortBy} />
      </div>
    </>
  );
}

export default function Page({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | undefined };
  params: { page: string };
}) {
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const page = parseInt(params.page);

  return (
    <div className="justify-between">
      <ServiceWorkerRegistration />
      <div className="container mx-auto max-w-5xl bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 border-2 rounded-xl shadow-2xl my-2 md:my-4 md:px-2 sm:px-6">
        <Suspense fallback={<Loading />}>
          <div className="flex flex-col md:flex-row p-1">
            <div className="flex-1 w-full md:w-auto">
              <PostsDataWrapper sortBy={sortBy} page={page} />
            </div>
            <div className="hidden md:block">
              <SideBar />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

import PostList from "@components/post_list";
import SideBar from "@components/sidebar";
import Sortby from "@components/sortby";
import PagePagination from "@components/page_pagination";
import { userGetPost } from "@lib/posts/server-utils";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | undefined };
  params: { page: string };
}) {
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const page = parseInt(params.page);
  const { posts, maxPage } = await userGetPost(page, sortBy);
  return (
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl my-4 px-6 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <ul>
              <li className="flex justify-between">
                <Sortby sortBy={sortBy} />
                <PagePagination maxPage={maxPage} sortBy={sortBy} />
              </li>
              <PostList posts={posts} />
            </ul>
            <div className="flex justify-end pt-2">
              <PagePagination maxPage={maxPage} sortBy={sortBy} />
            </div>
          </div>
          <div className="flex-none w-60 hidden md:block">
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
}

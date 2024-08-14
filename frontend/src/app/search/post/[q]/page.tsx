import ParamPagination from "@components/param_pagination";
import PostList from "@components/post_list";
import SideBar from "@components/sidebar";
import Sortby from "@components/sortby";
import { searchPostsByKeyword } from "@lib/posts/server-utils";

type PostListPageProps = {
  params: {
    q: string;
  };
  searchParams: { [key: string]: string | undefined };
};

export default async function PostListPage({
  params,
  searchParams,
}: PostListPageProps) {
  const q = decodeURIComponent(params.q);
  const page = parseInt(searchParams.page as string) || 1;
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const { posts, maxPage } = await searchPostsByKeyword(q, page);

  return (
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 border-2 rounded-xl shadow-2xl my-4 px-6">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <ul>
              <li className="flex justify-between items-center mb-4">
                <Sortby sortBy={sortBy} />
                <ParamPagination maxPage={maxPage} />
              </li>
              <PostList posts={posts} sortBy={sortBy} />
            </ul>
            <div className="flex justify-end pt-4">
              <ParamPagination maxPage={maxPage} />
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

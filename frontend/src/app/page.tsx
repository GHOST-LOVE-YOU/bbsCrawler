import PostList from "@components/post_list";
import SideBar from "@components/sidebar";
import { userGetMaxPage, userGetPost } from "@lib/posts/server-utils";
import Sortby from "@components/sortby";
import PagePagination from "@components/page_pagination";
import ServiceWorkerRegistration from "@components/service_worker_registration";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const posts = await userGetPost(1, sortBy);
  const maxPage = await userGetMaxPage();

  return (
    <div className="justify-between">
      <ServiceWorkerRegistration />
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl my-4 px-6 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <ul>
              <li className="flex justify-between">
                <Sortby sortBy={sortBy} currentUrl="/" />
                <PagePagination
                  maxPage={maxPage}
                  currentPage={1}
                  sortBy={sortBy}
                />
              </li>
              <PostList posts={posts} />
            </ul>
            <div className="flex justify-end pt-2">
              <PagePagination
                maxPage={maxPage}
                currentPage={1}
                sortBy={sortBy}
              />
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

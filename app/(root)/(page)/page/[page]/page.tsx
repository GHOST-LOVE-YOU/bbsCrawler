import PagePagination from "@/components/common/PagePagination";
import PostList from "@/components/PostList";
import Sortby from "@/components/Sortby";
import { userGetPost } from "@/lib/posts/server-utils";

const Home = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | undefined };
  params: { page: string };
}) => {
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const page = parseInt(params.page);
  const { posts, maxPage } = await userGetPost(page, sortBy);
  return (
    <>
      <div className="flex justify-between items-center">
        <Sortby />
        <PagePagination maxPage={maxPage} />
      </div>
      <PostList sortBy={sortBy} posts={posts} />
      <div className="flex justify-end py-2">
        <PagePagination maxPage={maxPage} />
      </div>
    </>
  );
};

export default Home;

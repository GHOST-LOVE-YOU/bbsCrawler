import PagePagination from "@/components/common/PagePagination";
import PostList from "@/components/PostList";
import Sortby from "@/components/Sortby";
import { userGetPost } from "@/lib/posts/server-utils";

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const { posts, maxPage } = await userGetPost(1, sortBy);
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

import PagePagination from "@/components/common/PagePagination";
import PostList from "@/components/PostList";
import Sortby from "@/components/Sortby";
import { userGetPost } from "@/lib/posts/server-utils";

const Home = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const sortBy =
    searchParams.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const page = Number(searchParams.page) || 1;
  const { posts, maxPage } = await userGetPost(page, sortBy);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-text-primary">最新帖子</h1>
        <div className="flex items-center gap-4">
          <Sortby />
          <PagePagination maxPage={maxPage} />
        </div>
      </div>
      <PostList sortBy={sortBy} posts={posts} />
      <div className="flex justify-end">
        <PagePagination maxPage={maxPage} />
      </div>
    </div>
  );
};

export default Home;

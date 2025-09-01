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
  const topPosts = [
    {
      postId: "1",
      topic: "在爬其它板块的内容, 担心服务器吃不消, 暂停爬取iwhisper新数据",
      area: "Advice",
      userName: "admin",
      userId: "1",
      userAvatar: null,
      commentCount: 0,
      latestCommentTime: null,
      latestCommentUserName: null,
      latestCommentUserId: null,
      createdAtTime: new Date(),
    },
    {
      postId: "2",
      topic: "数据迁移中, 爬取结束后统一恢复数据",
      area: "Advice",
      userName: "admin",
      userId: "1",
      userAvatar: null,
      commentCount: 0,
      latestCommentTime: null,
      latestCommentUserName: null,
      latestCommentUserId: null,
      createdAtTime: new Date(),
    },
  ];
  return (
    <div>
      <div
        className={`
          flex flex-col items-center justify-between gap-4
          sm:flex-row
        `}
      >
        {/* <h1 className="text-3xl font-bold text-text-primary">最新帖子</h1> */}
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <Sortby />
          </div>
          <div>
            <PagePagination maxPage={maxPage} />
          </div>
        </div>
      </div>
      <PostList sortBy="createdAt" posts={topPosts} />
      <PostList sortBy={sortBy} posts={posts} />
      <div className="flex justify-end pt-2">
        <PagePagination maxPage={maxPage} />
      </div>
    </div>
  );
};

export default Home;

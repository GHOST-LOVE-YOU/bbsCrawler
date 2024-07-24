import PostPagination from "@components/post_pagination";
import ReplyList from "@components/reply_list";
import SideBar from "@components/sidebar";
import { getCommentsByPage } from "@lib/server-utils";

// interface Comment {
//   sequence: number;
//   content: string | null;
//   like: number;
//   dislike: number;
//   time: Date;
//   userName: string;
// }

// interface HomeProps {
//   comments: Comment[];
//   postTitle: string;
//   maxPage: number;
//   currentPage: number;
// }

type postPageProps = {
  params: {
    postId: string;
  };
  searchParams: { [key: string]: string | undefined };
};

export default async function PostPage({
  params,
  searchParams,
}: postPageProps) {
  const postId = params.postId;
  const page = parseInt(searchParams.page || "1");
  const result = await getCommentsByPage(postId, page);
  return (
    <div className="justify-between pt-4">
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl px-6 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <div className="flex flex-row">
              <div className="pb-2 text-zinc-300 text-2xl hover:text-zinc-50 cursor-pointer font-extrabold">
                {result.postTitle}
              </div>
            </div>
            <ReplyList comments={result.comments} op={result.op} />
            <div className="flex justify-end">
              <PostPagination
                maxPage={result.maxPage}
                currentPage={result.currentPage}
                postId={postId}
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

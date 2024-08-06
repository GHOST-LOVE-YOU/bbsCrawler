import NotificationRuleButton from "@components/notification-rule-button";
import ParamPagination from "@components/param_pagination";
import ReplyList from "@components/reply_list";
import SideBar from "@components/sidebar";
import { getCommentsByPage } from "@lib/server-utils";

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
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl px-6 my-4 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <div className="flex flex-row items-center space-x-4">
              <div className="pb-2 text-zinc-300 text-2xl hover:text-zinc-50 cursor-pointer font-extrabold">
                {result.postTitle}
              </div>
              <NotificationRuleButton
                targetType="POST"
                targetId={postId}
                action="NOTIFY"
              />
            </div>
            <ReplyList comments={result.comments} op={result.op} />
            <div className="flex justify-end">
              <ParamPagination maxPage={result.maxPage} />
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

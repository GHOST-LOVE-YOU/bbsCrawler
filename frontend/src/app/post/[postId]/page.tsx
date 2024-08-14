import { Suspense } from "react";
import NotificationRuleButton from "@components/notification-rule-button";
import ParamPagination from "@components/param_pagination";
import ReplyList from "@components/reply_list";
import SideBar from "@components/sidebar";
import { getCommentsByPage } from "@lib/server-utils";
import Loading from "./loading";

type postPageProps = {
  params: {
    postId: string;
  };
  searchParams: { [key: string]: string | undefined };
};

export default function PostPage({ params, searchParams }: postPageProps) {
  const postId = params.postId;
  const page = parseInt(searchParams.page || "1");

  return (
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 border-2 rounded-xl shadow-2xl px-6 my-4">
        <Suspense fallback={<Loading />}>
          <PostContent postId={postId} page={page} />
        </Suspense>
      </div>
    </div>
  );
}

async function PostContent({ postId, page }: { postId: string; page: number }) {
  const result = await getCommentsByPage(postId, page);

  return (
    <div className="flex flex-row py-4">
      <div className="flex-1">
        <div className="flex flex-row items-center space-x-4">
          <div className="pb-2 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark text-2xl cursor-pointer font-extrabold">
            {result.postTitle}
          </div>
          <NotificationRuleButton
            targetType="POST"
            targetId={postId}
            action="NOTIFY"
          />
        </div>
        <ReplyList comments={result.comments} op={result.op} />
        <div className="flex justify-end pt-2">
          <ParamPagination maxPage={result.maxPage} />
        </div>
      </div>
      <div className="flex-none w-60 hidden md:block">
        <SideBar />
      </div>
    </div>
  );
}

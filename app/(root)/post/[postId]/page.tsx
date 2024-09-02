import { Suspense } from "react";
import ParamPagination from "@/components/common/ParamPagination";
import { getCommentsByPage } from "@/lib/comments/server-utils";
import NotificationRuleButton from "@/components/common/NotificationRuleButton";
import ReplyList from "@/components/ReplyList";
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
      <div className="container mx-auto max-w-5xl border-gray-300 dark:border-gray-700 md:border-2 rounded-xl md:shadow-2xl md:px-6 md:py-4 px-2">
        <PostContent postId={postId} page={page} />
      </div>
    </div>
  );
}

async function PostContent({ postId, page }: { postId: string; page: number }) {
  const result = await getCommentsByPage(postId, page);

  return (
    <div className="flex-1 py-2 md:px-2">
      <Suspense fallback={<Loading />}>
        <div className="flex flex-row items-center space-x-4">
          <div className="text-2xl cursor-pointer font-extrabold hover:text-stone-500">
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
      </Suspense>
    </div>
  );
}

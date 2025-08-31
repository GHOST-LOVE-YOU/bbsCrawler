import { Suspense } from "react";

import NotificationRuleButton from "@/components/common/NotificationRuleButton";
import ParamPagination from "@/components/common/ParamPagination";
import ReplyList from "@/components/ReplyList";
import { getCommentsByPage } from "@/lib/comments/server-utils";

import Loading from "./loading";

type postPageProps = {
  params: Promise<{
    postId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function PostPage(props: postPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const postId = params.postId;
  const page = parseInt(searchParams.page || "1");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="card card-hover md:shadow-lg md:rounded-xl">
          <div className="p-4 md:p-6">
            <PostContent postId={postId} page={page} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function PostContent({ postId, page }: { postId: string; page: number }) {
  const result = await getCommentsByPage(postId, page);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
          {result.postTitle}
        </h1>
        <NotificationRuleButton
          targetType="POST"
          targetId={postId}
          action="NOTIFY"
        />
      </div>
      
      <div className="space-y-6">
        <Suspense fallback={<Loading />}>
          <ReplyList comments={result.comments} op={result.op} />
          <div className="flex justify-end pt-4">
            <ParamPagination maxPage={result.maxPage} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

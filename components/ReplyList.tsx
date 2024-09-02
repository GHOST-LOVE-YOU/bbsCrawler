import { getAvatarUrl } from "@/lib/user/server-utils";
import Image from "next/legacy/image";
import Link from "next/link";
import NotificationRuleButton from "./common/NotificationRuleButton";
import { Skeleton } from "@/components/ui/skeleton";
import CommentDisplay from "./common/CommentDisplay";

interface Comment {
  commentId: string;
  sequence: number;
  content: string | null;
  like: number;
  dislike: number;
  time: Date;
  userName: string;
  userId: string;
}

interface ReplyListProps {
  comments: Comment[];
  op: string;
}

export default async function ReplyList({ comments, op }: ReplyListProps) {
  return (
    <div className="flex flex-col py-4">
      {comments.map((comment) => (
        <div
          key={comment.sequence}
          className="flex flex-col py-2 border-gray-300 dark:border-gray-700 border-b-2 break-words whitespace-pre-wrap"
        >
          <div className="flex flex-row">
            <div className="flex-none">
              <Image
                src={getAvatarUrl(comment.userId)}
                alt="1"
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
            <div className="px-2 flex-1 text-text-light dark:text-text-dark">
              <div className="flex flex-row">
                <div className="inline-flex">
                  <div className="pt-0.5 font-mono text-xl font-semibold hover:text-primary dark:hover:text-primary-dark cursor-pointer">
                    <Link href={`/space/${comment.userId}`}>
                      {comment.userName}
                    </Link>
                  </div>
                  {comment.userId === op && (
                    <div className="ml-1 px-1 border-2 border-accent-light dark:border-accent-dark rounded h-7 text-accent-light dark:text-accent-dark text-sm flex items-center justify-center">
                      楼主
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                <p className="relative bottom-0.5">
                  {new Date(comment.time).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex-none text-text-light dark:text-text-dark">
              # {comment.sequence}
            </div>
          </div>
          <div className="text-xl">
            <CommentDisplay content={comment.content || ""} />
          </div>
          <div className="flex flex-1 justify-end text-gray-500 dark:text-gray-400">
            <div className="flex space-x-10">
              <div className="inline-flex">
                <span className="icon-[iconoir--thumbs-up] text-2xl mr-1" />
                赞({comment.like})
              </div>
              <div className="inline-flex">
                <span className="icon-[iconoir--thumbs-down] text-2xl mr-1" />
                踩({comment.dislike})
              </div>
              <div className="inline-flex">
                <NotificationRuleButton
                  targetType="COMMENT"
                  targetId={comment.commentId}
                  action="NOTIFY"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReplyListLoading() {
  return (
    <div className="flex flex-col py-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col py-2 border-gray-300 dark:border-gray-700 border-b-2 break-words whitespace-pre-wrap"
        >
          <div className="flex flex-row">
            <div className="flex-none">
              <Skeleton className="w-12 h-12 rounded-md" />
            </div>
            <div className="px-2 flex-1 text-text-light dark:text-text-dark">
              <div className="flex flex-row">
                <div className="inline-flex">
                  <Skeleton className="h-6 w-32 mb-2" />
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="flex-none text-text-light dark:text-text-dark">
              <Skeleton className="h-6 w-8" />
            </div>
          </div>
          <div className="pt-5 text-text-light dark:text-text-dark leading-8 text-xl break-words whitespace-pre-wrap">
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex flex-1 justify-end text-gray-500 dark:text-gray-400 mt-2">
            <div className="flex space-x-10">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

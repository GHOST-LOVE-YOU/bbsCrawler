import Image from "next/legacy/image";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { getAvatarUrl } from "@/lib/user/server-utils";

import CommentDisplay from "./common/CommentDisplay";
import NotificationRuleButton from "./common/NotificationRuleButton";

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
          className={`
            flex flex-col border-b-2 border-gray-300 py-2 break-words whitespace-pre-wrap
            dark:border-gray-700
          `}
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
            <div
              className={`
                text-text-light flex-1 px-2
                dark:text-text-dark
              `}
            >
              <div className="flex flex-row">
                <div className="inline-flex">
                  <div
                    className={`
                      hover:text-primary
                      dark:hover:text-primary-dark
                      cursor-pointer pt-0.5 font-mono text-xl font-semibold
                    `}
                  >
                    <Link href={`/space/${comment.userId}`}>
                      {comment.userName}
                    </Link>
                  </div>
                  {comment.userId === op && (
                    <div
                      className={`
                        border-accent-light text-accent-light ml-1 flex h-7 items-center
                        justify-center rounded-sm border-2 px-1 text-sm
                        dark:border-accent-dark dark:text-accent-dark
                      `}
                    >
                      楼主
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`
                  flex items-center space-x-1 text-sm text-gray-500
                  dark:text-gray-400
                `}
              >
                <p className="relative bottom-0.5">
                  {new Date(comment.time).toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className={`
                text-text-light flex-none
                dark:text-text-dark
              `}
            >
              # {comment.sequence}
            </div>
          </div>
          <div className="text-xl">
            <CommentDisplay content={comment.content || ""} />
          </div>
          <div
            className={`
              flex flex-1 justify-end text-gray-500
              dark:text-gray-400
            `}
          >
            <div className="flex space-x-10">
              <div className="inline-flex">
                <span className="icon-[iconoir--thumbs-up] mr-1 text-2xl" />
                赞({comment.like})
              </div>
              <div className="inline-flex">
                <span className="icon-[iconoir--thumbs-down] mr-1 text-2xl" />
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
          className={`
            flex flex-col border-b-2 border-gray-300 py-2 break-words whitespace-pre-wrap
            dark:border-gray-700
          `}
        >
          <div className="flex flex-row">
            <div className="flex-none">
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>
            <div
              className={`
                text-text-light flex-1 px-2
                dark:text-text-dark
              `}
            >
              <div className="flex flex-row">
                <div className="inline-flex">
                  <Skeleton className="mb-2 h-6 w-32" />
                </div>
              </div>
              <div
                className={`
                  flex items-center space-x-1 text-sm text-gray-500
                  dark:text-gray-400
                `}
              >
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div
              className={`
                text-text-light flex-none
                dark:text-text-dark
              `}
            >
              <Skeleton className="h-6 w-8" />
            </div>
          </div>
          <div
            className={`
              text-text-light pt-5 text-xl leading-8 break-words whitespace-pre-wrap
              dark:text-text-dark
            `}
          >
            <Skeleton className="h-20 w-full" />
          </div>
          <div
            className={`
              mt-2 flex flex-1 justify-end text-gray-500
              dark:text-gray-400
            `}
          >
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

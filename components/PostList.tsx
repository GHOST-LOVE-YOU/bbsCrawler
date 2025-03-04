import Image from "next/legacy/image";
import moment from "moment";
import "moment/locale/zh-cn";
import { getAvatarUrl } from "@/lib/user/server-utils";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

moment.locale("zh-cn");

interface PostListProps {
  posts: listPost[];
  sortBy: sortByType;
}

export default function PostList({ posts, sortBy }: PostListProps) {
  return (
    <ul className="divide-y divide-stone-200 dark:divide-stone-800 w-full">
      {posts.map((post) => (
        <li key={post.postId} className="md:pt-3 md:pb-1 py-1">
          <div className="flex items-start space-x-2 sm:space-x-4">
            <Link
              href={`/space/${post.userId}`}
              passHref
              className="flex-shrink-0"
            >
              <Image
                src={getAvatarUrl(post.userId)}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex-grow">
              <p className="text-base sm:text-lg md:text-xl font-semibold truncate hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">
                <Link href={`/post/${post.postId}`} className="truncate">
                  {post.topic}
                </Link>
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm dark:text-stone-400 text-stone-600">
                <div className="flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-50 cursor-pointer">
                  <span className="icon-[ph--user]" />
                  <Link href={`/space/${post.userId}`}>{post.userName}</Link>
                </div>
                <div className="hidden sm:flex items-center space-x-1">
                  <span className="icon-[clarity--eye-show-line]" />
                  <span>000</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="icon-[tabler--message]" />
                  <span>{post.commentCount}</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-50 cursor-pointer">
                  <span className="icon-[carbon--user-activity]" />
                  <Link href={`/space/${post.latestCommentUserId}`}>
                    {post.latestCommentUserName}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="icon-[bx--time-five]" />
                  <span>
                    {sortBy === "createdAt"
                      ? moment(post.createdAtTime).subtract(8, "h").fromNow()
                      : post.latestCommentTime
                        ? moment(post.latestCommentTime)
                            .subtract(8, "h")
                            .fromNow()
                        : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
      <div className="border-b border-stone-200 dark:border-stone-800 w-full" />
    </ul>
  );
}

export function PostListLoading() {
  return (
    <ul>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="py-2 border-gray-300 dark:border-gray-700 border-b-2"
        >
          <li>
            <div className="flex flex-row">
              <div className="flex-none pt-1">
                <Skeleton className="w-10 h-10 rounded-md" />
              </div>
              <div className="px-2 flex-1">
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
                <div className="inline-flex font-sans text-text-light dark:text-text-dark space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}

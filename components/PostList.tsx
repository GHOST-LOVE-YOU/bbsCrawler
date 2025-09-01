import moment from "moment";
import Image from "next/legacy/image";
import "moment/locale/zh-cn";
import Link from "next/link";

import { getAvatarUrl } from "@/lib/user/server-utils";

import { Skeleton } from "./ui/skeleton";

moment.locale("zh-cn");

interface PostListProps {
  posts: listPost[];
  sortBy: sortByType;
}

export default function PostList({ posts, sortBy }: PostListProps) {
  return (
    <ul
      className={`
        w-full divide-y divide-stone-200
        dark:divide-stone-800
      `}
    >
      {posts.map((post) => (
        <li
          key={post.postId}
          className={`
            py-1
            md:pt-3 md:pb-1
          `}
        >
          <div
            className={`
              flex items-start space-x-2
              sm:space-x-4
            `}
          >
            <Link href={`/space/${post.userId}`} passHref className="shrink-0">
              <Image
                src={getAvatarUrl(post.userId)}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <div
                className={`
                  flex items-start
                  md:space-x-3
                `}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      cursor-pointer truncate text-base font-semibold
                      hover:text-stone-600
                      sm:text-lg
                      md:text-xl
                      dark:hover:text-stone-300
                    `}
                  >
                    <Link href={`/post/${post.postId}`} className="truncate">
                      {post.topic}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div
                  className={`
                    flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600
                    md:text-sm
                    dark:text-stone-400
                  `}
                >
                  <div
                    className={`
                      flex cursor-pointer items-center space-x-1
                      hover:text-stone-900
                      dark:hover:text-stone-50
                    `}
                  >
                    <span className="icon-[ph--user]" />
                    <Link href={`/space/${post.userId}`}>{post.userName}</Link>
                  </div>
                  <div
                    className={`
                      hidden items-center space-x-1
                      sm:flex
                    `}
                  >
                    <span className="icon-[clarity--eye-show-line]" />
                    <span>000</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="icon-[tabler--message]" />
                    <span>{post.commentCount}</span>
                  </div>
                  <div
                    className={`
                      flex cursor-pointer items-center space-x-1
                      hover:text-stone-900
                      dark:hover:text-stone-50
                    `}
                  >
                    <span className="icon-[carbon--user-activity]" />
                    <Link href={`/space/${post.latestCommentUserId}`}>
                      {post.latestCommentUserName}
                    </Link>
                  </div>
                  <div
                    className={`
                      flex items-center space-x-1 text-xs text-stone-600
                      dark:text-stone-400
                    `}
                  >
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
                <div className="flex items-center space-x-2">
                  {post.area && (
                    <span
                      className={`
                        inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs
                        font-medium text-blue-800
                      `}
                    >
                      {post.area}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
      <div
        className={`
          w-full border-b border-stone-200
          dark:border-stone-800
        `}
      />
    </ul>
  );
}

export function PostListLoading() {
  return (
    <ul>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className={`
            border-b-2 border-gray-300 py-2
            dark:border-gray-700
          `}
        >
          <li>
            <div className="flex flex-row">
              <div className="flex-none pt-1">
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              <div className="flex-1 px-2">
                <div className="flex flex-col">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                </div>
                <div
                  className={`
                    text-text-light inline-flex space-x-4 font-sans
                    dark:text-text-dark
                  `}
                >
                  <Skeleton
                    className={`
                      h-4 w-10
                      md:w-20
                    `}
                  />
                  <Skeleton
                    className={`
                      h-4 w-8
                      md:w-16
                    `}
                  />
                  <Skeleton
                    className={`
                      h-4 w-8
                      md:w-16
                    `}
                  />
                  <Skeleton
                    className={`
                      h-4 w-12
                      md:w-24
                    `}
                  />
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

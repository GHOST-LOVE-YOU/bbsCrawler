import Image from "next/legacy/image";
import moment from "moment";
import "moment/locale/zh-cn";
import { getAvatarUrl } from "@lib/user/server-utils";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

moment.locale("zh-cn");

interface PostListProps {
  posts: listPost[];
  sortBy: sortByType;
}

export default function PostList({ posts, sortBy }: PostListProps) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700 w-full">
      {posts.map((post) => (
        <li key={post.postId} className="py-4">
          <div className="flex items-start space-x-2 sm:space-x-4">
            <Link
              href={`/space/${post.userId}`}
              passHref
              className="flex-shrink-0"
            >
              <Image
                src={getAvatarUrl(post.postId)}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex-grow min-w-0">
              <p className="text-base sm:text-lg font-semibold text-text-light dark:text-text-dark truncate">
                <Link href={`/post/${post.postId}`}>{post.topic}</Link>
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
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
                <div className="flex items-center space-x-1">
                  <span className="icon-[carbon--user-activity]" />
                  <Link href={`/space/${post.latestCommentUserId}`}>
                    {post.latestCommentUserName}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="icon-[bx--time-five]" />
                  <span>
                    {sortBy === "createdAt"
                      ? moment(post.createdAtTime).fromNow()
                      : post.latestCommentTime
                      ? moment(post.latestCommentTime).fromNow()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

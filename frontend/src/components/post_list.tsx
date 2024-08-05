// "use client";

import Image from "next/legacy/image";
import moment from "moment";
import "moment/locale/zh-cn";
import { getAvatarUrl } from "@lib/user/server-utils";
import Link from "next/link";

moment.locale("zh-cn");

interface Post {
  postId: string;
  topic: string;
  userName: string;
  userId: string;
  commentCount: number;
  latestCommentTime: Date | null;
  latestCommentUserName: string | null;
  latestCommentUserId: string | null;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts.map((post) => (
        <div key={post.postId} className="py-2 border-zinc-900 border-b-2">
          <li>
            <div className="flex flex-row">
              <div className="flex-none pt-1">
                <Link href={`/space/${post.userId}`} passHref>
                  <Image
                    src={getAvatarUrl(post.postId)}
                    alt="1"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </Link>
              </div>
              <div className="px-2 flex-1">
                <div className="flex flex-col">
                  <p className="pt-0.5 font-mono text-lg font-semibold text-zinc-100">
                    <a href={`/post/${post.postId}`}>{post.topic}</a>
                  </p>
                </div>
                <div className="inline-flex font-sans text-slate-200 space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="icon-[ph--user]" />
                    <p className="relative bottom-0.5">
                      <a href={`/space/${post.userId}`}>{post.userName}</a>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="icon-[clarity--eye-show-line]" />
                    <p className="relative bottom-0.5">000</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="icon-[tabler--message]" />
                    <p className="relative bottom-0.5">{post.commentCount}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="icon-[carbon--user-activity]" />
                    <p className="relative bottom-0.5">
                      {post.latestCommentUserName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="icon-[bx--time-five]" />
                    <p className="relative bottom-0.5">
                      {post.latestCommentTime
                        ? moment(post.latestCommentTime).fromNow()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}

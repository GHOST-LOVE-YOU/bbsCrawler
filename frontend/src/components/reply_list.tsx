import { getAvatarUrl } from "@lib/user/server-utils";
import Image from "next/legacy/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface Comment {
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
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return (
      <div className="text-center text-zinc-400 mt-5">请登录以查看评论</div>
    );
  }
  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment.sequence}
          className="flex flex-col py-2 border-stone-800 border-b-2 shadow-md"
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
            <div className="px-2 flex-1 text-zinc-300">
              <div className="flex flex-row">
                <div className="inline-flex">
                  <div className="pt-0.5 font-mono text-xl font-semibold hover:text-zinc-50 cursor-pointer">
                    {comment.userName}
                  </div>
                  {comment.userId === op && (
                    <div className="ml-1 px-1 border-2 border-stone-500 rounded h-7 text-stone-500 text-sm flex items-center justify-center">
                      楼主
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-zinc-400 text-sm">
                <p className="relative bottom-0.5">
                  {new Date(comment.time).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex-none"># {comment.sequence}</div>
          </div>
          <div
            className="pt-5 text-neutral-400 leading-8 text-xl"
            dangerouslySetInnerHTML={{ __html: comment.content || "" }}
          />
          <div className="flex flex-1 justify-end text-zinc-400">
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
                <span className="icon-[ph--star-bold] text-2xl mr-1" />
                收藏(0)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

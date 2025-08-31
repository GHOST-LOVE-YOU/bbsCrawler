import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/legacy/image";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { userGetUnreadMessageCount } from "@/lib/messages/server-utils";
import { getAvatarUrl, getUserByKindeId } from "@/lib/user/server-utils";

export default async function SideBar() {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  const { getUser, isAuthenticated } = getKindeServerSession();
  const KindeUser = await getUser();
  const isLoggedin = await isAuthenticated();
  let user;

  if (isLoggedin) {
    user = await getUserByKindeId(KindeUser!.id, KindeUser!.given_name!);
  }

  return (
    <div
      className={`
        h-full
        md:pl-2
      `}
    >
      <div
        className={`
          flex flex-col
          md:p-4
        `}
      >
        {isLoggedin ? (
          <>
            <UserInfo user={user} />
            <UserActions />
          </>
        ) : (
          <GuestInfo />
        )}
      </div>
    </div>
  );
}

export function UserInfo({ user }: { user: any }) {
  return (
    <div className="p-2">
      <div className="flex items-center space-x-4">
        <Link href={`/space/${user.id}`} passHref>
          <Image
            src={user.avatar ? user.avatar : getAvatarUrl(user.id)}
            alt="avatar"
            width={48}
            height={48}
            className="cursor-pointer rounded-md"
            layout="fixed"
          />
        </Link>
        <div>
          <p
            className={`
              cursor-pointer truncate
              hover:text-stone-500
            `}
          >
            {user.name}
          </p>
          <div className="mt-2 flex space-x-2">
            <Link href="/settings/introduction" passHref>
              <span
                className={`
                  icon-[ph--user-bold]
                  hover:text-stone-500
                `}
              />
            </Link>
            <Link href="/settings/notification-rule" passHref>
              <span
                className={`
                  icon-[material-symbols--settings]
                  hover:text-stone-500
                `}
              />
            </Link>
            <LogoutLink>
              <span
                className={`
                  icon-[fluent--arrow-exit-20-filled]
                  hover:text-stone-500
                `}
              />
            </LogoutLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function UserActions() {
  const unreadCount = await userGetUnreadMessageCount();
  return (
    <div
      className={`
        mt-4 rounded-md border-2 border-gray-300 p-2
        dark:border-gray-700
      `}
    >
      <div className="flex flex-row">
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[game-icons--cultist] text-xl" />
                <p
                  className={`
                    pl-1
                    hover:text-stone-500
                  `}
                >
                  关注
                </p>
              </div>
            </div>
            <div className="cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[material-symbols--files] text-xl" />
                <p
                  className={`
                    pl-1
                    hover:text-stone-500
                  `}
                >
                  收藏
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="cursor-pointer">
              <div className="flex flex-row items-center">
                <div className="relative">
                  <span
                    className={`
                      icon-[basil--notification-on-solid] text-xl
                      ${unreadCount > 0 ? "text-red-500" : ""}
                    `}
                  />
                  {unreadCount > 0 && (
                    <span
                      className={`
                        absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center
                        rounded-full bg-red-500 text-xs font-bold text-white
                      `}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p
                  className={`
                    pl-1
                    hover:text-stone-500
                  `}
                >
                  <Link href="/inbox/comment" passHref>
                    通知
                  </Link>
                </p>
              </div>
            </div>
            <div className="cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[fluent--person-feedback-48-regular] text-xl" />
                <p
                  className={`
                    pl-1
                    hover:text-stone-500
                  `}
                >
                  反馈
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestInfo() {
  return (
    <div
      className={`
        w-56 rounded-md border-2 border-gray-300 p-2 shadow-md
        dark:border-gray-700
      `}
    >
      <p
        className={`
          text-text-light text-lg font-bold
          dark:text-text-dark
        `}
      >
        欢迎来到BYR IWhisper!
      </p>
      <p className="pt-1 text-justify font-mono">
        该项目源于BYR论坛悄悄话的浏览器通知,后来觉得反正都爬取了帖子内容,不如做一个论坛吧,方便毕业生访问.为了防止滥用,登录是必须的.(违反版规,
        注册关闭)
      </p>
      <LoginLink postLoginRedirectURL="/">
        <button className="mt-2 w-16 rounded-md p-1">登录</button>
      </LoginLink>
    </div>
  );
}

export function SideBarLoading() {
  return (
    <div
      className={`
        h-full
        md:pl-2
      `}
    >
      <div
        className={`
          flex flex-col
          md:p-4
        `}
      >
        <>
          <div className="px-2">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1">
                <Skeleton className="mt-4 h-4 w-24" />
                <div className="my-2 flex">
                  <Skeleton className="h-6 w-20 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`
              mt-4 rounded-md border-2 border-gray-300 p-2
              dark:border-gray-700
            `}
          >
            <div className="flex flex-row">
              <div className="flex basis-1/2">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-14 rounded-sm" />
                  <Skeleton className="h-6 w-14 rounded-sm" />
                </div>
              </div>
              <div className="flex basis-1/2">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-14 rounded-sm" />
                  <Skeleton className="h-6 w-14 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

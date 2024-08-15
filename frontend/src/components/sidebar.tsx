import Image from "next/legacy/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAvatarUrl, getUserByKindeId } from "@lib/user/server-utils";
import { userGetUnreadMessageCount } from "@lib/messages/server-utils";

export default async function SideBar() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const KindeUser = await getUser();
  const isLoggedin = await isAuthenticated();
  let user;

  if (isLoggedin) {
    user = await getUserByKindeId(KindeUser!.id, KindeUser!.given_name!);
  }

  return (
    <div className="flex-none w-full md:pl-2 md:w-60 h-full">
      <div className="flex flex-col bg-background-light dark:bg-background-dark md:p-4 rounded-lg shadow-md">
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
            className="rounded-md cursor-pointer"
            layout="fixed"
          />
        </Link>
        <div>
          <p className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark cursor-pointer">
            {user.name}
          </p>
          <div className="flex space-x-2 mt-2">
            <Link href="/settings/introduction" passHref>
              <span className="icon-[ph--user-bold] text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark" />
            </Link>
            <Link href="/settings/notification-rule" passHref>
              <span className="icon-[material-symbols--settings] text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark" />
            </Link>
            <LogoutLink>
              <span className="icon-[fluent--arrow-exit-20-filled] text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark" />
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
    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 mt-4">
      <div className="flex flex-row">
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[game-icons--cultist] text-xl" />
                <p className="pl-1">关注</p>
              </div>
            </div>
            <div className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark cursor-pointer pt-1">
              <div className="flex flex-row">
                <span className="icon-[material-symbols--files] text-xl" />
                <p className="pl-1">收藏</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark cursor-pointer relative">
              <div className="flex flex-row items-center">
                <div className="relative">
                  <span
                    className={`icon-[basil--notification-on-solid] text-xl ${
                      unreadCount > 0 ? "text-red-500" : ""
                    }`}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center text-xs text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="pl-1">
                  <Link href="/inbox/comment" passHref>
                    通知
                  </Link>
                </p>
              </div>
            </div>
            <div className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-dark cursor-pointer pt-1">
              <div className="flex flex-row">
                <span className="icon-[fluent--person-feedback-48-regular] text-xl" />
                <p className="pl-1">反馈</p>
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
    <div className="p-2 border-2 border-gray-300 dark:border-gray-700 rounded-md shadow-md">
      <p className="text-text-light dark:text-text-dark text-lg font-bold">
        欢迎来到BYR IWhisper!
      </p>
      <p className="text-text-light dark:text-text-dark pt-1 font-mono text-justify">
        该项目源于BYR论坛悄悄话的浏览器通知, 后来觉得反正都爬取了帖子内容,
        不如做一个论坛吧, 方便毕业生访问.为了防止滥用, 登录是必须的.
      </p>
      <LoginLink postLoginRedirectURL="/">
        <button className="bg-primary hover:bg-primary-dark text-white rounded-md p-1 mt-2 w-16">
          登录
        </button>
      </LoginLink>
      <RegisterLink postLoginRedirectURL="/">
        <button className="bg-secondary hover:bg-secondary-dark text-white rounded-md p-1 mt-2 w-16 ml-5">
          注册
        </button>
      </RegisterLink>
    </div>
  );
}

function TipsInfo() {
  return (
    <div className="mt-6 p-2 border-2 border-black rounded-md shadow-md">
      <p className="text-zinc-300 text-lg font-bold">欢迎登陆</p>
      <p className="text-zinc-300 pt-1 font-mono text-justify">
        本站主要目的是悄悄话通知, 详细介绍请看该帖子
      </p>
    </div>
  );
}

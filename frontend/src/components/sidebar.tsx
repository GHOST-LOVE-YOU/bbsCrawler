import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAvatarUrl, getUserByKindeId } from "@lib/user/server-utils";

export default async function SideBar() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const KindeUser = await getUser();
  const isLoggedin = await isAuthenticated();
  let user;

  if (isLoggedin) {
    user = await getUserByKindeId(KindeUser!.id, KindeUser!.given_name!);
  }

  return (
    <div className="flex-none w-60 hidden md:block pl-2">
      <div className="flex flex-col">
        {isLoggedin ? (
          <>
            <UserInfo user={user} />
            <UserActions />
            <BoundIWhisper />
          </>
        ) : (
          <GuestInfo />
        )}
      </div>
    </div>
  );
}

function UserInfo({ user }: { user: any }) {
  return (
    <div className="p-2">
      <div className="flex flex-row">
        <div style={{ minWidth: 48, minHeight: 48 }}>
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
        </div>
        <div className="block ml-2 mt-1">
          <p className="text-zinc-300 hover:text-white cursor-pointer">
            {user.name}
          </p>
          <div className="inline">
            <Link href="/settings/introduction" passHref>
              <span className="icon-[ph--user-bold] bg-zinc-300 hover:bg-white" />
            </Link>
            <button className="bg-dark text-white rounded-md pl-1 pt-0.5">
              <span className="icon-[material-symbols--settings] bg-zinc-300 hover:bg-white" />
            </button>
            <LogoutLink>
              <button className="bg-dark text-white rounded-md pl-1 pt-0.5">
                <span className="icon-[fluent--arrow-exit-20-filled] bg-zinc-300 hover:bg-white" />
              </button>
            </LogoutLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserActions() {
  return (
    <div className="bg-zinc-700 rounded-md p-2 mt-4">
      <div className="flex flex-row">
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="text-zinc-300 hover:text-white cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[game-icons--cultist] text-xl" />
                <p className="pl-1">关注</p>
              </div>
            </div>
            <div className="text-zinc-300 hover:text-white cursor-pointer pt-1">
              <div className="flex flex-row">
                <span className="icon-[material-symbols--files] text-xl" />
                <p className="pl-1">收藏</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex basis-1/2">
          <div className="flex flex-col">
            <div className="text-zinc-300 hover:text-white cursor-pointer">
              <div className="flex flex-row">
                <span className="icon-[basil--notification-on-solid] text-xl" />
                <p className="pl-1">通知</p>
              </div>
            </div>
            <div className="text-zinc-300 hover:text-white cursor-pointer pt-1">
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

function GuestInfo() {
  return (
    <div className="p-2 border-2 border-black rounded-md shadow-md">
      <p className="text-zinc-300 text-lg font-bold">欢迎来到BYR IWhisper!</p>
      <p className="text-zinc-300 pt-1 font-mono text-justify">
        该项目源于BYR论坛悄悄话的浏览器通知, 后来觉得反正都爬取了帖子内容,
        不如做一个论坛吧, 方便毕业生访问.为了防止滥用, 登录是必须的.
      </p>
      <LoginLink postLoginRedirectURL="/">
        <button className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1 mt-2 w-16">
          登录
        </button>
      </LoginLink>
      <RegisterLink postLoginRedirectURL="/dashboard">
        <button className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1 mt-2 w-16 ml-5">
          注册
        </button>
      </RegisterLink>
    </div>
  );
}

function BoundIWhisper() {
  return (
    <>
      <div className="bg-green-500 hover:bg-green-600 rounded-xl p-2 mt-4">
        <p className="text-white text-center cursor-pointer">IWhisper#118</p>
      </div>
      <div className="bg-green-500 hover:bg-green-600 rounded-xl p-2 mt-4">
        <div className="block text-white text-center cursor-pointer">
          <div className="flex flex-row justify-center">
            <span className="icon-[ant-design--plus-circle-outlined] text-2xl" />
            <p className="pl-2">绑定IWhisper</p>
          </div>
        </div>
      </div>
    </>
  );
}

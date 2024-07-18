import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function SideBar() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const isLoggedin = await isAuthenticated();
  console.log(user);

  return (
    <div className="flex-none w-60 hidden md:block pl-2">
      <div className="flex flex-col">
        {isLoggedin && (
          <div className="p-2">
            <div className="flex flex-row">
              <div style={{ minWidth: 48, minHeight: 48 }}>
                <Image
                  src="https://minio-img.nezuko.me/img/2024/04/15/661ccb24384c2.png"
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-2 cursor-pointer"
                  layout="fixed"
                />
              </div>
              <div className="block ml-2 mt-1">
                <p className="text-zinc-300 hover:text-white cursor-pointer">
                  {user?.username ? user?.username : user?.given_name}
                </p>
                <div className="inline">
                  <button className="bg-dark text-white rounded-md pt-0.5">
                    <span className="icon-[ph--user-bold] bg-zinc-300 hover:bg-white" />
                  </button>
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
        )}
        {isLoggedin && (
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
        )}
        {!isLoggedin && (
          <div className="p-2 border-2 border-black rounded-md shadow-md">
            <p className="text-zinc-300 text-lg font-bold">
              欢迎来到BYR IWhisper!
            </p>
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
        )}
        {isLoggedin && (
          <div className="bg-green-500 hover:bg-green-600 rounded-xl p-2 mt-4">
            <p className="text-white text-center cursor-pointer">
              IWhisper#118
            </p>
          </div>
        )}
        {isLoggedin && (
          <div className="bg-green-500 hover:bg-green-600 rounded-xl p-2 mt-4">
            <div className="block text-white text-center cursor-pointer">
              <div className="flex flex-row justify-center">
                <span className="icon-[ant-design--plus-circle-outlined] text-2xl" />
                {/* 绑定IWhisper */}
                <p className="pl-2">绑定IWhisper</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

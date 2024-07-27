import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cog } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAvatarUrl, getUserByKindeId } from "@lib/user/server-utils";
import Link from "next/link";
import SettingsNotification from "@components/settings_notification";

const UserProfileSettings = ({ avatarUrl }: { avatarUrl: string }) => {
  return (
    <div className="bg-gray-800 text-gray-200 p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex mb-6">
        <div className="w-1/4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/settings/introduction">个人信息</Link>
              </li>
              <li className="text-green-500">
                <Link href="/settings/notification" passHref>
                  通知
                </Link>
              </li>
              <li>联系方式</li>
              <li>屏蔽用户</li>
              <li>常用偏好</li>
              <li>首页版块</li>
              <li>论坛扩展</li>
            </ul>
          </nav>
        </div>
        <div className="w-3/4 space-y-6">
        <SettingsNotification />
        </div>
      </div>
    </div>
  );
};

const UserProfileHeader = ({
  userName,
  avatarUrl,
}: {
  userName: string;
  avatarUrl: string;
}) => (
  <div className="flex items-center space-x-2 mb-4 max-w-4xl mx-auto">
    <Avatar className="w-12 h-12">
      <AvatarImage src={avatarUrl} alt="nezuko" />
      <AvatarFallback>NC</AvatarFallback>
    </Avatar>
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        {userName}
        <Cog className="w-5 h-5 ml-2" />
      </h1>
    </div>
  </div>
);

export default async function UserProfilePage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const KindeUser = await getUser();
  const isLoggedin = await isAuthenticated();
  if (!isLoggedin) {
    return (
      <div className="bg-zinc-400 bg-opacity-45 flex items-center justify-center max-w-4xl h-96 mx-auto rounded-md my-4">
        请先登录
      </div>
    );
  }
  const user = await getUserByKindeId(KindeUser!.id, KindeUser!.given_name!);
  const avatarUrl = user.avatar ? user.avatar : await getAvatarUrl(user.id);
  return (
    <div className="p-4">
      <UserProfileHeader userName={user.name} avatarUrl={avatarUrl} />
      <UserProfileSettings avatarUrl={avatarUrl} />
    </div>
  );
}

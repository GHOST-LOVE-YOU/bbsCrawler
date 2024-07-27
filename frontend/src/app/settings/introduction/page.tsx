import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Cog } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAvatarUrl, getUserByKindeId } from "@lib/user/server-utils";
import Link from "next/link";

const UserProfileSettings = ({ avatarUrl }: { avatarUrl: string }) => {
  return (
    <div className="bg-gray-800 text-gray-200 p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex mb-6">
        <div className="w-1/4">
          <nav>
            <ul className="space-y-2">
              <li className="text-green-500">
                <Link href="/settings/introduction">个人信息</Link>
              </li>
              <li>
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
          <div>
            <h3 className="text-lg font-semibold mb-2">头像</h3>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback>NC</AvatarFallback>
              </Avatar>
              <Button className="bg-green-600 hover:bg-green-700">
                设置头像
              </Button>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <Input
              className="bg-gray-700 border-gray-600 mb-2"
              placeholder="请用一句话介绍自己"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">签名</h3>
            <Textarea className="bg-gray-700 border-gray-600 mb-1" rows={4} />
            <p className="text-xs text-gray-400">
              帖子内容下方显示；支持markdown；不支持图片的引用
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Readme</h3>
            <Textarea className="bg-gray-700 border-gray-600 mb-1" rows={4} />
            <p className="text-xs text-gray-400">
              用户主页中显示；支持markdown
            </p>
          </div>
          <div className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700">确定</Button>
          </div>
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

// app/settings/introduction/page.tsx
import React, { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { clientGetUser, getAvatarUrl } from "@/lib/user/server-utils";

export default async function UserProfilePage() {
  const user = await clientGetUser();
  if (!user) {
    return null;
  }
  const avatarUrl = user.avatar ? user.avatar : await getAvatarUrl(user!.id);
  return (
    <div className="p-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">头像</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
          <Button className="bg-green-600 hover:bg-green-700">设置头像</Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-2">Bio</h3>
        <Input
          className="bg-slate-200 dark:bg-slate-700 border-gray-600 mb-2"
          placeholder="请用一句话介绍自己"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">签名</h3>
        <Textarea
          className="bg-slate-200 dark:bg-slate-700 border-gray-600 mb-1"
          rows={4}
        />
        <p className="text-xs text-gray-400">
          帖子内容下方显示；支持markdown；不支持图片的引用
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Readme</h3>
        <Textarea
          className="bg-slate-200 dark:bg-slate-700 border-gray-600 mb-1"
          rows={4}
        />
        <p className="text-xs text-gray-400">用户主页中显示；支持markdown</p>
      </div>
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">保存</Button>
      </div>
    </div>
  );
}

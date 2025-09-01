// app/settings/introduction/page.tsx
import React, { use } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
        <h3 className="mb-2 text-lg font-semibold">头像</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
          <Button
            className={`
              bg-green-600
              hover:bg-green-700
            `}
          >
            设置头像
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-2 text-lg font-semibold">Bio</h3>
        <Input
          className={`
            mb-2 border-gray-600 bg-slate-200
            dark:bg-slate-700
          `}
          placeholder="请用一句话介绍自己"
        />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">签名</h3>
        <Textarea
          className={`
            mb-1 border-gray-600 bg-slate-200
            dark:bg-slate-700
          `}
          rows={4}
        />
        <p className="text-xs text-gray-400">
          帖子内容下方显示；支持markdown；不支持图片的引用
        </p>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Readme</h3>
        <Textarea
          className={`
            mb-1 border-gray-600 bg-slate-200
            dark:bg-slate-700
          `}
          rows={4}
        />
        <p className="text-xs text-gray-400">用户主页中显示；支持markdown</p>
      </div>
      <div className="flex justify-end">
        <Button
          className={`
            bg-green-600
            hover:bg-green-700
          `}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

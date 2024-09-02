import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users } from "lucide-react";
import { User } from "@prisma/client";
import { getAvatarUrl, searchUserByName } from "@/lib/user/server-utils";
import Image from "next/legacy/image";
import { Badge } from "@/components/ui/badge";
import BindingsButton from "@/components/common/BindingsButton";

const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <Card className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:shadow-lg transition-shadow duration-300 border border-gray-300 dark:border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <div className="relative mr-4">
          <Image
            src={getAvatarUrl(user.id)}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-md"
          />
        </div>
        <div>
          <h3 className="font-bold text-xl flex items-center">
            {user.name}
            {user.tag.includes("bot") && (
              <Badge variant="secondary" className="ml-2 px-2 py-1">
                Bot
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Joined 999 days ago
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center">
          <span className="font-semibold mr-2">等级:</span> Lv 1
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">主题帖:</span> 0
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">鸡腿:</span> 0
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">评论数:</span> 0
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">关注:</span> 0
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">粉丝:</span> 0
        </div>
      </div>
    </CardContent>
    <CardFooter className="p-4 bg-gray-100 dark:bg-gray-800">
      <BindingsButton botUserId={user.id} />
    </CardFooter>
  </Card>
);

type UserListPageProps = {
  params: {
    q: string;
  };
};

export default async function UserListPage({ params }: UserListPageProps) {
  const q = params.q;
  const users: User[] = await searchUserByName(q);

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark">
      <div className="mx-auto">
        <div className="flex items-center mb-8">
          <Users className="text-text-light dark:text-text-dark mr-3 h-8 w-8" />
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold">
            查找用户
          </h1>
        </div>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center text-text-light dark:text-text-dark text-xl mt-12">
            未找到匹配的用户。
          </div>
        )}
      </div>
    </div>
  );
}

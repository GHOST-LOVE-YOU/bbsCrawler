import { User } from "@prisma/client";
import { Users } from "lucide-react";
import Image from "next/legacy/image";
import React from "react";

import BindingsButton from "@/components/common/BindingsButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAvatarUrl, searchUserByName } from "@/lib/user/server-utils";

const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <Card
    className={`
      bg-background-light text-text-light border border-gray-300 transition-shadow duration-300
      dark:bg-background-dark dark:text-text-dark dark:border-gray-700
      hover:shadow-lg
    `}
  >
    <CardContent className="p-6">
      <div className="mb-4 flex items-center">
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
          <h3 className="flex items-center text-xl font-bold">
            {user.name}
            {user.tag.includes("bot") && (
              <Badge variant="secondary" className="ml-2 px-2 py-1">
                Bot
              </Badge>
            )}
          </h3>
          <p
            className={`
              text-sm text-gray-600
              dark:text-gray-400
            `}
          >
            Joined 999 days ago
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center">
          <span className="mr-2 font-semibold">等级:</span> Lv 1
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">主题帖:</span> 0
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">鸡腿:</span> 0
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">评论数:</span> 0
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">关注:</span> 0
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">粉丝:</span> 0
        </div>
      </div>
    </CardContent>
    <CardFooter
      className={`
        bg-gray-100 p-4
        dark:bg-gray-800
      `}
    >
      <BindingsButton botUserId={user.id} />
    </CardFooter>
  </Card>
);

type UserListPageProps = {
  params: Promise<{
    q: string;
  }>;
};

export default async function UserListPage(props: UserListPageProps) {
  const params = await props.params;
  const q = params.q;
  const users: User[] = await searchUserByName(q);

  return (
    <div
      className={`
        bg-background-light p-6
        dark:bg-background-dark
      `}
    >
      <div className="mx-auto">
        <div className="mb-8 flex items-center">
          <Users
            className={`
              text-text-light mr-3 h-8 w-8
              dark:text-text-dark
            `}
          />
          <h1
            className={`
              text-text-light text-3xl font-bold
              dark:text-text-dark
            `}
          >
            查找用户
          </h1>
        </div>
        {users.length > 0 ? (
          <div
            className={`
              grid grid-cols-1 gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            `}
          >
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div
            className={`
              text-text-light mt-12 text-center text-xl
              dark:text-text-dark
            `}
          >
            未找到匹配的用户。
          </div>
        )}
      </div>
    </div>
  );
}

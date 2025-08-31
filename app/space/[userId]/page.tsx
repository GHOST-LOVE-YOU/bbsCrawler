import { Clock, Diamond, Search, PenLine, MessageSquare } from "lucide-react";
import Image from "next/image";
import React from "react";

import BindingsButton from "@/components/common/BindingsButton";
import SpaceComment from "@/components/space/SpaceComment";
import SpaceTopic from "@/components/space/SpaceTopic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clientGetUser,
  getAvatarUrl,
  getOptimizedUserData,
  getUserByUserId,
} from "@/lib/user/server-utils";

export default async function Page(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await getUserByUserId(params.userId);
  if (!user) {
    return <div>User not found</div>;
  }
  const currentUser = await clientGetUser();
  if (!currentUser) {
    return <div>Unauthorized</div>;
  }
  const { joinedDays, postCount, commentCount, topicsList, commentsList } =
    await getOptimizedUserData(params.userId);
  const showBindingsButton =
    currentUser && !currentUser.tag.includes("bot") && user.tag.includes("bot");
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card
        className={`
          bg-background-light mb-4 border border-gray-300
          dark:bg-background-dark dark:border-gray-700
        `}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={user.avatar ? user.avatar : getAvatarUrl(user.id)}
              alt="User avatar"
              width={64}
              height={64}
              className="h-full w-full rounded-lg object-cover"
            />
            <div>
              <h1
                className={`
                  text-text-light flex items-center text-2xl font-bold
                  dark:text-text-dark
                `}
              >
                {user.name}
                {user.tag.includes("bot") && (
                  <Badge variant="secondary" className="ml-2">
                    Bot
                  </Badge>
                )}
              </h1>
              <p
                className={`
                  text-gray-600
                  dark:text-gray-400
                `}
              >
                一句话介绍自己
              </p>
            </div>
          </div>
          {showBindingsButton && <BindingsButton botUserId={user.id} />}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          className={`
            grid w-full grid-cols-4 border border-gray-300 bg-gray-200
            dark:border-gray-700 dark:bg-gray-800
          `}
        >
          <TabsTrigger
            value="overview"
            className={`
              text-text-light
              dark:text-text-dark
            `}
          >
            概况
          </TabsTrigger>
          <TabsTrigger
            value="topics"
            className={`
              text-text-light
              dark:text-text-dark
            `}
          >
            主题帖
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className={`
              text-text-light
              dark:text-text-dark
            `}
          >
            评论
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className={`
              text-text-light
              dark:text-text-dark
            `}
          >
            收藏
          </TabsTrigger>
        </TabsList>
        <OverviewContent
          joinedDays={joinedDays}
          postCount={postCount}
          commentCount={commentCount}
        />

        <TabsContent value="topics">
          <SpaceTopic topicsList={topicsList} />
        </TabsContent>
        <TabsContent value="comments">
          <SpaceComment commentsList={commentsList} />
        </TabsContent>
        <TabsContent value="bookmarks">收藏内容</TabsContent>
      </Tabs>
    </div>
  );
}

const StatCard = ({ icon, label, value }: any) => (
  <Card
    className={`
      border border-gray-300 bg-gray-100
      dark:border-gray-700 dark:bg-gray-800
    `}
  >
    <CardContent className="flex flex-col items-center p-4">
      {icon}
      <p
        className={`
          mt-2 text-sm text-gray-600
          dark:text-gray-400
        `}
      >
        {label}
      </p>
      <p
        className={`
          text-text-light font-bold
          dark:text-text-dark
        `}
      >
        {value}
      </p>
    </CardContent>
  </Card>
);

const OverviewContent = ({ joinedDays, postCount, commentCount }: any) => (
  <TabsContent value="overview">
    <div
      className={`
        mt-4 grid grid-cols-2 gap-4
        sm:grid-cols-3
        md:grid-cols-5
      `}
    >
      <StatCard
        icon={<Clock className="h-6 w-6" />}
        label="加入天数"
        value={joinedDays}
      />
      <StatCard icon={<Diamond className="h-6 w-6" />} label="等级" value="2" />
      <StatCard
        icon={<Search className="h-6 w-6" />}
        label="鸡腿数目"
        value="9999"
      />
      <StatCard
        icon={<PenLine className="h-6 w-6" />}
        label="主题帖数"
        value={postCount}
      />
      <StatCard
        icon={<MessageSquare className="h-6 w-6" />}
        label="评论数目"
        value={commentCount}
      />
    </div>
    <Card
      className={`
        mt-4 border border-gray-300 bg-gray-100
        dark:border-gray-700 dark:bg-gray-800
      `}
    >
      <CardContent className="pt-6">
        <p
          className={`
            text-gray-600
            dark:text-gray-400
          `}
        >
          没有找到readme🙁
        </p>
      </CardContent>
    </Card>
  </TabsContent>
);

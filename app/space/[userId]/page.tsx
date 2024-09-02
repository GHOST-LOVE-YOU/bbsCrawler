import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Diamond, Search, PenLine, MessageSquare } from "lucide-react";
import {
  clientGetUser,
  getAvatarUrl,
  getOptimizedUserData,
  getUserByUserId,
} from "@/lib/user/server-utils";
import SpaceTopic from "@/components/space/SpaceTopic";
import { Badge } from "@/components/ui/badge";
import BindingsButton from "@/components/common/BindingsButton";
import SpaceComment from "@/components/space/SpaceComment";

export default async function Page({ params }: { params: { userId: string } }) {
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-4 bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 border">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={user.avatar ? user.avatar : getAvatarUrl(user.id)}
              alt="User avatar"
              width={64}
              height={64}
              className="w-full h-full object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold flex items-center text-text-light dark:text-text-dark">
                {user.name}
                {user.tag.includes("bot") && (
                  <Badge variant="secondary" className="ml-2">
                    Bot
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">一句话介绍自己</p>
            </div>
          </div>
          {showBindingsButton && <BindingsButton botUserId={user.id} />}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full ">
        <TabsList className="grid w-full grid-cols-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <TabsTrigger
            value="overview"
            className="text-text-light dark:text-text-dark"
          >
            概况
          </TabsTrigger>
          <TabsTrigger
            value="topics"
            className="text-text-light dark:text-text-dark"
          >
            主题帖
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-text-light dark:text-text-dark"
          >
            评论
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="text-text-light dark:text-text-dark"
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
  <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
    <CardContent className="p-4 flex flex-col items-center">
      {icon}
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{label}</p>
      <p className="text-text-light dark:text-text-dark font-bold">{value}</p>
    </CardContent>
  </Card>
);

const OverviewContent = ({ joinedDays, postCount, commentCount }: any) => (
  <TabsContent value="overview">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 ">
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        label="加入天数"
        value={joinedDays}
      />
      <StatCard icon={<Diamond className="w-6 h-6" />} label="等级" value="2" />
      <StatCard
        icon={<Search className="w-6 h-6" />}
        label="鸡腿数目"
        value="9999"
      />
      <StatCard
        icon={<PenLine className="w-6 h-6" />}
        label="主题帖数"
        value={postCount}
      />
      <StatCard
        icon={<MessageSquare className="w-6 h-6" />}
        label="评论数目"
        value={commentCount}
      />
    </div>
    <Card className="mt-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
      <CardContent className="pt-6">
        <p className="text-gray-600 dark:text-gray-400">没有找到readme🙁</p>
      </CardContent>
    </Card>
  </TabsContent>
);

import React from "react";
import Image from "next/legacy/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Diamond, Search, PenLine, MessageSquare } from "lucide-react";
import {
  getAvatarUrl,
  getUserByUserId,
  getUserOverview,
} from "@lib/user/server-utils";
import SpaceTopic from "@components/space_topic";
import { getPostByUserId } from "@lib/posts/server-utils";

export default async function Page({ params }: { params: { userId: string } }) {
  const user = await getUserByUserId(params.userId);
  if (!user) {
    return <div>User not found</div>;
  }
  const { joinedDays, postCount, commentCount } = await getUserOverview(
    params.userId
  );
  const topicsList = await getPostByUserId(params.userId);
  return (
    <div className="bg-stone-400 bg-transparent bg-opacity-65 p-6 rounded-lg max-w-4xl mx-auto mt-4">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-lg mr-4 flex-shrink-0">
          <Image
            src={user.avatar ? user.avatar : getAvatarUrl(user.id)}
            alt="User avatar"
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-300">{user.name}</h2>
          <p className="text-stone-700">一句话介绍自己</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-stone-600">
          <TabsTrigger value="overview">概况</TabsTrigger>
          <TabsTrigger value="topics">主题帖</TabsTrigger>
          <TabsTrigger value="comments">评论</TabsTrigger>
          <TabsTrigger value="bookmarks">收藏</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="加入天数"
              value={joinedDays}
            />
            <StatCard
              icon={<Diamond className="w-6 h-6" />}
              label="等级"
              value="2"
            />
            <StatCard
              icon={<Search className="w-6 h-6" />}
              label="鸡腿数目"
              value="699"
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
          <Card className="mt-4 bg-stone-600">
            <CardContent className="pt-6">
              <p className="text-stone-300">没有找到readme🙁</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topics">
          <SpaceTopic topicsList={topicsList} />
        </TabsContent>
        <TabsContent value="comments">评论内容</TabsContent>
        <TabsContent value="bookmarks">收藏内容</TabsContent>
      </Tabs>
    </div>
  );
}

const StatCard = ({ icon, label, value }: any) => (
  <Card className="bg-stone-600">
    <CardContent className="p-4 flex flex-col items-center">
      {icon}
      <p className="text-stone-300 text-sm mt-2">{label}</p>
      <p className="text-stone-100 font-bold">{value}</p>
    </CardContent>
  </Card>
);

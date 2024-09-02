"use client";

import React from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@/providers/NotificationRuleProvider";
import Image from "next/image";
import type { BindingsBot } from "@/lib/bindings/type";
import moment from "moment";
import Link from "next/link";

moment.locale("zh-cn");

type BotCardProps = {
  bot: BindingsBot;
  onUnbind: (id: string) => void;
};

const BotCard = ({ bot, onUnbind }: BotCardProps) => (
  <div className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow duration-200 border border-gray-300 dark:border-gray-700">
    <div className="flex items-center">
      <Image
        src={bot.avatarUrl}
        alt={`${bot.name}'s avatar`}
        width={40}
        height={40}
        className="rounded-full mr-4"
      />
      <div>
        <div className="flex items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
            <Link href={`/space/${bot.id}`} className="hover:underline">
              {bot.name}
            </Link>
          </span>
          <Bot size={14} className="text-blue-500 dark:text-blue-400" />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          加入时间: {bot.createdAt ? moment(bot.createdAt).fromNow() : "N/A"}
        </span>
      </div>
    </div>
    <Button
      variant="destructive"
      size="sm"
      className="ml-4 shrink-0"
      onClick={() => onUnbind(bot.id)}
    >
      解绑
    </Button>
  </div>
);

export default function BindingsBotList() {
  const { bindingsBotList, unBindingBot } = useNotificationRule();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        已绑定机器人
      </h2>
      {bindingsBotList.length > 0 ? (
        bindingsBotList.map((bot) => (
          <BotCard key={bot.id} bot={bot} onUnbind={unBindingBot} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-background-light dark:bg-background-dark rounded-lg border border-gray-300 dark:border-gray-7000">
          --空--
        </div>
      )}
    </div>
  );
}

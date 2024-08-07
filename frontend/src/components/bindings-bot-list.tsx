"use client";
import React from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@contexts/notification-rule-context-provider";
import Image from "next/image";
import type { BindingsBot } from "@lib/bindings/type";
import moment from "moment";
import Link from "next/link";

moment.locale("zh-cn");

type BotCardProps = {
  bot: BindingsBot;
  onUnbind: (id: string) => void;
};

const BotCard = ({ bot, onUnbind }: BotCardProps) => (
  <div className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
    <div className="flex items-center">
      <Image
        src={bot.avatarUrl}
        alt={`${bot.name}'s avatar`}
        width={52}
        height={52}
        className="rounded-lg mr-4"
      />
      <div>
        <div className="flex items-center">
          <span className="font-semibold mr-2 text-slate-800">
            <Link href={`/space/${bot.id}`}>{bot.name}</Link>
          </span>
          <Bot size={16} className="text-blue-500" />
        </div>
        <span className="text-sm text-gray-500">
          加入时间:
          {bot.createdAt ? moment(bot.createdAt).fromNow() : "N/A"}
        </span>
      </div>
    </div>
    <Button variant="destructive" size="sm" onClick={() => onUnbind(bot.id)}>
      Unbind
    </Button>
  </div>
);

export default function BindingsBotList() {
  const { bindingsBotList, unBindingBot } = useNotificationRule();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-3">已绑定机器人</h2>
      {bindingsBotList.map((bot) => (
        <BotCard key={bot.id} bot={bot} onUnbind={unBindingBot} />
      ))}
    </div>
  );
}

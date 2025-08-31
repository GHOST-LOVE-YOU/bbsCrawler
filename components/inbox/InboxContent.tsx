import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageWithAvatar } from "@/lib/messages/server-utils";

import MarkdownContent from "../MarkdownContent";

type InboxContentProps = {
  messages: MessageWithAvatar[];
};

export default function InboxContent({ messages }: InboxContentProps) {
  return (
    <ScrollArea
      className={`
        bg-background-light h-[400px]
        dark:bg-background-dark
      `}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`
            flex items-start space-x-4 border-b border-gray-200 p-2
            dark:border-gray-700
          `}
        >
          <div className="relative">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage src={message.avatarUrl as string} alt="Avatar" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            {!message.isRead && (
              <div
                className={`
                  absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500
                  dark:bg-red-400
                `}
              ></div>
            )}
          </div>
          <div
            className={`
              text-text-light grow
              dark:text-text-dark
            `}
          >
            <MarkdownContent content={message.content} />
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

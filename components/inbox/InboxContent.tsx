import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageWithAvatar } from "@/lib/messages/server-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MarkdownContent from "../MarkdownContent";

type InboxContentProps = {
  messages: MessageWithAvatar[];
};

export default function InboxContent({ messages }: InboxContentProps) {
  return (
    <ScrollArea className="h-[400px] bg-background-light dark:bg-background-dark">
      {messages.map((message) => (
        <div
          key={message.id}
          className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-start space-x-4"
        >
          <div className="relative">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={message.avatarUrl as string} alt="Avatar" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            {!message.isRead && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full"></div>
            )}
          </div>
          <div className="flex-grow text-text-light dark:text-text-dark">
            <MarkdownContent content={message.content} />
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

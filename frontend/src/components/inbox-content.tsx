import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { MessageWithAvatar } from "@lib/messages/server-utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import MarkdownContent from "./markdown-content";

type InboxContentProps = {
  messages: MessageWithAvatar[];
};

export default function InboxContent({ messages }: InboxContentProps) {
  return (
    <ScrollArea className="h-[400px]">
      {messages.map((message) => (
        <div
          key={message.id}
          className="p-2 border-b border-gray-600 flex items-start space-x-4"
        >
          <div className="relative">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={message.avatarUrl as string} alt="Avatar" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            {!message.isRead && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
          <div className="flex-grow">
            <MarkdownContent content={message.content} />
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

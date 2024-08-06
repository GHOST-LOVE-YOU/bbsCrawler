import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { userGetMessages } from "@lib/messages/server-utils";
import { MessagesType } from "@prisma/client";
import InboxHeader from "@components/inbox-header";
import InboxContent from "@components/inbox-content";

export default async function NotificationPanel() {
  const messages = await userGetMessages([
    MessagesType.WATCHED_POST_NEW_COMMENT,
    MessagesType.POST_REPLY,
  ]);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-700 text-white">
        <CardContent className="p-0">
          <InboxHeader />
          <InboxContent messages={messages} />
        </CardContent>
      </Card>
    </div>
  );
}

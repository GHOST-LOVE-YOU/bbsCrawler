import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "./loading";
import InboxContent from "@components/inbox-content";
import InboxHeader from "@components/inbox-header";

async function InboxCommentContent() {
  const { userGetMessages } = await import("@lib/messages/server-utils");
  const { MessagesType } = await import("@prisma/client");
  const messages = await userGetMessages([
    MessagesType.COMMENT_REPLY,
    MessagesType.WATCHED_COMMENT_NEW_QUOTED,
  ]);

  return <InboxContent messages={messages} />;
}

export default function NotificationPanel() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-700 text-white">
        <CardContent className="p-0">
          <Suspense fallback={<Loading />}>
          <InboxHeader />
            <InboxCommentContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "./loading";
import InboxContent from "@/components/inbox/InboxContent";
import InboxHeader from "@/components/inbox/InboxHeader";

async function InboxPostContent() {
  const { userGetMessages } = await import("@/lib/messages/server-utils");
  const { MessagesType } = await import("@prisma/client");
  const messages = await userGetMessages([
    MessagesType.WATCHED_POST_NEW_COMMENT,
    MessagesType.POST_REPLY,
  ]);

  return <InboxContent messages={messages} />;
}

export default async function NotificationPanel() {
  return (
    <>
      <InboxHeader />
      <InboxPostContent />
    </>
  );
}

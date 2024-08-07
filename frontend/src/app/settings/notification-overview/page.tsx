import NotifyCommentOverview from "@components/notify-comment-overview";
import NotifyPostOverview from "@components/notify-post-overview";
import { ScrollArea } from "@components/ui/scroll-area";
import { NotificationOverviewProvider } from "@contexts/notification-overview-context-provider";
import {
  getCommentNotificationsOverview,
  getPostNotificationsOverview,
} from "@lib/notificationOverview/server-utils";
import React from "react";

export default async function notificationOverviewPage() {
  const initialNotifyPostOverview = await getPostNotificationsOverview();
  const initialNotifyCommentOverview = await getCommentNotificationsOverview();
  return (
    <ScrollArea className="h-[520px]">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">通知预览</h1>
        <div className="mb-6 space-y-4">
          <NotificationOverviewProvider
            initialNotifyPostOverview={initialNotifyPostOverview}
            initialNotifyCommentOverview={initialNotifyCommentOverview}
          >
            <NotifyPostOverview />
            <NotifyCommentOverview />
          </NotificationOverviewProvider>
        </div>
      </div>
    </ScrollArea>
  );
}

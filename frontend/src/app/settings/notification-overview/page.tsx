import NotifyCommentOverview from "@components/notification-overview/comment-list";
import NotifyPostOverview from "@components/notification-overview/post-list";
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
    <ScrollArea className="h-[calc(100vh-300px)] pr-0">
      <div className="container mx-auto p-4">
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

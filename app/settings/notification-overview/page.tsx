import NotifyPostOverview from "@/components/settings/notification-overview/NotifyPostOverview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationOverviewProvider } from "@/providers/NotificationOverviewProvider";
import {
  getCommentNotificationsOverview,
  getPostNotificationsOverview,
} from "@/lib/notificationOverview/server-utils";
import React from "react";
import NotifyCommentOverview from "@/components/settings/notification-overview/NotifyCommentOverview";

export default async function notificationOverviewPage() {
  const initialNotifyPostOverview = await getPostNotificationsOverview();
  const initialNotifyCommentOverview = await getCommentNotificationsOverview();
  return (
    <ScrollArea className="h-[calc(100vh-100px)] md:h-[calc(100vh-300px)] pr-0">
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

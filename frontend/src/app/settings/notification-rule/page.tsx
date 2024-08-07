// app/settings/notification/page.tsx
import BindingsBotList from "@components/bindings-bot-list";
import NofiticationList from "@components/notification-list";
import { NotificationProvider } from "@contexts/notification-context-provider";
import { NotificationRuleProvider } from "@contexts/notification-rule-context-provider";
import { userGetBindingsBotList } from "@lib/bindings/server-utils";
import { getNotifications } from "@lib/notifications/server-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotifyPostList from "@components/notify-post-list";
import NotifyCommentList from "@components/notify-comment-list";
import { getAllNotificationLists } from "@lib/notificationRule/server-utils";
import DontNotifyPostList from "@components/dont-notify-post-list";
import DontNotifyCommentList from "@components/dont-notify-comment-list";

export default async function UserProfilePage() {
  const { emailNotification, telegramNotification, browserPushNotification } =
    await getNotifications();
  const bindingBots = await userGetBindingsBotList();
  const {
    notifyPostList,
    notifyCommentList,
    dontNotifyPostList,
    dontNotifyCommentList,
  } = await getAllNotificationLists();
  return (
    <ScrollArea className="h-[520px]">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">通知规则</h1>
        <div className="mb-6 space-y-4">
          <NotificationProvider
            initialEmailNotification={emailNotification}
            initialTelegramNotification={telegramNotification}
            initialBrowserPushNotification={browserPushNotification}
          >
            <NofiticationList />
          </NotificationProvider>
          <NotificationRuleProvider
            initialBindingsBotList={bindingBots}
            initialNotifyPostList={notifyPostList}
            initialNotifyCommentList={notifyCommentList}
            initialDontNotifyPostList={dontNotifyPostList}
            initialDontNotifyCommentList={dontNotifyCommentList}
          >
            <BindingsBotList />
            <NotifyPostList />
            <NotifyCommentList />
            <DontNotifyPostList />
            <DontNotifyCommentList />
          </NotificationRuleProvider>
        </div>
      </div>
    </ScrollArea>
  );
}

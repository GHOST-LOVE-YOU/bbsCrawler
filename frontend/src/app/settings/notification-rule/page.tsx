import { NotificationProvider } from "@contexts/notification-context-provider";
import { NotificationRuleProvider } from "@contexts/notification-rule-context-provider";
import { userGetBindingsBotList } from "@lib/bindings/server-utils";
import { getNotifications } from "@lib/notifications/server-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllNotificationLists } from "@lib/notificationRule/server-utils";
import BindingsBotList from "@components/notification-rule/bindings-bot-list";
import NotifyPostList from "@components/notification-rule/notify-post-list";
import NotifyCommentList from "@components/notification-rule/notify-comment-list";
import DontNotifyPostList from "@components/notification-rule/dont-notify-post-list";
import DontNotifyCommentList from "@components/notification-rule/dont-notify-comment-list";
import MethodsList from "@components/notification-rule/methods-list";

export default async function NotificationRulePage() {
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
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="space-y-8">
        <NotificationProvider
          initialEmailNotification={emailNotification}
          initialTelegramNotification={telegramNotification}
          initialBrowserPushNotification={browserPushNotification}
        >
          <MethodsList />
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
    </ScrollArea>
  );
}

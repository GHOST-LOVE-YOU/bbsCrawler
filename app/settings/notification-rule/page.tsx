import BindingsBotList from "@/components/settings/notification-rule/BindingsBotList";
import DontNotifyCommentList from "@/components/settings/notification-rule/DontNotifyCommentList";
import DontNotifyPostList from "@/components/settings/notification-rule/DontNotifyPostList";
import MethodsList from "@/components/settings/notification-rule/MethodsList";
import NotifyCommentList from "@/components/settings/notification-rule/NotifyCommentList";
import NotifyPostList from "@/components/settings/notification-rule/NotifyPostList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userGetBindingsBotList } from "@/lib/bindings/server-utils";
import { getAllNotificationLists } from "@/lib/notificationRule/server-utils";
import { getNotifications } from "@/lib/notifications/server-utils";
import { NotificationMethodProvider } from "@/providers/NotificationMethodProvider";
import { NotificationRuleProvider } from "@/providers/NotificationRuleProvider";

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
    <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-300px)] pr-4">
      <div className="space-y-8">
        <NotificationMethodProvider
          initialEmailNotification={emailNotification}
          initialTelegramNotification={telegramNotification}
          initialBrowserPushNotification={browserPushNotification}
        >
          <MethodsList />
        </NotificationMethodProvider>
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

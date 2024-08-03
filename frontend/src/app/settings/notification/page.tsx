// app/settings/notification/page.tsx
import NofiticationList from "@components/notification-list";
import { NotificationProvider } from "@contexts/notification-context-provider";
import { getNotifications } from "@lib/notifications/utils";

export default async function UserProfilePage() {
  const { emailNotification, telegramNotification, browserPushNotification } =
    await getNotifications();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">通知</h1>
      <div className="mb-6">
        <NotificationProvider
          initialEmailNotification={emailNotification}
          initialTelegramNotification={telegramNotification}
          initialBrowserPushNotification={browserPushNotification}
        >
          <NofiticationList />
        </NotificationProvider>
      </div>
    </div>
  );
}

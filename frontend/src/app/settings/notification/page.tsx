// app/settings/notification/page.tsx
import NofiticationButton from "@components/nofitication-button";
import { clientGetUser } from "@lib/user/server-utils";

export default async function UserProfilePage() {
  // 当前user
  const user = await clientGetUser();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">通知</h1>
      <div className="mb-6">
        {/* <AddNotificationMethod onAdd={handleAddMethod} /> */}
        <NofiticationButton actionType="add" />
      </div>
      <div>
        {/* {notificationMethods.map(method => (
          <NotificationMethodCard
            key={method.id}
            method={method}
            onDelete={handleDeleteMethod}
            onToggle={handleToggleMethod}
            onUpdate={handleUpdateMethod}
          />
        ))} */}
      </div>
      {/* {toast.message && (
        <Toast variant={toast.type === 'success' ? 'default' : 'destructive'}>
          {toast.message}
        </Toast>
      )} */}
    </div>
  );
}

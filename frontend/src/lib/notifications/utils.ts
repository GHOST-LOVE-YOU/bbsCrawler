import webpush from "web-push";

type webPushData = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function testWebPush({ endpoint, p256dh, auth }: webPushData) {
  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  try {
    await webpush.sendNotification(
      {
        endpoint,
        keys: {
          p256dh,
          auth,
        },
      },
      JSON.stringify(notificationPayload)
    );
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

import prisma from "@lib/db";
import webpush from "web-push";

export async function POST() {
  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  try {
    const subscriptions = await prisma.subscription.findMany();
    const notificationPromises = subscriptions.map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify(notificationPayload)
      )
    );

    await Promise.all(notificationPromises);
    return Response.json({ message: "Notification sent successfully." });
  } catch (error) {
    console.error("Error sending notification", error);
    return Response.json({ error: "Error sending notification" });
  }
}

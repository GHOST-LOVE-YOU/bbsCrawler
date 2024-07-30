import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

type ResponseData = {
  message: string;
  error?: any;
};

type RequestBody = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ResponseData>> {
  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  try {
    const body: RequestBody = await req.json();
    const { endpoint, p256dh, auth } = body;
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
    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { message: "Error sending notification", error },
      { status: 500 }
    );
  }
}

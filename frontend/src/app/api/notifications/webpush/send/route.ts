import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// webpush.setVapidDetails(
//   "mailto:your-email@example.com",
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// );

type RequestBody = {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  payload: any;
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { subscription, payload } = body;

    await webpush.sendNotification(subscription, JSON.stringify(payload));

    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json(
      { message: "Failed to send push notification", error },
      { status: 500 }
    );
  }
}

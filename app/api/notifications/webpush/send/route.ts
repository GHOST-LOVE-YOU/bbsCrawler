import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs"; // 关键：用 Node.js 运行时

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:you@example.com";

// 只初始化一次（在 dev HMR 下也安全）
let vapidInitialized = false;
function ensureVapid() {
  if (!vapidInitialized) {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      throw new Error("Missing VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY envs");
    }
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    vapidInitialized = true;
  }
}

type ResponseData = { message: string; error?: any };

type RequestBody = {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  payload: {
    title: string;
    body: string;
    icon?: string;
    data?: any;
  };
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ResponseData>> {
  ensureVapid();

  try {
    const body: RequestBody = await req.json();
    const { subscription, payload } = body;

    await webpush.sendNotification(subscription, JSON.stringify(payload));

    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    // 把上游返回细节打出来，便于定位 401/403 等
    if (e?.statusCode) {
      console.error("WebPushError", {
        statusCode: e.statusCode,
        headers: e.headers,
        body: e.body,
        endpoint: e.endpoint,
      });
    } else {
      console.error(e);
    }
    return NextResponse.json(
      { message: "Error sending notification", error: e?.message ?? e },
      { status: 500 }
    );
  }
}

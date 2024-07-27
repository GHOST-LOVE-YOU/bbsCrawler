import prisma from "@lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { clientGetUser } from "@lib/user/server-utils";

// 配置VAPID details
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  "mailto:test@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: Request) {
  const user = await clientGetUser();
  if (!user) {
    return Response.json({ error: "User not found" });
  }
  const userId = user.id;

  const requestData = await request.json();
  const { endpoint, keys } = requestData;
  try {
    await prisma.subscription.create({
      data: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });
  return Response.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    Response.json({ error: "Subscription error" });
  }
}

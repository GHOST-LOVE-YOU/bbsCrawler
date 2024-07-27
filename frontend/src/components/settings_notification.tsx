"use client";

import React from "react";

const handleSubscribe = async () => {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register("/sw.js");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    console.log("Subscription:", JSON.stringify(subscription));

    const response = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Subscription response:", data);
  }
};

const handleUnsubscribe = async () => {
  const register = await navigator.serviceWorker.ready;
  const subscription = await register.pushManager.getSubscription();
  if (subscription) {
    const response = await fetch("/api/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await subscription.unsubscribe();
    const data = await response.json();
    console.log("Unsubscription response:", data);
  }
};

export default function SettingsNotification() {
  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubscribe}
      >
        订阅通知
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleUnsubscribe}
      >
        取消订阅
      </button>
    </div>
  );
}

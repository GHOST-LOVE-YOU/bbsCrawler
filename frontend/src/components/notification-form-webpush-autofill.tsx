import { TNotification } from "@lib/validations";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type WebPushAutoFillProps = {
  form: UseFormReturn<Partial<TNotification>>;
};

export function WebPushAutoFill({ form }: WebPushAutoFillProps) {
  const { setValue } = form;

  const handleAutoFill = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const register = await navigator.serviceWorker.register("/sw.js");
        let subscription = await register.pushManager.getSubscription();

        if (!subscription) {
          subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });
        }

        const { endpoint, keys } = subscription.toJSON();
        setValue("endpoint", endpoint || "");
        setValue("p256dh", keys?.p256dh ?? "");
        setValue("auth", keys?.auth ?? "");
      } catch (error) {
        console.error(
          "Error during service worker registration or subscription:",
          error
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <div className="col-span-3 col-start-2">
        <button
          type="button"
          onClick={handleAutoFill}
          className="mt-2 p-2 bg-green-500 text-white rounded"
        >
          Auto Fill Browser Push Data
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { UseFormReturn } from "react-hook-form";

import { NotificationType } from "@/lib/notifications/type";
import { TNotification } from "@/lib/validations";

type MethodFormSubmitButtonsProps = {
  actionType: NotificationType;
  form: UseFormReturn<Partial<TNotification>>;
};

export function MethodFormSubmitButtons({
  form,
}: MethodFormSubmitButtonsProps) {
  const { getValues } = form;

  const handleTestClick = async () => {
    const notificationData = getValues();
    console.log("Test Notification data:", notificationData);

    if ("endpoint" in notificationData) {
      try {
        const response = await fetch("/api/notifications/webpush/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: notificationData.endpoint,
            p256dh: notificationData.p256dh,
            auth: notificationData.auth,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("Error sending browser push notification:", error);
      }
    }
  };

  return (
    <>
      <button
        type="submit"
        className="mt-4 mr-2 rounded-sm bg-blue-500 p-2 text-white"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={handleTestClick}
        className="mt-4 rounded-sm bg-yellow-500 p-2 text-white"
      >
        Test
      </button>
    </>
  );
}

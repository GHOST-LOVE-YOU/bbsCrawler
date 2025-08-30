import { NotificationType } from "@/lib/notifications/type";
import { TNotification } from "@/lib/validations";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type MethodFormSubmitButtonsProps = {
  actionType: NotificationType;
  form: UseFormReturn<Partial<TNotification>>;
};

export function MethodFormSubmitButtons({ form }: MethodFormSubmitButtonsProps) {
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
        className="mt-4 p-2 bg-blue-500 text-white rounded-sm mr-2"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={handleTestClick}
        className="mt-4 p-2 bg-yellow-500 text-white rounded-sm"
      >
        Test
      </button>
    </>
  );
}

import React, { useState } from "react";
import { notificationSchema, TNotification } from "@lib/validations";
import { NotificationType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NotificationTypeSelect } from "./notification-form-type-select";
import { NotificationFields } from "./notification-form-fields";
import { WebPushAutoFill } from "./notification-form-webpush-autofill";
import { SubmitButtons } from "./notification-form-submit-buttons";

type NotificationFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function NotificationForm({
  actionType,
  onFormSubmission,
}: NotificationFormProps) {
  const [type, setType] = useState<NotificationType>("BROWSER_PUSH");

  const form = useForm<TNotification>({
    resolver: zodResolver(notificationSchema),
  });

  const handleSubmit = async (data: TNotification) => {
    if (type === "BROWSER_PUSH" && "endpoint" in data) {
      try {
        const response = await fetch("/api/notifications/webpush/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: data.endpoint,
            p256dh: data.p256dh,
            auth: data.auth,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("NotificationMethod created successfully:", result.data);
          onFormSubmission();
        } else {
          console.error("Error creating NotificationMethod:", result.error);
        }
      } catch (error) {
        console.error("Error creating NotificationMethod:", error);
      }
    } else {
      console.log("Notification data for other types:", data);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-4 py-4">
        <NotificationTypeSelect type={type} setType={setType} />
        <NotificationFields type={type} form={form} />
        <WebPushAutoFill form={form} />
      </div>
      <SubmitButtons form={form} />
    </form>
  );
}

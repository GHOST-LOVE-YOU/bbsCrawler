import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  notificationSchema,
  TNotification,
  typeFieldMap,
} from "@lib/validations";
import { NotificationType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type NotificationFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function NotificationForm({
  actionType,
  onFormSubmission,
}: NotificationFormProps) {
  const [type, setType] = useState<NotificationType>("BROWSER_PUSH");

  const {
    register,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TNotification>({
    resolver: zodResolver(notificationSchema),
  });

  const renderFields = (fields: string[]) => {
    return fields.map((field) => (
      <div key={field} className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={field} className="text-right">
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </Label>
        <Input
          id={field}
          placeholder={`Enter ${field}`}
          {...register(field as keyof TNotification)}
          className="col-span-3"
        />
        {errors[field as keyof TNotification] && (
          <p className="col-span-3 text-red-500">
            {(
              errors[field as keyof TNotification] as unknown as {
                message?: string;
              }
            )?.message || ""}
          </p>
        )}
      </div>
    ));
  };

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

  const handleTestClick = () => {
    const notificationData = getValues();
    console.log("Test Notification data:", notificationData);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await trigger();
        if (!result) return;

        onFormSubmission();

        const notificationData = getValues();
        console.log("Notification data:", notificationData);
      }}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            onValueChange={(value: NotificationType) => setType(value)}
            defaultValue="BROWSER_PUSH"
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BROWSER_PUSH">Browser Push</SelectItem>
              <SelectItem value="TELEGRAM">Telegram</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderFields(typeFieldMap[type])}
        {type === "BROWSER_PUSH" && (
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
        )}
      </div>
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded mr-2"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={handleTestClick}
        className="mt-4 p-2 bg-yellow-500 text-white rounded"
      >
        Test
      </button>
    </form>
  );
}

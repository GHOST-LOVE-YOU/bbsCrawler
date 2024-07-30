import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotificationType } from "@prisma/client";
import { TNotification, typeFieldMap } from "@lib/validations";

type NotificationFieldsProps = {
  type: NotificationType;
  form: UseFormReturn<TNotification>;
};

export function NotificationFields({ type, form }: NotificationFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {typeFieldMap[type].map((field) => (
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
      ))}
    </>
  );
}

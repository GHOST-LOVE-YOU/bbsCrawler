import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TNotification, typeFieldMap } from "@lib/validations";
import { NotificationType } from "@lib/notifications/type";

type NotificationFieldsProps = {
  actionType: NotificationType;
  form: UseFormReturn<Partial<TNotification>>;
};

export function NotificationFields({
  actionType,
  form,
}: NotificationFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <>
      {typeFieldMap[actionType].map((field) => {
        const isBoolean = field === "disable";
        return (
          <div key={field} className="mb-4 flex items-center">
            <Label htmlFor={field} className="w-1/4 mr-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <div className="w-3/4">
              {isBoolean ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    {...register(field as keyof TNotification)}
                    className="border-black"
                  />
                </div>
              ) : (
                <Input
                  id={field}
                  {...register(field as keyof TNotification)}
                  className="w-full border rounded-xl"
                />
              )}
              {errors[field as keyof TNotification] && (
                <p className="text-red-500 text-sm mt-1">
                  {(
                    errors[field as keyof TNotification] as unknown as {
                      message?: string;
                    }
                  )?.message || "This field is required"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

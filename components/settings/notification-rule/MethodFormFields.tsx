import React from "react";
import { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NotificationType } from "@/lib/notifications/type";
import { TNotification, typeFieldMap } from "@/lib/validations";

type MethodFormFieldsProps = {
  actionType: NotificationType;
  form: UseFormReturn<Partial<TNotification>>;
};

export function MethodFormFields({ actionType, form }: MethodFormFieldsProps) {
  return (
    <>
      {typeFieldMap[actionType].map((field) => {
        const isBoolean = field === "disable";
        return (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof TNotification}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                <FormLabel className="w-1/4 flex-none">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </FormLabel>
                <FormControl>
                  {isBoolean ? (
                    <Checkbox
                      checked={formField.value === true}
                      onCheckedChange={formField.onChange}
                      className="border-black"
                      value={formField.value ? "true" : "false"}
                    />
                  ) : (
                    <Input
                      className="grow border border-gray-400"
                      {...formField}
                      value={formField.value ? formField.value.toString() : ""}
                    />
                  )}
                </FormControl>
                <FormMessage className="flex-none" />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
}

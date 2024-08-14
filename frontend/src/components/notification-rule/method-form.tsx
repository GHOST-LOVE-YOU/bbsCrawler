"use client";

import React, { useState } from "react";
import {
  browserPushSchema,
  emailSchema,
  telegramSchema,
  TNotification,
} from "@lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NotificationType } from "@lib/notifications/type";
import {
  BrowserPushNotification,
  EmailNotification,
  TelegramNotification,
  useNotification,
} from "@contexts/notification-context-provider";
import { Form } from "../ui/form";
import { WebPushAutoFill } from "./webpush-autofill-button";
import { SubmitButtons } from "./method-form-submit-buttons";
import { MethodFormFields } from "./method-form-fields";

type MethodFormProps = {
  actionType: NotificationType;
  onFormSubmission: () => void;
};

export default function MethodForm({
  actionType,
  onFormSubmission,
}: MethodFormProps) {
  const {
    emailNotification,
    telegramNotification,
    browserPushNotification,
    updateEmailNotification,
    updateTelegramNotification,
    updateBrowserPushNotification,
  } = useNotification();
  let defaultValues: Partial<TNotification> = {};
  let resolver: any;
  switch (actionType) {
    case "email":
      defaultValues = emailNotification || { disable: true };
      resolver = zodResolver(emailSchema);
      break;
    case "telegram":
      defaultValues = telegramNotification || { disable: true };
      resolver = zodResolver(telegramSchema);
      break;
    case "webpush":
      defaultValues = browserPushNotification || { disable: true };
      resolver = zodResolver(browserPushSchema);
      break;
  }
  const form = useForm({
    resolver: resolver,
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: Partial<TNotification>) => {
    switch (actionType) {
      case "email":
        await updateEmailNotification(data as Partial<EmailNotification>);
        break;
      case "telegram":
        await updateTelegramNotification(data as Partial<TelegramNotification>);
        break;
      case "webpush":
        await updateBrowserPushNotification(
          data as Partial<BrowserPushNotification>
        );
        break;
    }
    onFormSubmission();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <MethodFormFields actionType={actionType} form={form} />
        {actionType === "webpush" && <WebPushAutoFill form={form} />}
        <SubmitButtons actionType={actionType} form={form} />
      </form>
    </Form>
  );
}

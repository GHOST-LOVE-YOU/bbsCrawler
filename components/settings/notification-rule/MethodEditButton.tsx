// component/notification-button.tsx
"use client";

import React, { useState } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NotificationType } from "@/lib/notifications/type";

import NotificationForm from "./MethodForm";

type NofiticationButtonProps = {
  actionType: NotificationType;
};

const dialogTitle = {
  webpush: "浏览器通知",
  email: "邮箱通知",
  telegram: "Telegram 通知",
};

const getDescription = (actionType: NotificationType) => {
  switch (actionType) {
    case "webpush":
      return "通过浏览器推送通知";
    case "email":
      return "通过邮件发送通知";
    case "telegram":
      return "通过 Telegram Bot 发送通知";
    default:
      return "选择一种通知类型";
  }
};

export default function MethodEditButton({
  actionType,
}: NofiticationButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button variant="link">编辑</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle[actionType]}</DialogTitle>
          <DialogDescription>{getDescription(actionType)}</DialogDescription>
        </DialogHeader>
        <NotificationForm
          actionType={actionType}
          onFormSubmission={() => {
            flushSync(() => {
              setIsFormOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

// component/notification-button.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import NotificationForm from "./nofitication-form";
import { flushSync } from "react-dom";
import { NotificationType } from "@lib/notifications/type";

type NofiticationButtonProps = {
  actionType: NotificationType;
};

const dialogTitle = {
  webpush: "浏览器通知",
  email: "邮箱通知",
  telegram: "Telegram 通知",
};

export default function NofiticationButton({
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

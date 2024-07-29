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

type NofiticationButtonProps = {
  actionType: "add" | "edit";
};

export default function NofiticationButton({
  actionType,
}: NofiticationButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button className="rounded-3xl w-80">增加通知</Button>
        ) : (
          <Button variant="secondary" />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "添加通知" : "编辑通知"}
          </DialogTitle>
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

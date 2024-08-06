"use client";

import React from "react";
import NofiticationButton from "./notification-button";
import { NotificationType } from "@lib/notifications/type";
import { Badge } from "./ui/badge";
import { useNotification } from "@contexts/notification-context-provider";

const notificationMethods = [
  {
    type: "webpush",
    icon: "icon-[gravity-ui--bell]",
    label: "浏览器推送",
  },
  { type: "email", icon: "icon-[carbon--email]", label: "邮件" },
  { type: "telegram", icon: "icon-[hugeicons--telegram]", label: "Telegram" },
];

export default function NotificationMethodsList() {
  const { disabledNotificationMethods } = useNotification();
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-3">通知方式</h2>
      {notificationMethods.map((method) => {
        const isEnabled =
          !disabledNotificationMethods[
            method.type as keyof typeof disabledNotificationMethods
          ];
        return (
          <div
            key={method.type}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className={`${method.icon} h-5 w-5 text-gray-600`}></span>
              <span className="text-gray-950">{method.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`${
                  isEnabled
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                } px-3 py-1 text-sm font-medium`}
              >
                {isEnabled ? "已启用" : "未启用"}
              </Badge>

              <NofiticationButton
                actionType={method.type as NotificationType}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

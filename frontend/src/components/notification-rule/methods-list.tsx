"use client";

import React from "react";
import { NotificationType } from "@lib/notifications/type";
import { Badge } from "../ui/badge";
import { useNotification } from "@contexts/notification-context-provider";
import MethodEditButton from "./method-edit-button";

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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        通知方式
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        {notificationMethods.map((method, index) => {
          const isEnabled =
            !disabledNotificationMethods[
              method.type as keyof typeof disabledNotificationMethods
            ];
          return (
            <div
              key={method.type}
              className={`flex items-center justify-between p-4 ${
                index !== notificationMethods.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`${method.icon} h-5 w-5 text-gray-600 dark:text-gray-400`}
                ></span>
                <span className="text-gray-800 dark:text-gray-200">
                  {method.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`${
                    isEnabled
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
                      : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  } px-2 py-0.5 text-xs font-medium`}
                >
                  {isEnabled ? "已启用" : "未启用"}
                </Badge>
                <MethodEditButton
                  actionType={method.type as NotificationType}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

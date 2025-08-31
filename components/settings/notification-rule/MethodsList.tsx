"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { NotificationType } from "@/lib/notifications/type";
import { useNotificationMethod } from "@/providers/NotificationMethodProvider";

import MethodEditButton from "./MethodEditButton";

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
  const { disabledNotificationMethods } = useNotificationMethod();
  return (
    <div className="space-y-4">
      <h2
        className={`
          mb-3 text-lg font-semibold text-stone-900
          dark:text-stone-100
        `}
      >
        通知方式
      </h2>
      <div
        className={`
          overflow-hidden rounded-lg border border-gray-300
          dark:border-gray-700
        `}
      >
        {notificationMethods.map((method, index) => {
          const isEnabled =
            !disabledNotificationMethods[
              method.type as keyof typeof disabledNotificationMethods
            ];
          return (
            <div
              key={method.type}
              className={`
                flex items-center justify-between p-4
                ${
                  index !== notificationMethods.length - 1
                    ? `
                      border-b border-gray-300
                      dark:border-gray-700
                    `
                    : ""
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`
                    ${method.icon}
                    h-5 w-5 text-stone-600
                    dark:text-stone-400
                  `}
                ></span>
                <span
                  className={`
                    text-stone-800
                    dark:text-stone-200
                  `}
                >
                  {method.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`
                    ${
                      isEnabled
                        ? `
                          border-green-200 bg-green-50 text-green-700
                          dark:border-green-700 dark:bg-green-900 dark:text-green-100
                        `
                        : `
                          border-gray-200 bg-gray-50 text-gray-600
                          dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300
                        `
                    }
                    px-2 py-0.5 text-xs font-medium
                  `}
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

import React from "react";
import NofiticationButton from "./nofitication-button";
import { NotificationType } from "@lib/notifications/type";

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
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-3">通知方式</h2>
      {notificationMethods.map((method) => (
        <div
          key={method.type}
          className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <span className={`${method.icon} h-5 w-5 text-gray-600`}></span>
            <span className="text-gray-950">{method.label}</span>
          </div>
          <NofiticationButton actionType={method.type as NotificationType} />
        </div>
      ))}
    </div>
  );
}

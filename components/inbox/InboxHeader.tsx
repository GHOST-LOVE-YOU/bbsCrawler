"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const InboxHeader = () => {
  const pathname = usePathname();

  const isAtMe = pathname === "/inbox/comment";
  const isReplyTopic = pathname === "/inbox/post";

  const handleReadAll = async () => {
    const response = await fetch(
      `/api/message/readall?messagesType=${
        isAtMe ? "WATCHED_COMMENT_NEW_QUOTED" : "WATCHED_POST_NEW_COMMENT"
      }`
    );
    if (response.ok) {
      location.reload();
    }
  };

  return (
    <div className="flex items-center justify-between rounded-t-xl bg-gray-600">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Link
            href="/inbox/comment"
            className={`
              rounded-ss-xl px-2 py-1
              ${isAtMe ? "bg-green-500 text-white" : "text-green-500"}
            `}
          >
            @我
          </Link>
          <Link
            href="/inbox/post"
            className={`
              px-2 py-1
              ${isReplyTopic ? "bg-green-500 text-white" : "text-green-500"}
            `}
          >
            回复主题
          </Link>
        </div>
      </div>
      <span
        onClick={handleReadAll}
        className={`
          pr-2 text-green-500
          hover:cursor-pointer
        `}
      >
        全部标为已读
      </span>
    </div>
  );
};

export default InboxHeader;

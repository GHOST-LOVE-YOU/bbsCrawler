"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    <div className="flex justify-between items-center bg-gray-600 rounded-t-xl">
      <div className="flex items-center space-x-2 ">
        <div className="flex items-center space-x-2">
          <Link
            href="/inbox/comment"
            className={`px-2 py-1 rounded-ss-xl ${
              isAtMe ? "bg-green-500 text-white" : "text-green-500"
            }`}
          >
            @我
          </Link>
          <Link
            href="/inbox/post"
            className={`px-2 py-1 ${
              isReplyTopic ? "bg-green-500 text-white" : "text-green-500"
            }`}
          >
            回复主题
          </Link>
        </div>
      </div>
      <span
        onClick={handleReadAll}
        className="text-green-500 pr-2 hover:cursor-pointer"
      >
        全部标为已读
      </span>
    </div>
  );
};

export default InboxHeader;

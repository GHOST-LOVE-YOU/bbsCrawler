"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@contexts/notification-rule-context-provider";
import Link from "next/link";

export default function NotifyPostList() {
  const { notifyPostList, unclaim } = useNotificationRule();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        关注的帖子
      </h2>
      {notifyPostList.length > 0 ? (
        notifyPostList.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 dark:text-gray-200 text-base font-medium">
                <Link
                  href={`/post/${post.targetId}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </h3>
              <Button
                variant="destructive"
                size="sm"
                className="ml-4 shrink-0"
                onClick={() => unclaim(post.id, "POST")}
              >
                取消认领
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          --空--
        </div>
      )}
    </div>
  );
}

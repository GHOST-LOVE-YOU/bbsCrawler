"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useNotificationRule } from "@contexts/notification-rule-context-provider";
import Link from "next/link";

export default function DontNotifyPostList() {
  const { dontNotifyPostList, unclaim } = useNotificationRule();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">不会通知的帖子</h2>
      {dontNotifyPostList.length > 0 ? (
        dontNotifyPostList.map((post) => (
          <div key={post.id} className="bg-background-light dark:bg-background-dark rounded-lg p-4 hover:shadow-md transition-shadow duration-200 border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 dark:text-gray-200 text-base font-medium">
                <Link href={`/post/${post.targetId}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <Button
                variant="destructive"
                size="sm"
                className="ml-4 shrink-0"
                onClick={() => unclaim(post.id, "DONT_NOTIFY_POST")}
              >
                取消屏蔽
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-background-light dark:bg-background-dark rounded-lg border border-gray-300 dark:border-gray-700">
          --空--
        </div>
      )}
    </div>
  );
}
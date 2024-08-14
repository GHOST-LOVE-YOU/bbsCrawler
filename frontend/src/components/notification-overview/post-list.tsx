"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNotificationOverview } from "@contexts/notification-overview-context-provider";
import { NotificationTargetType } from "@prisma/client";

export default function NotifyPostOverview() {
  const { notifyPostOverview, onDontNotify } = useNotificationOverview();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        相关联的帖子
      </h2>
      {notifyPostOverview.length > 0 ? (
        notifyPostOverview.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 dark:text-gray-200 text-base font-medium">
                <Link href={`/post/${post.id}`} className="hover:underline">
                  {post.topic}
                </Link>
              </h3>
              <Button
                variant="destructive"
                size="sm"
                className="ml-4 shrink-0"
                onClick={() => onDontNotify(post.id, "POST")}
              >
                屏蔽
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
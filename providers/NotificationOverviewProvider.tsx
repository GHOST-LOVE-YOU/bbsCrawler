"use client";

import { NotificationTargetType } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { dontNotify } from "@/lib/actions";

type NotificationOverviewContextType = {
  notifyPostOverview: notifyPostOverView[];
  notifyCommentOverview: notifyComment[];
  onDontNotify: (id: string, type: NotificationTargetType) => void;
};

const NotificationOverviewContext = createContext<
  NotificationOverviewContextType | undefined
>(undefined);

export const useNotificationOverview = () => {
  const context = useContext(NotificationOverviewContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

type NotificationOverviewProviderProps = {
  children: React.ReactNode;
  initialNotifyPostOverview: notifyPostOverView[];
  initialNotifyCommentOverview: notifyComment[];
};

export const NotificationOverviewProvider: React.FC<
  NotificationOverviewProviderProps
> = ({ children, initialNotifyPostOverview, initialNotifyCommentOverview }) => {
  const { toast } = useToast();
  const [notifyPostOverview, setNotifyPostOverview] = useState<
    notifyPostOverView[]
  >(initialNotifyPostOverview);
  const [notifyCommentOverview, setNotifyCommentOverview] = useState<
    notifyComment[]
  >(initialNotifyCommentOverview);

  const onDontNotify = async (id: string, type: NotificationTargetType) => {
    switch (type) {
      case "POST":
        setNotifyPostOverview((prev) => prev.filter((post) => post.id !== id));
        break;
      case "COMMENT":
        setNotifyCommentOverview((prev) =>
          prev.filter((comment) => comment.id !== id)
        );
        break;
    }
    const response = await dontNotify(id, type);
    if (!response.success) {
      toast({
        variant: "destructive",
        description: response.message,
      });
    } else {
      toast({
        variant: "default",
        description: "屏蔽成功",
      });
    }
  };
  return (
    <NotificationOverviewContext.Provider
      value={{
        notifyPostOverview,
        notifyCommentOverview,
        onDontNotify,
      }}
    >
      {children}
    </NotificationOverviewContext.Provider>
  );
};

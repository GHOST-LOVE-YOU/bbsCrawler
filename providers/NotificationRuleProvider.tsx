"use client";

import React, { createContext, useContext, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { deletebindingBot, deleteNotificationRule } from "@/lib/actions";
import { BindingsBot } from "@/lib/bindings/type";
import { unclaimType } from "@/lib/notificationRule/type";

type NotificationRuleContextType = {
  bindingsBotList: BindingsBot[];
  notifyPostList: notifyPost[];
  notifyCommentList: notifyComment[];
  dontNotifyPostList: notifyPost[];
  dontNotifyCommentList: notifyComment[];
  unBindingBot: (id: string) => void;
  unclaim: (id: string, type: unclaimType) => void;
};

const NotificationRuleContext = createContext<
  NotificationRuleContextType | undefined
>(undefined);

export const useNotificationRule = () => {
  const context = useContext(NotificationRuleContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

type NotificationRuleProviderProps = {
  children: React.ReactNode;
  initialBindingsBotList: BindingsBot[];
  initialNotifyPostList: notifyPost[];
  initialNotifyCommentList: notifyComment[];
  initialDontNotifyPostList: notifyPost[];
  initialDontNotifyCommentList: notifyComment[];
};

export const NotificationRuleProvider: React.FC<
  NotificationRuleProviderProps
> = ({
  children,
  initialBindingsBotList,
  initialNotifyPostList,
  initialNotifyCommentList,
  initialDontNotifyPostList,
  initialDontNotifyCommentList,
}) => {
  const { toast } = useToast();
  const [bindingsBotList, setBindingsBotList] = useState<BindingsBot[]>(
    initialBindingsBotList
  );
  const [notifyPostList, setNotifyPostList] = useState<notifyPost[]>(
    initialNotifyPostList
  );
  const [notifyCommentList, setNotifyCommentList] = useState<notifyComment[]>(
    initialNotifyCommentList
  );
  const [dontNotifyPostList, setDontNotifyPostList] = useState<notifyPost[]>(
    initialDontNotifyPostList
  );
  const [dontNotifyCommentList, setDontNotifyCommentList] = useState<
    notifyComment[]
  >(initialDontNotifyCommentList);

  const unBindingBot = async (id: string) => {
    try {
      setBindingsBotList((prevBindingsBotList) =>
        prevBindingsBotList.filter((bot) => bot.id !== id)
      );
      const response = await deletebindingBot(id);
      if (!response.success) {
        toast({
          variant: "destructive",
          description: response.message,
        });
      } else {
        toast({
          variant: "default",
          description: "删除成功",
        });
      }
    } catch (error) {
      console.error("Error deleting binding bot:", error);
    }
  };

  const unclaim = async (id: string, type: unclaimType) => {
    try {
      switch (type) {
        case "POST":
          setNotifyPostList((prevNotifyPostList) =>
            prevNotifyPostList.filter((post) => post.id !== id)
          );
          break;
        case "COMMENT":
          setNotifyCommentList((prevNotifyCommentList) =>
            prevNotifyCommentList.filter((comment) => comment.id !== id)
          );
          break;
        case "DONT_NOTIFY_POST":
          setDontNotifyPostList((prevDontNotifyPostList) =>
            prevDontNotifyPostList.filter((post) => post.id !== id)
          );
          break;
        case "DONT_NOTIFY_COMMENT":
          setDontNotifyCommentList((prevDontNotifyCommentList) =>
            prevDontNotifyCommentList.filter((comment) => comment.id !== id)
          );
          break;
      }
      const response = await deleteNotificationRule(id);
      if (!response.success) {
        toast({
          variant: "destructive",
          description: response.message,
        });
      } else {
        toast({
          variant: "default",
          description: "删除成功",
        });
      }
    } catch (error) {
      console.error("Error deleting notify post:", error);
    }
  };

  return (
    <NotificationRuleContext.Provider
      value={{
        bindingsBotList,
        notifyPostList,
        notifyCommentList,
        dontNotifyPostList,
        dontNotifyCommentList,
        unBindingBot,
        unclaim,
      }}
    >
      {children}
    </NotificationRuleContext.Provider>
  );
};

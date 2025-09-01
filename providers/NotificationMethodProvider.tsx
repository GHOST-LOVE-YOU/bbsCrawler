"use client";

import React, { createContext, use, useContext, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { addNotification } from "@/lib/actions";

export type EmailNotification = {
  disable: boolean;
  email: string;
};

export type TelegramNotification = {
  disable: boolean;
  chatId: string;
};

export type BrowserPushNotification = {
  disable: boolean;
  endpoint: string;
  p256dh: string;
  auth: string;
};

type NotificationContextType = {
  emailNotification: EmailNotification | null;
  telegramNotification: TelegramNotification | null;
  browserPushNotification: BrowserPushNotification | null;
  disabledNotificationMethods: {
    email: boolean;
    telegram: boolean;
    webpush: boolean;
  };
  updateEmailNotification: (newState: Partial<EmailNotification>) => void;
  updateTelegramNotification: (newState: Partial<TelegramNotification>) => void;
  updateBrowserPushNotification: (
    newState: Partial<BrowserPushNotification>
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotificationMethod = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationMethod must be used within a NotificationMethodProvider"
    );
  }
  return context;
};

type NotificationMethodProviderProps = {
  children: React.ReactNode;
  initialEmailNotification: EmailNotification | null;
  initialTelegramNotification: TelegramNotification | null;
  initialBrowserPushNotification: BrowserPushNotification | null;
};

export const NotificationMethodProvider: React.FC<
  NotificationMethodProviderProps
> = ({
  children,
  initialEmailNotification,
  initialTelegramNotification,
  initialBrowserPushNotification,
}) => {
  const { toast } = useToast();
  const [emailNotification, setEmailNotification] =
    useState<EmailNotification | null>(initialEmailNotification);
  const [telegramNotification, setTelegramNotification] =
    useState<TelegramNotification | null>(initialTelegramNotification);
  const [browserPushNotification, setBrowserPushNotification] =
    useState<BrowserPushNotification | null>(initialBrowserPushNotification);

  const updateEmailNotification = async (
    newState: Partial<EmailNotification>
  ) => {
    setEmailNotification(
      (prevState) =>
        ({
          ...prevState,
          ...newState,
        }) as EmailNotification
    );

    // TODO: Update the email notification state on your backend
  };

  const updateTelegramNotification = async (
    newState: Partial<TelegramNotification>
  ) => {
    setTelegramNotification(
      (prevState) =>
        ({
          ...prevState,
          ...newState,
        }) as TelegramNotification
    );

    // TODO: Update the Telegram notification state on your backend
  };

  const updateBrowserPushNotification = async (
    newState: Partial<BrowserPushNotification>
  ) => {
    setBrowserPushNotification(
      (prevState) =>
        ({
          ...prevState,
          ...newState,
        }) as BrowserPushNotification
    );

    const error = await addNotification(newState);
    if (!error.success) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } else {
      toast({
        variant: "default",
        description: error.message,
      });
    }
  };

  const disabledNotificationMethods = {
    email: emailNotification?.disable ?? true,
    telegram: telegramNotification?.disable ?? true,
    webpush: browserPushNotification?.disable ?? true,
  };

  return (
    <NotificationContext.Provider
      value={{
        emailNotification,
        telegramNotification,
        browserPushNotification,
        disabledNotificationMethods,
        updateEmailNotification,
        updateTelegramNotification,
        updateBrowserPushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

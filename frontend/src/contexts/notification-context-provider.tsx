"use client";

import React, { createContext, useContext, useState } from "react";

export type EmailNotification = {
  disabled: boolean;
  email: string;
};

export type TelegramNotification = {
  disabled: boolean;
  chatId: string;
};

export type BrowserPushNotification = {
  disabled: boolean;
  endpoint: string;
  p256dh: string;
  auth: string;
};

type NotificationContextType = {
  emailNotification: EmailNotification | null;
  telegramNotification: TelegramNotification | null;
  browserPushNotification: BrowserPushNotification | null;
  updateEmailNotification: (newState: Partial<EmailNotification>) => void;
  updateTelegramNotification: (newState: Partial<TelegramNotification>) => void;
  updateBrowserPushNotification: (
    newState: Partial<BrowserPushNotification>
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

type NotificationProviderProps = {
  children: React.ReactNode;
  initialEmailNotification: EmailNotification | null;
  initialTelegramNotification: TelegramNotification | null;
  initialBrowserPushNotification: BrowserPushNotification | null;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  initialEmailNotification,
  initialTelegramNotification,
  initialBrowserPushNotification,
}) => {
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
        } as EmailNotification)
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
        } as TelegramNotification)
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
        } as BrowserPushNotification)
    );

    // TODO: Update the browser push notification state on your backend
  };

  return (
    <NotificationContext.Provider
      value={{
        emailNotification,
        telegramNotification,
        browserPushNotification,
        updateEmailNotification,
        updateTelegramNotification,
        updateBrowserPushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

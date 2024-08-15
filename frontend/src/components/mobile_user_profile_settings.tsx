"use client";

import React from "react";
import { ClientSheetWrapper } from "./client-sheet-wrapper";
import UserProfileSettings from "./user_profile_settings";
import { Button } from "@/components/ui/button";

const MobileUserProfileSettings = () => {
  return (
    <ClientSheetWrapper
      trigger={
        <Button
          variant="outline"
          className="p-2 bg-background-light dark:bg-background-dark bg-opacity-50 dark:bg-opacity-50 hover:bg-opacity-75 dark:hover:bg-opacity-75 transition-colors duration-200 rounded-r-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Button>
      }
    >
      <UserProfileSettings />
    </ClientSheetWrapper>
  );
};

export default MobileUserProfileSettings;
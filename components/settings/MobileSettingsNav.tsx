"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import SettingsNav from "./SettingsNav";
import { ClientSheetWrapper } from "../header/ClientSheetWrapper";

const MobileUserProfileSettings = () => {
  return (
    <ClientSheetWrapper
      trigger={
        <Button
          variant="outline"
          className={`
            bg-background-light bg-opacity-50 rounded-r-md p-2 transition-colors duration-200
            dark:bg-background-dark dark:bg-opacity-50
            hover:bg-opacity-75
            dark:hover:bg-opacity-75
          `}
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
            className="h-6 w-6"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Button>
      }
    >
      <SettingsNav />
    </ClientSheetWrapper>
  );
};

export default MobileUserProfileSettings;

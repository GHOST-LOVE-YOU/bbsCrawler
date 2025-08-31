import { Suspense } from "react";

import MobileSettingsNav from "@/components/settings/MobileSettingsNav";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNav from "@/components/settings/SettingsNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`
        flex flex-col p-1
        md:flex-row
      `}
    >
      <div
        className={`
          w-full p-2 shadow-md
          md:rounded-lg md:p-6
        `}
      >
        <SettingsHeader />
        <div className="md:flex">
          <div
            className={`
              hidden
              md:block md:w-1/4 md:pr-4
            `}
          >
            <SettingsNav />
          </div>
          <div className="md:w-3/4">{children}</div>
        </div>
      </div>
      <div
        className={`
          fixed top-1/2 left-0 z-50 -translate-y-1/2 transform
          md:hidden
        `}
      >
        <MobileSettingsNav />
      </div>
    </div>
  );
}

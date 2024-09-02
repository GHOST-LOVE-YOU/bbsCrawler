import MobileSettingsNav from "@/components/settings/MobileSettingsNav";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNav from "@/components/settings/SettingsNav";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col md:flex-row p-1">
        <div className="md:rounded-lg shadow-md p-2 md:p-6 w-full">
          <SettingsHeader />
          <div className="md:flex">
            <div className="hidden md:block md:w-1/4 md:pr-4">
              <SettingsNav />
            </div>
            <div className="md:w-3/4">{children}</div>
          </div>
        </div>
        <div className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
          <MobileSettingsNav />
        </div>
      </div>
  );
}

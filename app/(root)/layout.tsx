import { Suspense } from "react";

import SideBar, { SideBarLoading } from "@/components/header/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`
        flex flex-col
        md:flex-row md:p-1
      `}
    >
      <div
        className={`
          w-full flex-1
          md:w-auto
        `}
      >
        {children}
      </div>
      <div
        className={`
          hidden
          md:block
        `}
      >
        <Suspense fallback={<SideBarLoading />}>
          <SideBar />
        </Suspense>
      </div>
    </div>
  );
}

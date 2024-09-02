import SideBar, { SideBarLoading } from "@/components/header/SideBar";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row p-1">
      <div className="flex-1 w-full md:w-auto">{children}</div>
      <div className="hidden md:block">
        <Suspense fallback={<SideBarLoading />}>
          <SideBar />
        </Suspense>
      </div>
    </div>
  );
}

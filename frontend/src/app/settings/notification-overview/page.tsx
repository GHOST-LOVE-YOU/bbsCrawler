import { ScrollArea } from "@components/ui/scroll-area";
import React from "react";

export default function notificationOverviewPage() {
  return (
    <ScrollArea className="h-[520px]">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">通知预览</h1>
        <div className="mb-6 space-y-4"></div>
      </div>
    </ScrollArea>
  );
}

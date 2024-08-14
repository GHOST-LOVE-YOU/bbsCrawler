import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InboxHeaderLoading } from "../comment/loading";
import { InboxContentLoading } from "../comment/loading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-gray-700 text-white">
        <CardContent className="p-0">
          <InboxHeaderLoading />
          <InboxContentLoading />
        </CardContent>
      </Card>
    </div>
  );
}

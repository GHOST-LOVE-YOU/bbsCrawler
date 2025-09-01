import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { InboxHeaderLoading, InboxContentLoading } from "../comment/loading";

export default function Loading() {
  return (
    <Card
      className={`
        w-full bg-slate-50
        dark:bg-slate-900
      `}
    >
      <CardContent className="p-0">
        <InboxHeaderLoading />
        <InboxContentLoading />
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationType } from "@lib/notifications/type";

type NotificationTypeSelectProps = {
  type: NotificationType;
  setType: (type: NotificationType) => void;
};

export function NotificationTypeSelect({ type, setType }: NotificationTypeSelectProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="type" className="text-right">
        Type
      </Label>
      <Select onValueChange={(value: NotificationType) => setType(value)} defaultValue={type}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BROWSER_PUSH">Browser Push</SelectItem>
          <SelectItem value="TELEGRAM">Telegram</SelectItem>
          <SelectItem value="EMAIL">Email</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
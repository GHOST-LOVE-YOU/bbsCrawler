"use client";

import { NotificationAction, NotificationTargetType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationRuleButtonProps = {
  targetType: NotificationTargetType;
  targetId: string;
  action: NotificationAction;
};

export default function NotificationRuleButton({
  targetType,
  targetId,
  action,
}: NotificationRuleButtonProps) {
  const [isBound, setIsBound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBindingStatus = async () => {
      try {
        const response = await fetch(
          `/api/notifications/rule/check?targetId=${targetId}&targetType=${targetType}`
        );
        if (!response.ok) {
          throw new Error("Failed to check binding status");
        }
        const data = await response.json();
        setIsBound(data.isBound);
      } catch (error) {
        console.error("Error checking binding status:", error);
      }
    };
    checkBindingStatus();
  }, [targetType, targetId]);

  const toggleNotificationRule = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notifications/rule`, {
        method: isBound ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetId, action, targetType }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification rule");
      }
      setIsBound(!isBound);
    } catch (error) {
      console.error("Error updating notification rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (action !== "NOTIFY") {
    return null;
  }

  return (
    <>
      {action === "NOTIFY" && (
        <Button
          onClick={toggleNotificationRule}
          disabled={isLoading}
          variant={isBound ? "default" : "outline"}
          size="sm"
          className={cn(
            "text-text-light dark:text-text-dark",
            "hover:text-primary dark:hover:text-primary-dark",
            "bg-background-light dark:bg-background-dark",
            "border border-gray-300 dark:border-gray-700",
            "transition-colors duration-200",
            {
              "bg-primary dark:bg-primary-dark text-white": isBound,
            }
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBound ? (
            <>
              <Bell className="mr-2 h-4 w-4" />
              已认领
            </>
          ) : (
            <>
              <BellOff className="mr-2 h-4 w-4" />
              认领
            </>
          )}
        </Button>
      )}
    </>
  );
}

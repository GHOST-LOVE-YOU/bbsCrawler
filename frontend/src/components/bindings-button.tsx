"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BindingsButtonProps {
  botUserId: string;
}

const BindingsButton: React.FC<BindingsButtonProps> = ({ botUserId }) => {
  const [isBound, setIsBound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBindingStatus = async () => {
      try {
        const response = await fetch(`/api/bindings/check?botId=${botUserId}`);
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
  }, [botUserId]);

  const handleBindingToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bindings", {
        method: isBound ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ botId: botUserId }),
      });

      if (response.ok) {
        setIsBound(!isBound);
      } else {
        console.error("Failed to update binding");
      }
    } catch (error) {
      console.error("Error updating binding:", error);
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleBindingToggle} disabled={isLoading}>
      {isLoading ? "处理中..." : isBound ? "取消绑定" : "绑定"}
    </Button>
  );
};

export default BindingsButton;

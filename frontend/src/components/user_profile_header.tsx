// components/user_profile_gheader.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Cog } from "lucide-react";

type UserProfileHeaderProps = {
  avatarUrl: string;
  userName: string;
};

export default async function UserProfileHeader({
  avatarUrl,
  userName,
}: UserProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-2 mb-4 max-w-4xl mx-auto bg-background-light dark:bg-background-dark">
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback>NC</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          {userName}
          <Cog className="w-5 h-5 ml-2" />
        </h1>
      </div>
    </div>
  );
}

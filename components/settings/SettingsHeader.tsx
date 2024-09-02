import React from "react";
import { clientGetUser, getAvatarUrl } from "@/lib/user/server-utils";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function SettingsHeader() {
  const { getUser } = getKindeServerSession();
  const user = await clientGetUser()
  const kindeUser = await getUser()
  const avatarUrl = user && user.avatar ? getAvatarUrl(user.avatar) : '/default-avatar.png';

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Image
        src={avatarUrl}
        alt="User Avatar"
        width={64}
        height={64}
        className="rounded-full"
      />
      <div>
        <h1 className="text-2xl font-bold">{user ? user.name : 'User'}</h1>
        <p className="text-gray-500">{kindeUser ? kindeUser.email : 'Loading...'}</p>
      </div>
    </div>
  );
}

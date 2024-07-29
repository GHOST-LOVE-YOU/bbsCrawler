import UserProfileHeader from "@components/user_profile_header";
import UserProfileSettings from "@components/user_profile_settings";
import { clientGetUser, getAvatarUrl } from "@lib/user/server-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BYR IWhisper",
  description: "BYR IWhisper",
};

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await clientGetUser();
  if (!user) {
    return (
      <div className="bg-zinc-400 bg-opacity-45 flex items-center justify-center max-w-4xl h-96 mx-auto rounded-md my-4">
        请先登录
      </div>
    );
  }
  const avatarUrl = user.avatar ? user.avatar : await getAvatarUrl(user.id);
  return (
    <div className="p-4">
      <UserProfileHeader avatarUrl={avatarUrl} userName={user.name} />
      <UserProfileSettings>{children}</UserProfileSettings>
    </div>
  );
}

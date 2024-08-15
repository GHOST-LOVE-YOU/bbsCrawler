import MobileUserProfileSettings from "@components/mobile_user_profile_settings";
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
    <div className="max-w-4xl mx-auto md:p-6 relative">
      <div className="bg-background-light dark:bg-gray-800 md:rounded-lg shadow-md p-2 md:p-6">
        <UserProfileHeader avatarUrl={avatarUrl} userName={user.name} />
        <div className="md:flex">
          <div className="hidden md:block md:w-1/4 md:pr-4">
            <UserProfileSettings />
          </div>
          <div className="md:w-3/4">{children}</div>
        </div>
      </div>
      <div className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
        <MobileUserProfileSettings />
      </div>
    </div>
  );
}
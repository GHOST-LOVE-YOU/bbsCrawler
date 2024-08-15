import prisma from "@lib/db";
import { clientGetUser, getAvatarUrl } from "@lib/user/server-utils";

export async function userGetBindingsBotList() {
  const user = await clientGetUser();
  if (!user) {
    return [];
  }

  try {
    const userWithBindings = await prisma.userBinding.findMany({
      where: { userId: user.id },
      select: { botId: true },
    });

    const botIds = userWithBindings.map((binding) => binding.botId);

    const bots = await prisma.user.findMany({
      where: {
        id: { in: botIds },
        tag: { has: "bot" },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        avatar: true,
      },
    });

    const botsWithAvatar = bots.map((bot) => ({
      id: bot.id,
      name: bot.name,
      createdAt: bot.createdAt,
      avatarUrl: bot.avatar ? bot.avatar : getAvatarUrl(bot.id),
    }));

    return botsWithAvatar;
  } catch (error) {
    console.error("Error fetching user's binding bots:", error);
    throw new Error("Failed to fetch binding bots");
  }
}

// 清理所有绑定机器人
export async function cleanAllBindings() {
  await prisma.userBinding.deleteMany();
}

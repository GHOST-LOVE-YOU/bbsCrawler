// 处理本地存储的帖子文件 cron: 0 */10 * * * *
import { NextResponse } from "next/server";

import { crawlAndStoreIWhisperFromLocal } from "@/lib/crawlee/iwhisper";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  logger.info("开始处理本地iWhisper帖子文件");
  try {
    await crawlAndStoreIWhisperFromLocal();
    return NextResponse.json({ message: "处理本地iWhisper帖子文件成功" });
  } catch (error) {
    logger.error("处理本地iWhisper帖子文件失败: " + String(error));
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "处理本地iWhisper帖子文件失败" },
        { status: 500 }
      );
    }
  }
}
// 每5分钟执行一次 cron: 0 */5 * * * *
import { NextResponse } from "next/server";

import { crawlAndStoreIWhisperFromWeb } from "@/lib/crawlee/iwhisper";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  logger.info("开始从网络采集iWhisper帖子");
  try {
    await crawlAndStoreIWhisperFromWeb();
    return NextResponse.json({ message: "从网络采集iWhisper帖子成功" });
  } catch (error) {
    logger.error("从网络采集iWhisper帖子失败: " + String(error));
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "从网络采集iWhisper帖子失败" },
        { status: 500 }
      );
    }
  }
}

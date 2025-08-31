// 每5分钟执行一次 cron: 0 */5 * * * *
import { NextResponse } from "next/server";

import { crawlAndStoreIWhisper } from "@/lib/crawlee/iwhisper";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  logger.info("开始采集iWhisper帖子");
  try {
    await crawlAndStoreIWhisper();
    return NextResponse.json({ message: "采集iWhisper帖子成功" });
  } catch (error) {
    logger.error("采集iWhisper帖子失败:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "采集iWhisper帖子失败" },
        { status: 500 }
      );
    }
  }
}

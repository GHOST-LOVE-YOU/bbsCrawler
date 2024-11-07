// 每5分钟执行一次 cron: 0 */5 * * * *
import { NextResponse } from "next/server";
import { crawlAndStoreIWhisper } from "@/lib/crawlee/iwhisper";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("Starting iWhisper crawler");
  try {
    await crawlAndStoreIWhisper();
    return NextResponse.json({ message: "Crawler finished successfully" });
  } catch (error) {
    console.error("Crawler error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}

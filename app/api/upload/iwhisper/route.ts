import { createWriteStream, promises as fs } from "fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "path";

import { NextResponse } from "next/server";

import { processIWhisperDir } from "@/lib/crawlee/iwhisper";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 3000000;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/zip")) {
      return NextResponse.json(
        { error: "Content-Type 必须为 application/zip" },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json({ error: "缺少请求体" }, { status: 400 });
    }

    const baseUploadDir = path.join(
      process.cwd(),
      "storage",
      "uploads",
      String(Date.now())
    );
    await fs.mkdir(baseUploadDir, { recursive: true });

    const nodeReadable = Readable.fromWeb(
      request.body as unknown as ReadableStream
    );
    const unzipper = (await import("unzipper")).default;
    const extract = unzipper.Parse({ forceStream: true });

    // Start piping request into unzip parser
    nodeReadable.pipe(extract);

    // Sequentially extract JSON files with backpressure
    for await (const entry of extract) {
      const entryPath = String((entry as any).path || "");
      const normalized = path.normalize(entryPath).replace(/^[/\\]+/, "");
      const destPath = path.join(baseUploadDir, normalized);

      if ((entry as any).type === "Directory") {
        (entry as any).autodrain();
        continue;
      }

      if (!destPath.endsWith(".json")) {
        (entry as any).autodrain();
        continue;
      }

      // Prevent ZipSlip: ensure path is within baseUploadDir
      const resolved = path.resolve(destPath);
      if (!resolved.startsWith(path.resolve(baseUploadDir) + path.sep)) {
        logger.warn(`跳过潜在危险路径: ${destPath}`);
        (entry as any).autodrain();
        continue;
      }

      const destDir = path.dirname(resolved);
      await fs.mkdir(destDir, { recursive: true });
      await pipeline(entry, createWriteStream(resolved));
    }

    // Start background import
    processIWhisperDir(baseUploadDir).catch((err) => {
      logger.error("后台导入失败: " + String(err));
    });

    return NextResponse.json(
      { message: "上传并解压完成, 已开始后台导入", dir: baseUploadDir },
      { status: 202 }
    );
  } catch (error) {
    logger.error("ZIP 上传或解压失败: " + String(error));
    return NextResponse.json({ error: "上传或解压失败" }, { status: 500 });
  }
}

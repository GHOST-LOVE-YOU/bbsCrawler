import { createWriteStream, promises as fs } from "fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "path";
import type { ReadableStream as WebReadableStream } from "stream/web";

import { NextResponse } from "next/server";

import { processIWhisperDir } from "@/lib/crawlee/iwhisper";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  logger.info("收到 ZIP 上传请求");
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/zip")) {
      logger.warn(`不支持的内容类型: ${contentType}`);
      return NextResponse.json(
        { error: "Content-Type 必须为 application/zip" },
        { status: 400 }
      );
    }

    if (!request.body) {
      logger.warn("请求体为空");
      return NextResponse.json({ error: "缺少请求体" }, { status: 400 });
    }

    const baseUploadDir = path.join(
      process.cwd(),
      "storage",
      "uploads",
      String(Date.now())
    );
    logger.info(`创建上传目录: ${baseUploadDir}`);
    await fs.mkdir(baseUploadDir, { recursive: true });

    logger.info("开始解析 ZIP 文件");
    const nodeReadable = Readable.fromWeb(
      request.body as unknown as WebReadableStream<Uint8Array>
    );
    
    // 动态导入 unzipper
    const unzipper = await import("unzipper");
    const extract = unzipper.Parse({ forceStream: true });

    // Start piping request into unzip parser
    nodeReadable.pipe(extract);

    let fileCount = 0;
    // Sequentially extract JSON files with backpressure
    for await (const entry of extract) {
      const entryPath = String(entry.path || "");
      const normalized = path.normalize(entryPath).replace(/^[/\\]+/, "");
      const destPath = path.join(baseUploadDir, normalized);

      if (entry.type === "Directory") {
        entry.autodrain();
        continue;
      }

      if (!destPath.endsWith(".json")) {
        entry.autodrain();
        continue;
      }

      // Prevent ZipSlip: ensure path is within baseUploadDir
      const resolved = path.resolve(destPath);
      if (!resolved.startsWith(path.resolve(baseUploadDir) + path.sep)) {
        logger.warn(`跳过潜在危险路径: ${destPath}`);
        entry.autodrain();
        continue;
      }

      const destDir = path.dirname(resolved);
      await fs.mkdir(destDir, { recursive: true });
      await pipeline(entry, createWriteStream(resolved));
      fileCount++;
      
      if (fileCount % 1000 === 0) {
        logger.info(`已解压 ${fileCount} 个 JSON 文件`);
      }
    }

    logger.info(`ZIP 解压完成, 共解压 ${fileCount} 个 JSON 文件`);

    // Start background import
    logger.info("开始后台导入数据");
    processIWhisperDir(baseUploadDir).catch((err) => {
      logger.error("后台导入失败: " + String(err));
    });

    return NextResponse.json(
      { 
        message: "上传并解压完成, 已开始后台导入", 
        dir: baseUploadDir,
        fileCount 
      },
      { status: 202 }
    );
  } catch (error) {
    logger.error("ZIP 上传或解压失败: " + String(error));
    logger.error("错误堆栈: " + (error instanceof Error ? error.stack : "无堆栈信息"));
    return NextResponse.json({ 
      error: "上传或解压失败",
      details: String(error)
    }, { status: 500 });
  }
}

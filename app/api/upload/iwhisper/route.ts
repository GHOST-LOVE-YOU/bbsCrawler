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

    // 在后台异步处理解压和导入
    const processInBackground = async () => {
      let fileCount = 0;
      let errorCount = 0;
      const startTime = Date.now();
      
      try {
        logger.info("开始解压 ZIP 文件流");
        
        // Sequentially extract JSON files with backpressure
        for await (const entry of extract) {
          try {
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
              const elapsed = Math.round((Date.now() - startTime) / 1000);
              logger.info(`已解压 ${fileCount} 个 JSON 文件 (用时 ${elapsed}s, 错误 ${errorCount})`);
            }

            // 每解压 5000 个文件后稍作停顿，避免内存压力
            if (fileCount % 5000 === 0) {
              await new Promise(resolve => setTimeout(resolve, 50));
              // 强制垃圾回收（如果可用）
              if (global.gc) {
                global.gc();
              }
            }
          } catch (entryError) {
            errorCount++;
            logger.error(`解压单个文件失败: ${String(entryError)}`);
            // 继续处理下一个文件，不中断整个流程
            try {
              entry.autodrain();
            } catch {
              // 忽略 autodrain 错误
            }
          }
        }

        const totalTime = Math.round((Date.now() - startTime) / 1000);
        logger.info(`ZIP 解压完成, 共解压 ${fileCount} 个 JSON 文件, 用时 ${totalTime}s, 错误 ${errorCount}`);

        // 写入状态文件
        const statusFile = path.join(baseUploadDir, ".status");
        await fs.writeFile(statusFile, JSON.stringify({
          extractedFiles: fileCount,
          extractErrors: errorCount,
          extractCompleted: new Date().toISOString(),
          importStarted: false
        }));

        // Start import after extraction is complete
        if (fileCount > 0) {
          logger.info("开始后台导入数据");
          await fs.writeFile(statusFile, JSON.stringify({
            extractedFiles: fileCount,
            extractErrors: errorCount,
            extractCompleted: new Date().toISOString(),
            importStarted: true,
            importCompleted: false
          }));
          
          await processIWhisperDir(baseUploadDir);
          
          await fs.writeFile(statusFile, JSON.stringify({
            extractedFiles: fileCount,
            extractErrors: errorCount,
            extractCompleted: new Date().toISOString(),
            importStarted: true,
            importCompleted: new Date().toISOString()
          }));
          
          logger.info("后台导入完成");
        } else {
          logger.warn("没有文件被解压，跳过导入");
        }
      } catch (error) {
        logger.error("后台处理失败: " + String(error));
        logger.error("错误堆栈: " + (error instanceof Error ? error.stack : "无堆栈"));
        
        // 写入错误状态
        try {
          const statusFile = path.join(baseUploadDir, ".status");
          await fs.writeFile(statusFile, JSON.stringify({
            extractedFiles: fileCount,
            extractErrors: errorCount,
            error: String(error),
            failedAt: new Date().toISOString()
          }));
        } catch {
          // 忽略状态文件写入错误
        }
      }
    };

    // 立即返回响应，避免超时
    processInBackground();

    return NextResponse.json(
      { 
        message: "上传已接收, 正在后台解压和导入", 
        dir: baseUploadDir,
        status: "processing"
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

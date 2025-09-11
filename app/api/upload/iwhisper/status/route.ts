import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");
    
    if (!dir) {
      return NextResponse.json({ error: "缺少 dir 参数" }, { status: 400 });
    }

    // 检查目录是否存在
    try {
      await fs.access(dir);
    } catch {
      return NextResponse.json({ error: "目录不存在" }, { status: 404 });
    }

    // 统计 JSON 文件数量和目录信息
    let fileCount = 0;
    let totalFiles = 0;
    let directories = 0;
    let lastModified: Date | null = null;
    
    try {
      const files = await fs.readdir(dir, { recursive: true });
      totalFiles = files.length;
      
      for (const file of files) {
        const filePath = path.join(dir, String(file));
        try {
          const stat = await fs.stat(filePath);
          if (stat.isDirectory()) {
            directories++;
          } else if (String(file).endsWith('.json')) {
            fileCount++;
            if (!lastModified || stat.mtime > lastModified) {
              lastModified = stat.mtime;
            }
          }
        } catch {
          // 跳过无法访问的文件
        }
      }
    } catch (error) {
      return NextResponse.json({ 
        error: "统计文件失败", 
        details: String(error) 
      }, { status: 500 });
    }

    // 检查目录创建时间
    let dirCreated: Date | null = null;
    try {
      const dirStat = await fs.stat(dir);
      dirCreated = dirStat.birthtime;
    } catch {
      // 忽略错误
    }

    // 读取状态文件
    let statusInfo: any = null;
    try {
      const statusFile = path.join(dir, ".status");
      const statusContent = await fs.readFile(statusFile, "utf-8");
      statusInfo = JSON.parse(statusContent);
    } catch {
      // 状态文件不存在或无法读取
    }

    // 判断处理状态
    const now = new Date();
    const timeSinceCreation = dirCreated ? now.getTime() - dirCreated.getTime() : 0;
    const timeSinceLastFile = lastModified ? now.getTime() - lastModified.getTime() : 0;
    
    let status = "processing";
    let message = `目录中有 ${fileCount} 个 JSON 文件，总共 ${totalFiles} 个文件和目录`;
    
    if (statusInfo) {
      if (statusInfo.error) {
        status = "error";
        message = `处理失败: ${statusInfo.error}`;
      } else if (statusInfo.importCompleted) {
        status = "completed";
        message = `处理完成: 解压 ${statusInfo.extractedFiles} 个文件，导入完成于 ${statusInfo.importCompleted}`;
      } else if (statusInfo.importStarted) {
        status = "importing";
        message = `正在导入数据: 已解压 ${statusInfo.extractedFiles} 个文件`;
      } else if (statusInfo.extractCompleted) {
        status = "extract_completed";
        message = `解压完成: ${statusInfo.extractedFiles} 个文件，准备导入`;
      }
    } else {
      if (timeSinceLastFile > 60000) { // 60秒内没有新文件
        status = "stalled";
        message = "可能已停止处理 (超过60秒无新文件)";
      } else if (timeSinceCreation < 10000) { // 刚创建不到10秒
        status = "starting";
        message = "正在开始处理";
      }
    }

    return NextResponse.json({
      dir,
      fileCount,
      totalFiles,
      directories,
      status,
      statusInfo,
      dirCreated: dirCreated?.toISOString(),
      lastModified: lastModified?.toISOString(),
      timeSinceCreation: Math.round(timeSinceCreation / 1000),
      timeSinceLastFile: Math.round(timeSinceLastFile / 1000),
      message
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "查询状态失败", 
      details: String(error) 
    }, { status: 500 });
  }
}

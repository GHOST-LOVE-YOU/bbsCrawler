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

    // 统计 JSON 文件数量
    let fileCount = 0;
    try {
      const files = await fs.readdir(dir, { recursive: true });
      fileCount = files.filter(file => String(file).endsWith('.json')).length;
    } catch (error) {
      return NextResponse.json({ 
        error: "统计文件失败", 
        details: String(error) 
      }, { status: 500 });
    }

    return NextResponse.json({
      dir,
      fileCount,
      status: "completed",
      message: `目录中有 ${fileCount} 个 JSON 文件`
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "查询状态失败", 
      details: String(error) 
    }, { status: 500 });
  }
}

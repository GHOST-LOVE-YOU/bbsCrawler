import logger from "@/lib/logger";

import { fetchPost, storePost, iteratePosts, iterateLocalPostEntries } from "./utils";

export const crawlAndStoreIWhisper = async () => {
  try {
    // 优先使用流式迭代，避免一次性占用大量内存
    let processed = 0;
    const fetchMode = process.env.FETCH_MODE || "web";
    
    if (fetchMode === "local") {
      // 本地模式：处理后删除文件
      for await (const entry of iterateLocalPostEntries()) {
        const post = entry.post;
        if (!post || post.topic === "") continue;
        
        try {
          await storePost(post);
          // 存储成功后删除文件，避免重复添加
          await (await import("fs")).promises.unlink(entry.filePath);
          processed += 1;
          if (processed % 1000 === 0) {
            logger.info(`已处理 ${processed} 个帖子`);
          }
        } catch (error) {
          logger.error(`处理文件 ${entry.filePath} 失败: ` + String(error));
          // 处理失败时不删除文件，以便下次重试
        }
      }
    } else {
      // 网络模式：使用原有逻辑
      for await (const post of iteratePosts()) {
        if (!post || post.topic === "") continue;
        await storePost(post);
        processed += 1;
        if (processed % 1000 === 0) {
          logger.info(`已处理 ${processed} 个帖子`);
        }
      }
    }
    
    if (processed === 0) {
      // 兼容旧逻辑：若流式没有返回数据，回退到一次性拉取（小数据场景）
      const data = await fetchPost();
      if (!data) {
        logger.error("没有数据从fetchPost获取");
        return;
      }
      for (const post of data) {
        if (post.topic === "") continue;
        await storePost(post);
      }
    }
    logger.info(`成功爬取并存储帖子，共处理 ${processed} 个帖子`);
  } catch (error) {
    logger.error("爬取并存储帖子失败: " + String(error));
    throw error;
  }
};

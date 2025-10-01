import logger from "@/lib/logger";

import { fetchPost, storePost, iterateWebPosts, iterateLocalPostEntries } from "./utils";

export const crawlAndStoreIWhisperFromWeb = async () => {
  try {
    logger.info("开始从网络爬取iWhisper帖子");
    // 优先使用流式迭代，避免一次性占用大量内存
    let processed = 0;
    
    // 网络模式：使用流式迭代
    for await (const post of iterateWebPosts()) {
      if (!post || post.topic === "") continue;
      await storePost(post);
      processed += 1;
      if (processed % 1000 === 0) {
        logger.info(`已处理 ${processed} 个帖子`);
      }
    }
    
    if (processed === 0) {
      // 兼容旧逻辑：若流式没有返回数据，回退到一次性拉取（小数据场景）
      logger.info("流式迭代未返回数据，回退到一次性拉取");
      const data = await fetchPost();
      if (!data || data.length === 0) {
        logger.error("没有数据从fetchPost获取");
        return;
      }
      for (const post of data) {
        if (post.topic === "") continue;
        await storePost(post);
        processed += 1;
      }
    }
    logger.info(`成功从网络爬取并存储帖子，共处理 ${processed} 个帖子`);
  } catch (error) {
    logger.error("从网络爬取并存储帖子失败: " + String(error));
    throw error;
  }
};

export const crawlAndStoreIWhisperFromLocal = async () => {
  try {
    logger.info("开始从本地文件处理iWhisper帖子");
    let processed = 0;
    
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
    
    logger.info(`成功从本地处理并存储帖子，共处理 ${processed} 个帖子`);
  } catch (error) {
    logger.error("从本地处理并存储帖子失败: " + String(error));
    throw error;
  }
};

// 保留旧的函数名以保持向后兼容性，但现在默认使用网络模式
export const crawlAndStoreIWhisper = crawlAndStoreIWhisperFromWeb;

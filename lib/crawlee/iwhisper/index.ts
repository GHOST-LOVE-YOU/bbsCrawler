import logger from "@/lib/logger";

import { fetchPosts, storePost, iteratePostsInDir } from "./utils";

export const crawlAndStoreIWhisper = async () => {
  try {
    let count = 0;
    for await (const post of fetchPosts()) {
      if (post.topic === "") {
        continue;
      }
      await storePost(post);
      count += 1;
      if (count % 1000 === 0) {
        logger.info(`处理进度: 已处理 ${count} 条帖子`);
      }
    }
    logger.info("成功爬取并存储帖子");
  } catch (error) {
    logger.error("爬取并存储帖子失败: " + String(error));
    throw error;
  }
};

export const processIWhisperDir = async (dirPath: string) => {
  try {
    let count = 0;
    for await (const post of iteratePostsInDir(dirPath)) {
      if (post.topic === "") {
        continue;
      }
      await storePost(post);
      count += 1;
      if (count % 1000 === 0) {
        logger.info(`目录导入进度: 已处理 ${count} 条帖子`);
      }
    }
    logger.info(`目录导入完成, 共导入 ${count} 条帖子`);
  } catch (error) {
    logger.error("目录导入失败: " + String(error));
    throw error;
  }
};

import logger from "@/lib/logger";

import { fetchPost, storePost } from "./utils";

export const crawlAndStoreIWhisper = async () => {
  try {
    const data = await fetchPost();
    if (!data) {
      logger.error("没有数据从fetchPost获取");
      return;
    }
    for (const post of data) {
      if (post.topic === "") {
        continue;
      }
      await storePost(post);
    }
    logger.info("成功爬取并存储帖子");
  } catch (error) {
    logger.error("爬取并存储帖子失败: " + String(error));
    throw error;
  }
};

import { promises as fs } from "fs";
import path from "path";

import axios, { AxiosResponse } from "axios";

import { autoAddComment } from "@/lib/comments/server-utils";
import logger from "@/lib/logger";
import { autoGetPost } from "@/lib/posts/server-utils";

const BACKEND_AUTH_USERNAME = process.env.BACKEND_AUTH_USERNAME || "";
const BACKEND_AUTH_PASSWORD = process.env.BACKEND_AUTH_PASSWORD || "";
const BACKEND_URL = process.env.BACKEND_URL || "";
const FETCHMODE = process.env.FETCH_MODE || "web";

export const storePost = async (postDatas: crawlPost) => {
  try {
    const result = await autoGetPost({
      byr_id: postDatas.byr_id,
      area: postDatas.area,
      topic: postDatas.topic,
      createdAt: postDatas.time,
      author: postDatas.author,
    });

    const post = result.post;
    const comments = postDatas.comments;

    for (const comment of comments) {
      await autoAddComment(
        {
          author: comment.author,
          content: comment.content,
          floor: comment.floor,
          like: comment.like,
          dislike: comment.dislike,
          time: comment.time,
        },
        post.id
      );
    }
  } catch (error) {
    logger.error("出现奇怪的问题: " + String(error));
    logger.info("post: " + JSON.stringify(postDatas));
  }
};

const config = {
  method: "get",
  maxBodyLength: Infinity,
  url: BACKEND_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${BACKEND_AUTH_USERNAME}:${BACKEND_AUTH_PASSWORD}`
    ).toString("base64")}`,
  },
};

export async function* fetchPosts(): AsyncGenerator<crawlPost> {
  try {
    if (FETCHMODE === "local") {
      yield* fetchPostsLocal();
    } else {
      const response: AxiosResponse<BackendResponse> =
        await axios.request(config);
      const items = response.data.items || [];
      for (const item of items) {
        yield item as crawlPost;
      }
    }
  } catch (error) {
    logger.error("获取帖子失败: " + String(error));
  }
}

async function* fetchPostsLocal(): AsyncGenerator<crawlPost> {
  logger.info("使用本地模式爬取帖子");
  const storageDir = path.join(process.cwd(), "storage");
  let processedCount = 0;
  try {
    const dir = await fs.opendir(storageDir);
    try {
      for await (const dirent of dir) {
        if (!dirent.isFile() || !dirent.name.endsWith(".json")) {
          continue;
        }
        const filePath = path.join(storageDir, dirent.name);
        try {
          const fileContent = await fs.readFile(filePath, "utf-8");
          const postData = JSON.parse(fileContent) as crawlPost;
          processedCount += 1;
          if (processedCount % 1000 === 0) {
            logger.info(`从本地读取进度: ${processedCount} 个帖子`);
          }
          yield postData;
        } catch (error) {
          logger.error(`读取文件 ${dirent.name} 失败: ` + String(error));
        }
      }
    } finally {
      await dir.close();
    }
    logger.info(`本地读取完成, 共读取 ${processedCount} 个帖子`);
  } catch (error) {
    logger.error("读取本地帖子失败: " + String(error));
  }
}

export async function* iteratePostsInDir(
  targetDir: string
): AsyncGenerator<crawlPost> {
  try {
    const dir = await fs.opendir(targetDir);
    let processedCount = 0;
    try {
      for await (const dirent of dir) {
        if (!dirent.isFile() || !dirent.name.endsWith(".json")) {
          continue;
        }
        const filePath = path.join(targetDir, dirent.name);
        try {
          const fileContent = await fs.readFile(filePath, "utf-8");
          const postData = JSON.parse(fileContent) as crawlPost;
          processedCount += 1;
          if (processedCount % 1000 === 0) {
            logger.info(`自定义目录读取进度: ${processedCount} 个帖子`);
          }
          yield postData;
        } catch (error) {
          logger.error(`读取文件 ${dirent.name} 失败: ` + String(error));
        }
      }
    } finally {
      await dir.close();
    }
    logger.info(`目录 ${targetDir} 读取完成, 共读取 ${processedCount} 个帖子`);
  } catch (error) {
    logger.error("读取目录帖子失败: " + String(error));
  }
}

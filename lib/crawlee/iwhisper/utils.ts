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

/**
 * 以流式方式迭代帖子，避免一次性将所有本地 JSON 加载到内存。
 */
export async function* iteratePosts(): AsyncGenerator<crawlPost> {
  if (FETCHMODE === "local") {
    for await (const { post } of iterateLocalPosts()) {
      yield post;
    }
  } else {
    yield* iterateWebPosts();
  }
}

/**
 * 本地模式流式迭代，返回帖子和文件路径，用于处理后删除文件
 */
export async function* iterateLocalPostEntries(): AsyncGenerator<{ post: crawlPost; filePath: string }> {
  if (FETCHMODE === "local") {
    yield* iterateLocalPosts();
  }
}

async function* iterateWebPosts(): AsyncGenerator<crawlPost> {
  try {
    const response: AxiosResponse<BackendResponse> = await axios.request(config);
    const items = response.data.items || [];
    for (const item of items) {
      yield item as crawlPost;
    }
  } catch (error) {
    logger.error("获取帖子失败: " + String(error));
  }
}

async function* iterateLocalPosts(): AsyncGenerator<{ post: crawlPost; filePath: string }> {
  logger.info("使用本地模式爬取帖子(流式)");
  try {
    const storageDir = path.join(process.cwd(), "storage");
    // 使用 readdir 而不是 opendir，避免异步生成器中的目录句柄生命周期问题
    const files = await fs.readdir(storageDir);
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    
    for (const fileName of jsonFiles) {
      const filePath = path.join(storageDir, fileName);
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const postData = JSON.parse(fileContent) as crawlPost;
        yield { post: postData, filePath };
      } catch (error) {
        logger.error(`读取文件 ${fileName} 失败: ` + String(error));
      }
    }
  } catch (error) {
    logger.error("读取本地帖子失败: " + String(error));
  }
}

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

export const fetchPost = async (): Promise<crawlPost[]> => {
  try {
    if (FETCHMODE === "local") {
      return fetchPostLocal();
    } else {
      const response: AxiosResponse<BackendResponse> =
        await axios.request(config);
      return response.data.items;
    }
  } catch (error) {
    logger.error("获取帖子失败: " + String(error));
    return [];
  }
};

const fetchPostLocal = async (): Promise<crawlPost[]> => {
  logger.info("使用本地模式爬取帖子");
  try {
    const storageDir = path.join(process.cwd(), "storage");
    // 为保持兼容性，此函数仍一次性返回数组，但实现改为流式累积，
    // 若数据量过大请改用 iteratePosts()。
    const posts: crawlPost[] = [];
    const dir = await fs.opendir(storageDir);
    try {
      for await (const dirent of dir) {
        if (!dirent.isFile()) continue;
        if (!dirent.name.endsWith(".json")) continue;
        try {
          const filePath = path.join(storageDir, dirent.name);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const postData = JSON.parse(fileContent) as crawlPost;
          posts.push(postData);
        } catch (error) {
          logger.error(`读取文件 ${dirent.name} 失败: ` + String(error));
        }
      }
    } finally {
      await dir.close();
    }
    logger.info(`从本地读取了 ${posts.length} 个帖子`);
    return posts;
  } catch (error) {
    logger.error("读取本地帖子失败: " + String(error));
    return [];
  }
};

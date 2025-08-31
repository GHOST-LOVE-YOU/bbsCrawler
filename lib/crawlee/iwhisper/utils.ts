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
    const files = await fs.readdir(storageDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const posts: crawlPost[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(storageDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const postData = JSON.parse(fileContent) as crawlPost;
        posts.push(postData);
      } catch (error) {
        logger.error(`读取文件 ${file} 失败: ` + String(error));
      }
    }

    logger.info(`从本地读取了 ${posts.length} 个帖子`);
    return posts;
  } catch (error) {
    logger.error("读取本地帖子失败: " + String(error));
    return [];
  }
};

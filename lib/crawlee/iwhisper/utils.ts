import { autoAddComment } from "@/lib/comments/server-utils";
import { autoGetPost } from "@/lib/posts/server-utils";
import axios, { AxiosResponse } from "axios";

const BACKEND_AUTH_USERNAME = process.env.BACKEND_AUTH_USERNAME || "";
const BACKEND_AUTH_PASSWORD = process.env.BACKEND_AUTH_PASSWORD || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export const storePost = async (postDatas: crawlPost) => {
  const result = await autoGetPost({
    byr_id: postDatas.byr_id,
    topic: postDatas.topic,
    createdAt: postDatas.time,
    userName: postDatas.author,
  });

  const post = result.post;
  const comments = postDatas.comments;

  for (const comment of comments) {
    await autoAddComment(
      {
        userName: comment.author,
        content: comment.content,
        floor: comment.floor,
        like: comment.like,
        dislike: comment.dislike,
        time: comment.time,
      },
      post.id
    );
  }
};

let config = {
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
    const response: AxiosResponse<BackendResponse> = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data.items;
  } catch (error) {
    console.error("Error fetching post:", error);
    return [];
  }
};

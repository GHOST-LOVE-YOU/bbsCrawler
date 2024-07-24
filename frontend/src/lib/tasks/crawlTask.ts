import "server-only";

import axios from "axios";
import { autoGetPost } from "@lib/posts/server-utils";
import { autoAddComment } from "@lib/comments/server-utils";

const data = JSON.stringify({
  username: process.env.AUTH_BACKEND_USERNAME,
  password: process.env.AUTH_BACKEND_PASSWORD,
});

const CRAWLEE_BACKEND_URL = process.env.CRAWLEE_BACKEND_URL;

const config = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${CRAWLEE_BACKEND_URL}/crawl`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

async function handleCrawlTask() {
  const response = await axios.request(config);

  if (response.status !== 200) {
    return {
      success: false,
      error: "Crawl failed",
    };
  }

  // 处理返回的数据
  const posts = response.data["data"];
  console.log(posts);
  for (const data of posts) {
    const result = await autoGetPost({
      byr_id: data.byr_id,
      topic: data.topic,
      createdAt: data.time,
      userName: data.author,
    });

    const post = result.post;
    const comments = data.comments;

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
  }
  return { success: true };
}

export default handleCrawlTask;

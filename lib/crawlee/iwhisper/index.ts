import { fetchPost, storePost } from "./utils";

export const crawlAndStoreIWhisper = async () => {
  try {
    const data = await fetchPost();
    if (!data) {
      console.error("No data received from fetchPost");
      return;
    }
    for (const post of data) {
      if (post.topic === "") {
        continue;
      }
      await storePost(post);
    }
    console.log("Successfully crawled and stored posts");
  } catch (error) {
    console.error("Error in crawlAndStoreIWhisper:", error);
    throw error;
  }
};

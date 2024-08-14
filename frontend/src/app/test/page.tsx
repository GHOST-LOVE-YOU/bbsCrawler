import { searchCommentsByKeyword } from "@lib/posts/server-utils";

export default async function page() {
  const comments = await searchCommentsByKeyword("test", 1);
  return <div>{comments.comments[0].content}</div>;
}

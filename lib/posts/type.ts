type notifyPost = {
  id: string;
  targetId: string;
  title: string;
};

type notifyPostOverView = {
  id: string;
  topic: string;
};

type listPost = {
  postId: string;
  topic: string;
  userName: string;
  userId: string;
  commentCount: number;
  latestCommentTime: Date | null;
  latestCommentUserName: string | null;
  latestCommentUserId: string | null;
  createdAtTime: Date;
};

type sortByType = "createdAt" | "updatedAt";

type crawlPost = {
  byr_id: string;
  topic: string;
  author: string;
  time: string;
  page: string;
  comments: crawlComment[];
};

type BackendResponse = {
  count: number;
  desc: boolean;
  items: crawlPost[];
  limit: number;
  offset: number;
  total: number;
}
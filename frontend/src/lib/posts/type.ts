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
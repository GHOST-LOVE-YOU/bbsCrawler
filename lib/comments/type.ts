type crawlComment = {
  author: string;
  content: string;
  floor: string;
  like: number;
  dislike: number;
  time: string;
};

type notifyComment = {
  id: string;
  postId: string;
  postTitle: string;
  commentSequence: number;
  content: string;
};

type CardComment = {
  postId: string;
  postTitle: string;
  comments: {
    id?: string;
    sequence: number;
    content: string;
  }[];
};

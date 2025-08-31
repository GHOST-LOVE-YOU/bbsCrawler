import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PostCardProps {
  post: {
    id: string;
    topic: string;
  };
  buttonText?: string;
  onButtonClick?: (postId: string) => void;
  smallText?: boolean;
}

const PostCard = ({
  post,
  buttonText,
  onButtonClick,
  smallText,
}: PostCardProps) => {
  return (
    <Card
      className={`
        w-full border border-gray-300 bg-slate-50
        dark:border-gray-700 dark:bg-slate-900
      `}
    >
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle>
            <Link
              href={`/post/${post.id}`}
              className={cn(
                `
                  hover:text-stone-500
                  dark:hover:text-stone-500
                `,
                smallText ? "text-lg" : ""
              )}
            >
              {post.topic}
            </Link>
          </CardTitle>
          {buttonText && onButtonClick && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onButtonClick(post.id)}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default PostCard;

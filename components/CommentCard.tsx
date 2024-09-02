import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import CommentDisplay from "./common/CommentDisplay";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CommentCardProps {
  group: CardComment;
  buttonText?: string;
  onButtonClick?: (commentId: string) => void;
  smallText?: boolean;
}

const CommentCard = ({
  group,
  buttonText,
  onButtonClick,
  smallText,
}: CommentCardProps) => {
  return (
    <Card className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle>
          <Link
            href={`/post/${group.postId}`}
            className={cn(
              "text-primary hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary",
              smallText ? "text-xl" : ""
            )}
          >
            {group.postTitle}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-stone-300 dark:divide-stone-700 pt-0">
        {group.comments.map((comment, commentIndex) => (
          <div key={commentIndex} className="py-4 first:pt-2 last:pb-2">
            <div className="flex justify-between items-start mb-2">
              <p
                className={cn(
                  "text-lg text-gray-600 dark:text-gray-400",
                  smallText ? "text-lg" : ""
                )}
              >
                Comment #{comment.sequence}
              </p>
              {buttonText && onButtonClick && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onButtonClick(comment.id as string)}
                  className="ml-2"
                >
                  {buttonText}
                </Button>
              )}
            </div>
            <div
              className={cn(
                "text-text-light dark:text-text-dark text-xl",
                smallText ? "text-lg" : ""
              )}
            >
              <CommentDisplay content={comment.content} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommentCard;

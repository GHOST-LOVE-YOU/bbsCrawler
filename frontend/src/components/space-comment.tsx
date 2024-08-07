"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import SpacePagination from "./space-pagination";

const ITEMS_PER_PAGE = 3;

type Comment = {
  postId: string;
  postTitle: string;
  commentSequence: number;
  content: string | null;
};

type GroupedComments = {
  [key: string]: {
    postId: string;
    postTitle: string;
    comments: { sequence: number; content: string }[];
  };
};

type SpaceCommentProps = {
  commentsList: Comment[];
};

export default function SpaceComment({ commentsList }: SpaceCommentProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const groupedComments = useMemo(() => {
    const grouped: GroupedComments = {};
    commentsList.forEach((comment) => {
      const key = `${comment.postId}-${comment.postTitle}`;
      if (!grouped[key]) {
        grouped[key] = {
          postId: comment.postId,
          postTitle: comment.postTitle,
          comments: [],
        };
      }
      grouped[key].comments.push({
        sequence: comment.commentSequence,
        content: comment.content ? comment.content : "--",
      });
    });

    // Sort comments by sequence within each group
    Object.values(grouped).forEach((group) => {
      group.comments.sort((a, b) => a.sequence - b.sequence);
    });

    return Object.values(grouped);
  }, [commentsList]);

  const totalPages = Math.ceil(groupedComments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGroupedComments = groupedComments.slice(startIndex, endIndex);

  if (groupedComments.length === 0) {
    return <div className="text-center p-4">No comments found</div>;
  }

  return (
    <div className="space-y-4">
      {currentGroupedComments.map((group, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <CardTitle>
              <Link
                href={`/post/${group.postId}`}
                className="text-blue-600 hover:underline"
              >
                {group.postTitle}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {group.comments.map((comment, commentIndex) => (
              <div key={commentIndex} className="mb-2 last:mb-0">
                <p className="text-sm text-gray-600">
                  Comment #{comment.sequence}
                </p>
                <p className="mt-1">{comment.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {totalPages > 1 && (
        <SpacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

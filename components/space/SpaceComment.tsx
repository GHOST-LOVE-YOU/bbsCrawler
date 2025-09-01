"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SpacePagination from "./SpacePagination";
import CommentCard from "../CommentCard";

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
    return (
      <Card
        className={`
          mt-4 flex min-h-48 justify-center bg-slate-50
          dark:bg-slate-900
        `}
      >
        <CardContent className="flex items-center">
          <p className="text-xl">最近没有新评论</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {currentGroupedComments.map((group, index) => (
        <CommentCard key={index} group={group} />
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

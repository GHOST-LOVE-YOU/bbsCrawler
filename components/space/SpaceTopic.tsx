"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import SpacePagination from "./SpacePagination";
import PostCard from "../PostCard";

const ITEMS_PER_PAGE = 5;

type SpaceTopicProps = {
  topicsList: {
    id: string;
    topic: string;
  }[];
};

export default function SpaceTopic({ topicsList }: SpaceTopicProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(topicsList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = topicsList.slice(startIndex, endIndex);

  if (topicsList.length === 0)
    return (
      <Card className="mt-4 min-h-48 flex justify-center bg-slate-50 dark:bg-slate-900">
        <CardContent className="flex items-center">
          <p className="text-xl">最近没有发布新帖子</p>
        </CardContent>
      </Card>
    );
  return (
    <div>
      {currentTopics.map((topic) => (
        <PostCard key={topic.id} post={topic} />
      ))}
      <div className="flex mt-4">
        {totalPages > 1 && (
          <SpacePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

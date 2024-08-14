"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import SpacePagination from "./space-pagination";

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
      <Card className="mt-4 bg-background-light dark:bg-background-dark min-h-48 flex justify-center">
        <CardContent className="flex items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No topics found
          </p>
        </CardContent>
      </Card>
    );
  return (
    <div>
      <Card className="mt-4 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700">
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {currentTopics.map((topic, index) => (
              <li
                key={index}
                className="px-4 py-3 transition-colors border-b border-gray-300 dark:border-gray-700"
              >
                <p className="text-text-light dark:text-text-dark text-sm">
                  <Link href={`/post/${topic.id}`}>{topic.topic}</Link>
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
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

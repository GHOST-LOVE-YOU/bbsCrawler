"use client";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Card, CardContent } from "./ui/card";

const ITEMS_PER_PAGE = 5;

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
      {[...Array(totalPages)].map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink
            onClick={() => onPageChange(index + 1)}
            isActive={currentPage === index + 1}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

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
      <Card className="mt-4 bg-stone-600 min-h-48 flex justify-center">
        <CardContent className="flex items-center ">
          <p className="text-gray-200 text-sm">No topics found</p>
        </CardContent>
      </Card>
    );
  console.log(topicsList);
  return (
    <div>
      <Card className="mt-4 bg-gray-700">
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-600">
            {currentTopics.map((topic, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-gray-600 transition-colors"
              >
                <p className="text-gray-200 text-sm">{topic.topic}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex mt-4">
        {totalPages >= 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

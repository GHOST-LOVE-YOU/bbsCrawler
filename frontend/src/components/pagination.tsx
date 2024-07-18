"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type PageinationProps = {
  maxPage: number;
  currentPage: number;
};

export default function Pagination({ maxPage, currentPage }: PageinationProps) {
  const getPages = () => {
    let pages = [];
    if (maxPage <= 5) {
      for (let i = 1; i <= maxPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", maxPage];
      } else if (currentPage >= maxPage - 2) {
        pages = [1, "...", maxPage - 3, maxPage - 2, maxPage - 1, maxPage];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          maxPage,
        ];
      }
    }
    return pages;
  };

  return (
    <nav
      className="pr-2 bg-nodedark inline-flex -space-x-px rounded-md shadow-sm h-7"
      aria-label="Pagination"
    >
      <a
        href="#"
        className="relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-inset ring-gray-300 hover:bg-[#3b3b3b] focus:z-20 focus:outline-offset-0"
        aria-disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </a>
      {getPages().map((page, index) => (
        <a
          key={index}
          href="#"
          aria-current={page === currentPage ? "page" : undefined}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            page === currentPage
              ? "z-10 bg-[#3b3b3b]"
              : page === "..."
              ? "ring-inset ring-gray-300"
              : "ring-inset ring-gray-300 hover:bg-[#3b3b3b]"
          } ${page === "..." && "hidden md:inline-flex"}`}
        >
          {page}
        </a>
      ))}
      <a
        href="#"
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-inset ring-gray-300 hover:bg-[#3b3b3b] focus:z-20 focus:outline-offset-0"
        aria-disabled={currentPage === maxPage}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </a>
    </nav>
  );
}

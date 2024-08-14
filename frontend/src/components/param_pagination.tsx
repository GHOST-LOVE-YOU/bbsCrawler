"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type ParamPaginationProps = {
  maxPage: number;
  sortBy?: "createdAt" | "updatedAt";
};

export default function ParamPagination({
  maxPage,
  sortBy,
}: ParamPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    return Number(searchParams.get("page") || "1");
  }, [searchParams]);

  const getPages = useCallback(() => {
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
  }, [currentPage, maxPage]);

  const navigateToPage = useCallback(
    (page: number | string) => {
      if (typeof page === "string" || page < 1 || page > maxPage) return;

      const params = new URLSearchParams(searchParams);
      if (page > 1) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }

      if (sortBy) {
        params.set("sortBy", sortBy);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, maxPage, sortBy]
  );

  if (maxPage === 1) {
    return null;
  }

  return (
    <nav
      className="pr-2 bg-background-light dark:bg-background-dark inline-flex -space-x-px rounded-md shadow-sm h-7"
      aria-label="Pagination"
    >
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        className={cn(
          "relative inline-flex items-center rounded-md px-2 py-2 text-text-light dark:text-text-dark ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0",
          {
            "text-gray-400 dark:text-gray-600": currentPage === 1,
          }
        )}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => navigateToPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md text-text-light dark:text-text-dark focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:focus-visible:outline-primary-dark ${
            page === currentPage
              ? "z-10 bg-primary dark:bg-primary-dark text-white"
              : page === "..."
              ? "ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
              : "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          } ${page === "..." && "hidden md:inline-flex"}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-light dark:text-text-dark ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0"
        disabled={currentPage === maxPage}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

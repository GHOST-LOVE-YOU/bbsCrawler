"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type ParamPaginationProps = {
  maxPage: number;
};

export default function ParamPagination({ maxPage }: ParamPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //   const sortByParam = searchParams.get("sortBy");
  //   const sortBy = sortByParam === "updatedAt" ? "updatedAt" : "createdAt";

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

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [router, pathname, searchParams, maxPage]
  );

  return (
    <nav
      className="md:pr-2 inline-flex -space-x-px text-sm"
      aria-label="Pagination"
    >
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        className={cn(
          "relative inline-flex items-center rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer",
          {
            "text-stone-400 dark:text-stone-600": currentPage === 1,
          },
          "p-[-6px]"
        )}
        disabled={currentPage === 1}
      >
        <span className="icon-[material-symbols--arrow-back-2] w-5 h-5" />
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => navigateToPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`relative inline-flex items-center px-1.5 text-sm font-semibold rounded-md focus:z-20 hover:bg-slate-300 dark:hover:bg-slate-700  ${
            page === currentPage
              ? "z-10 bg-slate-300 dark:bg-slate-700 text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
              : page === "..."
              ? ""
              : ""
          } ${page === "..." && "inline-flex"}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        className={cn(
          "relative inline-flex items-center rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer",
          {
            "text-gray-400 dark:text-gray-600": currentPage === maxPage,
          },
          "p-[-6px]"
        )}
        disabled={currentPage === maxPage}
      >
        <span className="icon-[material-symbols--play-arrow-rounded] w-5 h-5" />
      </button>
    </nav>
  );
}

export function ParamPaginationLoading() {
  return (
    <nav
      className="md:pr-2 inline-flex -space-x-px text-sm"
      aria-label="Pagination"
    >
      <button
        className="relative inline-flex items-center rounded-md p-[-6px]"
        disabled
      >
        <span className="icon-[material-symbols--arrow-back-2] w-5 h-5" />
      </button>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          className="relative inline-flex items-center px-1.5 text-sm font-semibold rounded-md"
        >
          {page}
        </button>
      ))}
      <button
        className="relative inline-flex items-center rounded-md p-[-6px]"
        disabled
      >
        <span className="icon-[material-symbols--play-arrow-rounded] w-5 h-5" />
      </button>
    </nav>
  );
}

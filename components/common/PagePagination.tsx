"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { cn } from "@/lib/utils";

type PagePaginationProps = {
  maxPage: number;
};

export default function PagePagination({ maxPage }: PagePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortByParam = searchParams.get("sortBy");
  const sortBy = sortByParam === "updatedAt" ? "updatedAt" : "createdAt";

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
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

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(url);
    },
    [router, searchParams, maxPage, pathname]
  );

  return (
    <nav
      className={`
        inline-flex -space-x-px text-sm
        md:pr-2
      `}
      aria-label="Pagination"
    >
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        className={cn(
          `
            relative inline-flex cursor-pointer items-center rounded-md
            hover:bg-slate-300
            dark:hover:bg-slate-700
          `,
          {
            "text-stone-400 dark:text-stone-600": currentPage === 1,
          },
          "p-[-6px]"
        )}
        disabled={currentPage === 1}
      >
        <span className="icon-[material-symbols--arrow-back-2] h-5 w-5" />
      </button>
      {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => navigateToPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`
            relative inline-flex items-center rounded-md px-1.5 text-sm font-semibold
            hover:bg-slate-300
            focus:z-20
            dark:hover:bg-slate-700
            ${
              page === currentPage
                ? `
                  z-10 bg-slate-300 text-white ring-1 ring-gray-300 ring-inset
                  dark:bg-slate-700 dark:ring-gray-700
                `
                : page === "..."
                  ? ""
                  : ""
            }
            ${page === "..." && ""}
          `}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        className={cn(
          `
            relative inline-flex cursor-pointer items-center rounded-md
            hover:bg-slate-300
            dark:hover:bg-slate-700
          `,
          {
            "text-gray-400 dark:text-gray-600": currentPage === maxPage,
          },
          "p-[-6px]"
        )}
        disabled={currentPage === maxPage}
      >
        <span className="icon-[material-symbols--play-arrow-rounded] h-5 w-5" />
      </button>
    </nav>
  );
}

export function PagePaginationLoading() {
  return (
    <nav
      className={`
        inline-flex -space-x-px text-sm
        md:pr-2
      `}
      aria-label="Pagination"
    >
      <button
        className="relative inline-flex items-center rounded-md p-[-6px]"
        disabled
      >
        <span className="icon-[material-symbols--arrow-back-2] h-5 w-5" />
      </button>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          className="relative inline-flex items-center rounded-md px-1.5 text-sm font-semibold"
        >
          {page}
        </button>
      ))}
      <button
        className="relative inline-flex items-center rounded-md p-[-6px]"
        disabled
      >
        <span className="icon-[material-symbols--play-arrow-rounded] h-5 w-5" />
      </button>
    </nav>
  );
}

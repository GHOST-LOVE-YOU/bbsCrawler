"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sortby() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortByParam = searchParams.get("sortBy");
  const sortBy = sortByParam === "updatedAt" ? "updatedAt" : "createdAt";

  const handleSort = (newSortBy: "createdAt" | "updatedAt") => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (newSortBy === "updatedAt") {
      current.set("sortBy", "updatedAt");
    } else {
      current.delete("sortBy");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <ul className="flex">
      <li
        onClick={() => handleSort("updatedAt")}
        className={cn(
          "w-14 rounded-s border-[1px] m-auto text-center border-stone-300 dark:border-stone-700 hover:cursor-pointer",
          sortBy === "updatedAt"
            ? "bg-slate-400 dark:bg-slate-50 text-stone-50 dark:text-stone-900"
            : ""
        )}
      >
        新评论
      </li>
      <li
        onClick={() => handleSort("createdAt")}
        className={cn(
          "w-14 rounded-e border-[1px] border-s-0 m-auto text-center border-stone-300 dark:border-stone-700 hover:cursor-pointer",
          sortBy === "createdAt"
            ? "bg-slate-400 dark:bg-slate-50 text-stone-50 dark:text-stone-900"
            : ""
        )}
      >
        新帖子
      </li>
    </ul>
  );
}

export function SortbyLoading() {
  return (
    <ul className="flex">
      <li
        className={cn(
          "w-14 rounded-s border-[1px] m-auto text-center border-stone-300 dark:border-stone-700"
        )}
      >
        新评论
      </li>
      <li
        className={cn(
          "w-14 rounded-e border-[1px] border-s-0 m-auto text-center border-stone-300 dark:border-stone-700"
        )}
      >
        新帖子
      </li>
    </ul>
  );
}

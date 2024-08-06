"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type SortByProp = {
  sortBy: "createdAt" | "updatedAt";
};

export default function Sortby({ sortBy }: SortByProp) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);

  useEffect(() => {
    const sortByParam = searchParams.get("sortBy");
    setCurrentSortBy(sortByParam === "updatedAt" ? "updatedAt" : "createdAt");
  }, [searchParams]);

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
    <ul className="flex text-white">
      <li
        onClick={() => handleSort("updatedAt")}
        className={cn(
          "w-14 rounded-s border-2 m-auto text-center border-[#888888] hover:cursor-pointer",
          sortBy === "updatedAt" ? "bg-[#888888]" : "bg-dark"
        )}
      >
        新评论
      </li>
      <li
        onClick={() => handleSort("createdAt")}
        className={cn(
          "w-14 rounded-e border-2 m-auto text-center border-[#888888] hover:cursor-pointer",
          sortBy === "createdAt" ? "bg-[#888888]" : "bg-dark"
        )}
      >
        新帖子
      </li>
    </ul>
  );
}

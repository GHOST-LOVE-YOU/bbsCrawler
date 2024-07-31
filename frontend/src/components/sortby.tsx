import { cn } from "@lib/utils";
import Link from "next/link";

type sortByProp = {
  sortBy: "createdAt" | "updatedAt";
  currentUrl: string;
};

export default function Sortby(props: sortByProp) {
  return (
    <ul className="flex text-white">
      <li
        className={cn(
          "w-14 rounded-s border-2 m-auto text-center border-[#888888]",
          {
            "bg-[#888888]": props.sortBy === "updatedAt",
            "bg-dark": props.sortBy === "createdAt",
          }
        )}
      >
        <Link href={`${props.currentUrl}?sortBy=updatedAt`}>新评论</Link>
      </li>
      <li
        className={cn(
          "w-14 rounded-e border-2 m-auto text-center border-[#888888] ",
          {
            "bg-[#888888]": props.sortBy === "createdAt",
            "bg-dark": props.sortBy === "updatedAt",
          }
        )}
      >
        <Link href={props.currentUrl}>新帖子</Link>
      </li>
    </ul>
  );
}

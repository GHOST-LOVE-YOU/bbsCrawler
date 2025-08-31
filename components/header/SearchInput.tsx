// SearchInput.tsx
"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Input } from "../ui/input";

export function SearchInput({
  onSearchComplete,
}: {
  onSearchComplete?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = input
    ? [
        `搜索帖子:${input}`,
        `搜索评论:${input}`,
        `搜索用户:${input}`,
        `谷歌搜索:${input}`,
      ]
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  const handleSearch = (index?: number) => {
    const searchIndex = index !== undefined ? index : selectedIndex;
    if (searchIndex === 0) {
      router.push(`/search/post/${input}`);
    } else if (searchIndex === 1) {
      router.push(`/search/comment/${input}`);
    } else if (searchIndex === 2) {
      router.push(`/search/member/${input}`);
    } else if (searchIndex === 3) {
      window.open(`https://www.google.com/search?q=${input}`, "_blank");
    }
    setInput("");
    if (onSearchComplete) {
      onSearchComplete();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % options.length);
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) => (prevIndex - 1 + options.length) % options.length
      );
      event.preventDefault();
    } else if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <div className="w-full">
        <Input
          ref={inputRef}
          type="text"
          className={`
            h-8 w-full bg-slate-100 pr-10 pl-2
            dark:bg-slate-900
          `}
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search
          className={`
            absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400
            dark:text-gray-600
          `}
          size={20}
        />
      </div>
      {options.length > 0 && isFocused && (
        <ul
          className={`
            absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-slate-100 shadow-lg
            dark:border-slate-700 dark:bg-slate-900
          `}
        >
          {options.map((option, index) => (
            <li
              key={option}
              className={`
                cursor-pointer px-2 py-1
                ${
                  index === selectedIndex
                    ? "text-slate-500"
                    : `
                      text-black
                      dark:text-white
                    `
                }
              `}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                handleSearch(index);
                inputRef.current?.blur();
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

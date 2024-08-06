// SearchInput.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";

export function SearchInput() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = input
    ? [`搜索帖子:${input}`, `搜索用户:${input}`, `谷歌搜索:${input}`]
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  const handleSearch = () => {
    if (selectedIndex === 0) {
      router.push(`/search/post/${input}`);
    } else if (selectedIndex === 1) {
      router.push(`/search/member/${input}`);
    } else if (selectedIndex === 2) {
      window.open(`https://www.google.com/search?q=${input}`, "_blank");
    }
    setInput("");
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

  const clearInput = () => {
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isFocused ? "w-56" : "w-44"
        }`}
      >
        <Input
          ref={inputRef}
          type="text"
          className="w-full h-8 bg-[#3b3b3b] text-white rounded-md pl-2 pr-10"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {input && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
            size={20}
            onClick={clearInput}
          />
        )}
      </div>
      {options.length > 0 && isFocused && (
        <ul className="absolute z-10 w-full bg-[#3b3b3b] mt-1 shadow-lg">
          {options.map((option, index) => (
            <li
              key={option}
              className={`px-2 py-1 cursor-pointer ${
                index === selectedIndex ? "bg-gray-700" : "text-white"
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={handleSearch}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

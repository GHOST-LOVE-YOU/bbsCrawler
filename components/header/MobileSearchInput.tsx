"use client";
import { Search } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

import { SearchInput } from "./SearchInput";

export default function MobileSearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchComplete = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div className="relative" ref={searchRef}>
      <Search
        className="cursor-pointer"
        size={20}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className={`fixed top-40 right-0 left-0 z-50 mx-2 flex items-center rounded-md shadow-lg`}
        >
          <SearchInput onSearchComplete={handleSearchComplete} />
        </div>
      )}
    </div>
  );
}

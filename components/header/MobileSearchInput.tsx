"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
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
        <div className="fixed top-40 left-0 right-0 rounded-md shadow-lg z-50 flex items-center mx-2">
          <SearchInput onSearchComplete={handleSearchComplete} />
        </div>
      )}
    </div>
  );
}

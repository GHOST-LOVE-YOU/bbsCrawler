// NavBar.tsx

import Link from "next/link";

import { topBoards } from "@/constants/board";
import { Logo } from "./Logo";
import MobileSearchInput from "./MobileSearchInput";
import { MobileSidebar } from "./MobileSidebar";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./ThemeToggle";

export default function NavBar() {
  return (
    <header className="h-16 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center space-x-4">
            <MobileSidebar />
            <Logo />
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {topBoards.slice(0, 4).map((board) => (
                <Link
                  key={board.label}
                  href={`/areas/${board.label}`}
                  className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-md transition-colors"
                >
                  {board.name}
                </Link>
              ))}
              <Link
                href="/areas"
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-md transition-colors"
              >
                更多
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:block">
              <SearchInput />
            </div>
            <div className="md:hidden">
              <MobileSearchInput />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

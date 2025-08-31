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
    <header
      className={`
        h-12 w-full border-b border-slate-200 bg-slate-50
        dark:border-slate-700 dark:bg-slate-900
      `}
    >
      <div className="container px-0">
        <div className="flex h-full flex-row items-center justify-between">
          <div
            className={`
              flex flex-row items-center space-x-2
              sm:space-x-4
            `}
          >
            <MobileSidebar />
            <Logo />
            <nav className="hidden md:flex items-center space-x-4 ml-4">
              {topBoards.slice(0, 4).map((board) => (
                <Link
                  key={board.label}
                  href={`/areas/${board.label}`}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                  {board.name}
                </Link>
              ))}
              <Link
                href="/areas"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                更多
              </Link>
            </nav>
          </div>
          <div
            className={`
              flex flex-row items-center space-x-2
              sm:space-x-4
            `}
          >
            <div
              className={`
                hidden flex-none
                md:block
              `}
            >
              <SearchInput />
            </div>
            <div
              className={`
                flex-none
                md:hidden
              `}
            >
              <MobileSearchInput />
            </div>
            <div className="flex-none">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

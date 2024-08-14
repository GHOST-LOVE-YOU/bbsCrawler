// NavBar.tsx

import { Logo } from "./logo";
import { MobileSidebar } from "./mobile-sidebar";
import { SearchInput } from "./search_input";
import { ThemeToggle } from "./theme-toggle";

export default function NavBar() {
  return (
    <header className="w-full h-12 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto max-w-5xl md:px-2">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4">
            <MobileSidebar />
            <Logo />
          </div>
          <div className="flex flex-row items-center space-x-2 sm:space-x-4">
            <div className="flex-none">
              <SearchInput />
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
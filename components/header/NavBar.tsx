// NavBar.tsx

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import MobileSearchInput from "./MobileSearchInput";
import { MobileSidebar } from "./MobileSidebar";
import { SearchInput } from "./SearchInput";

export default function NavBar() {
  return (
    <header className="w-full h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="container px-0">
        <div className="flex flex-row justify-between items-center h-full">
          <div className="flex flex-row items-center space-x-2 sm:space-x-4">
            <MobileSidebar />
            <Logo />
          </div>
          <div className="flex flex-row items-center space-x-2 sm:space-x-4">
            <div className="flex-none hidden md:block">
              <SearchInput />
            </div>
            <div className="flex-none md:hidden">
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

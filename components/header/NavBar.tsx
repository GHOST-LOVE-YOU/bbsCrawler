// NavBar.tsx

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

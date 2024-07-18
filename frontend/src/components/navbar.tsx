
// NavBar.tsx
"use client";

import { Logo } from "./logo";
import { SearchInput } from "./search_input";

export default function NavBar() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-row justify-between bg-nodedark">
        <div className="flex flex-row">
          <div className="flex-none">
            <Logo />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex-none py-2">
            <SearchInput />
          </div>
        </div>
      </div>
    </div>
  );
}

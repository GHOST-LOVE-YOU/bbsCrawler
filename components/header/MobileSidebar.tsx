import { Button } from "@/components/ui/button";

import { ClientSheetWrapper } from "./ClientSheetWrapper";
import SideBar from "./SideBar";

export function MobileSidebar() {
  return (
    <ClientSheetWrapper
      trigger={
        <Button
          variant="outline"
          className={`
            p-2
            hover:bg-slate-100
            md:hidden
            dark:hover:bg-slate-800
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`
              h-6 w-6 stroke-black
              dark:stroke-white
            `}
          >
            <line x1="2" y1="11" x2="14" y2="11" />
            <line x1="2" y1="8" x2="14" y2="8" />
            <line x1="2" y1="5" x2="14" y2="5" />
          </svg>
        </Button>
      }
    >
      <SideBar />
    </ClientSheetWrapper>
  );
}

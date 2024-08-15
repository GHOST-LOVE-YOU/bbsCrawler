import { Button } from "@/components/ui/button";
import { ClientSheetWrapper } from "./client-sheet-wrapper";
import SideBar from "./sidebar";

export function MobileSidebar() {
  return (
    <ClientSheetWrapper
      trigger={
        <Button
          variant="outline"
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      }
    >
      <SideBar />
    </ClientSheetWrapper>
  );
}
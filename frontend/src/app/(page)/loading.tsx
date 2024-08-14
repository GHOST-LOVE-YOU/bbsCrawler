import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export function SideBarLoading() {
  return (
    <div className="md:hidden fixed bottom-4 right-4">
      <Skeleton className="w-12 h-12 rounded-full" />
    </div>
  );
}

export function PostListLoading() {
  return (
    <ul>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="py-2 border-gray-300 dark:border-gray-700 border-b-2"
        >
          <li>
            <div className="flex flex-row">
              <div className="flex-none pt-1">
                <Skeleton className="w-10 h-10 rounded-md" />
              </div>
              <div className="px-2 flex-1">
                <div className="flex flex-col">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
                <div className="inline-flex font-sans text-text-light dark:text-text-dark space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}

export function SortbyLoading() {
  return (
    <ul className="flex text-text-light dark:text-text-dark">
      <li className="w-14 rounded-s border-2 m-auto text-center border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark">
        <div className="h-6 flex items-center justify-center">新评论</div>
      </li>
      <li className="w-14 rounded-e border-2 m-auto text-center border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark">
        <div className="h-6 flex items-center justify-center">新帖子</div>
      </li>
    </ul>
  );
}

export function PagePaginationLoading() {
  return (
    <nav
      className="pr-2 bg-background-light dark:bg-background-dark inline-flex -space-x-px rounded-md shadow-sm h-7 text-sm"
      aria-label="Pagination"
    >
      <button
        className="relative inline-flex items-center rounded-md px-2 py-2 text-text-light dark:text-text-dark ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0"
        disabled
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {[1, 2, 3, "...", 100].map((page, index) => (
        <button
          key={index}
          disabled
          className={`relative inline-flex items-center px-2 py-1 text-sm font-semibold rounded-md text-text-light dark:text-text-dark focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:focus-visible:outline-primary-dark ${
            page === 1
              ? "z-10 bg-primary dark:bg-primary-dark text-white"
              : page === "..."
              ? "ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
              : "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          } ${page === "..." && "hidden sm:inline-flex"}`}
        >
          {page}
        </button>
      ))}
      <button
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-inset ring-gray-300 hover:bg-[#3b3b3b] focus:z-20 focus:outline-offset-0"
        disabled
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row py-4">
      <div className="flex-1 w-full md:w-auto space-y-4">
        <div className="flex justify-between items-center">
          <SortbyLoading />
          <PagePaginationLoading />
        </div>
        <PostListLoading />
        <div className="flex justify-end">
          <PagePaginationLoading />
        </div>
      </div>
      <div className="md:hidden fixed bottom-4 right-4">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}
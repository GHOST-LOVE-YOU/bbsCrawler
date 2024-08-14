import { Skeleton } from "@/components/ui/skeleton";
import { SideBarLoading } from "@/app/(page)/loading";

function PostHeaderLoading() {
  return (
    <div className="flex flex-row items-center space-x-4 mb-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

function CommentLoading() {
  return (
    <div className="flex flex-col py-2 border-gray-300 dark:border-gray-700 border-b-2 shadow-md">
      <div className="flex flex-row">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="px-2 flex-1">
          <div className="flex flex-row items-center space-x-2 mb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-8" />
      </div>
      <div className="pt-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex justify-end mt-4 space-x-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-8 rounded-full" />
      </div>
    </div>
  );
}

function PaginationLoading() {
  return (
    <div className="flex justify-end mt-4">
      <Skeleton className="h-8 w-64" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 border-2 rounded-xl shadow-2xl px-6 my-4">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <PostHeaderLoading />
            {[...Array(5)].map((_, index) => (
              <CommentLoading key={index} />
            ))}
            <PaginationLoading />
          </div>
          <SideBarLoading />
        </div>
      </div>
    </div>
  );
}
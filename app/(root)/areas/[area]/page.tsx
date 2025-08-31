import { notFound } from "next/navigation";

import PagePagination from "@/components/common/PagePagination";
import PostList from "@/components/PostList";
import Sortby from "@/components/Sortby";
import { topBoards } from "@/constants/board";
import { userGetPost } from "@/lib/posts/server-utils";

interface AreaPageProps {
  params: Promise<{
    area: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateStaticParams() {
  return topBoards.map((board) => ({
    area: board.label,
  }));
}

export default async function AreaPage({
  params,
  searchParams,
}: AreaPageProps) {
  const { area } = await params;
  const searchParamsData = await searchParams;

  // 验证area是否在topBoards中
  const validAreas = topBoards.map((b) => b.label);
  if (!validAreas.includes(area)) {
    notFound();
  }

  const sortBy =
    searchParamsData.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const page = Number(searchParamsData.page) || 1;

  const { posts, maxPage } = await userGetPost(page, sortBy, area);

  const boardName = topBoards.find((b) => b.label === area)?.name || area;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex items-center justify-between">
        <Sortby />
        <PagePagination maxPage={maxPage} />
      </div>
      <PostList sortBy={sortBy} posts={posts} area={boardName} />
      <div className="flex justify-end py-2">
        <PagePagination maxPage={maxPage} />
      </div>
    </div>
  );
}

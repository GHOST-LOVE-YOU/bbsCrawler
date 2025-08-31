import Link from "next/link";

import { topBoards, boardLabels } from "@/constants/board";

export default function AreasPage() {
  const allBoards = boardLabels.flatMap((category) =>
    category.boards.map((board) => ({
      ...board,
      category: category.name,
    }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">所有版块</h1>
        <p className="mb-6 text-gray-600">
          浏览北邮人论坛的所有版块，选择你感兴趣的领域。
        </p>
      </div>

      <div className="grid gap-8">
        {boardLabels.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              {category.name}
            </h2>
            <div
              className={`
                grid grid-cols-1 gap-3
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              `}
            >
              {category.boards.map((board) => (
                <Link
                  key={board.label}
                  href={`/areas/${board.label}`}
                  className={`
                    block rounded-md border border-gray-200 p-3 transition-colors
                    hover:border-blue-500 hover:bg-blue-50
                  `}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {board.name}
                  </div>
                  <div className="text-xs text-gray-500">{board.label}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import getUserBoardsAction from "@/actions/getUserBoards";
import BoardItem from "@/components/BoardItem";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function BoardsPage() {
  const data = await getUserBoardsAction();

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 rounded-lg shadow-md bg-red-50">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Unable to load boards
          </h2>
          <p className="text-gray-600">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {data?.name}'s Workspace
        </h1>
        <Link
          href="/boards/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusCircle size={20} />
          <span>New Board</span>
        </Link>
      </div>

      {data.boards.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first board to get started
          </p>
          <Link
            href="/boards/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Board</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.boards.map((board) => (
            <BoardItem board={board} key={board.id} />
          ))}

          <Link href="/boards/new" className="block group">
            <div className="h-40 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <div className="text-center">
                <PlusCircle
                  size={36}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors mx-auto mb-2"
                />
                <span className="text-gray-600 group-hover:text-gray-800 font-medium transition-colors">
                  Create New Board
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

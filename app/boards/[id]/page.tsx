import { notFound } from "next/navigation";

import getUserBoardAction from "@/actions/boards/getUserBoard";
import BackButton from "@/components/custom/BackButton";
import Board from "@/components/board/Board";
import BoardDetailPageClient from "@/components/board/BoardDetailPageClient";
import Link from "next/link";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userBoard = await getUserBoardAction(id);

  if (!userBoard) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <BackButton route="/boards" text="← Back to Boards" />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            {userBoard?.name}'s Tasks
          </h1>
          <BoardDetailPageClient userId={userBoard.userId} columnId={id} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex-col justify-evenly">
          {userBoard.columns.length > 0 ? (
            <Board columns={userBoard.columns} tasks={userBoard.tasks} />
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">No tasks added yet.</p>
              <p className="text-sm text-gray-500">
                Start by adding columns to your board.
              </p>
            </div>
          )}
          <div className="flex items-center shrink-0 w-32 my-4">
            <Link
              href="#"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md"
            >
              Add Column
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

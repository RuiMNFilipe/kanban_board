import { notFound } from "next/navigation";

import getUserBoardAction from "@/actions/getUserBoard";
import BackButton from "@/components/BackButton";
import Board from "@/components/Board";
import BoardDetailPageClient from "@/components/BoardDetailPageClient";

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
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-evenly">
          {userBoard.tasks.length > 0 ? (
            <Board columns={userBoard.columns} tasks={userBoard.tasks} />
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">No tasks added yet.</p>
              <p className="text-sm text-gray-500">
                Start adding tasks to your board.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

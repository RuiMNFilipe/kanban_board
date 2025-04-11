import { notFound } from "next/navigation";

import getUserBoardAction from "@/actions/getUserBoard";
import BackButton from "@/components/BackButton";
import Board from "@/components/Board";

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
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Board columns={userBoard.columns} tasks={userBoard.tasks} />
        </div>
      </div>
    </div>
  );
}

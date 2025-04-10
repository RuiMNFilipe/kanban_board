"use server";

import getUserBoardAction from "@/actions/getUserBoard";
import BackButton from "@/components/BackButton";
import { CheckSquareIcon, Square, SquareDashed } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userBoard = await getUserBoardAction(id);

  if (!userBoard) return notFound();

  return (
    <div>
      <BackButton route="/boards" text="← Back to Boards" />
      <h1>{userBoard?.name}'s Tasks:</h1>
      <ul>
        {userBoard?.tasks.map((task) => (
          <li key={task.id} className="flex items-center">
            {task.title}{" "}
            {task.status === "DONE" ? (
              <CheckSquareIcon color="green" />
            ) : task.status === "TODO" ? (
              <Square />
            ) : (
              <SquareDashed />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

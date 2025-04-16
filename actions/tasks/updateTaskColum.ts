"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function updateTaskColumnAction(
  taskId: string,
  newColumnId: string,
  newPositionInColumn: number
) {
  const session = await auth();

  if (!session?.user?.email)
    return {
      error: "Unauthorized",
    };

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        board: {
          userId: session.user.id,
        },
      },
      data: {
        columnId: newColumnId,
        position: newPositionInColumn,
      },
    });
    revalidatePath(`/boards/${updatedTask.boardId}`);
    return {
      success: true,
      updatedTask,
    };
  } catch (error) {
    console.error("Error updating task column:", error);
    return {
      success: false,
      error: "Failed to update task column",
    };
  }
}

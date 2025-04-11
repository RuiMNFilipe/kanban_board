"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function updateTaskPositionAction(
  taskId: string,
  newPosition: number,
  columnId: string
) {
  const session = await auth();

  if (!session?.user?.email) return { error: "Unauthorized" };

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        board: {
          userId: session.user.id,
        },
      },
      data: {
        position: newPosition,
      },
    });
    revalidatePath(`/boards/${updatedTask.boardId}`);
    return {
      success: true,
      updatedTask,
    };
  } catch (error) {
    console.error("Error updating task position:", error);
    return {
      success: false,
      error: "Failed to update task position",
    };
  }
}

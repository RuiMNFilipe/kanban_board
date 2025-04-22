"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { taskIdSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export default async function deleteTaskAction(taskId: string) {
  const session = await auth();

  if (!session?.user)
    return {
      success: false,
      error: "CredentialsSignin",
    };

  const parsedTaskId = taskIdSchema.safeParse({ id: taskId });

  if (!parsedTaskId.success)
    return {
      success: false,
      error: "ValidationError",
    };

  const { data } = parsedTaskId;

  try {
    const taskExists = await prisma.task.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!taskExists)
      return {
        success: false,
        error: "NotFound",
      };

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskExists.id,
      },
    });

    revalidatePath(`/boards/${deletedTask.boardId}`);

    return {
      success: true,
      deletedTask,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.type,
      };
    }
    return {
      success: false,
      error: "UnknownError",
    };
  }
}

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export default async function deleteBoardAction(boardId: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const boardIdSchema = z.string().uuid();
  const { success, data: id } = boardIdSchema.safeParse(boardId);

  if (!success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    const boardExists = await prisma.board.findUnique({
      where: {
        id,
      },
    });

    if (!boardExists) {
      return {
        success: false,
        error: "NotFound",
      };
    }

    const deletedBoard = await prisma.board.delete({
      where: {
        id,
      },
    });

    revalidatePath("/boards");

    return {
      success: true,
      deletedBoard,
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
